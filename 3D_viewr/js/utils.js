/**
 * utils.js - 通用工具函数库
 * 
 * 该文件提供应用程序中使用的通用辅助函数，包括：
 * - 日志记录
 * - 错误处理
 * - 调试工具
 * - 加载进度显示
 */

// 调试输出区域元素
const debugOutputEl = document.getElementById('debugOutput');

/**
 * 记录调试信息到控制台和调试面板
 * @param {string} message - 要记录的消息
 */
export function log(message) {
    console.log(`[公寓查看器] ${message}`);
    
    // 如果调试输出元素存在，同时在UI中显示
    if (debugOutputEl) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `<span class="timestamp">${timestamp}</span> ${message}`;
        debugOutputEl.appendChild(logEntry);
        
        // 限制显示的日志条目数量为最近的20条
        while (debugOutputEl.childNodes.length > 20) {
            debugOutputEl.removeChild(debugOutputEl.firstChild);
        }
        
        // 自动滚动到最新日志
        debugOutputEl.scrollTop = debugOutputEl.scrollHeight;
    }
}

/**
 * 切换调试面板的展开/折叠状态
 */
export function toggleDebug() {
    const debugContent = document.querySelector('.debug-content');
    const toggleBtn = document.getElementById('toggleDebugBtn');
    
    if (debugContent) {
        debugContent.classList.toggle('collapsed');
        
        // 更新按钮图标
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                if (debugContent.classList.contains('collapsed')) {
                    icon.className = 'bx bx-chevron-down';
                } else {
                    icon.className = 'bx bx-chevron-up';
                }
            }
        }
    }
}

/**
 * 显示错误消息
 * @param {string} message - 错误消息
 */
export function showError(message) {
    console.error(`[错误] ${message}`);
    
    // 创建错误提示元素
    let errorElement = document.getElementById('errorMessage');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'errorMessage';
        errorElement.className = 'error-message';
        document.body.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('visible');
    
    // 同时在调试面板中记录错误
    log(`错误: ${message}`);
}

/**
 * 清除错误消息
 */
export function clearError() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.classList.remove('visible');
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 300);
    }
}

/**
 * 更新加载进度条
 * @param {number} progress - 0到100之间的进度值
 * @param {string} [statusText] - 可选的状态文本
 */
export function updateLoadingProgress(progress, statusText) {
    const progressBar = document.querySelector('#loadingOverlay .progress-bar');
    const loadingText = document.querySelector('#loadingOverlay .loading-text');
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    if (loadingText && statusText) {
        loadingText.textContent = statusText;
    }
    
    // 如果进度达到100%，1秒后隐藏加载覆盖层
    if (progress >= 100) {
        setTimeout(() => {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.remove('visible');
            }
        }, 1000);
    }
}

/**
 * 检查浏览器WebGL支持情况
 * @returns {boolean} 是否支持WebGL
 */
export function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
    } catch (e) {
        return false;
    }
}

/**
 * 格式化文件大小为人类可读格式
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小（如 "1.5 MB"）
 */
export function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
} 