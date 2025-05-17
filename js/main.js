// 全局变量
let scene, camera, renderer, controls, orbitControls;
let keyboardControls; // 键盘控制器
let currentModel = null;
let isModelLoaded = false;
let isWireframe = false;
let currentQuality = 'medium';
let debugCollapsed = true;
let isPointerLocked = false; // 跟踪指针是否锁定
let eyeHeight = 1.7; // 默认人眼高度（米）
let floorHeight = 0.0; // 地板高度，默认为0
let apartmentConfig = null; // 当前公寓配置
let controlMode = 'fps'; // 控制模式：'fps' 或 'orbit'

// 调试信息输出
function log(message) {
    console.log(message);
    
    const debugOutput = document.getElementById('debugOutput');
    if (debugOutput) {
        const timestamp = new Date().toLocaleTimeString();
        debugOutput.textContent = `[${timestamp}] ${message}\n${debugOutput.textContent}`;
        
        // 限制日志长度
        if (debugOutput.textContent.length > 5000) {
            debugOutput.textContent = debugOutput.textContent.substring(0, 5000) + '...';
        }
    }
}

// 加载公寓配置文件
function loadApartmentConfig(apartmentName) {
    return new Promise((resolve, reject) => {
        const configPath = `Apartments/${apartmentName}/config.json`;
        
        fetch(configPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`无法加载配置文件: ${response.status}`);
                }
                return response.json();
            })
            .then(config => {
                log(`成功加载配置: ${config.name}`);
                resolve(config);
            })
            .catch(error => {
                log(`配置加载失败，使用默认配置: ${error.message}`);
                // 使用默认配置
                const defaultConfig = {
                    name: apartmentName,
                    camera: {
                        height: 1.7,
                        init_point: [0, 10]
                    }
                };
                resolve(defaultConfig);
            });
    });
}

// 初始化函数
function init() {
    try {
        log('初始化Three.js环境...');
        
        // 显示加载覆盖层
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('visible');
        }
        
        // 创建场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f7fa);

        // 创建相机
        camera = new THREE.PerspectiveCamera(
            75, // 视野角度 - 增大以获得更好的FPS视角
            document.getElementById('modelContainer').clientWidth / document.getElementById('modelContainer').clientHeight, // 长宽比
            0.1, // 近平面
            1000 // 远平面
        );
        camera.position.set(0, floorHeight + eyeHeight, 10); // 设置初始高度为人眼高度

        // 创建渲染器
        renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        renderer.setSize(
            document.getElementById('modelContainer').clientWidth,
            document.getElementById('modelContainer').clientHeight
        );
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('modelContainer').appendChild(renderer.domElement);

        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        // 添加定向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // 添加另一个定向光照亮背面
        const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
        backLight.position.set(-1, -1, -1);
        scene.add(backLight);

        // 添加预览几何体（在模型加载时显示）
        const previewGeometry = new THREE.BoxGeometry(1, 1, 1);
        const previewMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x888888,
            wireframe: true
        });
        const previewCube = new THREE.Mesh(previewGeometry, previewMaterial);
        scene.add(previewCube);

        // 添加坐标轴辅助
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        // ===== 控制系统初始化 =====
        
        // 1. 创建轨道控制器 - OrbitControls
        orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true; // 平滑控制
        orbitControls.dampingFactor = 0.05;
        orbitControls.screenSpacePanning = true; // 启用屏幕空间平移，使平移与视角相关
        orbitControls.minDistance = 1;
        orbitControls.maxDistance = 50;
        orbitControls.maxPolarAngle = Math.PI; // 允许完全旋转
        
        // 2. 创建FPS控制器 - PointerLockControls
        controls = new THREE.PointerLockControls(camera, renderer.domElement);
        scene.add(controls.getObject());
        
        // 3. 初始化键盘控制器
        keyboardControls = new KeyboardControls(camera, scene, renderer.domElement);
        keyboardControls.setLogCallback(log);
        keyboardControls.setMovementSpeed(0.05); // 降低移动速度以提供更精细的控制
        
        // 默认禁用键盘控制和指针锁定控制
        keyboardControls.disable();
        
        // ===== 事件监听器设置 =====
        
        // 设置指针锁定状态变化的事件监听器
        document.addEventListener('pointerlockchange', onPointerLockChange, false);
        document.addEventListener('pointerlockerror', function() {
            log('指针锁定失败');
        }, false);
        
        // 设置点击事件以启用指针锁定
        const lockPrompt = document.getElementById('pointerLockPrompt');
        const enterFPSBtn = document.getElementById('enterFPSBtn');
        if (lockPrompt && enterFPSBtn) {
            enterFPSBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                log('点击FPS按钮，尝试锁定指针');
                if (controlMode === 'fps') {
                    controls.lock();
                }
            }, false);
            // 默认隐藏锁定提示（因为默认是轨道模式）
            lockPrompt.classList.add('hidden');
        }
        
        // 监听窗口大小变化
        window.addEventListener('resize', onWindowResize);

        // 选择器变化事件
        document.getElementById('apartmentSelector').addEventListener('change', function() {
            loadModel(this.value);
        });

        // 添加按钮事件监听
        document.getElementById('resetViewBtn').addEventListener('click', resetView);
        document.getElementById('toggleWireframeBtn').addEventListener('click', toggleWireframe);
        document.getElementById('viewTopBtn').addEventListener('click', () => setView('top'));
        document.getElementById('viewFrontBtn').addEventListener('click', () => setView('front'));
        document.getElementById('viewSideBtn').addEventListener('click', () => setView('side'));
        document.getElementById('qualitySelector').addEventListener('change', changeQuality);
        document.getElementById('screenshotBtn').addEventListener('click', takeScreenshot);
        document.getElementById('toggleDebugBtn').addEventListener('click', toggleDebug);
        document.getElementById('toggleControlModeBtn').addEventListener('click', toggleControlMode);

        // 默认设置为轨道控制模式
        setControlMode('orbit');

        // 在控制台输出调试信息
        log('Three.js已初始化. WebGL支持: ' + (!!renderer.capabilities.isWebGL2 ? '是' : '否'));
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

