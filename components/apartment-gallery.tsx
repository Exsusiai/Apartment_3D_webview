"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { getApartments, ApartmentData } from "@/utils/apartment-data"
import { Apartment3DViewer } from "@/components/apartment-3d-viewer"

function ApartmentCard({
  apartment,
  index,
  isLast,
}: {
  apartment: ApartmentData
  index: number
  isLast: boolean
}) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  })

  const isEven = index % 2 === 0
  const [selectedApartment, setSelectedApartment] = useState<ApartmentData | null>(null)
  const [showNoModelMessage, setShowNoModelMessage] = useState(false)

  // 计算卡片间距和位置
  const spacingClass = cn(
    "relative transition-all duration-700",
    // 垂直间距 - 第一个卡片紧贴hero section，确保滚动后Browse按钮不可见
    index === 0 ? "mt-0" : "", // 从mt-4改为mt-0，让第一个卡片更贴近hero section
    !isLast ? "mb-24 md:mb-28 lg:mb-32" : "mb-16", // 确保最后一个卡片也有底部间距
    // 动画效果
    isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16",
  )

  // 处理点击事件
  const handleCardClick = () => {
    if (apartment.hasModel) {
      setSelectedApartment(apartment)
    } else {
      // 对于没有模型的公寓，显示更好的提示
      setShowNoModelMessage(true)
      setTimeout(() => setShowNoModelMessage(false), 3000)
    }
  }

  // 判断是否为占位符
  const isPlaceholder = apartment.id.startsWith('placeholder_')

  return (
    <>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={spacingClass}
        // 为第一个卡片添加ID，便于直接定位
        id={index === 0 ? "first-apartment-card" : undefined}
      >
        <div className="md:flex md:items-end md:justify-center relative">
          {/* 左侧内容 */}
          <div className="md:w-[45%] flex md:justify-end mb-4 md:mb-0">
            {isEven ? (
              // 偶数索引：左侧为图片
              <div
                className={cn(
                  "relative w-[90%] md:w-[400px] h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded-lg border border-gray-100",
                  apartment.hasModel ? "cursor-pointer" : "cursor-default",
                  isPlaceholder ? "opacity-60" : ""
                )}
                onClick={handleCardClick}
              >
                <div className={cn(
                  "absolute inset-0 transition-colors z-10",
                  apartment.hasModel ? "bg-black/5 hover:bg-black/0" : "bg-black/10"
                )} />
                {apartment.hasModel && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20">
                    <span className="px-4 py-2 bg-white/90 rounded-md text-sm font-medium">View 3D Model</span>
                  </div>
                )}
                {isPlaceholder && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <span className="px-4 py-2 bg-gray-100/90 rounded-md text-sm font-medium text-gray-600">Coming Soon</span>
                  </div>
                )}
                <div className={cn(
                  "h-full w-full transition-transform duration-500",
                  apartment.hasModel ? "hover:scale-105" : ""
                )}>
                  <img
                    src={apartment.thumbnail || "/placeholder.svg"}
                    alt={apartment.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ) : (
              // 奇数索引：左侧为文字
              <div className="w-[90%] md:w-[400px] flex flex-col justify-end text-right pr-4">
                <h3 className={cn(
                  "text-lg sm:text-xl md:text-2xl font-medium mb-2",
                  isPlaceholder ? "text-gray-500" : "text-gray-900"
                )}>{apartment.title}</h3>
                <p className={cn(
                  "text-sm sm:text-base",
                  isPlaceholder ? "text-gray-400" : "text-gray-600"
                )}>{apartment.description}</p>
                {apartment.hasModel && (
                  <button
                    onClick={handleCardClick}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors self-end"
                  >
                    View 3D Model
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 中轴线占位 */}
          <div className="hidden md:block md:w-[10%]"></div>

          {/* 右侧内容 */}
          <div className="md:w-[45%] flex md:justify-start mb-4 md:mb-0">
            {isEven ? (
              // 偶数索引：右侧为文字
              <div className="w-[90%] md:w-[400px] flex flex-col justify-end text-left pl-4">
                <h3 className={cn(
                  "text-lg sm:text-xl md:text-2xl font-medium mb-2",
                  isPlaceholder ? "text-gray-500" : "text-gray-900"
                )}>{apartment.title}</h3>
                <p className={cn(
                  "text-sm sm:text-base",
                  isPlaceholder ? "text-gray-400" : "text-gray-600"
                )}>{apartment.description}</p>
                {apartment.hasModel && (
                  <button
                    onClick={handleCardClick}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors self-start"
                  >
                    View 3D Model
                  </button>
                )}
              </div>
            ) : (
              // 奇数索引：右侧为图片
              <div
                className={cn(
                  "relative w-[90%] md:w-[400px] h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded-lg border border-gray-100",
                  apartment.hasModel ? "cursor-pointer" : "cursor-default",
                  isPlaceholder ? "opacity-60" : ""
                )}
                onClick={handleCardClick}
              >
                <div className={cn(
                  "absolute inset-0 transition-colors z-10",
                  apartment.hasModel ? "bg-black/5 hover:bg-black/0" : "bg-black/10"
                )} />
                {apartment.hasModel && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20">
                    <span className="px-4 py-2 bg-white/90 rounded-md text-sm font-medium">View 3D Model</span>
                  </div>
                )}
                {isPlaceholder && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <span className="px-4 py-2 bg-gray-100/90 rounded-md text-sm font-medium text-gray-600">Coming Soon</span>
                  </div>
                )}
                <div className={cn(
                  "h-full w-full transition-transform duration-500",
                  apartment.hasModel ? "hover:scale-105" : ""
                )}>
                  <img
                    src={apartment.thumbnail || "/placeholder.svg"}
                    alt={apartment.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 无模型提示消息 */}
      {showNoModelMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-100 border border-blue-300 px-6 py-3 rounded-lg shadow-lg">
          <p className="text-blue-800 text-sm font-medium">
            The 3D model for {apartment.title} is being prepared, stay tuned!
          </p>
        </div>
      )}

      {/* 3D查看器对话框 */}
      <Dialog open={!!selectedApartment} onOpenChange={(open) => !open && setSelectedApartment(null)}>
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0">
          <DialogTitle className="sr-only">
            {selectedApartment?.title} - 3D Viewer
          </DialogTitle>
          {selectedApartment && (
            <Apartment3DViewer 
              apartment={selectedApartment} 
              onClose={() => setSelectedApartment(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export function ApartmentGallery() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [axisHeight, setAxisHeight] = useState("100%")
  
  // 获取真实的公寓数据
  const apartments = getApartments()

  // 计算中轴线的高度，确保它只覆盖gallery区域，不延伸到About部分
  useEffect(() => {
    const updateAxisHeight = () => {
      if (galleryRef.current) {
        // 获取gallery容器内容的实际高度
        const contentHeight = galleryRef.current.clientHeight
        // 只给中轴线设置到gallery内容结束的位置，不添加额外高度
        setAxisHeight(`${contentHeight}px`)
      }
    }

    // 初始更新
    setTimeout(updateAxisHeight, 100) // 短暂延迟确保DOM渲染完成

    // 设置ResizeObserver
    const resizeObserver = new ResizeObserver(updateAxisHeight)
    if (galleryRef.current) {
      resizeObserver.observe(galleryRef.current)
    }

    // 在窗口大小变化时也更新
    window.addEventListener("resize", updateAxisHeight)

    // 清理函数
    return () => {
      if (galleryRef.current) {
        resizeObserver.unobserve(galleryRef.current)
      }
      window.removeEventListener("resize", updateAxisHeight)
    }
  }, [])

  return (
    <div
      id="apartment-gallery"
      className="container mx-auto pt-0 pb-16 md:pb-24 px-4 md:px-8 relative border-none"
      ref={galleryRef}
    >
      {/* 添加一个锚点元素，用于更精确的滚动定位 */}
      <div id="gallery-anchor" className="absolute" style={{ top: "-100px" }}></div>

      {/* 中轴线 - 只覆盖gallery区域，不延伸到About部分 */}
      <div
        className="absolute left-1/2 top-0 w-[2px] md:w-[3px] bg-gray-200 md:bg-gray-300 transform -translate-x-1/2 z-10"
        style={{ height: axisHeight }}
      />

      <div className="relative">
        {apartments.map((apartment, index) => (
          <ApartmentCard
            key={apartment.id}
            apartment={apartment}
            index={index}
            isLast={index === apartments.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
