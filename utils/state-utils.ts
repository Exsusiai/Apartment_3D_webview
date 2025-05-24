// 改进的状态管理，支持页面刷新时的正确重置
export const SessionState = {
  // 内存中的状态变量
  _hasViewedContent: false,
  _initialized: false,

  // 初始化状态（确保页面刷新时正确重置）
  init(): void {
    if (!this._initialized) {
      this._hasViewedContent = false
      this._initialized = true
    }
  },

  // 检查用户是否已经浏览过内容
  hasViewedContent(): boolean {
    this.init() // 确保状态已初始化
    return this._hasViewedContent
  },

  // 标记用户已经浏览过内容
  markContentAsViewed(): void {
    this.init() // 确保状态已初始化
    this._hasViewedContent = true
  },

  // 重置状态
  reset(): void {
    this._hasViewedContent = false
    this._initialized = true
  },

  // 强制重置（用于页面刷新时确保清理状态）
  forceReset(): void {
    this._hasViewedContent = false
    this._initialized = false
  },
}