// 更新相机高度
function updateCameraHeight() {
    if (camera) {
        // 设置相机当前高度
        camera.position.y = floorHeight + eyeHeight;
        
        // 同时更新键盘控制器的固定高度
        if (keyboardControls) {
            keyboardControls.setFixedHeight(floorHeight + eyeHeight);
        }
        
        updateViewInfo();
    }
}

// 自动检测地板高度（在模型加载后调用）
function detectFloorHeight() {
    if (!currentModel) return;
    
    try {
        // 获取模型边界盒
        const box = new THREE.Box3().setFromObject(currentModel);
        // 假设地板是模型最低的Y值
        floorHeight = box.min.y;
        
        log(`检测到地板高度：${floorHeight.toFixed(2)}`);
        
        // 更新相机高度
        updateCameraHeight();
        
        // 如果有键盘控制器，也更新它的固定高度
        if (keyboardControls) {
            keyboardControls.setFixedHeight(floorHeight + eyeHeight);
            log(`键盘控制器固定高度已设置为：${(floorHeight + eyeHeight).toFixed(2)}`);
        }
    } catch (error) {
        console.error('检测地板高度错误:', error);
    }
}

// 指针锁定状态变化处理函数
function onPointerLockChange() {
    const wasLocked = isPointerLocked;
    isPointerLocked = document.pointerLockElement === renderer.domElement;
    log(`指针锁定状态变化: ${wasLocked} -> ${isPointerLocked}`);
    
    // 只处理FPS模式下的锁定变化
    if (controlMode !== 'fps') return;
    
    const lockPrompt = document.getElementById('pointerLockPrompt');
    const escPrompt = document.getElementById('escExitPrompt');
    
    if (isPointerLocked) {
        // 锁定成功 - 隐藏锁定提示，显示ESC退出提示
        if (lockPrompt) lockPrompt.classList.add('hidden');
        if (escPrompt) escPrompt.classList.remove('hidden');
        log('FPS控制已启用');
        
        if (keyboardControls && !keyboardControls.isEnabled()) {
            keyboardControls.enable();
            log('键盘控制器已激活');
        }
    } else {
        // 锁定解除 - 显示锁定提示，隐藏ESC退出提示
        if (lockPrompt) lockPrompt.classList.remove('hidden');
        if (escPrompt) escPrompt.classList.add('hidden');
        log('FPS控制已禁用');
    }
}

