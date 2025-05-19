/**
 * 键盘控制模块 - FPS风格的移动控制
 * 与鼠标控制视角结合使用
 */

// 确认脚本已加载
console.log("keyboardControls.js 已加载");

export class KeyboardControls {
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
    
    // 启用控制
    enable() {
        // 如果已经启用则不做任何操作
        if (this.enabled) {
            console.log("键盘控制已经启用，无需再次启用");
            return;
        }
        
        console.log("启用键盘控制...");
        
        // 先确保已经移除之前的事件监听
        this.disable();
        
        // 标记为启用
        this.enabled = true;
        
        // 添加键盘事件监听
        window.addEventListener('keydown', this._onKeyDown, false);
        window.addEventListener('keyup', this._onKeyUp, false);
        
        this.log('键盘控制已启用');
    }
    
    // 禁用控制
    disable() {
        // 如果已经禁用则不做任何操作
        if (!this.enabled) {
            console.log("键盘控制已经禁用，无需再次禁用");
            return;
        }
        
        console.log("禁用键盘控制...");
        
        // 标记为禁用
        this.enabled = false;
        
        // 移除键盘事件监听
        window.removeEventListener('keydown', this._onKeyDown, false);
        window.removeEventListener('keyup', this._onKeyUp, false);
        
        // 重置按键状态
        for (let key in this.keys) {
            this.keys[key] = false;
        }
        
        // 重置移动状态
        this.isMoving = false;
        
        this.log('键盘控制已禁用');
    }
    
    // 键盘按下事件处理
    _onKeyDown(event) {
        console.log("键盘按下:", event.keyCode);
        
        // 如果禁用则不处理
        if (!this.enabled) return;
        
        // 使用keyCode和key兼容不同浏览器
        const keyCode = event.keyCode;
        
        // 检查常用键控制
        if (event.key === 'w' || event.key === 'W' || keyCode === 87 || keyCode === 38) {
            this.keys[87] = true;
        } else if (event.key === 's' || event.key === 'S' || keyCode === 83 || keyCode === 40) {
            this.keys[83] = true;
        } else if (event.key === 'a' || event.key === 'A' || keyCode === 65 || keyCode === 37) {
            this.keys[65] = true;
        } else if (event.key === 'd' || event.key === 'D' || keyCode === 68 || keyCode === 39) {
            this.keys[68] = true;
        }
        
        // 防止按键事件影响浏览器默认行为
        if ([32, 37, 38, 39, 40].includes(keyCode)) { // 空格和方向键
            event.preventDefault();
        }
        
        // 输出当前按键状态
        this.log(`按键状态: W=${this.keys[87]}, S=${this.keys[83]}, A=${this.keys[65]}, D=${this.keys[68]}`);
    }
    
    // 键盘释放事件处理
    _onKeyUp(event) {
        console.log("键盘释放:", event.keyCode);
        
        // 如果禁用则不处理
        if (!this.enabled) return;
        
        // 使用keyCode和key兼容不同浏览器
        const keyCode = event.keyCode;
        
        // 检查常用键控制
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
    
    // 更新相机位置 - 适配PointerLockControls
    update() {
        if (!this.enabled) {
            return;
        }
        
        try {
            // 调试 - 输出按键状态
            console.log(`更新中，按键状态: W=${this.keys[87]}, S=${this.keys[83]}, A=${this.keys[65]}, D=${this.keys[68]}`);
            
            // 检查按键状态
            const movingForward = this.keys[87]; // W
            const movingBackward = this.keys[83]; // S
            const movingLeft = this.keys[65]; // A
            const movingRight = this.keys[68]; // D
            
            // 如果没有按键按下，直接返回
            if (!(movingForward || movingBackward || movingLeft || movingRight)) {
                if (this.isMoving) {
                    this.isMoving = false;
                    this.log('停止移动');
                }
                return;
            }
            
            // 获取相机的朝向，用于确定移动方向
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            
            // 归一化方向向量，确保移动速度一致
            direction.normalize();
            
            // 获取右向量 (叉乘世界的上向量和相机的前向量)
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
            
            // 归一化移动向量，避免对角移动速度更快
            moveVector.normalize();
            
            // 应用移动速度
            moveVector.multiplyScalar(this.movementSpeed);
            
            // 只在xz平面移动 (y轴保持不变)
            moveVector.y = 0;
            
            // 记录当前高度
            const currentY = this.camera.position.y;
            
            // 更新相机位置
            this.camera.position.add(moveVector);
            
            // 重置为固定高度
            this.camera.position.y = this.fixedHeight;
            
            // 如果刚开始移动，记录状态
            if (!this.isMoving) {
                this.isMoving = true;
                this.log('开始移动');
            }
            
            console.log(`相机位置: x=${this.camera.position.x.toFixed(2)}, y=${this.camera.position.y.toFixed(2)}, z=${this.camera.position.z.toFixed(2)}`);
        } catch (error) {
            console.error('键盘控制更新时出错:', error);
        }
    }
    
    // 设置移动速度
    setMovementSpeed(speed) {
        this.movementSpeed = speed;
        this.log(`移动速度已设置为: ${speed}`);
    }
    
    // 检查控制是否启用
    isEnabled() {
        return this.enabled;
    }
} 