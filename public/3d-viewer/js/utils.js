/**
 * utils.js - Common Utility Functions Library
 * 
 * This file provides common helper functions used in the application, including:
 * - Logging
 * - Error handling
 * - Debug tools
 * - Loading progress display
 */

// Debug output area element
const debugOutputEl = document.getElementById('debugOutput');

/**
 * Log debug information to console and debug panel
 * @param {string} message - The message to log
 */
export function log(message) {
    console.log(`[Apartment Viewer] ${message}`);
    
    // If debug output element exists, also display in UI
    if (debugOutputEl) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `<span class="timestamp">${timestamp}</span> ${message}`;
        debugOutputEl.appendChild(logEntry);
        
        // Limit the number of displayed log entries to the most recent 20
        while (debugOutputEl.childNodes.length > 20) {
            debugOutputEl.removeChild(debugOutputEl.firstChild);
        }
        
        // Auto-scroll to the latest log
        debugOutputEl.scrollTop = debugOutputEl.scrollHeight;
    }
}

/**
 * Toggle debug panel expand/collapse state
 */
export function toggleDebug() {
    const debugContent = document.querySelector('.debug-content');
    const toggleBtn = document.getElementById('toggleDebugBtn');
    
    if (debugContent) {
        debugContent.classList.toggle('collapsed');
        
        // Update button icon
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
 * Display error message
 * @param {string} message - Error message
 */
export function showError(message) {
    console.error(`[Error] ${message}`);
    
    // Create error prompt element
    let errorElement = document.getElementById('errorMessage');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'errorMessage';
        errorElement.className = 'error-message';
        document.body.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('visible');
    
    // Also log error in debug panel
    log(`Error: ${message}`);
}

/**
 * Clear error message
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
 * Update loading progress bar
 * @param {number} progress - Progress value between 0 and 100
 * @param {string} [statusText] - Optional status text
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
    
    // If progress reaches 100%, hide loading overlay after 1 second
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
 * Check browser WebGL support
 * @returns {boolean} Whether WebGL is supported
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
 * Format file size to human-readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
} 