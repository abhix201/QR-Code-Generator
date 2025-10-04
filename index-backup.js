// QR Code Generator - Enhanced JavaScript with modern features
// Author: Abhijeet Gupta
// Version: 2.0

class QRCodeGenerator {
    constructor() {
        try {
            console.log('Initializing QR Code Generator v2.0.1...');
            this.initializeElements();
            this.bindEvents();
            this.setupKeyboardShortcuts();
            this.currentQRData = null;
            this.currentQRUrl = null;
            console.log('QR Code Generator initialized successfully');
        } catch (error) {
            console.error('Failed to initialize QR Code Generator:', error);
            alert('Error initializing app. Please refresh the page.');
        }
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Input elements
        this.input = document.getElementById('qr-input');
        this.clearBtn = document.getElementById('clear-btn');
        this.sizeSelect = document.getElementById('size-select');
        this.errorCorrectionSelect = document.getElementById('error-correction');
        this.foregroundColorInput = document.getElementById('foreground-color');
        this.backgroundColorInput = document.getElementById('background-color');
        this.marginSelect = document.getElementById('margin-size');
        this.styleSelect = document.getElementById('style-select');

        // Form and buttons
        this.form = document.querySelector('.qr-form');
        this.generateBtn = document.getElementById('generate-btn');
        
        // Check for critical elements
        const criticalElements = {
            'qr-input': this.input,
            'generate-btn': this.generateBtn,
            'qr-form': this.form
        };
        
        for (const [name, element] of Object.entries(criticalElements)) {
            if (!element) {
                console.error(`Critical element missing: ${name}`);
                throw new Error(`Missing element: ${name}`);
            }
        }

        // Display elements
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.resultSection = document.getElementById('result-section');
        this.qrImage = document.getElementById('qr-image');
        this.qrDataPreview = document.getElementById('qr-data-preview');
        this.errorMessage = document.getElementById('error-message');
        this.successMessage = document.getElementById('success-message');

        // Action buttons
        this.downloadBtn = document.getElementById('download-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.previewBtn = document.getElementById('preview-btn');
        
        // Debug button
        this.debugBtn = document.getElementById('debug-btn');

        // Modal elements
        this.previewModal = document.getElementById('preview-modal');
        this.modalClose = document.getElementById('modal-close');
        this.modalBackdrop = document.getElementById('modal-backdrop');
        this.modalQrImage = document.getElementById('modal-qr-image');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input events
        this.input.addEventListener('input', () => this.handleInputChange());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit(e);
            }
        });

        // Clear button
        this.clearBtn.addEventListener('click', () => this.clearInput());

        // Debug button
        this.debugBtn.addEventListener('click', () => this.debugAndClearCache());

        // Action buttons
        this.downloadBtn.addEventListener('click', () => this.downloadQR());
        this.shareBtn.addEventListener('click', () => this.shareQR());
        this.copyBtn.addEventListener('click', () => this.copyQRLink());
        this.previewBtn.addEventListener('click', () => this.openPreview());

        // Modal events
        this.modalClose.addEventListener('click', () => this.closePreview());
        this.modalBackdrop.addEventListener('click', () => this.closePreview());

        // Settings change
        this.sizeSelect.addEventListener('change', () => this.regenerateIfNeeded());
        this.errorCorrectionSelect.addEventListener('change', () => this.regenerateIfNeeded());
        this.foregroundColorInput.addEventListener('change', () => this.regenerateIfNeeded());
        this.backgroundColorInput.addEventListener('change', () => this.regenerateIfNeeded());
        this.marginSelect.addEventListener('change', () => this.regenerateIfNeeded());
        this.styleSelect.addEventListener('change', () => this.regenerateIfNeeded());
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape to close modal or clear input
            if (e.key === 'Escape') {
                if (this.previewModal.classList.contains('visible')) {
                    this.closePreview();
                } else {
                    this.clearInput();
                }
            }

            // Ctrl/Cmd + Enter to generate
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (this.input.value.trim()) {
                    this.handleSubmit(e);
                }
            }

            // Ctrl/Cmd + D to download (if QR is generated)
            if ((e.ctrlKey || e.metaKey) && e.key === 'd' && this.currentQRUrl) {
                e.preventDefault();
                this.downloadQR();
            }
        });
    }

    /**
     * Handle input changes
     */
    handleInputChange() {
        const hasContent = this.input.value.trim().length > 0;
        this.clearBtn.classList.toggle('visible', hasContent);
        this.hideError();
        
        // Auto-generate for URLs (optional feature)
        if (this.isUrl(this.input.value) && this.input.value.length > 10) {
            clearTimeout(this.autoGenerateTimeout);
            this.autoGenerateTimeout = setTimeout(() => {
                if (this.input.value === this.input.value) { // Check if value hasn't changed
                    this.generateQR(false); // Generate without showing success message
                }
            }, 1000);
        }
    }

    /**
     * Handle form submission
     */
    async handleSubmit(event) {
        event.preventDefault();
        await this.generateQR(true);
    }

    /**
     * Generate QR code using client-side library
     */
    async generateQR(showSuccess = true) {
        const inputText = this.input.value.trim();

        // Validation
        if (!this.validateInput(inputText)) {
            return;
        }

        try {
            // Check if QRCode library is loaded
            if (typeof QRCode === 'undefined') {
                throw new Error('QR code library is not loaded. Please refresh the page and try again.');
            }

            this.showLoading();
            this.hideError();
            this.hideResult();

            // Get settings
            const size = parseInt(this.sizeSelect.value);
            const errorCorrection = this.errorCorrectionSelect.value;
            const foregroundColor = this.foregroundColorInput.value;
            const backgroundColor = this.backgroundColorInput.value;
            const margin = parseInt(this.marginSelect.value);

            // Process the input
            const processedText = this.preprocessInput(inputText);

            // Generate QR code options
            const qrOptions = {
                width: size,
                height: size,
                margin: margin,
                color: {
                    dark: foregroundColor,
                    light: backgroundColor
                },
                errorCorrectionLevel: this.mapErrorCorrectionLevel(errorCorrection),
                type: 'image/png',
                quality: 0.92
            };

            // Generate QR code as data URL
            const qrDataUrl = await QRCode.toDataURL(processedText, qrOptions);

            // Update current data
            this.currentQRData = processedText;
            this.currentQRUrl = qrDataUrl;
            this.currentQRBlob = await this.dataURLtoBlob(qrDataUrl);

            // Display the QR code
            await this.displayQR(qrDataUrl, processedText);

            if (showSuccess) {
                this.showSuccess();
            }

        } catch (error) {
            console.error('QR Generation Error:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Failed to generate QR code.';
            
            if (error.message.includes('too long') || inputText.length > 2000) {
                errorMessage = 'The text is too long for QR code generation. Please use shorter text or URL.';
            } else if (error.message.includes('invalid') || error.message.includes('encode')) {
                errorMessage = 'The text contains characters that cannot be encoded in a QR code. Please check your input.';
            } else if (this.isUrl(inputText)) {
                errorMessage = 'Unable to generate QR code for this URL. Please verify the URL is correct and try again.';
            } else {
                errorMessage = 'Failed to generate QR code. Please check your input and try again.';
            }
            
            this.handleError(new Error(errorMessage));
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Validate input text
     */
    validateInput(text) {
        if (!text) {
            this.showError('Please enter some text or a URL to generate a QR code.');
            this.input.focus();
            return false;
        }

        if (text.length > 2000) {
            this.showError('Text is too long. Please limit to 2000 characters.');
            return false;
        }

        // Additional validations can be added here
        return true;
    }

    /**
     * Preprocess input based on type
     */
    preprocessInput(text) {
        // Auto-detect and format different input types
        
        // Email detection
        if (this.isEmail(text)) {
            return `mailto:${text}`;
        }

        // Phone number detection
        if (this.isPhoneNumber(text)) {
            return `tel:${text}`;
        }

        // URL detection and formatting
        if (this.isUrl(text)) {
            const formattedUrl = this.formatUrl(text);
            // Ensure the URL is properly encoded for QR generation
            return this.sanitizeUrlForQR(formattedUrl);
        }

        // SMS detection
        if (text.toLowerCase().startsWith('sms:')) {
            return text;
        }

        // Return as-is for plain text
        return text;
    }

    /**
     * Map error correction level to QRCode.js format
     */
    mapErrorCorrectionLevel(level) {
        const mapping = {
            'low': 'L',
            'medium': 'M', 
            'quartile': 'Q',
            'high': 'H'
        };
        return mapping[level.toLowerCase()] || 'M';
    }

    /**
     * Sanitize URL for QR code generation
     * Handles special characters that might cause issues
     */
    sanitizeUrlForQR(url) {
        try {
            // For QR codes, we want to preserve the original URL structure
            // but ensure it's a valid URL format
            if (url.startsWith('http://') || url.startsWith('https://')) {
                // If it's already a complete URL, validate and return
                const urlObj = new URL(url);
                return urlObj.href;
            } else {
                // If it's not a complete URL, add https:// and validate
                const fullUrl = `https://${url}`;
                const urlObj = new URL(fullUrl);
                return urlObj.href;
            }
        } catch (error) {
            // If URL parsing fails, return the original text
            // The QR library will handle it as plain text
            console.warn('URL parsing failed, treating as plain text:', error);
            return url;
        }
    }

    /**
     * Convert data URL to Blob for download
     */
    async dataURLtoBlob(dataURL) {
        const response = await fetch(dataURL);
        return response.blob();
    }

    /**
     * Generate filename for download
     */
    generateFilename() {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const sanitizedData = this.currentQRData
            .replace(/[^a-z0-9]/gi, '_')
            .substring(0, 20)
            .toLowerCase();
        return `qr_${sanitizedData}_${timestamp}.png`;
    }

    /**
     * Display the generated QR code
     */
    async displayQR(qrUrl, originalText) {
        return new Promise((resolve) => {
            this.qrImage.onload = () => {
                this.qrDataPreview.textContent = this.truncateText(originalText, 100);
                this.modalQrImage.src = qrUrl;
                this.showResult();
                resolve();
            };
            this.qrImage.src = qrUrl;
        });
    }

    /**
     * Download QR code
     */
    async downloadQR() {
        if (!this.currentQRBlob) return;

        try {
            const filename = this.generateFilename();
            
            const url = window.URL.createObjectURL(this.currentQRBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.showTemporaryMessage('QR code downloaded successfully! 📥', 'success');
        } catch (error) {
            console.error('Download error:', error);
            this.showTemporaryMessage('Failed to download QR code. Please try again.', 'error');
        }
    }

    /**
     * Share QR code
     */
    async shareQR() {
        if (!this.currentQRBlob || !this.currentQRData) return;

        if (navigator.share && navigator.canShare) {
            try {
                const filename = this.generateFilename();
                const file = new File([this.currentQRBlob], filename, { type: 'image/png' });
                
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'QR Code',
                        text: `QR code for: ${this.currentQRData}`,
                        files: [file]
                    });
                } else {
                    this.fallbackShare();
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    this.fallbackShare();
                }
            }
        } else {
            this.fallbackShare();
        }
    }

    /**
     * Fallback share method
     */
    fallbackShare() {
        const shareText = `Check out this QR code for: ${this.currentQRData}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showTemporaryMessage('QR code info copied to clipboard! 📋', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showTemporaryMessage('QR code info copied to clipboard! 📋', 'success');
        }
    }

    /**
     * Copy QR data to clipboard
     */
    async copyQRLink() {
        if (!this.currentQRData) return;

        try {
            await navigator.clipboard.writeText(this.currentQRData);
            this.showTemporaryMessage('QR code data copied to clipboard! 📋', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.currentQRData;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showTemporaryMessage('QR code data copied to clipboard! 📋', 'success');
        }
    }

    /**
     * Open QR preview modal
     */
    openPreview() {
        if (!this.currentQRUrl) return;
        
        this.previewModal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close QR preview modal
     */
    closePreview() {
        this.previewModal.classList.remove('visible');
        document.body.style.overflow = '';
    }

    /**
     * Clear input and reset form
     */
    clearInput() {
        this.input.value = '';
        this.input.focus();
        this.clearBtn.classList.remove('visible');
        this.hideError();
        this.hideResult();
        this.hideSuccess();
        this.currentQRData = null;
        this.currentQRUrl = null;
        this.currentQRBlob = null;
        
        // Clear any pending auto-generation
        clearTimeout(this.autoGenerateTimeout);
    }

    /**
     * Regenerate QR if settings change and QR exists
     */
    regenerateIfNeeded() {
        if (this.currentQRData && this.input.value.trim()) {
            this.generateQR(false);
        }
    }

    /**
     * Utility methods for input detection
     */
    isEmail(text) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
    }

    isPhoneNumber(text) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
        return phoneRegex.test(text) && text.replace(/[\s\-\(\)]/g, '').length >= 10;
    }

    isUrl(text) {
        // Check if it's already a valid URL
        try {
            new URL(text);
            return true;
        } catch {
            // Try adding https:// if it looks like a domain
            try {
                new URL(`https://${text}`);
                // Additional checks for common URL patterns
                // Allow spaces in URLs as they will be encoded
                return text.includes('.') && 
                       text.length > 3 &&
                       !text.startsWith('.');
            } catch {
                return false;
            }
        }
    }

    formatUrl(text) {
        // If it's already a complete URL, return as-is
        if (text.startsWith('http://') || text.startsWith('https://')) {
            return text;
        }
        
        // If it looks like a domain/URL without protocol, add https://
        if (this.isUrl(text)) {
            return `https://${text}`;
        }
        
        return text;
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    /**
     * Debug and clear cache
     */
    async debugAndClearCache() {
        console.log('=== DEBUG INFO ===');
        console.log('App Version:', window.APP_VERSION || 'Unknown');
        console.log('QRCode Library Available:', typeof QRCode !== 'undefined');
        console.log('Input Element:', !!this.input);
        console.log('Form Element:', !!this.form);
        console.log('Generate Button:', !!this.generateBtn);
        console.log('Current Input Value:', this.input ? this.input.value : 'N/A');
        
        // Test QR generation
        if (typeof QRCode !== 'undefined') {
            try {
                await QRCode.toDataURL('Test');
                console.log('QR Library Test: SUCCESS');
            } catch (e) {
                console.log('QR Library Test: FAILED -', e.message);
            }
        }
        
        // Clear cache
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            console.log('Clearing caches:', cacheNames);
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        // Clear local storage
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('Cache cleared. Reloading...');
        window.location.reload(true);
    }

    /**
     * UI State Management Methods
     */
    showLoading() {
        this.generateBtn.disabled = true;
        this.generateBtn.querySelector('.btn-text').textContent = 'Generating...';
        this.loadingSpinner.classList.add('visible');
    }

    hideLoading() {
        this.generateBtn.disabled = false;
        this.generateBtn.querySelector('.btn-text').textContent = 'Generate QR Code';
        this.loadingSpinner.classList.remove('visible');
    }

    showResult() {
        this.resultSection.classList.add('visible');
    }

    hideResult() {
        this.resultSection.classList.remove('visible');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('visible');
    }

    hideError() {
        this.errorMessage.classList.remove('visible');
    }

    showSuccess() {
        this.successMessage.classList.add('visible');
        setTimeout(() => this.hideSuccess(), 3000);
    }

    hideSuccess() {
        this.successMessage.classList.remove('visible');
    }

    showTemporaryMessage(message, type = 'success') {
        const messageEl = document.createElement('div');
        messageEl.className = `temporary-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    handleError(error) {
        console.error('QR Generation Error:', error);
        this.showError(error.message || 'An error occurred while generating the QR code. Please try again.');
    }
}

// CSS animations for temporary messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                
                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available, prompt user to update
                            showUpdateAvailable();
                        }
                    });
                });
            })
            .catch((err) => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Show update notification
function showUpdateAvailable() {
    const updateBanner = document.createElement('div');
    updateBanner.className = 'update-banner';
    updateBanner.innerHTML = `
        <div class="update-content">
            <span>🚀 New version available!</span>
            <button onclick="updateApp()" class="update-btn">Update Now</button>
            <button onclick="dismissUpdate()" class="dismiss-btn">Later</button>
        </div>
    `;
    updateBanner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.insertBefore(updateBanner, document.body.firstChild);
}

// Update the app
function updateApp() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
    }
}

// Dismiss update notification
function dismissUpdate() {
    const banner = document.querySelector('.update-banner');
    if (banner) {
        banner.remove();
    }
}

// QRCodeGenerator class is now initialized from HTML after library loads

// Legacy function for backward compatibility
function handleSubmit(event) {
    // This function is kept for backward compatibility
    // The new QRCodeGenerator class handles all functionality
}
