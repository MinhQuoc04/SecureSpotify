// SpotifySecure App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // File Upload Functionality
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFile = document.getElementById('removeFile');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressStatus = document.getElementById('progressStatus');
    
    // Password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const sessionKeyInput = document.getElementById('session_key');
    
    if (togglePassword && sessionKeyInput) {
        togglePassword.addEventListener('click', function() {
            const type = sessionKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
            sessionKeyInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // File upload drag and drop
    if (uploadArea && fileInput) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);
        
        // Handle file input change
        fileInput.addEventListener('change', handleFileSelect, false);
        
        // Handle click on upload area
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // Handle remove file
        if (removeFile) {
            removeFile.addEventListener('click', clearFileSelection);
        }
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        uploadArea.classList.add('dragover');
    }
    
    function unhighlight(e) {
        uploadArea.classList.remove('dragover');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect({ target: { files: files } });
        }
    }
    
    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            displayFileInfo(file);
        }
    }
    
    function displayFileInfo(file) {
        if (fileName && fileSize && fileInfo && uploadBtn) {
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            fileInfo.style.display = 'block';
            uploadBtn.disabled = false;
            
            // Update file icon based on file type
            const fileIcon = fileInfo.querySelector('.file-icon');
            if (fileIcon) {
                fileIcon.className = 'fas file-icon ' + getFileIcon(file.name);
            }
        }
    }
    
    function clearFileSelection() {
        if (fileInput && fileInfo && uploadBtn) {
            fileInput.value = '';
            fileInfo.style.display = 'none';
            uploadBtn.disabled = true;
            uploadArea.classList.remove('dragover');
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'mp3': 'fa-music',
            'wav': 'fa-music',
            'flac': 'fa-music',
            'txt': 'fa-file-alt',
            'pdf': 'fa-file-pdf',
            'doc': 'fa-file-word',
            'docx': 'fa-file-word',
            'jpg': 'fa-file-image',
            'jpeg': 'fa-file-image',
            'png': 'fa-file-image',
            'mp4': 'fa-file-video',
            'avi': 'fa-file-video'
        };
        return iconMap[ext] || 'fa-file';
    }
    
    // Form submission with progress simulation
    const uploadForm = document.querySelector('.upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            if (uploadProgress) {
                // Show progress indicator
                uploadProgress.style.display = 'block';
                uploadForm.style.display = 'none';
                
                // Simulate upload progress
                simulateUploadProgress();
            }
        });
    }
    
    function simulateUploadProgress() {
        const steps = ['step1', 'step2', 'step3'];
        const messages = [
            'Performing handshake...',
            'Authenticating and exchanging keys...',
            'Encrypting file and verifying integrity...'
        ];
        
        let currentStep = 0;
        
        function nextStep() {
            if (currentStep < steps.length) {
                // Update progress status
                if (progressStatus) {
                    progressStatus.textContent = messages[currentStep];
                }
                
                // Update step visual state
                const stepElement = document.getElementById(steps[currentStep]);
                if (stepElement) {
                    stepElement.classList.add('active');
                    
                    // Update step icon
                    const statusIcon = stepElement.querySelector('.step-status i');
                    if (statusIcon) {
                        statusIcon.className = 'fas fa-spinner fa-spin';
                    }
                    
                    // Complete step after delay
                    setTimeout(() => {
                        stepElement.classList.remove('active');
                        stepElement.classList.add('completed');
                        
                        if (statusIcon) {
                            statusIcon.className = 'fas fa-check';
                        }
                        
                        currentStep++;
                        if (currentStep < steps.length) {
                            nextStep();
                        } else {
                            // Upload complete
                            if (progressStatus) {
                                progressStatus.textContent = 'Upload completed successfully!';
                            }
                        }
                    }, 2000);
                }
            }
        }
        
        // Start the process
        nextStep();
    }
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showAlert('Please fill in all required fields.', 'error');
            }
        });
    });
    
    // Show alert function
    function showAlert(message, type = 'info') {
        const alertContainer = document.querySelector('.alert-container');
        if (alertContainer) {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`;
            alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            alertContainer.appendChild(alertDiv);
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    }
    
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add fade-in animation to content
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.action-card, .feature-card, .step, .protocol-step').forEach(el => {
        observer.observe(el);
    });
    
    // Copy to clipboard functionality
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showAlert('Copied to clipboard!', 'success');
        }).catch(() => {
            showAlert('Failed to copy to clipboard', 'error');
        });
    }
    
    // Add copy buttons to file IDs
    document.querySelectorAll('.file-id').forEach(fileId => {
        fileId.style.cursor = 'pointer';
        fileId.title = 'Click to copy';
        fileId.addEventListener('click', function() {
            const text = this.textContent.replace('ID: ', '').replace('...', '');
            copyToClipboard(text);
        });
    });
    
    // Real-time input validation
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
            
            // Special validation for session key (hex format)
            if (this.name === 'session_key') {
                const hexPattern = /^[0-9a-fA-F]+$/;
                if (this.value && !hexPattern.test(this.value)) {
                    this.classList.add('is-invalid');
                }
            }
        });
    });
    
    // Player controls simulation
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Add some visual effect
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 300);
        });
    });
    
    // Connection status simulation
    const connectionStatus = document.querySelector('.connection-status');
    if (connectionStatus) {
        // Simulate connection status updates
        setInterval(() => {
            const icon = connectionStatus.querySelector('i');
            if (icon) {
                icon.style.opacity = '0.5';
                setTimeout(() => {
                    icon.style.opacity = '1';
                }, 500);
            }
        }, 3000);
    }
    
    // Console log for debugging
    console.log('SpotifySecure App initialized');
    console.log('Security features: RSA-1024, AES-GCM, SHA-512');
    console.log('Socket protocol: Handshake → Auth → Transfer');
});

// Utility functions
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function generateRandomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function validateHexString(str) {
    return /^[0-9a-fA-F]+$/.test(str);
}

// Export functions for testing
window.SpotifySecure = {
    formatBytes,
    generateRandomId,
    validateHexString
};