// 更新视图信息
function updateViewInfo() {
    if (!camera) return;
    
    // 计算旋转角度 - 使用四元数获取y轴旋转
    const quaternion = camera.quaternion;
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');
    const rotation = Math.round(THREE.MathUtils.radToDeg(euler.y) + 180) % 360;
    
    // 计算相对地板的高度
    const heightAboveFloor = camera.position.y - floorHeight;
    
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

// 切换调试面板
function toggleDebug() {
    debugCollapsed = !debugCollapsed;
    
    const debugContent = document.querySelector('.debug-content');
    const toggleBtn = document.getElementById('toggleDebugBtn');
    
    if (debugCollapsed) {
        debugContent.classList.add('collapsed');
        toggleBtn.innerHTML = '<i class=\'bx bx-chevron-down\'></i>';
    } else {
        debugContent.classList.remove('collapsed');
        toggleBtn.innerHTML = '<i class=\'bx bx-chevron-up\'></i>';
    }
}

// 重置视图
function resetView() {
    log('重置视图...');
    
    // 移除可能存在的错误消息
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) {
        errorMsg.remove();
        log('重置视图时清除了错误消息');
    }
    
    // 获取配置文件中的初始点位置
    let initX = 0, initZ = 10;
    if (apartmentConfig && apartmentConfig.camera && apartmentConfig.camera.init_point) {
        initX = apartmentConfig.camera.init_point[0] || 0;
        initZ = apartmentConfig.camera.init_point[1] || 10;
    }

    // 如果在FPS模式下且指针已锁定，先解除锁定
    if (controlMode === 'fps' && isPointerLocked) {
        controls.unlock();
    }
    
    // 重置相机位置
    camera.position.set(initX, floorHeight + eyeHeight, initZ);
    
    if (controlMode === 'orbit') {
        // 轨道控制模式 - 重置目标点
        orbitControls.target.set(0, floorHeight + eyeHeight, 0);
        orbitControls.update();
    } else {
        // FPS模式 - 重置朝向
        camera.lookAt(0, floorHeight + eyeHeight, 0);
    }
    
    log('视图已重置');
}

// 设置特定视角
function setView(viewType) {
    log(`设置视角: ${viewType}`);
    
    // 获取配置文件中的初始点位置
    let initX = 0, initZ = 10;
    if (apartmentConfig && apartmentConfig.camera && apartmentConfig.camera.init_point) {
        initX = apartmentConfig.camera.init_point[0] || 0;
        initZ = apartmentConfig.camera.init_point[1] || 10;
    }
    
    // 如果在FPS模式下且指针已锁定，先解除锁定
    if (controlMode === 'fps' && isPointerLocked) {
        controls.unlock();
    }
    
    // 根据视图类型设置相机位置
    switch(viewType) {
        case 'top':
            camera.position.set(0, floorHeight + 15, 0);
            camera.lookAt(0, floorHeight, 0);
            break;
        case 'front':
            camera.position.set(0, floorHeight + eyeHeight, initZ + 10);
            camera.lookAt(0, floorHeight + eyeHeight, 0);
            break;
        case 'side':
            camera.position.set(initX + 10, floorHeight + eyeHeight, 0);
            camera.lookAt(initX, floorHeight + eyeHeight, 0);
            break;
    }
    
    // 如果是轨道控制模式，需要更新控制器目标
    if (controlMode === 'orbit' && orbitControls) {
        switch(viewType) {
            case 'top':
                orbitControls.target.set(0, floorHeight, 0);
                break;
            case 'front':
                orbitControls.target.set(0, floorHeight + eyeHeight, 0);
                break;
            case 'side':
                orbitControls.target.set(initX, floorHeight + eyeHeight, 0);
                break;
        }
        orbitControls.update();
    }
    
    log(`已切换到${viewType === 'top' ? '顶视图' : viewType === 'front' ? '正视图' : '侧视图'}`);
}

// 切换线框模式
function toggleWireframe() {
    if (!currentModel) return;
    
    isWireframe = !isWireframe;
    currentModel.traverse(function(child) {
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(material => material.wireframe = isWireframe);
            } else {
                child.material.wireframe = isWireframe;
            }
        }
    });
    
    const btn = document.getElementById('toggleWireframeBtn');
    if (isWireframe) {
        btn.classList.add('accent');
        btn.classList.remove('secondary');
    } else {
        btn.classList.remove('accent');
        btn.classList.add('secondary');
    }
    
    log('线框模式: ' + (isWireframe ? '开启' : '关闭'));
}

// 更改渲染质量
function changeQuality() {
    const quality = document.getElementById('qualitySelector').value;
    currentQuality = quality;
    
    switch(quality) {
        case 'low':
            renderer.setPixelRatio(1);
            break;
        case 'medium':
            renderer.setPixelRatio(window.devicePixelRatio);
            break;
        case 'high':
            renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.5, 2));
            break;
    }
    
    log(`渲染质量已更改为: ${quality === 'low' ? '低' : quality === 'medium' ? '中' : '高'}`);
}

