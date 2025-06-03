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
        "py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50 transition-all duration-1000",
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="container mx-auto max-w-4xl">
        {/* 标题部分 */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            关于 MemoSpace
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            一个用3D技术保存空间记忆的数字化项目
          </p>
        </div>

        {/* 内容网格 */}
        <div className="grid gap-8 md:gap-12">
          {/* 项目介绍 */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              项目愿景
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg max-w-3xl mx-auto">
              MemoSpace 是一个致力于保存和分享居住空间记忆的3D数字化项目。我们相信每一个居住过的地方都承载着独特的故事和情感，
              值得被完整地记录下来。通过高精度的3D扫描技术，我们将这些珍贵的空间记忆永久保存，
              让人们能够随时重新体验那些曾经生活过的地方。
            </p>
          </div>

          {/* 特色功能 */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">高精度3D扫描</h4>
              <p className="text-gray-600 text-sm">
                使用先进的3D扫描技术，捕捉空间的每一个细节，
                创造身临其境的浏览体验
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">沉浸式体验</h4>
              <p className="text-gray-600 text-sm">
                流畅的360度视角控制和真实的光影效果，
                让您仿佛真的重新走进了那个空间
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">情感记忆</h4>
              <p className="text-gray-600 text-sm">
                不仅仅是空间的记录，更是情感和回忆的载体，
                每个角落都诉说着独特的故事
              </p>
            </div>
          </div>

          {/* 技术说明 */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              技术实现
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">前端技术</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                    Next.js + React 19 现代化框架
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                    Three.js 3D渲染引擎
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                    TypeScript 类型安全开发
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                    Tailwind CSS 现代化样式
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">3D技术特性</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                    实时光线追踪渲染
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                    多种相机控制模式
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                    响应式性能优化
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                    跨平台兼容性支持
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 当前状态和未来计划 */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              项目进展
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-blue-900 mb-3">当前展示</h4>
                <p className="text-blue-800 text-sm">
                  目前展示了柏林潘科区（Berlin Pankow）的公寓3D模型，
                  这是一个完整的高精度扫描案例，展示了项目的技术实现水平和视觉效果。
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-green-900 mb-3">未来规划</h4>
                <p className="text-green-800 text-sm">
                  计划添加更多居住空间的3D模型，包括不同城市、不同时期的居住记忆，
                  构建一个完整的个人空间记忆档案。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 