/**
 * controlsManager.js - 控制系统管理模块
 * 
 * 该文件负责管理所有控制系统，包括：
 * - FPS风格控制（PointerLockControls）
 * - 轨道控制（OrbitControls）
 * - 控制模式之间的切换
 * - 视角设置（顶视图、侧视图等）
 * - 控制状态管理和事件处理
 */

import { log, clearError } from './utils.js';
import { KeyboardControls } from './keyboardControls.js';

// 引用全局THREE对象
const THREE = window.THREE;

export class ControlsManager {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.controls = null; // FPS控制器
        this.orbitControls = null; // 轨道控制器
        this.keyboardControls = null; // 键盘控制器
        this.isPointerLocked = false; // 跟踪指针是否锁定
        this.controlMode = 'orbit'; // 控制模式：'fps' 或 'orbit'
        this.floorHeight = 0.0; // 地板高度参考
        this.eyeHeight = 1.7; // 人眼高度参考
        
        this.setupControls();
        this.setupEventListeners();
    }
    
    // 设置控制系统
    setupControls() {
        // 1. 创建轨道控制器 - OrbitControls
        this.orbitControls = new THREE.OrbitControls(this.camera, document.getElementById('modelContainer'));
        this.orbitControls.enableDamping = true; // 平滑控制
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.screenSpacePanning = true; // 启用屏幕空间平移，使平移与视角相关
        this.orbitControls.minDistance = 1;
        this.orbitControls.maxDistance = 50;
        this.orbitControls.maxPolarAngle = Math.PI; // 允许完全旋转
        
        // 2. 创建FPS控制器 - PointerLockControls
        this.controls = new THREE.PointerLockControls(this.camera, document.getElementById('modelContainer'));
        this.scene.add(this.controls.getObject());
        
        // 3. 初始化键盘控制器
        this.keyboardControls = new KeyboardControls(this.camera, this.scene, document.getElementById('modelContainer'));
        this.keyboardControls.setLogCallback(log);
        this.keyboardControls.setMovementSpeed(0.05); // 降低移动速度以提供更精细的控制
        
        // 默认禁用键盘控制
        this.keyboardControls.disable();
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 设置指针锁定状态变化的事件监听器
        document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this), false);
        document.addEventListener('pointerlockerror', function() {
            log('指针锁定失败');
        }, false);
        
        // 设置点击事件以启用指针锁定
        const enterFPSBtn = document.getElementById('enterFPSBtn');
        if (enterFPSBtn) {
            enterFPSBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                log('点击FPS按钮，尝试锁定指针');
                if (this.controlMode === 'fps') {
                    this.controls.lock();
                }
            }, false);
        }
    }
    
    // 指针锁定状态变化处理函数
    onPointerLockChange() {
        const wasLocked = this.isPointerLocked;
        this.isPointerLocked = document.pointerLockElement === document.getElementById('modelContainer');
        log(`指针锁定状态变化: ${wasLocked} -> ${this.isPointerLocked}`);
        
        // 只处理FPS模式下的锁定变化
        if (this.controlMode !== 'fps') return;
        
        const lockPrompt = document.getElementById('pointerLockPrompt');
        const escPrompt = document.getElementById('escExitPrompt');
        
        if (this.isPointerLocked) {
            // 锁定成功 - 隐藏锁定提示，显示ESC退出提示
            if (lockPrompt) lockPrompt.classList.add('hidden');
            if (escPrompt) escPrompt.classList.remove('hidden');
            log('FPS控制已启用');
            
            if (this.keyboardControls && !this.keyboardControls.isEnabled()) {
                this.keyboardControls.enable();
                log('键盘控制器已激活');
            }
        } else {
            // 锁定解除 - 显示锁定提示，隐藏ESC退出提示
            if (lockPrompt) lockPrompt.classList.remove('hidden');
            if (escPrompt) escPrompt.classList.add('hidden');
            log('FPS控制已禁用');
        }
    }
    
    // 更新固定高度（用于FPS模式）
    updateFixedHeight(height) {
        if (this.keyboardControls) {
            this.keyboardControls.setFixedHeight(height);
            log(`键盘控制器固定高度已设置为：${height.toFixed(2)}`);
        }
    }
    
    // 切换控制模式
    toggleControlMode() {
        const newMode = this.controlMode === 'fps' ? 'orbit' : 'fps';
        this.setControlMode(newMode);
    }
    
    // 设置控制模式
    setControlMode(mode) {
        log(`正在切换控制模式: ${this.controlMode} -> ${mode}`);
        
        // 保存当前相机位置和朝向
        const position = this.camera.position.clone();
        const quaternion = this.camera.quaternion.clone();
        
        // 记录之前的模式用于后续判断
        const previousMode = this.controlMode;
        
        // 如果之前是FPS模式且处于锁定状态，解除锁定
        if (this.controlMode === 'fps' && this.isPointerLocked) {
            log('解除指针锁定');
            this.controls.unlock();
        }
        
        // 完全禁用前一个控制模式
        this.disablePreviousControls(previousMode);
        
        // 更新控制模式
        this.controlMode = mode;
        
        // 激活新的控制模式
        if (mode === 'fps') {
            this.activateFPSMode();
        } else {
            this.activateOrbitMode(previousMode, position, quaternion);
        }
        
        this.updateControlsInfoText();
    }
    
    // 禁用之前的控制模式
    disablePreviousControls(previousMode) {
        if (previousMode === 'fps') {
            if (this.keyboardControls) {
                this.keyboardControls.disable();
                log('键盘控制已禁用');
            }
            
            // 隐藏FPS按钮，确保切换模式时它消失
            const lockPrompt = document.getElementById('pointerLockPrompt');
            if (lockPrompt) {
                lockPrompt.classList.add('hidden');
            }
            
            // 同时隐藏ESC退出提示
            const escPrompt = document.getElementById('escExitPrompt');
            if (escPrompt) {
                escPrompt.classList.add('hidden');
            }
        } else {
            if (this.orbitControls) {
                this.orbitControls.enabled = false;
                log('轨道控制已禁用');
            }
        }
    }
    
    // 激活FPS模式
    activateFPSMode() {
        // 显示中央按钮提示
        const lockPrompt = document.getElementById('pointerLockPrompt');
        if (lockPrompt) {
            lockPrompt.classList.remove('hidden');
            log('显示指针锁定提示');
        }
        
        if (this.keyboardControls) {
            this.keyboardControls.enable();
            this.keyboardControls.setFixedHeight(this.floorHeight + this.eyeHeight);
            log('键盘控制已启用，固定高度为:', (this.floorHeight + this.eyeHeight).toFixed(2));
        }
        
        document.getElementById('controlModeText').textContent = '切换到鼠标模式';
        document.getElementById('toggleControlModeBtn').classList.add('primary');
        document.getElementById('toggleControlModeBtn').classList.remove('accent');
        
        log('已切换至FPS控制模式');
    }
    
    // 激活轨道控制模式
    activateOrbitMode(previousMode, position, quaternion) {
        if (this.orbitControls) {
            // 从FPS模式切换到轨道模式时，设置轨道控制器目标
            if (previousMode === 'fps') {
                this.transitionFromFPSToOrbit(position, quaternion);
            }
            
            this.orbitControls.enabled = true;
            this.orbitControls.update();
            log('轨道控制已启用');
        }
        
        // 隐藏中央按钮
        const lockPrompt = document.getElementById('pointerLockPrompt');
        if (lockPrompt) {
            lockPrompt.classList.add('hidden');
            log('隐藏指针锁定提示');
        }
        
        document.getElementById('controlModeText').textContent = '切换到FPS模式';
        document.getElementById('toggleControlModeBtn').classList.remove('primary');
        document.getElementById('toggleControlModeBtn').classList.add('accent');
        
        log('已切换至鼠标轨道控制模式');
    }
    
    // 从FPS模式转换到轨道控制模式
    transitionFromFPSToOrbit(position, quaternion) {
        // 获取相机朝向
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(quaternion);
        
        // 计算目标点 - 当前位置加上朝向方向
        const targetDistance = 10; // 增加目标点到相机的距离以减少视角变化
        const targetPoint = position.clone().add(
            direction.multiplyScalar(targetDistance)
        );
        
        // 设置轨道控制器的目标点
        this.orbitControls.target.copy(targetPoint);

        // 重要 - 重置控制器状态，防止突然移动
        this.orbitControls.saveState();
        this.orbitControls.dampingFactor = 0.1; // 暂时增加阻尼以减轻过渡时的晃动
        
        // 动态调整旋转中心 - 在平滑过渡后300毫秒开始
        setTimeout(() => {
            // 将旋转中心逐渐过渡回场景中心点附近
            let targetCenter = new THREE.Vector3(0, this.floorHeight + 1.5, 0);
            
            // 动画过渡到新的旋转中心
            const startPoint = this.orbitControls.target.clone();
            const duration = 500; // 持续500毫秒
            const startTime = Date.now();
            
            const animateTargetTransition = () => {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                if (progress < 1) {
                    // 线性插值计算当前目标点
                    this.orbitControls.target.lerpVectors(
                        startPoint,
                        targetCenter,
                        progress
                    );
                    requestAnimationFrame(animateTargetTransition);
                } else {
                    // 完成过渡
                    this.orbitControls.target.copy(targetCenter);
                    log('轨道控制器旋转中心已调整完成');
                }
                
                // 每次更新后需要更新控制器
                this.orbitControls.update();
            };
            
            // 开始动画
            animateTargetTransition();
            
            // 恢复正常阻尼系数
            this.orbitControls.dampingFactor = 0.05;
        }, 300);
        
        log('基于FPS视角设置了轨道控制器目标点');
    }
    
    // 重置视图
    resetView(apartmentConfig = null) {
        log('重置视图...');
        
        // 清除可能存在的错误消息
        clearError();
        
        // 获取配置文件中的初始点位置
        let initX = 0, initZ = 10;
        if (apartmentConfig && apartmentConfig.camera && apartmentConfig.camera.init_point) {
            initX = apartmentConfig.camera.init_point[0] || 0;
            initZ = apartmentConfig.camera.init_point[1] || 10;
        }

        // 如果在FPS模式下且指针已锁定，先解除锁定
        if (this.controlMode === 'fps' && this.isPointerLocked) {
            this.controls.unlock();
        }
        
        // 重置相机位置
        this.camera.position.set(initX, this.floorHeight + this.eyeHeight, initZ);
        
        if (this.controlMode === 'orbit') {
            // 轨道控制模式 - 重置目标点
            this.orbitControls.target.set(0, this.floorHeight + this.eyeHeight, 0);
            this.orbitControls.update();
        } else {
            // FPS模式 - 重置朝向
            this.camera.lookAt(0, this.floorHeight + this.eyeHeight, 0);
        }
        
        log('视图已重置');
    }
    
    // 设置特定视角
    setView(viewType) {
        log(`设置视角: ${viewType}`);
        
        // 清除可能存在的错误消息
        clearError();
        
        // 如果在FPS模式下且指针已锁定，先解除锁定
        if (this.controlMode === 'fps' && this.isPointerLocked) {
            this.controls.unlock();
        }
        
        // 根据视图类型设置相机位置
        switch(viewType) {
            case 'top':
                this.camera.position.set(0, this.floorHeight + 15, 0);
                this.camera.lookAt(0, this.floorHeight, 0);
                break;
            case 'front':
                this.camera.position.set(0, this.floorHeight + this.eyeHeight, 10);
                this.camera.lookAt(0, this.floorHeight + this.eyeHeight, 0);
                break;
            case 'side':
                this.camera.position.set(10, this.floorHeight + this.eyeHeight, 0);
                this.camera.lookAt(0, this.floorHeight + this.eyeHeight, 0);
                break;
        }
        
        // 如果是轨道控制模式，需要更新控制器目标
        if (this.controlMode === 'orbit' && this.orbitControls) {
            switch(viewType) {
                case 'top':
                    this.orbitControls.target.set(0, this.floorHeight, 0);
                    break;
                case 'front':
                    this.orbitControls.target.set(0, this.floorHeight + this.eyeHeight, 0);
                    break;
                case 'side':
                    this.orbitControls.target.set(0, this.floorHeight + this.eyeHeight, 0);
                    break;
            }
            this.orbitControls.update();
        }
        
        log(`已切换到${viewType === 'top' ? '顶视图' : viewType === 'front' ? '正视图' : '侧视图'}`);
    }
    
    // 更新控制系统
    update() {
        // 根据当前控制模式更新
        if (this.controlMode === 'fps') {
            // FPS模式下，只在指针锁定时更新键盘控制
            if (this.keyboardControls && this.isPointerLocked) {
                this.keyboardControls.update();
            }
        } else {
            // 轨道控制模式
            if (this.orbitControls && this.orbitControls.enabled) {
                this.orbitControls.update();
            }
        }
    }
    
    // 更新控制说明文本
    updateControlsInfoText() {
        const controlsInfo = document.querySelector('.controls-info');
        if (controlsInfo) {
            if (this.controlMode === 'fps') {
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
} 