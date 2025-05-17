/**
 * 键盘控制模块 - FPS风格的移动控制
 * 与鼠标控制视角结合使用
 */

// 确认脚本已加载
console.log("keyboardControls.js 已加载");

class KeyboardControls {
    constructor(camera, scene, domElement) {
        console.log("初始化键盘控制...");
        this.camera = camera;
        this.scene = scene;
        this.domElement = domElement;
        
        // 控制状态 - 始终启用
        this.enabled = true;
        this.isMoving = false;
        
        // 移动参数 - 降低默认速度
        this.movementSpeed = 0.05;
        
        // 当前高度 - 用于锁定Y轴
        this.fixedHeight = this.camera.position.y;
        
        // 按键状态 - 使用键码更可靠
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
        
        // 日志函数引用
        this.logCallback = null;
        
        // 启用键盘控制 - 立即添加事件监听器
        window.addEventListener('keydown', this._onKeyDown, false);
        window.addEventListener('keyup', this._onKeyUp, false);
        
        console.log("FPS风格键盘控制模块已初始化，事件监听器已添加");
    }
    
    // 设置固定高度
    setFixedHeight(height) {
        this.fixedHeight = height;
        this.log(`固定高度已设置为: ${height.toFixed(2)}`);
    }
    
    // 设置日志回调函数
    setLogCallback(callback) {
        this.logCallback = callback;
        console.log("设置了日志回调函数");
    }
    
    // 输出日志
    log(message) {
        console.log("键盘控制: " + message);
        if (this.logCallback && typeof this.logCallback === 'function') {
            this.logCallback('键盘控制: ' + message);
        }
    }
    
    // 启用控制 - 不再需要参数
    enable() {
        if (this.enabled) return;
        
        console.log("启用键盘控制...");
        this.enabled = true;
        
        // 添加键盘事件监听
        window.addEventListener('keydown', this._onKeyDown, false);
        window.addEventListener('keyup', this._onKeyUp, false);
        
        this.log('键盘控制已启用');
    }
    
    // 禁用控制 - 保留此方法以备未来需要
    disable() {
        if (!this.enabled) return;
        
        console.log("禁用键盘控制...");
        this.enabled = false;
        
        // 移除键盘事件监听
        window.removeEventListener('keydown', this._onKeyDown, false);
        window.removeEventListener('keyup', this._onKeyUp, false);
        
        // 重置按键状态
        for (let key in this.keys) {
            this.keys[key] = false;
        }
        
        this.log('键盘控制已禁用');
    }
    
    // 键盘按下事件处理
    _onKeyDown(event) {
        console.log("键盘按下:", event.keyCode);
        
        // 如果禁用则不处理
        if (!this.enabled) return;
        
        // 使用keyCode而不是code，兼容性更好
        const keyCode = event.keyCode;
        
        // 只处理我们关心的按键
        if (this.keys.hasOwnProperty(keyCode)) {
            this.keys[keyCode] = true;
            console.log(`键 ${keyCode} 已按下，状态设为true`);
            
            // 防止按键事件影响浏览器默认行为
            if ([32, 37, 38, 39, 40].includes(keyCode)) { // 空格和方向键
                event.preventDefault();
            }
        }
    }
    
    // 键盘释放事件处理
    _onKeyUp(event) {
        console.log("键盘释放:", event.keyCode);
        
        // 如果禁用则不处理
        if (!this.enabled) return;
        
        // 使用keyCode而不是code
        const keyCode = event.keyCode;
        
        // 只处理我们关心的按键
        if (this.keys.hasOwnProperty(keyCode)) {
            this.keys[keyCode] = false;
            console.log(`键 ${keyCode} 已释放，状态设为false`);
        }
    }
    
    // 更新相机位置 - 适配PointerLockControls
    update() {
        if (!this.enabled) return;
        
        try {
            // 检查按键状态
            const movingForward = this.keys[87] || this.keys[38]; // W 或 上箭头
            const movingBackward = this.keys[83] || this.keys[40]; // S 或 下箭头
            const movingLeft = this.keys[65] || this.keys[37]; // A 或 左箭头
            const movingRight = this.keys[68] || this.keys[39]; // D 或 右箭头
            
            // 如果没有按键按下，直接返回
            if (!(movingForward || movingBackward || movingLeft || movingRight)) {
                if (this.isMoving) {
                    this.isMoving = false;
                    this.log('停止移动');
                }
                return;
            }
            
            // 获取相机的朝向，用于确定移动方向
            const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
            direction.y = 0; // 保持在水平面上移动
            direction.normalize();
            
            // 计算右方向向量
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
            right.y = 0;
            right.normalize();
            
            // 计算移动向量
            const moveVector = new THREE.Vector3(0, 0, 0);
            
            // 前后移动
            if (movingForward) moveVector.add(direction.clone().multiplyScalar(this.movementSpeed));
            if (movingBackward) moveVector.add(direction.clone().multiplyScalar(-this.movementSpeed));
            
            // 左右移动
            if (movingLeft) moveVector.add(right.clone().multiplyScalar(-this.movementSpeed));
            if (movingRight) moveVector.add(right.clone().multiplyScalar(this.movementSpeed));
            
            // 应用移动
            if (moveVector.length() > 0) {
                // 直接移动相机
                this.camera.position.add(moveVector);
                
                // 保持在固定高度上 - 锁定Y轴
                this.camera.position.y = this.fixedHeight;
                
                // 更新移动状态
                if (!this.isMoving) {
                    this.isMoving = true;
                    this.log('开始移动');
                }
            }
            
        } catch (error) {
            console.error("键盘控制更新错误:", error);
            this.log('更新出错: ' + error.message);
        }
    }
    
    // 设置移动速度
    setMovementSpeed(speed) {
        this.movementSpeed = speed;
        this.log(`移动速度已调整为: ${speed}`);
    }
    
    // 检查是否启用
    isEnabled() {
        return this.enabled;
    }
} 