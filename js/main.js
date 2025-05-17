// 全局变量
let scene, camera, renderer, controls;
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

        // 使用PointerLockControls替代OrbitControls来实现真正的FPS控制
        controls = new THREE.PointerLockControls(camera, renderer.domElement);
        scene.add(controls.getObject());
        
        // 设置指针锁定状态变化的事件监听器
        document.addEventListener('pointerlockchange', onPointerLockChange, false);
        document.addEventListener('pointerlockerror', function() {
            log('指针锁定失败');
        }, false);
        
        // 设置点击事件以启用指针锁定
        const lockPrompt = document.getElementById('pointerLockPrompt');
        if (lockPrompt) {
            lockPrompt.addEventListener('click', function() {
                controls.lock();
            }, false);
        }
        
        // 初始化键盘控制器
        keyboardControls = new KeyboardControls(camera, scene, renderer.domElement);
        keyboardControls.setLogCallback(log);
        
        // 设置移动速度
        keyboardControls.setMovementSpeed(0.05); // 降低移动速度以提供更精细的控制

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

        // 在控制台输出调试信息
        log('Three.js已初始化. WebGL支持: ' + (!!renderer.capabilities.isWebGL2 ? '是' : '否'));
        log('FPS风格控制已启用，使用WASD移动和鼠标视角');

        // 初始加载第一个模型
        setTimeout(() => {
            loadModel('berlin_pankow');
        }, 500);

        // 检查键盘控制器状态
        setTimeout(() => {
            if (keyboardControls) {
                console.log("键盘控制器状态检查: 已初始化");
                if (keyboardControls.isEnabled()) {
                    console.log("键盘控制已启用");
                }
            } else {
                console.error("键盘控制器未正确初始化");
                // 尝试重新初始化
                keyboardControls = new KeyboardControls(camera, scene, renderer.domElement);
                keyboardControls.setLogCallback(log);
                console.log("键盘控制器已重新初始化");
            }
        }, 2000);

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
    isPointerLocked = document.pointerLockElement === renderer.domElement;
    
    // 更新UI
    const lockPrompt = document.getElementById('pointerLockPrompt');
    if (isPointerLocked) {
        if (lockPrompt) lockPrompt.classList.add('hidden');
        log('FPS控制已启用');
    } else {
        if (lockPrompt) lockPrompt.classList.remove('hidden');
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
    // 对于PointerLockControls，我们需要直接移动相机对象
    if (controls) {
        // 解锁控制，如果当前已锁定
        if (isPointerLocked) {
            controls.unlock();
        }
        
        // 获取配置文件中的初始点位置
        let initX = 0, initZ = 10;
        if (apartmentConfig && apartmentConfig.camera && apartmentConfig.camera.init_point) {
            initX = apartmentConfig.camera.init_point[0] || 0;
            initZ = apartmentConfig.camera.init_point[1] || 10;
        }
        
        // 设置相机位置
        camera.position.set(initX, floorHeight + eyeHeight, initZ);
        // 重置相机旋转
        camera.lookAt(0, floorHeight + eyeHeight, 0);
    }
    log('视图已重置');
}

// 设置特定视角
function setView(viewType) {
    if (controls) {
        // 解锁控制，如果当前已锁定
        if (isPointerLocked) {
            controls.unlock();
        }
        
        // 获取配置文件中的初始点位置
        let initX = 0, initZ = 10;
        if (apartmentConfig && apartmentConfig.camera && apartmentConfig.camera.init_point) {
            initX = apartmentConfig.camera.init_point[0] || 0;
            initZ = apartmentConfig.camera.init_point[1] || 10;
        }
        
        switch(viewType) {
            case 'top':
                camera.position.set(0, floorHeight + 10, 0);
                camera.lookAt(0, floorHeight, 0);
                break;
            case 'front':
                camera.position.set(0, floorHeight + eyeHeight, initZ);
                camera.lookAt(0, floorHeight + eyeHeight, 0);
                break;
            case 'side':
                camera.position.set(initX + 10, floorHeight + eyeHeight, 0);
                camera.lookAt(initX, floorHeight + eyeHeight, 0);
                break;
        }
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
        // 更新键盘控制器 - 仅在指针锁定时启用
        if (keyboardControls && isPointerLocked) {
            keyboardControls.update();
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

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init); 