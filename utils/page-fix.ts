// 页面修复工具函数
export class PageFixer {
  // 检查并修复页面状态
  static checkAndFix(): void {
    this.ensureScrollability()
    this.ensureHeaderVisibility()
    this.fixViewportIssues()
  }

  // 确保页面可滚动
  static ensureScrollability(): void {
    document.body.style.overflow = "auto"
    document.documentElement.style.overflow = "auto"
    
    // 移除可能的固定定位问题
    document.body.style.position = ""
    document.documentElement.style.position = ""
  }

  // 确保Header可见
  static ensureHeaderVisibility(): void {
    const header = document.querySelector("header")
    if (header) {
      header.style.display = ""
      header.style.visibility = "visible"
      header.style.opacity = "1"
    }
  }

  // 修复视口问题
  static fixViewportIssues(): void {
    // 强制重新计算视口高度
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    
    // 触发重新渲染
    window.dispatchEvent(new Event('resize'))
  }

  // 重置页面到初始状态
  static resetToInitialState(): void {
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'auto' })
    
    // 重置所有状态
    this.checkAndFix()
    
    // 延迟后再次检查
    setTimeout(() => {
      this.checkAndFix()
    }, 100)
  }

  // 调试信息
  static debugPageState(): void {
    console.log('Page Debug Info:', {
      scrollY: window.scrollY,
      innerHeight: window.innerHeight,
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      headerVisible: !!document.querySelector("header"),
      heroSection: !!document.getElementById("hero-section"),
      firstCard: !!document.getElementById("first-apartment-card")
    })
  }
} 