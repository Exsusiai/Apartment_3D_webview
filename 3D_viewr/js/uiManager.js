/**
 * uiManager.js - 用户界面交互管理模块
 * 
 * 该文件负责管理用户界面交互，包括：
 * - 设置和处理UI事件监听
 * - 更新UI元素状态
 * - 管理界面提示显示
 * - 处理用户交互和反馈
 */

import { log, toggleDebug } from './utils.js';

export class UIManager {
    constructor(toggleControlModeCallback) {
        this.toggleControlMode = toggleControlModeCallback;
        this.modelLoader = null;
        this.sceneManager = null;
        
        // 注册UI事件监听器
        this.setupEventListeners();
    }
    
    // 设置对模型加载器和场景管理器的引用
    setManagers(modelLoader, sceneManager) {
        this.modelLoader = modelLoader;
        this.sceneManager = sceneManager;
    }
    
    // 设置UI事件监听器
    setupEventListeners() {
        // 线框模式切换按钮
        const toggleWireframeBtn = document.getElementById('toggleWireframeBtn');
        if (toggleWireframeBtn) {
            toggleWireframeBtn.addEventListener('click', () => {
                if (this.modelLoader) {
                    this.modelLoader.toggleWireframe();
                }
            });
        }
        
        // 截图按钮
        const screenshotBtn = document.getElementById('screenshotBtn');
        if (screenshotBtn) {
            screenshotBtn.addEventListener('click', () => {
                if (this.sceneManager) {
                    this.sceneManager.takeScreenshot();
                }
            });
        }
        
        // 调试面板切换按钮
        const toggleDebugBtn = document.getElementById('toggleDebugBtn');
        if (toggleDebugBtn) {
            toggleDebugBtn.addEventListener('click', toggleDebug);
        }
        
        // 控制模式切换按钮
        const toggleControlModeBtn = document.getElementById('toggleControlModeBtn');
        if (toggleControlModeBtn) {
            toggleControlModeBtn.addEventListener('click', () => {
                if (this.toggleControlMode) {
                    this.toggleControlMode();
                }
            });
        }
        
        log('UI事件监听器已设置');
    }
    
    // 显示加载覆盖层
    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('visible');
        }
    }
    
    // 隐藏加载覆盖层
    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    }
    
    // 显示或隐藏指针锁定提示
    setPointerLockPromptVisible(visible) {
        const lockPrompt = document.getElementById('pointerLockPrompt');
        if (lockPrompt) {
            if (visible) {
                lockPrompt.classList.remove('hidden');
            } else {
                lockPrompt.classList.add('hidden');
            }
        }
    }
    
    // 显示或隐藏ESC退出提示
    setEscPromptVisible(visible) {
        const escPrompt = document.getElementById('escExitPrompt');
        if (escPrompt) {
            if (visible) {
                escPrompt.classList.remove('hidden');
            } else {
                escPrompt.classList.add('hidden');
            }
        }
    }
    
    // 更新控制模式按钮文本和样式
    updateControlModeButton(mode) {
        const button = document.getElementById('toggleControlModeBtn');
        const textElement = document.getElementById('controlModeText');
        
        if (button && textElement) {
            if (mode === 'fps') {
                textElement.textContent = '切换到鼠标模式';
                button.classList.add('primary');
                button.classList.remove('accent');
            } else {
                textElement.textContent = '切换到FPS模式';
                button.classList.remove('primary');
                button.classList.add('accent');
            }
        }
    }
    
    // 更新控制说明文本
    updateControlsInfoText(mode) {
        const controlsInfo = document.querySelector('.controls-info');
        if (controlsInfo) {
            if (mode === 'fps') {
                controlsInfo.innerHTML = `
                    <p><i class='bx bx-mouse'></i> 鼠标：控制视角</p>
                    <p><i class='bx bx-joystick'></i> WASD：前后左右移动</p>
                `;
            } else {
                controlsInfo.innerHTML = `
                    <p><i class='bx bx-mouse'></i> 鼠标左键：旋转视角</p>
                    <p><i class='bx bx-mouse-alt'></i> 鼠标右键：平移</p>
                    <p><i class='bx bx-mouse-alt'></i> 滚轮：缩放</p>
                `;
            }
        }
    }
    
    // 更新线框模式按钮状态
    updateWireframeButton(isWireframe) {
        const btn = document.getElementById('toggleWireframeBtn');
        if (btn) {
            if (isWireframe) {
                btn.classList.add('accent');
                btn.classList.remove('secondary');
            } else {
                btn.classList.remove('accent');
                btn.classList.add('secondary');
            }
        }
    }
} 