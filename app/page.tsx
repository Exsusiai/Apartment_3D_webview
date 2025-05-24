"use client"

import { useState, useEffect } from "react"
import { ApartmentGallery } from "@/components/apartment-gallery"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ScrollToTopButton } from "@/components/scroll-to-top-button"
import { SessionState } from "@/utils/state-utils"
import { PageFixer } from "@/utils/page-fix"

export default function Home() {
  // 添加滚动状态
  const [hasScrolled, setHasScrolled] = useState(false)
  const [hasViewedContent, setHasViewedContent] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // 初始化状态 - 在每次页面加载时重置状态并修复问题
  useEffect(() => {
    // 强制重置SessionState以确保页面刷新时状态正确
    SessionState.forceReset()
    setHasViewedContent(false)
    setHasScrolled(false)
    
    // 使用PageFixer修复页面状态
    PageFixer.checkAndFix()
    
    // 短暂延迟后标记为已初始化，确保所有组件都已挂载
    const timer = setTimeout(() => {
      setIsInitialized(true)
      // 再次检查并修复状态
      PageFixer.checkAndFix()
    }, 100)

    // 在开发环境下打印调试信息
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        PageFixer.debugPageState()
      }, 200)
    }

    return () => clearTimeout(timer)
  }, [])

  // 监听滚动事件
  useEffect(() => {
    if (!isInitialized) return

    const handleScroll = () => {
      // 当滚动超过视口高度的20%时，认为用户已经开始滚动
      if (window.scrollY > window.innerHeight * 0.2) {
        setHasScrolled(true)

        // 标记用户已浏览过内容
        if (!SessionState.hasViewedContent()) {
          SessionState.markContentAsViewed()
          setHasViewedContent(true)
        }
      } else {
        // 如果回到顶部，但保持已浏览状态
        setHasScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isInitialized])

  // 监听SessionState变化
  useEffect(() => {
    if (!isInitialized) return

    const checkState = () => {
      const currentState = SessionState.hasViewedContent()
      if (currentState !== hasViewedContent) {
        setHasViewedContent(currentState)
      }
    }

    // 定期检查状态以确保同步
    const interval = setInterval(checkState, 200)
    
    return () => clearInterval(interval)
  }, [hasViewedContent, isInitialized])

  // 监听页面可见性变化，处理页面切换回来时的状态
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isInitialized) {
        // 页面重新可见时，检查并修复状态
        setTimeout(() => {
          PageFixer.checkAndFix()
        }, 100)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isInitialized])

  // 如果还未初始化，显示loading状态
  if (!isInitialized) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white overflow-auto relative">
      <Header />
      <div className="flex flex-col border-none">
        <HeroSection />
        {/* 添加淡入动画效果给公寓画廊 */}
        <div
          className={`transition-all duration-1000 ease-in-out ${
            hasScrolled || hasViewedContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <ApartmentGallery />
        </div>
      </div>
      <ScrollToTopButton />
    </main>
  )
}
