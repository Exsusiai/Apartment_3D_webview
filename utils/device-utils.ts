/**
 * 设备检测工具
 * 用于检测当前设备类型和功能
 */

/**
 * 检测是否为移动设备
 * @returns boolean 是否为移动设备
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // 强化的user agent检测
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|phone|tablet/i;
  
  // 检查屏幕宽度
  const screenWidth = window.innerWidth || screen.width;
  const isMobileWidth = screenWidth < 768; // 与Tailwind的md断点一致
  
  // 检查触摸功能
  const hasTouch = ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0) ||
                   ((navigator as any).msMaxTouchPoints > 0);
  
  // 检查设备方向
  const hasOrientation = 'orientation' in window;
  
  // 检查是否为已知移动设备型号
  const isMobileUA = mobileRegex.test(userAgent) || 
                     /iPhone|iPad|iPod|Android|Mobile|Tablet/i.test(navigator.userAgent);
  
  // 检查媒体查询
  let isMobileMediaQuery = false;
  if (window.matchMedia) {
    isMobileMediaQuery = window.matchMedia('(max-width: 767px)').matches;
  }
  
  // 综合判断：满足任一条件即视为移动设备
  return isMobileUA || (isMobileWidth && hasTouch) || (isMobileMediaQuery && hasTouch) || hasOrientation;
}

/**
 * 检测是否支持触摸
 * @returns boolean 是否支持触摸
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0) || 
         ((navigator as any).msMaxTouchPoints > 0);
}

/**
 * 获取设备类型
 * @returns 'mobile' | 'tablet' | 'desktop'
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth || screen.width;
  const userAgent = navigator.userAgent.toLowerCase();
  
  // 先检查user agent中的明确标识
  if (/mobile|phone/i.test(userAgent)) {
    return 'mobile';
  }
  
  if (/tablet|ipad/i.test(userAgent)) {
    return 'tablet';
  }
  
  // 基于屏幕宽度判断
  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * 获取视口尺寸
 * @returns { width: number, height: number }
 */
export function getViewportSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth || document.documentElement.clientWidth || screen.width,
    height: window.innerHeight || document.documentElement.clientHeight || screen.height
  };
}

/**
 * 检测是否为iOS设备
 * @returns boolean
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * 检测是否为Android设备
 * @returns boolean
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /android/i.test(navigator.userAgent);
} 