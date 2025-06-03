"use client"

// 注意：这个组件是一个示例，实际使用时需要根据您的3D模型格式和查看器库进行调整
// 您可以使用 three.js, model-viewer 或其他3D查看器库

import { useEffect, useRef } from "react"

interface ApartmentModelViewerProps {
  modelUrl: string
  title: string
}

export function ApartmentModelViewer({ modelUrl, title }: ApartmentModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 这里应该初始化您选择的3D查看器
    // 例如，如果使用 three.js，您可以在这里设置场景、相机和渲染器

    // 示例代码（需要替换为实际的3D查看器初始化代码）
    const container = containerRef.current
    if (!container) return

    // 清理函数
    return () => {
      // 在组件卸载时清理3D查看器资源
    }
  }, [modelUrl])

  return (
    <div className="w-full h-full" ref={containerRef}>
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        {/* 在实际3D查看器加载前显示的占位内容 */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading {title}'s 3D model...</p>
      </div>
    </div>
  )
}
