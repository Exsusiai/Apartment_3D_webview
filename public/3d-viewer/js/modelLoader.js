/**
 * modelLoader.js - 3D模型加载和处理模块
 * 
 * 该文件负责加载和处理3D模型，包括：
 * - 加载配置文件和3D模型
 * - 处理模型的材质和几何体
 * - 清除旧模型并释放资源
 * - 错误处理和加载进度报告
 * - 检测地板高度
 */

import { log, showError, updateLoadingProgress, clearError } from './utils.js';

export class ModelLoader {
    constructor(sceneManager, controlsManager) {
        this.sceneManager = sceneManager;
        this.controlsManager = controlsManager;
        this.currentModel = null;
        this.isModelLoaded = false;
        this.isWireframe = false;
        this.apartmentConfig = null;
    }
    
    // 加载公寓配置文件
    loadApartmentConfig(apartmentName) {
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
    
    // 加载3D模型
    loadModel(apartmentName) {
        log('开始加载模型: ' + apartmentName);
        this.isModelLoaded = false;
        
        // 清除可能存在的错误消息
        clearError();
        
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
        this.loadApartmentConfig(apartmentName)
            .then(config => {
                this.apartmentConfig = config;
                
                // 更新相机和控制系统的高度设置
                if (config.camera && typeof config.camera.height === 'number') {
                    this.sceneManager.eyeHeight = config.camera.height;
                    this.controlsManager.eyeHeight = config.camera.height;
                    log(`从配置文件设置相机高度: ${this.sceneManager.eyeHeight}m`);
                }
                
                // 更新公寓名称显示
                this.updateApartmentName();
                
                // 继续加载3D模型
                return this.loadApartmentModel(apartmentName);
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
    
    // 加载3D模型的实际函数
    loadApartmentModel(apartmentName) {
        // 如果已经有模型，先移除
        this.clearCurrentModel();

        // 模型路径
        const basePath = `Apartments/${apartmentName}/`;
        const modelFilename = 'textured_output.obj';
        const materialFilename = 'textured_output.mtl';
        
        log('模型文件夹路径: ' + basePath);
        log('模型文件: ' + modelFilename);
        log('材质文件: ' + materialFilename);

        try {
            // 检查文件是否存在
            return this.loadMaterialAndModel(basePath, materialFilename, modelFilename)
                .then(object => {
                    // 处理加载成功的模型
                    this.processLoadedModel(object);
                    return object;
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
    
    // 加载材质和模型文件
    loadMaterialAndModel(basePath, materialFilename, modelFilename) {
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
            });
    }
    
    // 清除当前模型
    clearCurrentModel() {
        if (this.currentModel) {
            this.sceneManager.scene.remove(this.currentModel);
            this.currentModel.traverse(function(child) {
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
            this.currentModel = null;
        }
    }
    
    // 处理加载成功的模型
    processLoadedModel(object) {
        try {
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
            if (this.isWireframe) {
                this.applyWireframe(object);
            }
            
            // 为模型启用阴影
            object.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // 添加到场景
            this.sceneManager.scene.add(object);
            this.currentModel = object;
            this.isModelLoaded = true;

            // 隐藏加载覆盖层
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.remove('visible');
            }

            // 清除错误消息
            clearError();

            // 重置相机和控制器
            this.controlsManager.resetView(this.apartmentConfig);
            
            log('模型已添加到场景，渲染完成');
            
            // 检测地板高度并更新相机位置
            this.detectFloorHeight();
            
            // 更新公寓选择器显示名称
            this.updateApartmentName();
        } catch (error) {
            console.error('处理模型时出错:', error);
            throw error;
        }
    }
    
    // 应用线框模式到模型
    applyWireframe(object) {
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
    
    // 检测地板高度
    detectFloorHeight() {
        if (!this.currentModel) return;
        
        try {
            // 获取模型边界盒
            const box = new THREE.Box3().setFromObject(this.currentModel);
            // 假设地板是模型最低的Y值
            const floorHeight = box.min.y;
            
            log(`检测到地板高度：${floorHeight.toFixed(2)}`);
            
            // 更新场景管理器和控制管理器的地板高度
            this.sceneManager.floorHeight = floorHeight;
            this.controlsManager.floorHeight = floorHeight;
            
            // 更新相机高度
            this.sceneManager.updateCameraHeight();
            
            // 更新键盘控制器的固定高度
            const eyeHeight = this.sceneManager.eyeHeight;
            this.controlsManager.updateFixedHeight(floorHeight + eyeHeight);
        } catch (error) {
            console.error('检测地板高度错误:', error);
        }
    }
    
    // 切换线框模式
    toggleWireframe() {
        if (!this.currentModel) return;
        
        this.isWireframe = !this.isWireframe;
        this.currentModel.traverse((child) => {
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.wireframe = this.isWireframe);
                } else {
                    child.material.wireframe = this.isWireframe;
                }
            }
        });
        
        const btn = document.getElementById('toggleWireframeBtn');
        if (this.isWireframe) {
            btn.classList.add('accent');
            btn.classList.remove('secondary');
        } else {
            btn.classList.remove('accent');
            btn.classList.add('secondary');
        }
        
        log('线框模式: ' + (this.isWireframe ? '开启' : '关闭'));
    }
    
    // 更新公寓名称显示
    updateApartmentName() {
        if (this.apartmentConfig && this.apartmentConfig.name) {
            const selector = document.getElementById('apartmentSelector');
            if (selector) {
                // 找到当前选中的选项
                const selectedOption = selector.options[selector.selectedIndex];
                if (selectedOption) {
                    // 更新选项文本为配置中的名称
                    selectedOption.textContent = this.apartmentConfig.name;
                    log(`更新公寓名称为: ${this.apartmentConfig.name}`);
                }
            }
        }
    }
}