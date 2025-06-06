"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { SessionState } from "@/utils/state-utils"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true) // 确保Header始终可见
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    
    // 关闭移动端菜单
    setIsMobileMenuOpen(false)
    
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
    
    // 关闭移动端菜单
    setIsMobileMenuOpen(false)
  }

  // 如果Header不可见，不渲染
  if (!isVisible) {
    return null
  }

  return (
    <header
      className={cn(
        "py-4 px-4 md:px-8 sticky top-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100"
          : "bg-white border-b border-gray-100",
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <a href="#" onClick={scrollToTop} className="flex items-center gap-2 sm:gap-3">
            {/* Logo部分 */}
            <div className="flex-shrink-0">
              <Image
                src="/home-logo.png"
                alt="Home Logo"
                width={42}
                height={42}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            {/* 主标题部分 - 自然排列 */}
            <div className="flex flex-col gap-0">
              <h1 className="text-base sm:text-xl font-bold text-gray-900 leading-tight">Rooms</h1>
              <h1 className="text-base sm:text-xl font-bold text-gray-900 leading-tight">I've Lived</h1>
            </div>
          </a>
          {/* 副标题部分 - 独占一行，适中的间距 */}
          <p className="text-[10px] sm:text-xs text-gray-600 ml-0">A 3D Remembrance Project</p>
        </div>
        
        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center">
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
              <a href="https://github.com/Exsusiai/Apartment_3D_webview/tree/main" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Github
              </a>
            </li>
          </ul>
        </nav>
        
        {/* 移动端菜单按钮 */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-4 border-t border-gray-100">
          <ul className="flex flex-col gap-4 pt-4">
            <li>
              <a href="#" onClick={scrollToTop} className="block text-base font-medium text-gray-600 hover:text-gray-900 transition-colors px-4">
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={scrollToAbout} className="block text-base font-medium text-gray-600 hover:text-gray-900 transition-colors px-4">
                About
              </a>
            </li>
            <li>
              <a href="https://github.com/Exsusiai/Apartment_3D_webview/tree/main" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors px-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Github
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
