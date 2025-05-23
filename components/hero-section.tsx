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

  // 页面加载后触发动画和检查状态
  useEffect(() => {
    // 检查用户是否已浏览过内容
    setHasViewedContent(SessionState.hasViewedContent())

    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300) // 短暂延迟以确保DOM已完全加载

    return () => clearTimeout(timer)
  }, [])

  // 添加滚动监听，确保状态在滚动时更新
  useEffect(() => {
    const handleScroll = () => {
      // 检查状态是否已更新
      const currentState = SessionState.hasViewedContent()
      if (currentState !== hasViewedContent) {
        setHasViewedContent(currentState)
      }
    }

    // 添加滚动事件监听器
    window.addEventListener("scroll", handleScroll)

    // 添加一个定时器，定期检查状态（以防滚动事件不够频繁）
    const intervalId = setInterval(handleScroll, 500)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(intervalId)
    }
  }, [hasViewedContent])

  const handleBrowseClick = () => {
    // 标记用户已浏览过内容
    SessionState.markContentAsViewed()
    setHasViewedContent(true)

    // 获取画廊元素
    const galleryElement = document.getElementById("apartment-gallery")
    if (!galleryElement) return

    // 获取第一个卡片元素
    const firstCardElement = document.getElementById("first-apartment-card")
    if (!firstCardElement) return

    // 获取导航栏高度（用于计算偏移量）
    const headerElement = document.querySelector("header")
    const headerHeight = headerElement ? headerElement.offsetHeight : 0

    // 根据当前状态设置不同的偏移量
    if (!hasViewedContent) {
      // 首次访问（全屏标题状态）
      // 计算第一个卡片相对于文档顶部的位置
      const cardPosition = firstCardElement.getBoundingClientRect().top + window.pageYOffset

      // 设置较小的偏移量，确保第一个卡片在视口中可见
      // 这里的偏移量需要考虑导航栏高度和一些额外空间
      const offsetPosition = cardPosition - headerHeight - 20

      // 使用平滑滚动
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    } else {
      // 后续访问（小标题状态）
      // 计算画廊相对于文档顶部的位置
      const galleryPosition = galleryElement.getBoundingClientRect().top + window.pageYOffset

      // 设置较大的偏移量，确保第一个卡片到达网页最上方
      // 这里的偏移量需要考虑导航栏高度
      const offsetPosition = galleryPosition - headerHeight

      // 使用平滑滚动
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }

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
          : "min-h-[100vh] flex flex-col items-center justify-center" // 首次访问，使用全屏高度
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
