"use client"

import { useEffect, useState } from "react"

interface AnimatedBackgroundProps {
  isActive?: boolean
  opacity?: number
}

export function AnimatedBackground({ isActive = true, opacity = 0.15 }: AnimatedBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    // 页面加载后短暂延迟开始动画
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    // 创建动画阶段变化效果
    const phaseTimer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4)
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearInterval(phaseTimer)
    }
  }, [])

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ease-in-out ${
        isLoaded && isActive ? "opacity-100" : "opacity-0"
      }`}
      style={{ opacity: isLoaded && isActive ? opacity : 0 }}
    >
      {/* 主要动画线条层 */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* 第一层 - 主要波浪线 */}
        <g className="animate-float-slow">
          <path
            d="M0,300 C320,180 640,420 960,300 C1280,180 1600,420 1920,300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-700 animate-path-draw opacity-75"
          />
          <path
            d="M0,600 C480,480 960,720 1440,600 C1680,540 1920,660 1920,600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-gray-600 animate-path-draw opacity-65"
            style={{ animationDelay: '1s' }}
          />
        </g>

        {/* 第二层 - 辅助曲线 */}
        <g className="animate-float-medium">
          <path
            d="M0,200 C400,400 800,100 1200,300 C1600,500 1920,200 1920,250"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-gray-600 animate-path-draw opacity-60"
            style={{ animationDelay: '2s' }}
          />
        </g>

        {/* 第三层 - 细节线条 */}
        <g className="animate-float-fast">
          <path
            d="M0,450 C480,350 960,550 1440,450 C1680,400 1920,500 1920,450"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.0"
            className="text-gray-500 animate-path-draw opacity-50"
            style={{ animationDelay: '3s' }}
          />
        </g>

        {/* 简化的装饰性粒子 */}
        <g className="animate-pulse-slow">
          <circle cx="320" cy="250" r="2.5" fill="currentColor" className="text-gray-600 opacity-50 animate-bounce-slow" style={{ animationDelay: '1.5s' }} />
          <circle cx="960" cy="400" r="2" fill="currentColor" className="text-gray-500 opacity-45 animate-bounce-slow" style={{ animationDelay: '2.5s' }} />
          <circle cx="1600" cy="350" r="2.5" fill="currentColor" className="text-gray-600 opacity-50 animate-bounce-slow" style={{ animationDelay: '3.5s' }} />
        </g>
      </svg>

      {/* 简化的渐变遮罩效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-gray-50/8 animate-gradient-shift" />
      
      {/* 轻微的光影效果 */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r transition-all duration-4000 ease-in-out ${
          animationPhase % 2 === 0 
            ? 'from-transparent via-blue-50/3 to-transparent' 
            : 'from-transparent via-purple-50/3 to-transparent'
        }`}
        style={{
          transform: `translateX(${animationPhase * 25 - 50}%)`,
        }}
      />
    </div>
  )
} 