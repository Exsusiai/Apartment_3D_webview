"use client"

import type React from "react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"

export function AboutSection() {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        "py-12 sm:py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50 transition-all duration-1000",
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="container mx-auto max-w-4xl">
        {/* 标题部分 */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            About MemoSpace
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            A digital project that preserves spatial memories through immersive visualization
          </p>
        </div>

        {/* 内容网格 */}
        <div className="grid gap-6 sm:gap-8 md:gap-12">
          {/* 项目介绍 */}
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              Project Vision
            </h3>
            <div className="text-gray-700 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto space-y-3 sm:space-y-4 text-left">
              <p>
                MemoSpace is a digital remembrance project that documents the 3D-scanned models of apartments I have lived in over the years.
              </p>
              <p>
                Since I began studying abroad in 2020, I've called several places home: two student apartments in Helsinki, two more in Stockholm, and—after moving to Berlin for work—four different apartments through three relocations.
              </p>
              <p>
                Back then, mobile 3D scanning tools already existed, but I never realized their potential as a way to preserve and revisit the spaces that shaped my everyday life. I regret not having started sooner. That's why I've decided to begin now—to document the rooms I've lived in, while I still can.
              </p>
              <p>
                This project is my way of archiving not just spaces, but memories—captured in three dimensions.
              </p>
              <p>
                This project is also my first exploration into AI-assisted programming. It's the first time I built a front-end website without writing a single line of code myself—everything was created using natural language prompts.
              </p>
              <p>
                As a C++ engineer, I don't have much experience with web development. But with the help of large language models, I was still able to design and build this site in a very short time.
              </p>
              <p>
                AI programming has now reached a point where it can support the development of complete projects—though it still benefits greatly from guidance by someone with programming knowledge.
              </p>
              <p>
                I find this very exciting, and I believe the day when AI agents can independently develop full applications is not far away.
              </p>
            </div>
          </div>

          {/* 特色功能 - 移动端单列布局 */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-5 sm:p-6 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Online 3D Viewer</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Intuitive navigation interface, model rendering quality control, and screenshot capture functionality
              </p>
            </div>

            <div className="text-center p-5 sm:p-6 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Immersive Experience</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Smooth 360-degree view control and multiple camera modes with FPS support, making you feel like truly walking back into that space
              </p>
            </div>

            <div className="text-center p-5 sm:p-6 bg-white rounded-lg shadow-sm sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Emotional Memory</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                More than just spatial documentation, it's a carrier of emotions and memories, where every corner tells a unique story
              </p>
            </div>
          </div>

          {/* 技术说明 */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
              Technology Stack
            </h3>
            <div className="max-w-2xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                    Next.js + React 19 modern framework
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                    Three.js 3D rendering engine
                  </li>
                </ul>
                <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                    TypeScript type-safe development
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                    Tailwind CSS modern styling
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 底部卡片 - 移动端垂直布局 */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* 个人网站卡片 */}
            <a 
              href="https://jingsheng.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-5 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                    My Personal Website
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Visit my personal site to learn more about me
                  </p>
                </div>
              </div>
            </a>

            {/* 开发工具卡片 */}
            <a 
              href="https://github.com/Exsusiai/Apartment_3D_webview/blob/main/cursor_rule.md"
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-5 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                    Development by Cursor + Claude 4
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    View Cursor Rules used in this project on GitHub
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 