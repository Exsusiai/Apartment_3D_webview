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

  // 格式化description以正确显示换行符
  const formatDescription = (description: string) => {
    return description.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < description.split('\n').length - 1 && <br />}
      </span>
    ));
  };

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
                  apartment.hasModel ? "cursor-pointer" : "cursor-default"
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
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium mb-2 text-gray-900">{apartment.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{formatDescription(apartment.description)}</p>
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
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium mb-2 text-gray-900">{apartment.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{formatDescription(apartment.description)}</p>
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
                  apartment.hasModel ? "cursor-pointer" : "cursor-default"
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
            {selectedApartment?.title} 3D Model
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
  const [apartments, setApartments] = useState<ApartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axisRef = useRef<HTMLDivElement>(null);

  // 动态加载公寓数据
  useEffect(() => {
    const loadApartments = async () => {
      try {
        setLoading(true);
        const apartmentData = await getApartments();
        setApartments(apartmentData);
      } catch (err) {
        console.error('Failed to load apartments:', err);
        setError('Failed to load apartment data');
      } finally {
        setLoading(false);
      }
    };

    loadApartments();
  }, []);

  // 动态更新轴线高度
  useEffect(() => {
    const updateAxisHeight = () => {
      if (axisRef.current) {
        const galleryHeight = document.querySelector('.apartment-gallery')?.scrollHeight || 0;
        axisRef.current.style.height = `${galleryHeight - 100}px`;
      }
    };

    // 初始更新
    updateAxisHeight();

    // 监听窗口大小变化
    const handleResize = () => {
      setTimeout(updateAxisHeight, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // 监听内容变化
    const observer = new ResizeObserver(() => {
      setTimeout(updateAxisHeight, 100);
    });

    if (axisRef.current) {
      observer.observe(axisRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [apartments]);

  if (loading) {
    return (
      <section className="py-16 bg-white min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading apartments...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white relative apartment-gallery">
      {/* 中央轴线 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
        <div
          ref={axisRef}
          className="w-0.5 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent"
          style={{ height: 'auto' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {apartments.map((apartment, index) => (
          <ApartmentCard
            key={apartment.id}
            apartment={apartment}
            index={index}
            isLast={index === apartments.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