// 截图功能
function takeScreenshot() {
    try {
        const link = document.createElement('a');
        link.download = `公寓3D模型截图_${new Date().toISOString().split('T')[0]}.png`;
        link.href = renderer.domElement.toDataURL('image/png');
        link.click();
        log('截图已保存');
    } catch (error) {
        log('截图保存失败: ' + error.message);
    }
}

// 窗口大小变化处理函数
function onWindowResize() {
    camera.aspect = document.getElementById('modelContainer').clientWidth / document.getElementById('modelContainer').clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
        document.getElementById('modelContainer').clientWidth,
        document.getElementById('modelContainer').clientHeight
    );
    log('窗口大小已调整');
}

// 显示错误信息
function showError(message) {
    const container = document.getElementById('modelContainer');
    // 移除旧的消息(如果存在)
    const oldMsg = document.getElementById('loadingMessage');
    if (oldMsg) {
        oldMsg.remove();
    }
    
    const errorMsg = document.createElement('div');
    errorMsg.id = 'errorMessage';
    errorMsg.textContent = message;
    errorMsg.style.position = 'absolute';
    errorMsg.style.top = '50%';
    errorMsg.style.left = '50%';
    errorMsg.style.transform = 'translate(-50%, -50%)';
    errorMsg.style.color = '#ffffff';
    errorMsg.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    errorMsg.style.padding = '15px 25px';
    errorMsg.style.borderRadius = '8px';
    errorMsg.style.zIndex = '1000';
    errorMsg.style.maxWidth = '80%';
    errorMsg.style.textAlign = 'center';
    container.appendChild(errorMsg);
    
    log('错误: ' + message);
}

// 更新进度条
function updateLoadingProgress(percent) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }
    
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = `正在加载模型... ${percent}%`;
    }
}

// 加载3D模型
function loadModel(apartmentName) {
    log('开始加载模型: ' + apartmentName);
    isModelLoaded = false;
    
    // 移除可能存在的错误消息
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) {
        errorMsg.remove();
        log('清除了先前的错误消息');
    }
    
    // 显示加载覆盖层
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('visible');
        
        // 重置进度条
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }
    
    // 先加载公寓配置文件
    loadApartmentConfig(apartmentName)
        .then(config => {
            apartmentConfig = config;
            
            // 更新相机高度设置
            if (config.camera && typeof config.camera.height === 'number') {
                eyeHeight = config.camera.height;
                log(`从配置文件设置相机高度: ${eyeHeight}m`);
            }
            
            // 更新公寓名称显示
            updateApartmentName();
            
            // 继续加载3D模型
            return loadApartmentModel(apartmentName);
        })
        .catch(error => {
            console.error('加载配置或模型失败:', error);
            showError('加载失败: ' + error.message);
            
            // 隐藏加载覆盖层
            if (overlay) {
                overlay.classList.remove('visible');
            }
        });
}

