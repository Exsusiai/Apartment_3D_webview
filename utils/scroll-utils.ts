export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId)
  if (element) {
    // 获取元素位置
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset

    // 添加一些偏移，考虑固定导航栏的高度
    const offset = 80
    const offsetPosition = elementPosition - offset

    // 使用平滑滚动
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })

    // 确保滚动后页面仍可正常滚动
    document.body.style.overflow = "auto"
    document.documentElement.style.overflow = "auto"
  }
}
