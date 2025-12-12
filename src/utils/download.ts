/**
 * 跨平台文件下载工具
 * 支持iOS、Android等多种设备
 */

// 检测是否为移动设备
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 检测是否为iOS设备
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// 检测是否为Android设备
const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

// 检测是否支持Web Share API
const supportsWebShare = () => {
  return navigator.share !== undefined;
};

/**
 * 下载文本文件
 * @param content 文件内容
 * @param filename 文件名
 * @returns Promise<boolean> 是否成功
 */
export async function downloadTextFile(content: string, filename: string): Promise<boolean> {
  try {
    // 移动设备优先使用Web Share API
    if (isMobile() && supportsWebShare()) {
      try {
        // 创建File对象
        const file = new File([content], filename, { type: 'text/plain' });
        
        // 使用Web Share API分享
        await navigator.share({
          files: [file],
          title: '空调方案推荐',
          text: '查看空调配置方案'
        });
        
        return true;
      } catch (shareError) {
        // 如果用户取消分享或不支持文件分享，继续尝试其他方法
        console.log('Web Share API failed, trying alternative method:', shareError);
      }
    }

    // Android设备使用特殊处理
    if (isAndroid()) {
      return downloadForAndroid(content, filename);
    }

    // iOS和桌面设备使用标准方法
    return downloadStandard(content, filename);
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
}

/**
 * 标准下载方法（适用于iOS和桌面）
 */
function downloadStandard(content: string, filename: string): boolean {
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // 延迟清理，确保下载开始
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Standard download failed:', error);
    return false;
  }
}

/**
 * Android专用下载方法
 */
function downloadForAndroid(content: string, filename: string): boolean {
  try {
    // 方法1: 使用data URL（更兼容）
    const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const link = document.createElement('a');
    
    link.href = dataUrl;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    // 触发点击
    link.click();
    
    // 延迟清理
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Android download method 1 failed, trying method 2:', error);
    
    // 方法2: 使用Blob URL（备选）
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // 在新窗口打开（某些Android浏览器需要这样）
      const newWindow = window.open(url, '_blank');
      
      if (newWindow) {
        // 延迟清理
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
        return true;
      }
      
      // 如果无法打开新窗口，尝试直接下载
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      return true;
    } catch (error2) {
      console.error('Android download method 2 failed:', error2);
      return false;
    }
  }
}

/**
 * 复制文本到剪贴板（备选方案）
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // 优先使用现代API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // 备选方案：使用传统方法
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return false;
  }
}

/**
 * 获取设备信息（用于调试）
 */
export function getDeviceInfo() {
  return {
    isMobile: isMobile(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    supportsWebShare: supportsWebShare(),
    userAgent: navigator.userAgent
  };
}
