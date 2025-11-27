import ky, { type KyResponse, type AfterResponseHook, type NormalizedOptions } from 'ky';
import { createParser, type EventSourceParser } from 'eventsource-parser';

export interface SSEOptions {
  onData: (data: string) => void;
  onEvent?: (event: any) => void;
  onCompleted?: (error?: Error) => void;
  onAborted?: () => void;
  onReconnectInterval?: (interval: number) => void;
}

export const createSSEHook = (options: SSEOptions): AfterResponseHook => {
  const hook: AfterResponseHook = async (request: Request, _options: NormalizedOptions, response: KyResponse) => {
    if (!response.ok || !response.body) {
      return;
    }

    let completed = false;
    const innerOnCompleted = (error?: Error): void => {
      if (completed) {
        return;
      }

      completed = true;
      options.onCompleted?.(error);
    };

    const isAborted = false;

    const reader: ReadableStreamDefaultReader<Uint8Array> = response.body.getReader();

    const decoder: TextDecoder = new TextDecoder('utf8');

    const parser: EventSourceParser = createParser({
      onEvent: (event) => {
        if (event.data) {
          options.onEvent?.(event);
          const dataArray: string[] = event.data.split('\n');
          for (const data of dataArray) {
            options.onData(data);
          }
        }
      }
    });

    const read = (): void => {
      if (isAborted) {
        return;
      }

      reader.read().then((result: ReadableStreamReadResult<Uint8Array>) => {
        if (result.done) {
          innerOnCompleted();
          return;
        }

        parser.feed(decoder.decode(result.value, { stream: true }));

        read();
      }).catch(error => {
        if (request.signal.aborted) {
          options.onAborted?.();
          return;
        }

        innerOnCompleted(error as Error);
      });
    };

    read();

    return response;
  };

  return hook;
};

type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | ContentPart[];
  id?: string;
}

export interface ChatStreamOptions {
  endpoint: string;
  messages: ChatMessage[];
  apiId: string;
  onUpdate: (content: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}

export const sendChatStream = async (options: ChatStreamOptions): Promise<void> => {
  const { messages, onUpdate, onComplete, onError, signal } = options;

  let currentContent = '';

  const sseHook = createSSEHook({
    onData: (data: string) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          console.error('API返回错误:', parsed.error);
          onError(new Error(parsed.error.message || '服务器返回错误'));
          return;
        }
        if (parsed.choices?.[0]?.delta?.content) {
          currentContent += parsed.choices[0].delta.content;
          onUpdate(currentContent);
        }
      } catch (err) {
        console.warn('解析SSE数据失败:', data);
      }
    },
    onCompleted: (error?: Error) => {
      if (error) {
        console.error('流式传输完成时出错:', error);
        onError(error);
      } else {
        onComplete();
      }
    },
    onAborted: () => {
      console.log('流式传输已中止');
    }
  });

  try {
    console.log('发送AI请求到:', options.endpoint);
    console.log('请求头 X-App-Id:', options.apiId);
    
    const response = await ky.post(options.endpoint, {
      json: {
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: true,
        enable_thinking: false
      },
      headers: {
        'X-App-Id': options.apiId,
        'Content-Type': 'application/json'
      },
      signal,
      hooks: {
        afterResponse: [sseHook]
      }
    });
    
    console.log('AI请求响应状态:', response.status);
  } catch (error) {
    if (!signal?.aborted) {
      console.error('AI请求失败:', error);
      
      if (error instanceof Error) {
        let errorMessage = error.message;
        
        if (errorMessage.includes('fetch')) {
          errorMessage = '网络连接失败，请检查网络';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = '请求超时，请重试';
        } else if (errorMessage.includes('401')) {
          errorMessage = '认证失败，请检查配置';
        } else if (errorMessage.includes('403')) {
          errorMessage = '无权访问，请检查权限';
        } else if (errorMessage.includes('500')) {
          errorMessage = '服务器错误，请稍后重试';
        }
        
        onError(new Error(errorMessage));
      } else {
        onError(new Error('未知错误，请重试'));
      }
    }
  }
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
