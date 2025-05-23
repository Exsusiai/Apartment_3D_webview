/**
 * sceneManager.js - 场景管理模块
 * 
 * 该文件负责创建和管理Three.js场景，包括：
 * - 创建和配置场景、相机、渲染器
 * - 添加灯光和基本几何体
 * - 处理窗口大小调整
 * - 管理渲染质量和截图功能
 * - 更新视图信息
 */

import { log } from './utils.js';

// 引用全局THREE对象
const THREE = window.THREE;

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.floorHeight = 0.0;
        this.eyeHeight = 1.7;
        this.frameCount = 0;
        
        this.setupScene();
    }
    
    // 创建和设置场景
    setupScene() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f7fa);

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75, // 视野角度
            document.getElementById('modelContainer').clientWidth / document.getElementById('modelContainer').clientHeight, // 长宽比
            0.1, // 近平面
            1000 // 远平面
        );
        this.camera.position.set(0, this.floorHeight + this.eyeHeight, 10);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(
            document.getElementById('modelContainer').clientWidth,
            document.getElementById('modelContainer').clientHeight
        );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('modelContainer').appendChild(this.renderer.domElement);

        // 添加灯光
        this.addLights();
        
        // 添加预览几何体和辅助工具
        this.addHelpers();
        
        // 监听窗口大小变化
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    // 添加灯光到场景
    addLights() {
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // 添加定向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // 添加背光
        const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
        backLight.position.set(-1, -1, -1);
        this.scene.add(backLight);
    }
    
    // 添加辅助工具到场景
    addHelpers() {
        // 添加预览几何体
        const previewGeometry = new THREE.BoxGeometry(1, 1, 1);
        const previewMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x888888,
            wireframe: true
        });
        const previewCube = new THREE.Mesh(previewGeometry, previewMaterial);
        this.scene.add(previewCube);

        // 添加坐标轴辅助
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }
    
    // 更新相机高度
    updateCameraHeight() {
        this.camera.position.y = this.floorHeight + this.eyeHeight;
    }
    
    // 设置渲染质量
    setQuality(quality) {
        switch(quality) {
            case 'low':
                this.renderer.setPixelRatio(1);
                break;
            case 'medium':
                this.renderer.setPixelRatio(window.devicePixelRatio);
                break;
            case 'high':
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.5, 2));
                break;
        }
    }
    
    // 窗口大小变化处理函数
    onWindowResize() {
        this.camera.aspect = document.getElementById('modelContainer').clientWidth / document.getElementById('modelContainer').clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
            document.getElementById('modelContainer').clientWidth,
            document.getElementById('modelContainer').clientHeight
        );
        log('窗口大小已调整');
    }
    
    // 截图功能
    takeScreenshot() {
        try {
            const link = document.createElement('a');
            link.download = `公寓3D模型截图_${new Date().toISOString().split('T')[0]}.png`;
            link.href = this.renderer.domElement.toDataURL('image/png');
            link.click();
            log('截图已保存');
        } catch (error) {
            log('截图保存失败: ' + error.message);
        }
    }
    
    // 渲染场景
    render() {
        // 更新视图信息 - 每50帧更新一次
        if (this.frameCount % 50 === 0) {
            this.updateViewInfo();
        }
        this.frameCount++;
        
        // 渲染场景
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    // 更新视图信息
    updateViewInfo() {
        if (!this.camera) return;
        
        // 计算旋转角度 - 使用四元数获取y轴旋转
        const quaternion = this.camera.quaternion;
        const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');
        const rotation = Math.round(THREE.MathUtils.radToDeg(euler.y) + 180) % 360;
        
        // 计算相对地板的高度
        const heightAboveFloor = this.camera.position.y - this.floorHeight;
        
        // 更新UI
        document.getElementById('rotationInfo').textContent = `视角: ${rotation}°`;
        document.getElementById('zoomInfo').textContent = `高度: ${heightAboveFloor.toFixed(1)}m`;
        
        // 添加动画效果
        document.getElementById('rotationInfo').classList.add('active');
        document.getElementById('zoomInfo').classList.add('active');
        
        setTimeout(() => {
            document.getElementById('rotationInfo').classList.remove('active');
            document.getElementById('zoomInfo').classList.remove('active');
        }, 1000);
    }
} 