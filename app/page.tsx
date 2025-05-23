"use client"

import { useState, useEffect } from "react"
import { ApartmentGallery } from "@/components/apartment-gallery"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ScrollToTopButton } from "@/components/scroll-to-top-button"
import { SessionState } from "@/utils/state-utils"

export default function Home() {
  // 添加滚动状态
  const [hasScrolled, setHasScrolled] = useState(false)
  const [hasViewedContent, setHasViewedContent] = useState(false)

  // 初始化状态 - 在每次页面加载时重置状态
  useEffect(() => {
    // 重置SessionState
    SessionState.reset()
    setHasViewedContent(false)
  }, [])

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      // 当滚动超过视口高度的20%时，认为用户已经开始滚动
      if (window.scrollY > window.innerHeight * 0.2) {
        setHasScrolled(true)

        // 标记用户已浏览过内容
        if (!SessionState.hasViewedContent()) {
          SessionState.markContentAsViewed()
          setHasViewedContent(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-white overflow-hidden relative">
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
