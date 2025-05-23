/**
 * main.js - 公寓3D查看器主文件
 * 
 * 该文件负责应用程序的初始化和核心流程控制，包括：
 * - 引入和组织其他模块
 * - 初始化应用程序
 * - 管理全局状态
 * - 协调各个模块之间的交互
 */

import { SceneManager } from './sceneManager.js';
import { ControlsManager } from './controlsManager.js';
import { ModelLoader } from './modelLoader.js';
import { UIManager } from './uiManager.js';
import { log, showError } from './utils.js';

// 全局变量
let sceneManager;
let controlsManager;
let modelLoader;
let uiManager;
let currentQuality = 'medium';

// 初始化函数
function init() {
    try {
        log('初始化Three.js环境...');
        
        // 显示加载覆盖层
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('visible');
        }
        
        // 初始化场景管理器
        sceneManager = new SceneManager();
        
        // 初始化控制系统管理器
        controlsManager = new ControlsManager(sceneManager.camera, sceneManager.scene);
        
        // 初始化UI管理器（传入控制模式切换回调）
        uiManager = new UIManager(controlsManager.toggleControlMode.bind(controlsManager));
        
        // 初始化模型加载器
        modelLoader = new ModelLoader(sceneManager, controlsManager);
        
        // 设置UI管理器的引用
        uiManager.setManagers(modelLoader, sceneManager);
        
        // 设置额外的事件监听
        setupEventListeners();
        
        // 默认设置为轨道控制模式
        controlsManager.setControlMode('orbit');
        
        // 在控制台输出调试信息
        log('Three.js已初始化. WebGL支持: ' + (!!sceneManager.renderer.capabilities.isWebGL2 ? '是' : '否'));
        log('默认启用鼠标轨道控制模式，可点击按钮切换到FPS模式');

        // 初始加载第一个模型
        setTimeout(() => {
            loadModel('berlin_pankow');
        }, 500);

        // 开始动画循环
        animate();
    } catch (error) {
        console.error('初始化Three.js时出错:', error);
        log('初始化3D视图时出错: ' + error.message);
        showError('初始化3D视图时出错，您的浏览器可能不支持WebGL。请尝试使用最新版Chrome或Firefox浏览器。');
    }
}

// 设置事件监听器（不在其他管理器中处理的事件）
function setupEventListeners() {
    // 公寓选择器
    document.getElementById('apartmentSelector').addEventListener('change', function() {
        loadModel(this.value);
    });

    // 视图相关按钮
    document.getElementById('resetViewBtn').addEventListener('click', () => controlsManager.resetView());
    document.getElementById('viewTopBtn').addEventListener('click', () => controlsManager.setView('top'));
    document.getElementById('viewFrontBtn').addEventListener('click', () => controlsManager.setView('front'));
    document.getElementById('viewSideBtn').addEventListener('click', () => controlsManager.setView('side'));
    
    // 质量设置
    document.getElementById('qualitySelector').addEventListener('change', changeQuality);
}

// 加载模型
function loadModel(apartmentName) {
    modelLoader.loadModel(apartmentName);
}

// 更改渲染质量
function changeQuality() {
    const quality = document.getElementById('qualitySelector').value;
    currentQuality = quality;
    
    sceneManager.setQuality(quality);
    
    log(`渲染质量已更改为: ${quality === 'low' ? '低' : quality === 'medium' ? '中' : '高'}`);
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    try {
        // 更新控制系统
        controlsManager.update();
        
        // 渲染场景
        sceneManager.render();
    } catch (error) {
        console.error("动画循环出错:", error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 