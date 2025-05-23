"use client"

import { useEffect, useRef, useState } from "react"
import { ApartmentData } from "@/utils/apartment-data"

interface Apartment3DViewerProps {
  apartment: ApartmentData
  onClose?: () => void
}

export function Apartment3DViewer({ apartment, onClose }: Apartment3DViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [iframeKey, setIframeKey] = useState(0) // 添加key来强制重新创建iframe

  useEffect(() => {
    if (!apartment.hasModel) {
      setError("该公寓暂无3D模型")
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
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${apartment.title} - 3D查看器</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            overflow: hidden;
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
        
        .panel h3 {
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
    </style>
</head>
<body>
    <div class="viewer-container">
        <div class="sidebar">
            <div class="panel">
                <h3>🏠 公寓信息</h3>
                <h4 style="margin: 0; color: #333;">${apartment.title}</h4>
                <p style="font-size: 12px; color: #666; margin: 8px 0 0 0;">${apartment.description}</p>
            </div>

            <div class="panel">
                <h3>🎮 视角控制</h3>
                <div class="controls-group">
                    <button id="toggleControlModeBtn" class="btn full-width">
                        <span id="controlModeText">切换到FPS模式</span>
                    </button>
                </div>
                <div class="controls-group">
                    <button id="viewTopBtn" class="btn secondary">顶视图</button>
                    <button id="viewFrontBtn" class="btn secondary">正视图</button>
                    <button id="viewSideBtn" class="btn secondary">侧视图</button>
                </div>
                <div class="controls-group">
                    <button id="resetViewBtn" class="btn full-width">重置视图</button>
                </div>
                <div class="controls-group">
                    <button id="toggleWireframeBtn" class="btn secondary full-width">切换线框模式</button>
                </div>
            </div>

            <div class="panel">
                <h3>⚙️ 质量控制</h3>
                <label for="qualitySelector">渲染质量:</label>
                <select id="qualitySelector">
                    <option value="low">低 (更流畅)</option>
                    <option value="medium" selected>中 (平衡)</option>
                    <option value="high">高 (更清晰)</option>
                </select>
            </div>

            <div class="panel">
                <h3>📷 截图</h3>
                <button id="screenshotBtn" class="btn full-width">保存截图</button>
            </div>
        </div>

        <div class="model-view">
            <button class="close-btn" onclick="window.parent.postMessage('close', '*')" title="关闭">×</button>
            <div id="modelContainer">
                <div class="view-info">
                    <div id="rotationInfo">视角: 0°</div>
                    <div id="zoomInfo">高度: ${apartment.config.camera.height}m</div>
                </div>
                <div id="escExitPrompt" class="esc-prompt hidden">
                    按ESC退出FPS模式
                </div>
                <div id="loadingOverlay">
                    <div class="spinner"></div>
                    <div class="loading-text">正在加载模型...</div>
                </div>
                <div id="pointerLockPrompt" class="center-screen hidden">
                    <div class="prompt-content">
                        <button id="enterFPSBtn" class="btn full-width" style="font-size:1.1rem;padding:1em 2em;">点击以启用FPS控制</button>
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
        
        // 3D查看器初始化脚本
        let scene, camera, renderer, controls, model;
        let orbitControls, pointerLockControls;
        let isWireframe = false;
        let currentControlMode = 'orbit'; // 'orbit' or 'fps'
        let animationId = null; // 用于清理动画循环
        
        // 公寓配置
        const apartmentConfig = ${JSON.stringify(apartment.config)};
        const modelPath = "${apartment.modelPath}";
        
        // 清理之前的资源
        function cleanup() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
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
                renderer.setSize(window.innerWidth - 280, window.innerHeight);
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
                
            } catch (error) {
                console.error('初始化3D场景失败:', error);
                const loadingOverlay = document.getElementById('loadingOverlay');
                if (loadingOverlay) {
                    loadingOverlay.innerHTML = '<div style="color: red;">3D场景初始化失败</div>';
                }
            }
        }
        
        function setupControls() {
            // 轨道控制器
            orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            orbitControls.dampingFactor = 0.05;
            orbitControls.target.set(0, 0, 0);
            
            // FPS控制器
            pointerLockControls = new THREE.PointerLockControls(camera, renderer.domElement);
            scene.add(pointerLockControls.getObject());
            
            // 默认使用轨道控制器
            orbitControls.enabled = true;
            pointerLockControls.enabled = false;
        }
        
        function setupLighting() {
            // 环境光
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);
            
            // 方向光
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 10, 5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);
            
            // 点光源
            const pointLight = new THREE.PointLight(0xffffff, 0.5);
            pointLight.position.set(0, 5, 0);
            scene.add(pointLight);
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
                        
                        // 调整相机位置
                        const maxDim = Math.max(size.x, size.y, size.z);
                        const fov = camera.fov * (Math.PI / 180);
                        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                        cameraZ *= 1.5; // 增加一些距离
                        
                        camera.position.set(center.x, center.y + apartmentConfig.camera.height, center.z + cameraZ);
                        orbitControls.target.copy(center);
                        
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
            // 控制模式切换
            document.getElementById('toggleControlModeBtn').addEventListener('click', toggleControlMode);
            
            // 视角按钮
            document.getElementById('viewTopBtn').addEventListener('click', () => setView('top'));
            document.getElementById('viewFrontBtn').addEventListener('click', () => setView('front'));
            document.getElementById('viewSideBtn').addEventListener('click', () => setView('side'));
            document.getElementById('resetViewBtn').addEventListener('click', resetView);
            
            // 线框模式
            document.getElementById('toggleWireframeBtn').addEventListener('click', toggleWireframe);
            
            // 截图
            document.getElementById('screenshotBtn').addEventListener('click', takeScreenshot);
            
            // 质量控制
            document.getElementById('qualitySelector').addEventListener('change', changeQuality);
            
            // FPS模式相关
            document.getElementById('enterFPSBtn').addEventListener('click', enterFPSMode);
            
            // 键盘事件
            document.addEventListener('keydown', onKeyDown);
            
            // 窗口大小调整
            window.addEventListener('resize', onWindowResize);
        }
        
        function toggleControlMode() {
            if (currentControlMode === 'orbit') {
                // 切换到FPS模式
                document.getElementById('pointerLockPrompt').classList.remove('hidden');
            } else {
                // 切换到轨道模式
                exitFPSMode();
            }
        }
        
        function enterFPSMode() {
            pointerLockControls.lock();
            currentControlMode = 'fps';
            orbitControls.enabled = false;
            pointerLockControls.enabled = true;
            document.getElementById('pointerLockPrompt').classList.add('hidden');
            document.getElementById('escExitPrompt').classList.remove('hidden');
            document.getElementById('controlModeText').textContent = '切换到鼠标模式';
        }
        
        function exitFPSMode() {
            pointerLockControls.unlock();
            currentControlMode = 'orbit';
            orbitControls.enabled = true;
            pointerLockControls.enabled = false;
            document.getElementById('escExitPrompt').classList.add('hidden');
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
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            camera.position.set(center.x, center.y + apartmentConfig.camera.height, center.z + maxDim * 1.5);
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
            link.download = \`\${apartmentConfig.name}_screenshot.png\`;
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
        
        function onKeyDown(event) {
            if (event.code === 'Escape' && currentControlMode === 'fps') {
                exitFPSMode();
            }
        }
        
        function onWindowResize() {
            camera.aspect = (window.innerWidth - 280) / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth - 280, window.innerHeight);
        }
        
        function animate() {
            animationId = requestAnimationFrame(animate);
            
            if (orbitControls.enabled) {
                orbitControls.update();
            }
            
            renderer.render(scene, camera);
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
  }, [apartment, iframeKey]) // 添加iframeKey作为依赖

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