// 加载3D模型的实际函数（将原loadModel的主要内容移到这里）
function loadApartmentModel(apartmentName) {
    // 如果已经有模型，先移除
    if (currentModel) {
        scene.remove(currentModel);
        currentModel.traverse(function(child) {
            if (child.geometry) {
                child.geometry.dispose();
            }
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        currentModel = null;
    }

    // 模型路径
    const basePath = `Apartments/${apartmentName}/`;
    const modelFilename = 'textured_output.obj';
    const materialFilename = 'textured_output.mtl';
    
    log('模型文件夹路径: ' + basePath);
    log('模型文件: ' + modelFilename);
    log('材质文件: ' + materialFilename);

    try {
        // 先尝试请求文件，检查文件是否存在和可访问
        return fetch(basePath + materialFilename)
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法访问材质文件，状态码: ' + response.status);
                }
                log('材质文件可访问，开始加载...');
                
                // 加载材质文件
                const mtlLoader = new THREE.MTLLoader();
                mtlLoader.setCrossOrigin('anonymous');
                mtlLoader.setPath(basePath);
                return new Promise((resolve, reject) => {
                    mtlLoader.load(materialFilename, 
                        materials => {
                            log('材质加载完成');
                            materials.preload();
                            resolve(materials);
                        },
                        xhr => {
                            if (xhr.lengthComputable) {
                                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                                log('材质加载进度: ' + percent + '%');
                            }
                        },
                        error => {
                            log('加载MTL材质出错: ' + error.message);
                            reject(error);
                        }
                    );
                });
            })
            .then(materials => {
                // 加载OBJ模型
                const objLoader = new THREE.OBJLoader();
                objLoader.setCrossOrigin('anonymous');
                objLoader.setPath(basePath);
                objLoader.setMaterials(materials);
                
                return new Promise((resolve, reject) => {
                    objLoader.load(modelFilename, 
                        object => {
                            log('模型加载完成，准备渲染...');
                            resolve(object);
                        },
                        xhr => {
                            if (xhr.lengthComputable) {
                                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                                updateLoadingProgress(percent);
                                log('加载进度: ' + percent + '%');
                            }
                        },
                        error => {
                            log('加载OBJ模型出错: ' + error.message);
                            reject(error);
                        }
                    );
                });
            })
            .then(object => {
                try {
                    // 停止自动旋转
                    if (controls && controls.autoRotate) {
                        controls.autoRotate = false;
                    }
                    
                    // 模型居中
                    const box = new THREE.Box3().setFromObject(object);
                    const center = box.getCenter(new THREE.Vector3());
                    object.position.x -= center.x;
                    object.position.y -= center.y;
                    object.position.z -= center.z;

                    // 调整模型大小以适应视图
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 5 / maxDim;
                    object.scale.set(scale, scale, scale);
                    
                    // 应用线框模式(如果启用)
                    if (isWireframe) {
                        object.traverse(function(child) {
                            if (child.material) {
                                if (Array.isArray(child.material)) {
                                    child.material.forEach(material => material.wireframe = true);
                                } else {
                                    child.material.wireframe = true;
                                }
                            }
                        });
                    }
                    
                    // 为模型启用阴影
                    object.traverse(function(child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    // 添加到场景
                    scene.add(object);
                    currentModel = object;
                    isModelLoaded = true;

                    // 隐藏加载覆盖层
                    const overlay = document.getElementById('loadingOverlay');
                    if (overlay) {
                        overlay.classList.remove('visible');
                    }

                    // 移除错误消息（如果存在）
                    const errorMsg = document.getElementById('errorMessage');
                    if (errorMsg) {
                        errorMsg.remove();
                        log('清除了先前的错误消息');
                    }

                    // 重置相机和控制器
                    resetView();
                    
                    log('模型已添加到场景，渲染完成');
                    
                    // 检测地板高度并更新相机位置
                    detectFloorHeight();
                    
                    // 更新公寓选择器显示名称
                    updateApartmentName();
                    
                    return object;
                } catch (error) {
                    console.error('处理模型时出错:', error);
                    throw error;
                }
            })
            .catch(error => {
                console.error('加载模型过程中出错:', error);
                showError('加载3D模型失败: ' + error.message);
                
                // 隐藏加载覆盖层
                const overlay = document.getElementById('loadingOverlay');
                if (overlay) {
                    overlay.classList.remove('visible');
                }
                
                throw error;
            });
    } catch (error) {
        console.error('创建加载器时出错:', error);
        showError('加载器创建失败: ' + error.message);
        
        // 隐藏加载覆盖层
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
        
        return Promise.reject(error);
    }
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    try {
        // 根据当前控制模式更新
        if (controlMode === 'fps') {
            // FPS模式下，只在指针锁定时更新键盘控制
            if (keyboardControls && isPointerLocked) {
                keyboardControls.update();
            }
        } else {
            // 轨道控制模式
            if (orbitControls && orbitControls.enabled) {
                orbitControls.update();
            }
        }
        
        // 更新视图信息 - 每50帧更新一次
        if (frameCount % 50 === 0) {
            updateViewInfo();
        }
        frameCount++;
        
        // 渲染场景
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    } catch (error) {
        console.error("动画循环出错:", error);
    }
}

// 用于控制视图信息更新频率
let frameCount = 0;

// 更新公寓选择器显示名称
function updateApartmentName() {
    if (apartmentConfig && apartmentConfig.name) {
        const selector = document.getElementById('apartmentSelector');
        if (selector) {
            // 找到当前选中的选项
            const selectedOption = selector.options[selector.selectedIndex];
            if (selectedOption) {
                // 更新选项文本为配置中的名称
                selectedOption.textContent = apartmentConfig.name;
                log(`更新公寓名称为: ${apartmentConfig.name}`);
            }
        }
    }
}

// 切换控制模式
function toggleControlMode() {
    const newMode = controlMode === 'fps' ? 'orbit' : 'fps';
    setControlMode(newMode);
}

// 设置控制模式
function setControlMode(mode) {
    log(`正在切换控制模式: ${controlMode} -> ${mode}`);
    
    // 保存当前相机位置和朝向
    const position = camera.position.clone();
    const quaternion = camera.quaternion.clone();
    
    // 记录之前的模式用于后续判断
    const previousMode = controlMode;
    
    // 如果之前是FPS模式且处于锁定状态，解除锁定
    if (controlMode === 'fps' && isPointerLocked) {
        log('解除指针锁定');
        controls.unlock();
    }
    
    // 完全禁用前一个控制模式
    if (controlMode === 'fps') {
        if (keyboardControls) {
            keyboardControls.disable();
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
        if (orbitControls) {
            orbitControls.enabled = false;
            log('轨道控制已禁用');
        }
    }
    
    // 更新控制模式
    controlMode = mode;
    
    // 激活新的控制模式
    if (mode === 'fps') {
        // 只显示中央按钮
        const lockPrompt = document.getElementById('pointerLockPrompt');
        if (lockPrompt) {
            lockPrompt.classList.remove('hidden');
            log('显示指针锁定提示');
        }
        
        if (keyboardControls) {
            keyboardControls.enable();
            keyboardControls.setFixedHeight(floorHeight + eyeHeight);
            log('键盘控制已启用，固定高度为:', (floorHeight + eyeHeight).toFixed(2));
        }
        
        document.getElementById('controlModeText').textContent = '切换到鼠标模式';
        document.getElementById('toggleControlModeBtn').classList.add('primary');
        document.getElementById('toggleControlModeBtn').classList.remove('accent');
        
        log('已切换至FPS控制模式');
    } else {
        if (orbitControls) {
            // 从FPS模式切换到轨道模式时，基于当前相机朝向设置轨道控制器目标点
            if (previousMode === 'fps') {
                // 获取相机朝向
                const direction = new THREE.Vector3(0, 0, -1);
                direction.applyQuaternion(quaternion);
                
                // 计算目标点 - 当前位置加上朝向方向
                const targetDistance = 10; // 增加目标点到相机的距离以减少视角变化
                const targetPoint = position.clone().add(
                    direction.multiplyScalar(targetDistance)
                );
                
                // 设置轨道控制器的目标点
                orbitControls.target.copy(targetPoint);

                // 重要 - 重置控制器状态，防止突然移动
                orbitControls.saveState();
                orbitControls.dampingFactor = 0.1; // 暂时增加阻尼以减轻过渡时的晃动
                
                // 动态调整旋转中心 - 在平滑过渡后300毫秒开始
                // 使用setTimeout而不是立即执行，以确保先完成平滑过渡
                setTimeout(() => {
                    // 将旋转中心逐渐过渡回场景中心点附近
                    // 检测场景中是否有模型，如果有则使用模型中心，否则使用原点
                    let targetCenter = new THREE.Vector3(0, floorHeight + 1.5, 0);
                    
                    if (currentModel) {
                        // 计算模型的边界盒中心
                        const box = new THREE.Box3().setFromObject(currentModel);
                        box.getCenter(targetCenter);
                        // 确保高度合适
                        targetCenter.y = floorHeight + 1.5;
                    }
                    
                    log('开始调整轨道控制器旋转中心至场景中心');
                    
                    // 动画过渡到新的旋转中心
                    const startPoint = orbitControls.target.clone();
                    const duration = 500; // 持续500毫秒，缩短动画时间
                    const startTime = Date.now();
                    
                    function animateTargetTransition() {
                        const elapsedTime = Date.now() - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        
                        if (progress < 1) {
                            // 线性插值计算当前目标点
                            orbitControls.target.lerpVectors(
                                startPoint,
                                targetCenter,
                                progress
                            );
                            requestAnimationFrame(animateTargetTransition);
                        } else {
                            // 完成过渡
                            orbitControls.target.copy(targetCenter);
                            log('轨道控制器旋转中心已调整完成');
                        }
                        
                        // 每次更新后需要更新控制器
                        orbitControls.update();
                    }
                    
                    // 开始动画
                    animateTargetTransition();
                    
                    // 恢复正常阻尼系数
                    orbitControls.dampingFactor = 0.05;
                }, 300);
                
                log('基于FPS视角设置了轨道控制器目标点');
            }
            
            orbitControls.enabled = true;
            orbitControls.update();
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
    
    updateControlsInfoText();
}

// 更新控制说明文本
function updateControlsInfoText() {
    const controlsInfo = document.querySelector('.controls-info');
    if (controlsInfo) {
        if (controlMode === 'fps') {
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

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init); 