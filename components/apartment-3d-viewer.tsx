"use client"

import { useEffect, useRef, useState } from "react"
import { ApartmentData } from "@/utils/apartment-data"
import { isMobileDevice, getDeviceType } from "@/utils/device-utils"

interface Apartment3DViewerProps {
  apartment: ApartmentData
  onClose?: () => void
}

export function Apartment3DViewer({ apartment, onClose }: Apartment3DViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [iframeKey, setIframeKey] = useState(0) // 添加key来强制重新创建iframe
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // 确保在客户端执行
    setIsClient(true)
    
    // 延迟检测设备类型，确保DOM完全加载
    const detectDevice = () => {
      const mobile = isMobileDevice()
      console.log('Device detection result:', mobile) // 调试日志
      setIsMobile(mobile)
    }
    
    // 立即检测一次
    detectDevice()
    
    // 监听窗口大小变化
    const handleResize = () => {
      detectDevice()
    }
    
    // 监听设备方向变化
    const handleOrientationChange = () => {
      setTimeout(detectDevice, 100) // 延迟检测，等待方向变化完成
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  useEffect(() => {
    // 只有在客户端且设备检测完成后才创建iframe内容
    if (!isClient) return
    
    if (!apartment.hasModel) {
      setError("This apartment currently has no 3D model")
      setIsLoading(false)
      return
    }

    // 重置状态
    setError(null)
    setIsLoading(true)
    
    // 延迟一点时间确保iframe完全重新创建
    const timer = setTimeout(() => {
      // 创建3D查看器的HTML内容
      const create3DViewerHTML = () => {
        const isMobileStr = isMobile ? 'true' : 'false';
        console.log('Creating 3D viewer with mobile setting:', isMobileStr) // 调试日志
        
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${apartment.title} - 3D Viewer</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            overflow: hidden;
            touch-action: none; /* 防止默认的触摸行为 */
        }
        
        .viewer-container {
            display: flex;
            height: 100vh;
            width: 100vw;
        }
        
        .sidebar {
            width: 280px;
            background: white;
            border-right: 1px solid #e5e5e5;
            padding: 20px;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            display: ${isMobile ? 'none' : 'block'};
        }
        
        .mobile-controls {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255,255,255,0.95);
            padding: 16px;
            border-top: 1px solid #e5e5e5;
            display: ${isMobile ? 'block' : 'none'};
            z-index: 100;
        }
        
        .mobile-controls-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .mobile-controls-content {
            display: none;
        }
        
        .mobile-controls.expanded .mobile-controls-content {
            display: block;
        }
        
        .toggle-controls-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
        }
        
        .model-view {
            flex: 1;
            position: relative;
            background: #f0f0f0;
        }
        
        #modelContainer {
            width: 100%;
            height: 100%;
            position: relative;
        }
        
        .panel {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }
        
        .mobile-panel {
            background: transparent;
            border: none;
            padding: 0;
            margin-bottom: 12px;
        }
        
        .panel h3, .mobile-panel h3 {
            margin: 0 0 12px 0;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            margin: 4px;
            transition: background-color 0.2s;
        }
        
        .btn:hover {
            background: #0056b3;
        }
        
        .btn.secondary {
            background: #6c757d;
        }
        
        .btn.secondary:hover {
            background: #545b62;
        }
        
        .btn.full-width {
            width: 100%;
            margin: 4px 0;
        }
        
        .btn.small {
            padding: 6px 12px;
            font-size: 12px;
        }
        
        .controls-group {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 8px;
        }
        
        .controls-group .btn {
            flex: 1;
            min-width: 80px;
        }
        
        .mobile-controls-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }
        
        select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            margin-top: 8px;
        }
        
        .view-info {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 100;
            display: ${isMobile ? 'none' : 'block'};
        }
        
        .mobile-view-info {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            z-index: 100;
            display: ${isMobile ? 'block' : 'none'};
        }
        
        .esc-prompt {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255,0,0,0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 100;
        }
        
        .esc-prompt.hidden {
            display: none;
        }
        
        #loadingOverlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-text {
            margin-top: 16px;
            font-size: 14px;
            color: #666;
        }
        
        .center-screen {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 200;
        }
        
        .center-screen.hidden {
            display: none;
        }
        
        .prompt-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            z-index: 1001;
        }
        
        .close-btn:hover {
            background: rgba(0,0,0,0.7);
        }
        
        /* 移动端触摸提示 */
        .touch-hint {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            z-index: 500;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        
        .touch-hint.hidden {
            opacity: 0;
        }
        
        /* 移动端持续操作提示 */
        .mobile-operation-hint {
            position: absolute;
            top: 60px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 150;
            display: ${isMobile ? 'block' : 'none'};
            max-width: 200px;
            transition: all 0.3s ease;
        }
        
        .mobile-operation-hint.minimized {
            padding: 8px 12px;
            cursor: pointer;
        }
        
        .mobile-operation-hint.minimized .hint-content {
            display: none;
        }
        
        .mobile-operation-hint.minimized .hint-title {
            font-size: 11px;
        }
        
        .hint-title {
            font-weight: bold;
            margin-bottom: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }
        
        .hint-content {
            line-height: 1.4;
        }
        
        .hint-toggle {
            background: none;
            border: none;
            color: white;
            font-size: 12px;
            cursor: pointer;
            padding: 0;
            margin-left: 8px;
        }
    </style>
</head>
<body>
    <div class="viewer-container">
        <!-- 桌面端侧边栏 -->
        <div class="sidebar">
            <div class="panel">
                <h3>🏠 Apartment Information</h3>
                <h4 style="margin: 0; color: #333;">${apartment.title}</h4>
                <p style="font-size: 12px; color: #666; margin: 8px 0 0 0;">${apartment.description}</p>
            </div>

            <div class="panel" id="desktopControlPanel">
                <h3>🎮 View Control</h3>
                <div class="controls-group">
                    <button id="toggleControlModeBtn" class="btn full-width">
                        <span id="controlModeText">Switch to FPS Mode</span>
                    </button>
                </div>
                <div class="controls-group">
                    <button id="viewTopBtn" class="btn secondary">Top View</button>
                    <button id="viewFrontBtn" class="btn secondary">Front View</button>
                    <button id="viewSideBtn" class="btn secondary">Side View</button>
                </div>
                <div class="controls-group">
                    <button id="resetViewBtn" class="btn full-width">Reset View</button>
                </div>
                <div class="controls-group">
                    <button id="toggleWireframeBtn" class="btn secondary full-width">Toggle Wireframe</button>
                </div>
            </div>

            <div class="panel">
                <h3>⚙️ Quality Control</h3>
                <label for="qualitySelector">Render Quality:</label>
                <select id="qualitySelector">
                    <option value="low">Low (Smoother)</option>
                    <option value="medium" selected>Medium (Balanced)</option>
                    <option value="high">High (Clearer)</option>
                </select>
            </div>

            <div class="panel">
                <h3>📷 Screenshot</h3>
                <button id="screenshotBtn" class="btn full-width">Save Screenshot</button>
            </div>

            <div class="panel">
                <h3>💡 Lighting Control</h3>
                <label for="brightnessSlider">Overall Brightness:</label>
                <input type="range" id="brightnessSlider" min="0.4" max="1.2" step="0.05" value="0.8" style="width: 100%; margin: 8px 0;">
                <div style="font-size: 11px; color: #666; margin-bottom: 8px;">
                    <span>Dark</span>
                    <span style="float: right;">Bright</span>
                </div>
                <div class="controls-group">
                    <button id="resetLightingBtn" class="btn secondary full-width">Reset Lighting</button>
                </div>
            </div>
        </div>

        <div class="model-view">
            <button class="close-btn" onclick="window.parent.postMessage('close', '*')" title="Close">×</button>
            <div id="modelContainer">
                <div class="view-info">
                    <div id="rotationInfo">View: 0°</div>
                    <div id="zoomInfo">Height: ${apartment.config.camera.height}m</div>
                </div>
                <div class="mobile-view-info">
                    <div>${apartment.title}</div>
                </div>
                <div id="escExitPrompt" class="esc-prompt hidden">
                    Press ESC to exit FPS mode
                </div>
                <div id="loadingOverlay">
                    <div class="spinner"></div>
                    <div class="loading-text">Loading model...</div>
                </div>
                <div id="pointerLockPrompt" class="center-screen hidden">
                    <div class="prompt-content">
                        <button id="enterFPSBtn" class="btn full-width" style="font-size:1.1rem;padding:1em 2em;">Click to enable FPS control</button>
                    </div>
                </div>
                <div id="touchHint" class="touch-hint hidden">
                    <div>
                        <p style="margin: 0 0 8px 0;">Touch Controls:</p>
                        <p style="margin: 0; font-size: 12px;">
                            Single finger: Rotate<br>
                            Two fingers: Zoom/Pan
                        </p>
                    </div>
                </div>
                
                <!-- 移动端持续操作提示 -->
                <div id="mobileOperationHint" class="mobile-operation-hint">
                    <div class="hint-title" onclick="toggleOperationHint()">
                        <span>操作提示</span>
                        <button class="hint-toggle" id="hintToggleBtn">−</button>
                    </div>
                    <div class="hint-content" id="hintContent">
                        <div style="margin-bottom: 4px;">
                            <strong>👆 单指:</strong> 旋转视角
                        </div>
                        <div style="margin-bottom: 4px;">
                            <strong>✌️ 双指:</strong> 缩放/平移
                        </div>
                        <div style="font-size: 10px; color: #ccc; margin-top: 6px;">
                            点击此区域可收起/展开
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 移动端底部控制栏 -->
            <div class="mobile-controls" id="mobileControls">
                <div class="mobile-controls-header">
                    <h3 style="margin: 0; font-size: 16px;">Controls</h3>
                    <button class="toggle-controls-btn" id="toggleMobileControlsBtn">
                        <span id="toggleControlsText">▲</span>
                    </button>
                </div>
                <div class="mobile-controls-content">
                    <div class="mobile-panel">
                        <div class="mobile-controls-grid">
                            <button id="mobileViewTopBtn" class="btn small secondary">Top</button>
                            <button id="mobileViewFrontBtn" class="btn small secondary">Front</button>
                            <button id="mobileViewSideBtn" class="btn small secondary">Side</button>
                        </div>
                        <button id="mobileResetViewBtn" class="btn full-width small" style="margin-top: 8px;">Reset View</button>
                    </div>
                    <div class="mobile-panel">
                        <button id="mobileToggleWireframeBtn" class="btn secondary full-width small">Toggle Wireframe</button>
                        <button id="mobileScreenshotBtn" class="btn full-width small" style="margin-top: 8px;">Save Screenshot</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Three.js 库 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/PointerLockControls.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/MTLLoader.min.js"></script>
    
    <script>
        // 强制重置所有全局变量
        if (window.scene) {
            window.scene.clear();
        }
        if (window.renderer) {
            window.renderer.dispose();
        }
        
        // 检测是否为移动设备
        const isMobile = ${isMobileStr};
        
        // 3D查看器初始化脚本
        let scene, camera, renderer, controls, model;
        let orbitControls, pointerLockControls;
        let isWireframe = false;
        let currentControlMode = 'orbit'; // 'orbit' or 'fps'
        let animationId = null; // 用于清理动画循环
        let keyboardControls = null; // 键盘控制器
        let lightSources = []; // 存储所有光源用于亮度控制
        let baseLightIntensities = {}; // 存储光源的基础亮度值
        
        // 公寓配置
        const apartmentConfig = ${JSON.stringify(apartment.config)};
        const modelPath = "${apartment.modelPath}";
        
        // 调试：输出配置信息
        console.log('Raw apartment object passed to iframe:', ${JSON.stringify(apartment)});
        console.log('Apartment config received:', apartmentConfig);
        console.log('Config camera height:', apartmentConfig.camera.height);
        console.log('Config camera object:', apartmentConfig.camera);
        console.log('Is mobile device:', isMobile);
        
        // 键盘控制类 - 完整的WASD移动逻辑（桌面端才使用）
        class KeyboardControls {
            constructor(camera, scene, domElement) {
                this.camera = camera;
                this.scene = scene;
                this.domElement = domElement;
                
                // 控制状态
                this.enabled = false;
                this.isMoving = false;
                
                // 移动参数
                this.movementSpeed = 0.05;
                this.fixedHeight = this.camera.position.y;
                
                // 按键状态
                this.keys = {
                    87: false, // W
                    83: false, // S
                    65: false, // A
                    68: false, // D
                    38: false, // 上箭头
                    40: false, // 下箭头
                    37: false, // 左箭头
                    39: false  // 右箭头
                };
                
                // 绑定事件处理函数
                this._onKeyDown = this._onKeyDown.bind(this);
                this._onKeyUp = this._onKeyUp.bind(this);
            }
            
            enable() {
                if (this.enabled) return;
                
                this.enabled = true;
                document.addEventListener('keydown', this._onKeyDown, false);
                document.addEventListener('keyup', this._onKeyUp, false);
                console.log('Keyboard control enabled');
            }
            
            disable() {
                if (!this.enabled) return;
                
                this.enabled = false;
                document.removeEventListener('keydown', this._onKeyDown, false);
                document.removeEventListener('keyup', this._onKeyUp, false);
                
                // 重置按键状态
                for (let key in this.keys) {
                    this.keys[key] = false;
                }
                this.isMoving = false;
                console.log('Keyboard control disabled');
            }
            
            _onKeyDown(event) {
                if (!this.enabled) return;
                
                const keyCode = event.keyCode;
                
                // 检查移动键
                if (event.key === 'w' || event.key === 'W' || keyCode === 87 || keyCode === 38) {
                    this.keys[87] = true;
                } else if (event.key === 's' || event.key === 'S' || keyCode === 83 || keyCode === 40) {
                    this.keys[83] = true;
                } else if (event.key === 'a' || event.key === 'A' || keyCode === 65 || keyCode === 37) {
                    this.keys[65] = true;
                } else if (event.key === 'd' || event.key === 'D' || keyCode === 68 || keyCode === 39) {
                    this.keys[68] = true;
                }
                
                // 阻止默认行为
                if ([32, 37, 38, 39, 40, 87, 83, 65, 68].includes(keyCode)) {
                    event.preventDefault();
                }
            }
            
            _onKeyUp(event) {
                if (!this.enabled) return;
                
                const keyCode = event.keyCode;
                
                // 检查移动键
                if (event.key === 'w' || event.key === 'W' || keyCode === 87 || keyCode === 38) {
                    this.keys[87] = false;
                } else if (event.key === 's' || event.key === 'S' || keyCode === 83 || keyCode === 40) {
                    this.keys[83] = false;
                } else if (event.key === 'a' || event.key === 'A' || keyCode === 65 || keyCode === 37) {
                    this.keys[65] = false;
                } else if (event.key === 'd' || event.key === 'D' || keyCode === 68 || keyCode === 39) {
                    this.keys[68] = false;
                }
            }
            
            update() {
                if (!this.enabled) return;
                
                try {
                    // 检查按键状态
                    const movingForward = this.keys[87]; // W
                    const movingBackward = this.keys[83]; // S
                    const movingLeft = this.keys[65]; // A
                    const movingRight = this.keys[68]; // D
                    
                    // 如果没有按键按下，直接返回
                    if (!(movingForward || movingBackward || movingLeft || movingRight)) {
                        if (this.isMoving) {
                            this.isMoving = false;
                        }
                        return;
                    }
                    
                    // 获取相机的朝向
                    const direction = new THREE.Vector3();
                    this.camera.getWorldDirection(direction);
                    direction.normalize();
                    
                    // 获取右向量
                    const right = new THREE.Vector3();
                    right.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();
                    
                    // 计算移动向量
                    const moveVector = new THREE.Vector3(0, 0, 0);
                    
                    if (movingForward) {
                        moveVector.add(direction);
                    }
                    if (movingBackward) {
                        moveVector.sub(direction);
                    }
                    if (movingRight) {
                        moveVector.add(right);
                    }
                    if (movingLeft) {
                        moveVector.sub(right);
                    }
                    
                    // 归一化移动向量
                    moveVector.normalize();
                    moveVector.multiplyScalar(this.movementSpeed);
                    
                    // 只在xz平面移动
                    moveVector.y = 0;
                    
                    // 更新相机位置
                    this.camera.position.add(moveVector);
                    this.camera.position.y = this.fixedHeight;
                    
                    if (!this.isMoving) {
                        this.isMoving = true;
                    }
                } catch (error) {
                    console.error('键盘控制更新时出错:', error);
                }
            }
            
            setFixedHeight(height) {
                this.fixedHeight = height;
            }
            
            setMovementSpeed(speed) {
                this.movementSpeed = speed;
            }
        }
        
        // 清理之前的资源
        function cleanup() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            
            if (keyboardControls) {
                keyboardControls.disable();
                keyboardControls = null;
            }
            
            if (renderer) {
                renderer.dispose();
                renderer.forceContextLoss();
                if (renderer.domElement && renderer.domElement.parentNode) {
                    renderer.domElement.parentNode.removeChild(renderer.domElement);
                }
            }
            
            if (scene) {
                scene.clear();
            }
            
            // 清理事件监听器
            window.removeEventListener('resize', onWindowResize);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('pointerlockchange', onPointerLockChange);
            document.removeEventListener('pointerlockerror', onPointerLockError);
        }
        
        // 初始化3D场景
        function init() {
            try {
                // 先清理之前的资源
                cleanup();
                
                // 创建场景
                scene = new THREE.Scene();
                scene.background = new THREE.Color(0xf0f0f0);
                
                // 创建相机
                camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.set(apartmentConfig.camera.init_point[0], apartmentConfig.camera.height, apartmentConfig.camera.init_point[1]);
                
                // 创建渲染器
                renderer = new THREE.WebGLRenderer({ antialias: true });
                
                // 移动端调整渲染器大小
                const rendererWidth = isMobile ? window.innerWidth : window.innerWidth - 280;
                renderer.setSize(rendererWidth, window.innerHeight);
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                
                const container = document.getElementById('modelContainer');
                const canvas = container.querySelector('canvas');
                if (canvas) {
                    container.removeChild(canvas);
                }
                container.appendChild(renderer.domElement);
                
                // 创建控制器
                setupControls();
                
                // 添加光源
                setupLighting();
                
                // 加载模型
                loadModel();
                
                // 设置事件监听
                setupEventListeners();
                
                // 开始渲染循环
                animate();
                
                // 移动端显示触控提示
                if (isMobile) {
                    showTouchHint();
                }
                
            } catch (error) {
                console.error('初始化3D场景失败:', error);
                const loadingOverlay = document.getElementById('loadingOverlay');
                if (loadingOverlay) {
                    loadingOverlay.innerHTML = '<div style="color: red;">3D scene initialization failed</div>';
                }
            }
        }
        
        function setupControls() {
            // 轨道控制器
            orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            orbitControls.dampingFactor = 0.05;
            orbitControls.target.set(0, 0, 0);
            
            // 移动端特殊设置
            if (isMobile) {
                orbitControls.enablePan = true; // 允许平移
                orbitControls.panSpeed = 0.5;
                orbitControls.rotateSpeed = 0.7;
                orbitControls.zoomSpeed = 0.8;
                
                // 移动端不创建FPS相关控制器
                pointerLockControls = null;
                keyboardControls = null;
            } else {
                // 桌面端才创建FPS控制器
            pointerLockControls = new THREE.PointerLockControls(camera, renderer.domElement);
            scene.add(pointerLockControls.getObject());
            
            // 键盘控制器
            keyboardControls = new KeyboardControls(camera, scene, renderer.domElement);
            keyboardControls.setFixedHeight(apartmentConfig.camera.height);
            
            pointerLockControls.enabled = false;
            keyboardControls.disable();
            }
            
            // 默认使用轨道控制器
            orbitControls.enabled = true;
        }
        
        function setupLighting() {
            // 清空之前的光源
            lightSources = [];
            baseLightIntensities = {};
            
            // 强化环境光 - 降低基础亮度适配新的滑块范围
            const ambientLight = new THREE.AmbientLight(0x606060, 0.5);
            scene.add(ambientLight);
            lightSources.push(ambientLight);
            baseLightIntensities['ambientLight'] = 0.5;
            
            // 半球光 - 模拟天空和地面的反射光
            const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
            hemisphereLight.position.set(0, 20, 0);
            scene.add(hemisphereLight);
            lightSources.push(hemisphereLight);
            baseLightIntensities['hemisphereLight'] = 0.3;
            
            // 主方向光 - 模拟窗户进来的阳光
            const mainDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
            mainDirectionalLight.position.set(15, 15, 10);
            mainDirectionalLight.castShadow = true;
            mainDirectionalLight.shadow.mapSize.width = 2048;
            mainDirectionalLight.shadow.mapSize.height = 2048;
            scene.add(mainDirectionalLight);
            lightSources.push(mainDirectionalLight);
            baseLightIntensities['mainDirectionalLight'] = 0.6;
            
            // 辅助方向光 - 从另一个角度补光
            const secondaryDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
            secondaryDirectionalLight.position.set(-10, 12, -8);
            scene.add(secondaryDirectionalLight);
            lightSources.push(secondaryDirectionalLight);
            baseLightIntensities['secondaryDirectionalLight'] = 0.3;
            
            // 室内点光源1 - 模拟天花板灯
            const ceilingLight1 = new THREE.PointLight(0xffffff, 0.4, 20);
            ceilingLight1.position.set(2, 3, 2);
            scene.add(ceilingLight1);
            lightSources.push(ceilingLight1);
            baseLightIntensities['ceilingLight1'] = 0.4;
            
            // 室内点光源2 - 模拟另一盏天花板灯
            const ceilingLight2 = new THREE.PointLight(0xffffff, 0.4, 20);
            ceilingLight2.position.set(-2, 3, -2);
            scene.add(ceilingLight2);
            lightSources.push(ceilingLight2);
            baseLightIntensities['ceilingLight2'] = 0.4;
            
            // 温暖点光源 - 模拟台灯或壁灯
            const warmLight = new THREE.PointLight(0xffeaa7, 0.3, 15);
            warmLight.position.set(0, 2, 0);
            scene.add(warmLight);
            lightSources.push(warmLight);
            baseLightIntensities['warmLight'] = 0.3;
            
            // 填充光 - 消除过暗的阴影
            const fillLight1 = new THREE.DirectionalLight(0xffffff, 0.15);
            fillLight1.position.set(5, 5, -10);
            scene.add(fillLight1);
            lightSources.push(fillLight1);
            baseLightIntensities['fillLight1'] = 0.15;
            
            const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.15);
            fillLight2.position.set(-5, 5, 10);
            scene.add(fillLight2);
            lightSources.push(fillLight2);
            baseLightIntensities['fillLight2'] = 0.15;
            
            // 根据滑块默认值调整初始亮度
            const defaultBrightness = 0.8;
            lightSources.forEach((light, index) => {
                const lightKeys = Object.keys(baseLightIntensities);
                if (lightKeys[index]) {
                    const baseIntensity = baseLightIntensities[lightKeys[index]];
                    light.intensity = baseIntensity * defaultBrightness;
                }
            });
            
            console.log('Enhanced lighting setup completed with adjusted brightness levels, initial brightness set to:', defaultBrightness);
        }
        
        function loadModel() {
            const loadingOverlay = document.getElementById('loadingOverlay');
            
            // MTL加载器
            const mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath(modelPath + '/');
            
            mtlLoader.load('textured_output.mtl', function(materials) {
                materials.preload();
                
                // OBJ加载器
                const objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath(modelPath + '/');
                
                objLoader.load('textured_output.obj', 
                    function(object) {
                        // 模型加载成功
                        model = object;
                        scene.add(model);
                        
                        // 计算模型边界盒
                        const box = new THREE.Box3().setFromObject(model);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());
                        
                        // 计算地板高度（模型最低点）
                        const floorHeight = box.min.y;
                        
                        // 计算相机的正确高度：地板高度 + 配置的相机高度
                        const cameraHeight = floorHeight + apartmentConfig.camera.height;
                        
                        // 使用配置文件中的init_point作为相机初始位置
                        const initX = apartmentConfig.camera.init_point[0];
                        const initZ = apartmentConfig.camera.init_point[1];
                        
                        // 设置相机位置 - 使用配置的init_point和计算的高度
                        camera.position.set(initX, cameraHeight, initZ);
                        
                        // 轨道控制器的目标点设置为模型中心
                        orbitControls.target.copy(center);
                        
                        // 桌面端更新键盘控制器的固定高度
                        if (keyboardControls) {
                        keyboardControls.setFixedHeight(cameraHeight);
                        }
                        
                        console.log('Model loaded. Floor height: ' + floorHeight.toFixed(2) + 'm, Camera height: ' + cameraHeight.toFixed(2) + 'm, Config height: ' + apartmentConfig.camera.height + 'm, Init point: [' + initX + ', ' + initZ + ']');
                        
                        // 隐藏加载界面
                        loadingOverlay.style.display = 'none';
                    },
                    function(progress) {
                        // 加载进度
                        console.log('Loading progress:', progress);
                    },
                    function(error) {
                        // 加载错误
                        console.error('Error loading model:', error);
                        loadingOverlay.innerHTML = '<div style="color: red;">模型加载失败</div>';
                    }
                );
            }, undefined, function(error) {
                console.error('Error loading materials:', error);
                loadingOverlay.innerHTML = '<div style="color: red;">材质加载失败</div>';
            });
        }
        
        function setupEventListeners() {
            // 桌面端控制
            if (!isMobile) {
            // 控制模式切换
            document.getElementById('toggleControlModeBtn').addEventListener('click', toggleControlMode);
            
            // FPS模式相关
            document.getElementById('enterFPSBtn').addEventListener('click', enterFPSMode);
            
            // 指针锁定状态变化监听
            document.addEventListener('pointerlockchange', onPointerLockChange);
            document.addEventListener('pointerlockerror', onPointerLockError);
            
            // 键盘事件
            document.addEventListener('keydown', onKeyDown);
                
                // 桌面端灯光控制
                document.getElementById('brightnessSlider').addEventListener('input', adjustBrightness);
                document.getElementById('resetLightingBtn').addEventListener('click', resetLighting);
            }
            
            // 通用控制（桌面端和移动端）
            // 视角按钮
            const viewTopBtn = document.getElementById(isMobile ? 'mobileViewTopBtn' : 'viewTopBtn');
            const viewFrontBtn = document.getElementById(isMobile ? 'mobileViewFrontBtn' : 'viewFrontBtn');
            const viewSideBtn = document.getElementById(isMobile ? 'mobileViewSideBtn' : 'viewSideBtn');
            const resetViewBtn = document.getElementById(isMobile ? 'mobileResetViewBtn' : 'resetViewBtn');
            const toggleWireframeBtn = document.getElementById(isMobile ? 'mobileToggleWireframeBtn' : 'toggleWireframeBtn');
            const screenshotBtn = document.getElementById(isMobile ? 'mobileScreenshotBtn' : 'screenshotBtn');
            
            if (viewTopBtn) viewTopBtn.addEventListener('click', () => setView('top'));
            if (viewFrontBtn) viewFrontBtn.addEventListener('click', () => setView('front'));
            if (viewSideBtn) viewSideBtn.addEventListener('click', () => setView('side'));
            if (resetViewBtn) resetViewBtn.addEventListener('click', resetView);
            if (toggleWireframeBtn) toggleWireframeBtn.addEventListener('click', toggleWireframe);
            if (screenshotBtn) screenshotBtn.addEventListener('click', takeScreenshot);
            
            // 质量控制（桌面端）
            if (!isMobile) {
                document.getElementById('qualitySelector').addEventListener('change', changeQuality);
            }
            
            // 移动端控制栏折叠
            if (isMobile) {
                const toggleBtn = document.getElementById('toggleMobileControlsBtn');
                const mobileControls = document.getElementById('mobileControls');
                const toggleText = document.getElementById('toggleControlsText');
                
                if (toggleBtn && mobileControls) {
                    toggleBtn.addEventListener('click', () => {
                        mobileControls.classList.toggle('expanded');
                        toggleText.textContent = mobileControls.classList.contains('expanded') ? '▼' : '▲';
                    });
                }
            }
            
            // 窗口大小调整
            window.addEventListener('resize', onWindowResize);
        }
        
        function toggleControlMode() {
            // 移动端不支持FPS模式
            if (isMobile) return;
            
            if (currentControlMode === 'orbit') {
                // 切换到FPS模式
                currentControlMode = 'fps';
                orbitControls.enabled = false;
                document.getElementById('pointerLockPrompt').classList.remove('hidden');
                document.getElementById('controlModeText').textContent = '切换到鼠标模式';
            } else {
                // 切换到轨道模式
                exitFPSMode();
            }
        }
        
        function enterFPSMode() {
            // 进入指针锁定状态
            pointerLockControls.lock();
            pointerLockControls.enabled = true;
            keyboardControls.enable(); // 启用键盘控制
            document.getElementById('pointerLockPrompt').classList.add('hidden');
            document.getElementById('escExitPrompt').classList.remove('hidden');
        }
        
        function exitPointerLock() {
            // 退出指针锁定状态，但仍在FPS模式
            pointerLockControls.unlock();
            pointerLockControls.enabled = false;
            keyboardControls.disable(); // 禁用键盘控制
            document.getElementById('escExitPrompt').classList.add('hidden');
            document.getElementById('pointerLockPrompt').classList.remove('hidden');
        }
        
        function exitFPSMode() {
            // 完全退出FPS模式，回到轨道模式
            pointerLockControls.unlock();
            currentControlMode = 'orbit';
            orbitControls.enabled = true;
            pointerLockControls.enabled = false;
            keyboardControls.disable(); // 禁用键盘控制
            document.getElementById('escExitPrompt').classList.add('hidden');
            document.getElementById('pointerLockPrompt').classList.add('hidden');
            document.getElementById('controlModeText').textContent = '切换到FPS模式';
        }
        
        function setView(viewType) {
            if (!model) return;
            
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            switch(viewType) {
                case 'top':
                    camera.position.set(center.x, center.y + maxDim, center.z);
                    break;
                case 'front':
                    camera.position.set(center.x, center.y, center.z + maxDim);
                    break;
                case 'side':
                    camera.position.set(center.x + maxDim, center.y, center.z);
                    break;
            }
            
            orbitControls.target.copy(center);
            orbitControls.update();
        }
        
        function resetView() {
            if (!model) return;
            
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const floorHeight = box.min.y;
            const cameraHeight = floorHeight + apartmentConfig.camera.height;
            
            // 使用配置的init_point重置相机位置
            const initX = apartmentConfig.camera.init_point[0];
            const initZ = apartmentConfig.camera.init_point[1];
            
            camera.position.set(initX, cameraHeight, initZ);
            orbitControls.target.copy(center);
            orbitControls.update();
        }
        
        function toggleWireframe() {
            if (!model) return;
            
            isWireframe = !isWireframe;
            model.traverse(function(child) {
                if (child.isMesh) {
                    child.material.wireframe = isWireframe;
                }
            });
        }
        
        function takeScreenshot() {
            const link = document.createElement('a');
            link.download = apartmentConfig.name + '_screenshot.png';
            link.href = renderer.domElement.toDataURL();
            link.click();
        }
        
        function changeQuality(event) {
            const quality = event.target.value;
            let pixelRatio;
            
            switch(quality) {
                case 'low':
                    pixelRatio = 0.5;
                    break;
                case 'medium':
                    pixelRatio = 1;
                    break;
                case 'high':
                    pixelRatio = Math.min(window.devicePixelRatio, 2);
                    break;
            }
            
            renderer.setPixelRatio(pixelRatio);
        }
        
        function adjustBrightness(event) {
            const brightness = parseFloat(event.target.value);
            
            // 遍历所有光源，按比例调整亮度
            lightSources.forEach((light, index) => {
                const lightKeys = Object.keys(baseLightIntensities);
                if (lightKeys[index]) {
                    const baseIntensity = baseLightIntensities[lightKeys[index]];
                    light.intensity = baseIntensity * brightness;
                }
            });
            
            console.log('Brightness adjusted to:', brightness);
        }
        
        function resetLighting() {
            // 重置亮度滑块到默认值
            document.getElementById('brightnessSlider').value = '0.8';
            
            // 重置所有光源到基础亮度
            lightSources.forEach((light, index) => {
                const lightKeys = Object.keys(baseLightIntensities);
                if (lightKeys[index]) {
                    const baseIntensity = baseLightIntensities[lightKeys[index]];
                    light.intensity = baseIntensity;
                }
            });
            
            console.log('Lighting reset to default values');
        }
        
        function onKeyDown(event) {
            // 移动端不处理键盘事件
            if (isMobile) return;
            
            // 只处理ESC键，其他键让键盘控制器处理
            if (event.code === 'Escape' && currentControlMode === 'fps' && pointerLockControls && pointerLockControls.enabled) {
                exitPointerLock(); // 只退出指针锁定，不退出FPS模式
                event.preventDefault();
                event.stopPropagation();
            }
        }
        
        function onWindowResize() {
            const width = isMobile ? window.innerWidth : window.innerWidth - 280;
            camera.aspect = width / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(width, window.innerHeight);
        }
        
        function animate() {
            animationId = requestAnimationFrame(animate);
            
            if (orbitControls.enabled) {
                orbitControls.update();
            }
            
            // 更新键盘控制（桌面端）
            if (keyboardControls && currentControlMode === 'fps') {
                keyboardControls.update();
            }
            
            renderer.render(scene, camera);
        }
        
        function onPointerLockChange() {
            // 移动端不处理指针锁定
            if (isMobile || !pointerLockControls) return;
            
            if (currentControlMode === 'fps') {
                if (document.pointerLockElement === renderer.domElement) {
                    console.log('Pointer locked');
                    pointerLockControls.enabled = true;
                    keyboardControls.enable();
                    document.getElementById('escExitPrompt').classList.remove('hidden');
                } else {
                    console.log('Pointer unlocked');
                    pointerLockControls.enabled = false;
                    keyboardControls.disable();
                    document.getElementById('escExitPrompt').classList.add('hidden');
                    if (currentControlMode === 'fps') {
                    document.getElementById('pointerLockPrompt').classList.remove('hidden');
                    }
                }
            }
        }
        
        function onPointerLockError() {
            // 移动端不处理指针锁定错误
            if (isMobile) return;
            
            console.error('Pointer lock error');
        }
        
        // 切换操作提示显示状态
        function toggleOperationHint() {
            if (!isMobile) return;
            
            const hint = document.getElementById('mobileOperationHint');
            const toggleBtn = document.getElementById('hintToggleBtn');
            
            if (hint && toggleBtn) {
                hint.classList.toggle('minimized');
                toggleBtn.textContent = hint.classList.contains('minimized') ? '+' : '−';
            }
        }
        
        // 显示触控提示（保持原有的临时提示，但时间缩短）
        function showTouchHint() {
            const hint = document.getElementById('touchHint');
            if (hint) {
                hint.classList.remove('hidden');
                setTimeout(() => {
                    hint.classList.add('hidden');
                }, 2000); // 缩短到2秒，因为现在有持续的操作提示
            }
        }
        
        // 初始化
        init();
    </script>
</body>
</html>
      `
      }

      // 创建iframe并设置内容
      const iframe = iframeRef.current
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (doc) {
          doc.open()
          doc.write(create3DViewerHTML())
          doc.close()
          setIsLoading(false)
        }
      }
    }, 100) // 100ms延迟

    return () => {
      clearTimeout(timer)
    }
  }, [apartment, iframeKey, isMobile, isClient]) // 添加isMobile和isClient作为依赖

  // 组件卸载时重置iframe key来强制重新创建
  useEffect(() => {
    return () => {
      setIframeKey(prev => prev + 1)
    }
  }, [])

  // 监听iframe消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'close' && onClose) {
        onClose()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onClose])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <p className="text-gray-500 mb-4">{error}</p>
          <p className="text-sm text-gray-400">该公寓模型正在准备中，敬请期待</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">正在初始化3D查看器...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        key={iframeKey}
        className="w-full h-full border-0"
        title={`${apartment.title} 3D查看器`}
        sandbox="allow-scripts allow-same-origin allow-downloads allow-pointer-lock"
      />
    </div>
  )
} 