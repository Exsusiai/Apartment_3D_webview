"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SessionState } from "@/utils/state-utils"

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  // 监听滚动事件，控制按钮显示/隐藏
  useEffect(() => {
    const toggleVisibility = () => {
      // 当页面滚动超过300px时显示按钮
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // 立即执行一次检查
    toggleVisibility()

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // 滚动到页面顶部
  const scrollToTop = () => {
    try {
      // 确保状态已被标记为已浏览
      SessionState.markContentAsViewed()

      // 使用平滑滚动
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } catch (error) {
      // 兼容性回退
      document.body.scrollTop = 0 // For Safari
      document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full p-3 shadow-md transition-all duration-300",
        "bg-white/80 backdrop-blur-sm hover:bg-gray-100",
        "border border-gray-200",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none",
      )}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
