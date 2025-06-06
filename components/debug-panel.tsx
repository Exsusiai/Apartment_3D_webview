"use client"

import { useState, useEffect } from "react"
import { isMobileDevice, getDeviceType, isTouchDevice, getViewportSize, isIOS, isAndroid } from "@/utils/device-utils"

export function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [debugInfo, setDebugInfo] = useState({
    isMobile: false,
    deviceType: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    isTouch: false,
    viewport: { width: 0, height: 0 },
    userAgent: '',
    isIOS: false,
    isAndroid: false,
    screenSize: { width: 0, height: 0 },
    pixelRatio: 1,
    hasOrientation: false,
    orientation: 0
  })

  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        isMobile: isMobileDevice(),
        deviceType: getDeviceType(),
        isTouch: isTouchDevice(),
        viewport: getViewportSize(),
        userAgent: navigator.userAgent,
        isIOS: isIOS(),
        isAndroid: isAndroid(),
        screenSize: { width: screen.width, height: screen.height },
        pixelRatio: window.devicePixelRatio || 1,
        hasOrientation: 'orientation' in window,
        orientation: (window as any).orientation || 0
      })
    }

    updateDebugInfo()
    
    window.addEventListener('resize', updateDebugInfo)
    window.addEventListener('orientationchange', updateDebugInfo)
    
    return () => {
      window.removeEventListener('resize', updateDebugInfo)
      window.removeEventListener('orientationchange', updateDebugInfo)
    }
  }, [])

  // 只在开发环境或有特殊查询参数时显示调试面板
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isDev = process.env.NODE_ENV === 'development'
    const forceDebug = urlParams.get('debug') === 'true'
    
    setIsVisible(isDev || forceDebug)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-16 right-4 z-50 bg-black/90 text-white p-3 rounded-lg text-xs max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">Debug Info</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-300 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div>Mobile: <span className={debugInfo.isMobile ? "text-green-400" : "text-red-400"}>
          {debugInfo.isMobile ? "Yes" : "No"}
        </span></div>
        
        <div>Device: <span className="text-blue-400">{debugInfo.deviceType}</span></div>
        
        <div>Touch: <span className={debugInfo.isTouch ? "text-green-400" : "text-red-400"}>
          {debugInfo.isTouch ? "Yes" : "No"}
        </span></div>
        
        <div>Viewport: <span className="text-yellow-400">
          {debugInfo.viewport.width}×{debugInfo.viewport.height}
        </span></div>
        
        <div>Screen: <span className="text-yellow-400">
          {debugInfo.screenSize.width}×{debugInfo.screenSize.height}
        </span></div>
        
        <div>Ratio: <span className="text-purple-400">{debugInfo.pixelRatio}</span></div>
        
        <div>iOS: <span className={debugInfo.isIOS ? "text-green-400" : "text-gray-400"}>
          {debugInfo.isIOS ? "Yes" : "No"}
        </span></div>
        
        <div>Android: <span className={debugInfo.isAndroid ? "text-green-400" : "text-gray-400"}>
          {debugInfo.isAndroid ? "Yes" : "No"}
        </span></div>
        
        <div>Orientation: <span className={debugInfo.hasOrientation ? "text-green-400" : "text-gray-400"}>
          {debugInfo.hasOrientation ? `${debugInfo.orientation}°` : "N/A"}
        </span></div>
        
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-gray-300 break-all">
            UA: {debugInfo.userAgent.slice(0, 50)}...
          </div>
        </div>
      </div>
    </div>
  )
} 