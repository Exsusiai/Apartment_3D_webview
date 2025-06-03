/**
 * uiManager.js - User Interface Interaction Management Module
 * 
 * This file is responsible for managing user interface interactions, including:
 * - Setting up and handling UI event listeners
 * - Updating UI element states
 * - Managing interface prompt displays
 * - Handling user interactions and feedback
 */

import { log, toggleDebug } from './utils.js';

export class UIManager {
    constructor(toggleControlModeCallback) {
        this.toggleControlMode = toggleControlModeCallback;
        this.modelLoader = null;
        this.sceneManager = null;
        
        // Register UI event listeners
        this.setupEventListeners();
    }
    
    // Set references to model loader and scene manager
    setManagers(modelLoader, sceneManager) {
        this.modelLoader = modelLoader;
        this.sceneManager = sceneManager;
    }
    
    // Set up UI event listeners
    setupEventListeners() {
        // Wireframe mode toggle button
        const toggleWireframeBtn = document.getElementById('toggleWireframeBtn');
        if (toggleWireframeBtn) {
            toggleWireframeBtn.addEventListener('click', () => {
                if (this.modelLoader) {
                    this.modelLoader.toggleWireframe();
                }
            });
        }
        
        // Screenshot button
        const screenshotBtn = document.getElementById('screenshotBtn');
        if (screenshotBtn) {
            screenshotBtn.addEventListener('click', () => {
                if (this.sceneManager) {
                    this.sceneManager.takeScreenshot();
                }
            });
        }
        
        // Debug panel toggle button
        const toggleDebugBtn = document.getElementById('toggleDebugBtn');
        if (toggleDebugBtn) {
            toggleDebugBtn.addEventListener('click', toggleDebug);
        }
        
        // Control mode toggle button
        const toggleControlModeBtn = document.getElementById('toggleControlModeBtn');
        if (toggleControlModeBtn) {
            toggleControlModeBtn.addEventListener('click', () => {
                if (this.toggleControlMode) {
                    this.toggleControlMode();
                }
            });
        }
        
        log('UI event listeners have been set up');
    }
    
    // Show loading overlay
    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('visible');
        }
    }
    
    // Hide loading overlay
    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    }
    
    // Show or hide pointer lock prompt
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
    
    // Show or hide ESC exit prompt
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
    
    // Update control mode button text and style
    updateControlModeButton(mode) {
        const button = document.getElementById('toggleControlModeBtn');
        const textElement = document.getElementById('controlModeText');
        
        if (button && textElement) {
            if (mode === 'fps') {
                textElement.textContent = 'Switch to Mouse Mode';
                button.classList.add('primary');
                button.classList.remove('accent');
            } else {
                textElement.textContent = 'Switch to FPS Mode';
                button.classList.remove('primary');
                button.classList.add('accent');
            }
        }
    }
    
    // Update controls info text
    updateControlsInfoText(mode) {
        const controlsInfo = document.querySelector('.controls-info');
        if (controlsInfo) {
            if (mode === 'fps') {
                controlsInfo.innerHTML = `
                    <p><i class='bx bx-mouse'></i> Mouse: Control view</p>
                    <p><i class='bx bx-joystick'></i> WASD: Move forward/back/left/right</p>
                `;
            } else {
                controlsInfo.innerHTML = `
                    <p><i class='bx bx-mouse'></i> Left click: Rotate view</p>
                    <p><i class='bx bx-mouse-alt'></i> Right click: Pan</p>
                    <p><i class='bx bx-mouse-alt'></i> Scroll wheel: Zoom</p>
                `;
            }
        }
    }
    
    // Update wireframe button state
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