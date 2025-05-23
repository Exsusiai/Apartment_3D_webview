// 删除localStorage，改用简单的内存状态
export const SessionState = {
  // 内存中的状态变量
  _hasViewedContent: false,

  // 检查用户是否已经浏览过内容
  hasViewedContent(): boolean {
    return this._hasViewedContent
  },

  // 标记用户已经浏览过内容
  markContentAsViewed(): void {
    this._hasViewedContent = true
  },

  // 重置状态
  reset(): void {
    this._hasViewedContent = false
  },
}
