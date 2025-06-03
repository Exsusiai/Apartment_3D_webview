"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Building } from "lucide-react"
import { cn } from "@/lib/utils"
import { SessionState } from "@/utils/state-utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true) // 确保Header始终可见

  // 监听滚动事件，控制导航栏样式
  useEffect(() => {
    // 确保Header可见
    setIsVisible(true)
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // 立即检查当前滚动位置
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 滚动到页面顶部
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // 确保状态已被重置为初始状态
    SessionState.forceReset()

    try {
      // 先尝试使用平滑滚动
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } catch (error) {
      // 兼容性回退
      document.body.scrollTop = 0 // For Safari
      document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
    }

    // 延迟后强制刷新页面状态
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
  }

  // 如果Header不可见，不渲染
  if (!isVisible) {
    return null
  }

  return (
    <header
      className={cn(
        "py-4 md:py-6 px-4 md:px-8 sticky top-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100"
          : "bg-white border-b border-gray-100",
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <a href="#" onClick={scrollToTop} className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-900" />
            <h1 className="text-lg font-medium text-gray-900">3D Apartments</h1>
          </a>
        </div>
        <nav>
          <ul className="flex gap-6">
            <li>
              <a href="#" onClick={scrollToTop} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
