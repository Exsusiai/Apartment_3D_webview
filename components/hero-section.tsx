"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { SessionState } from "@/utils/state-utils"

export function HeroSection() {
  // 添加动画状态
  const [isLoaded, setIsLoaded] = useState(false)
  // 跟踪用户是否已浏览过内容
  const [hasViewedContent, setHasViewedContent] = useState(false)
  // 添加初始化状态
  const [isInitialized, setIsInitialized] = useState(false)

  // 页面加载后触发动画和检查状态
  useEffect(() => {
    // 确保状态初始化
    SessionState.init()
    
    // 检查用户是否已浏览过内容
    const currentState = SessionState.hasViewedContent()
    setHasViewedContent(currentState)

    // 短暂延迟确保组件完全加载
    const timer = setTimeout(() => {
      setIsLoaded(true)
      setIsInitialized(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // 优化的滚动监听，减少频率并确保状态同步
  useEffect(() => {
    if (!isInitialized) return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // 检查状态是否已更新
          const currentState = SessionState.hasViewedContent()
          if (currentState !== hasViewedContent) {
            setHasViewedContent(currentState)
          }
          ticking = false
        })
        ticking = true
      }
    }

    // 添加滚动事件监听器
    window.addEventListener("scroll", handleScroll, { passive: true })

    // 添加一个定时器，定期检查状态（以防滚动事件不够频繁）
    const intervalId = setInterval(() => {
      const currentState = SessionState.hasViewedContent()
      if (currentState !== hasViewedContent) {
        setHasViewedContent(currentState)
      }
    }, 500)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(intervalId)
    }
  }, [hasViewedContent, isInitialized])

  const handleBrowseClick = () => {
    // 标记用户已浏览过内容
    SessionState.markContentAsViewed()
    const wasFullScreen = !hasViewedContent // 记录是否从全屏模式开始
    setHasViewedContent(true)

    // 使用requestAnimationFrame确保DOM更新完成后再计算位置
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        performScroll(wasFullScreen)
      })
    })
  }

  // 统一的滚动逻辑，减少重复代码
  const performScroll = (wasFullScreen: boolean) => {
    // 获取第一个卡片元素
    const firstCardElement = document.getElementById("first-apartment-card")
    if (!firstCardElement) {
      console.warn("First apartment card not found, scrolling to fallback position")
      // 如果找不到目标元素，滚动到一个安全的位置
      window.scrollTo({
        top: window.innerHeight * 0.8,
        behavior: "smooth",
      })
      return
    }

    // 获取导航栏高度
    const headerElement = document.querySelector("header")
    const headerHeight = headerElement ? headerElement.offsetHeight : 80 // 默认高度80px

    // 计算第一个卡片的位置
    const cardRect = firstCardElement.getBoundingClientRect()
    const cardTop = cardRect.top + window.scrollY

    // 根据模式调整滚动位置
    let scrollPosition
    if (wasFullScreen) {
      // 全屏模式：添加额外偏移量
      const extraOffset = Math.max(80, window.innerHeight * 0.05) // 动态计算额外偏移
      scrollPosition = cardTop - headerHeight + extraOffset
    } else {
      // 非全屏模式：精确对齐到导航栏下方
      scrollPosition = cardTop - headerHeight + 20 // 添加20px的缓冲
    }

    // 确保滚动位置不会超出页面范围
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    scrollPosition = Math.min(scrollPosition, maxScroll)
    scrollPosition = Math.max(0, scrollPosition) // 确保不小于0

    // 使用平滑滚动
    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    })

    // 确保页面可滚动
    document.body.style.overflow = "auto"
    document.documentElement.style.overflow = "auto"
  }

  return (
    <div
      id="hero-section"
      className={`relative border-none overflow-hidden transition-all duration-700 ease-in-out ${
        hasViewedContent
          ? "py-16 sm:py-20 md:py-24 pb-6 sm:pb-8 md:pb-12" // 已浏览过内容，使用较小高度
          : "min-h-[calc(100vh-80px)] flex flex-col items-center justify-center" // 首次访问，使用全屏高度减去导航栏
      }`}
    >
      {/* 背景曲线装饰 - 添加淡入动画 */}
      <div
        className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ease-in-out ${
          isLoaded ? "opacity-10" : "opacity-0"
        }`}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 500"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C300,300 400,0 500,100 C600,200 700,0 900,100 C1100,200 1000,300 1200,250"
            fill="none"
            stroke="black"
            strokeWidth="1"
          />
          <path
            d="M0,200 C200,100 300,200 400,100 C500,0 700,300 800,200 C900,100 1000,200 1200,100"
            fill="none"
            stroke="black"
            strokeWidth="1"
          />
          <path
            d="M0,150 C200,250 400,150 600,250 C800,350 1000,150 1200,200"
            fill="none"
            stroke="black"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div
        className={`container mx-auto px-4 relative z-10 text-center ${hasViewedContent ? "" : "flex-grow flex flex-col justify-center"}`}
      >
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 transition-all duration-1000 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px]"
          } ${hasViewedContent ? "lg:text-5xl" : ""}`} // 已浏览过内容时使用较小字体
        >
          The apartment I lived in
        </h1>
        <div
          className={`flex justify-center mb-4 md:mb-8 transition-all duration-1000 delay-300 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          }`}
        >
          <Button
            variant="outline"
            size={hasViewedContent ? "default" : "lg"} // 已浏览过内容时使用较小按钮
            className={`rounded-full transition-colors ${
              hasViewedContent ? "px-4 py-2 text-sm" : "px-5 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 text-sm sm:text-base"
            } font-medium border-gray-300 hover:bg-gray-100`}
            onClick={handleBrowseClick}
          >
            Browse
            <ArrowRight className={`ml-2 ${hasViewedContent ? "h-3 w-3" : "h-4 w-4 sm:h-5 sm:w-5"}`} />
          </Button>
        </div>
      </div>

      {/* 向下滚动指示器 - 只在首次访问时显示 */}
      {!hasViewedContent && (
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-500 ease-out ${
            isLoaded ? "opacity-70 translate-y-0" : "opacity-0 translate-y-[20px]"
          }`}
        >
          <div className="animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 5V19M12 19L5 12M12 19L19 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
