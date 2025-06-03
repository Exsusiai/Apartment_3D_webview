"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
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

  // 滚动到页面顶部并重置为初始状态
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // 先重置状态到初始状态
    SessionState.forceReset()
    
    // 强制触发重新渲染以立即更新hero-section状态
    window.dispatchEvent(new Event('resize'))
    
    // 延迟滚动，确保状态重置先生效
    setTimeout(() => {
      try {
        // 滚动到页面顶部
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      } catch (error) {
        // 兼容性回退
        document.body.scrollTop = 0 // For Safari
        document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
      }
    }, 50) // 50ms延迟确保状态重置先生效
  }

  // 滚动到About部分
  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    const aboutElement = document.getElementById('about')
    if (aboutElement) {
      const offsetTop = aboutElement.offsetTop - 100 // 减去header高度的偏移
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
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
        <div className="flex flex-col gap-1">
          <a href="#" onClick={scrollToTop} className="flex items-start gap-3">
            {/* Logo部分 */}
            <div className="flex-shrink-0">
              <Image
                src="/home-logo.png"
                alt="Home Logo"
                width={42}
                height={42}
                className="w-10 h-10 object-contain"
              />
            </div>
            {/* 主标题部分 - 与logo同高 */}
            <div className="flex flex-col justify-between h-10">
              <h1 className="text-xl font-bold text-gray-900 leading-none">Rooms</h1>
              <h1 className="text-xl font-bold text-gray-900 leading-none">I've Lived</h1>
            </div>
          </a>
          {/* 副标题部分 - 独占一行，与整个上方区块对齐 */}
          <p className="text-xs text-gray-600 ml-0">A 3D Remembrance Project</p>
        </div>
        <nav className="flex items-center">
          <ul className="flex gap-8">
            <li>
              <a href="#" onClick={scrollToTop} className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={scrollToAbout} className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
