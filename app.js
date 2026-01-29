import config from './config.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initThemeToggle();
    initNavigation();
    
    // Initialize generators
    initImageGenerator();
    initTextGenerator();
    initAudioGenerator();
    
    // Initialize event listeners
    document.getElementById('language-selector').addEventListener('change', changeLanguage);
    
    // Initialize range slider display
    const speedSlider = document.getElementById('speech-speed');
    const speedValue = document.getElementById('speed-value');
    speedSlider.addEventListener('input', function() {
        speedValue.textContent = `${this.value}x`;
    });
});

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Set initial theme
    if (config.ui.darkModeDefault || localStorage.getItem('darkMode') === 'true') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    // Listen for toggle changes
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('darkMode', 'false');
        }
    });
}

// Navigation between sections
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.generator-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active navigation item
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Show the selected section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Language change functionality
function changeLanguage() {
    // This would normally load different language strings
    // For now, just showing alert as a placeholder
    alert('سيتم دعم تغيير اللغة في التحديث القادم');
}

// ---------- IMAGE GENERATOR ----------
function initImageGenerator() {
    const generateBtn = document.getElementById('generate-image');
    const imagePrompt = document.getElementById('image-prompt');
    const imageStyle = document.getElementById('image-style');
    const imageQuality = document.getElementById('image-quality');
    const aspectRatio = document.getElementById('aspect-ratio');
    const autoEnhance = document.getElementById('auto-enhance');
    const imagePreview = document.getElementById('image-preview');
    const imageLoader = document.getElementById('image-loader');
    const downloadBtn = document.getElementById('download-image');
    const shareBtn = document.getElementById('share-image');
    const regenerateBtn = document.getElementById('regenerate-image');
    const gallery = document.getElementById('image-gallery');
    
    // Set default values
    imageStyle.value = config.imageDefaults.style;
    imageQuality.value = config.imageDefaults.quality;
    aspectRatio.value = config.imageDefaults.aspectRatio;
    autoEnhance.checked = config.imageDefaults.autoEnhance;
    
    // Generate image on button click
    generateBtn.addEventListener('click', function() {
        if (!imagePrompt.value.trim()) {
            showNotification('يرجى إدخال وصف للصورة', 'error');
            return;
        }
        
        // Show loading indicator
        imageLoader.style.display = 'block';
        imagePreview.style.display = 'none';
        
        // Disable buttons during generation
        generateBtn.disabled = true;
        
        // Build the prompt with style and quality
        let fullPrompt = imagePrompt.value;
        
        // Add style modifier if not "realistic"
        if (imageStyle.value !== 'realistic') {
            fullPrompt += `, ${config.imageStyles[imageStyle.value]}`;
        }
        
        // Add quality modifier if not "standard"
        if (imageQuality.value !== 'standard') {
            fullPrompt += `, ${config.imageQualities[imageQuality.value]}`;
        }
        
        // Add auto enhance if enabled
        if (autoEnhance.checked) {
            fullPrompt += ', best quality, highly detailed';
        }
        
        // Generate image using Pollinations API
        generateImage(fullPrompt, aspectRatio.value)
            .then(imageUrl => {
                // Hide loader and update preview
                imageLoader.style.display = 'none';
                
                // Clear placeholder content and display the image
                imagePreview.innerHTML = '';
                imagePreview.style.display = 'block';
                
                // Create and append image element
                const img = document.createElement('img');
                img.src = imageUrl;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '500px';
                img.style.borderRadius = 'var(--border-radius)';
                imagePreview.appendChild(img);
                
                // Enable control buttons
                downloadBtn.disabled = false;
                shareBtn.disabled = false;
                regenerateBtn.disabled = false;
                
                // Add to gallery
                addToGallery(imageUrl);
                
                // Set download link
                downloadBtn.onclick = () => downloadImage(imageUrl, 'generated-image.jpg');
                
                // Set share functionality
                shareBtn.onclick = () => shareImage(imageUrl);
                
                // Set regenerate functionality
                regenerateBtn.onclick = () => {
                    generateBtn.click();
                };
                
                // Re-enable generate button
                generateBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error generating image:', error);
                imageLoader.style.display = 'none';
                generateBtn.disabled = false;
                showNotification('حدث خطأ أثناء توليد الصورة', 'error');
            });
    });
}

// Generate image using Pollinations API
async function generateImage(prompt, aspectRatio) {
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Parse aspect ratio to determine width and height
    let width, height;
    if (aspectRatio === '1:1') {
        width = 512;
        height = 512;
    } else if (aspectRatio === '16:9') {
        width = 640;
        height = 360;
    } else if (aspectRatio === '9:16') {
        width = 360;
        height = 640;
    } else if (aspectRatio === '4:3') {
        width = 640;
        height = 480;
    } else if (aspectRatio === '3:2') {
        width = 600;
        height = 400;
    }
    
    // Construct the URL
    const imageUrl = `${config.apis.image.baseUrl}${encodedPrompt}?width=${width}&height=${height}`;
    
    // In a real implementation, we'd handle actual API response
    // For now, we just return the URL since Pollinations API returns the image directly
    return imageUrl;
}

// Add generated image to gallery
function addToGallery(imageUrl) {
    const gallery = document.getElementById('image-gallery');
    
    // Create gallery item
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    // Create and append image
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Generated image';
    galleryItem.appendChild(img);
    
    // Add click handler to show full image
    galleryItem.addEventListener('click', function() {
        const imagePreview = document.getElementById('image-preview');
        imagePreview.innerHTML = '';
        
        const fullImg = document.createElement('img');
        fullImg.src = imageUrl;
        fullImg.style.maxWidth = '100%';
        fullImg.style.maxHeight = '500px';
        fullImg.style.borderRadius = 'var(--border-radius)';
        imagePreview.appendChild(fullImg);
        
        document.getElementById('download-image').disabled = false;
        document.getElementById('share-image').disabled = false;
        document.getElementById('regenerate-image').disabled = false;
    });
    
    // Add to gallery (prepend to show newest first)
    gallery.prepend(galleryItem);
    
    // Limit gallery size
    const galleryItems = gallery.querySelectorAll('.gallery-item');
    if (galleryItems.length > config.ui.gallerySize) {
        gallery.removeChild(galleryItems[galleryItems.length - 1]);
    }
}

// Download generated image
function downloadImage(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error downloading image:', error);
            showNotification('حدث خطأ أثناء تحميل الصورة', 'error');
        });
}

// Share generated image
function shareImage(imageUrl) {
    if (navigator.share) {
        navigator.share({
            title: 'صورة مولدة بالذكاء الاصطناعي',
            text: 'أنظر إلى هذه الصورة المولدة بالذكاء الاصطناعي!',
            url: imageUrl
        })
        .then(() => console.log('Shared successfully'))
        .catch(error => console.error('Error sharing:', error));
    } else {
        // Fallback - copy URL to clipboard
        navigator.clipboard.writeText(imageUrl)
            .then(() => {
                showNotification('تم نسخ رابط الصورة إلى الحافظة', 'success');
            })
            .catch(error => {
                console.error('Error copying to clipboard:', error);
                showNotification('حدث خطأ أثناء نسخ الرابط', 'error');
            });
    }
}

// ---------- TEXT GENERATOR ----------
function initTextGenerator() {
    const generateBtn = document.getElementById('generate-text');
    const textPrompt = document.getElementById('text-prompt');
    const textType = document.getElementById('text-type');
    const textLength = document.getElementById('text-length');
    const textStyle = document.getElementById('text-style');
    const textResult = document.getElementById('text-result');
    const textLoader = document.getElementById('text-loader');
    const copyBtn = document.getElementById('copy-text');
    const downloadBtn = document.getElementById('download-text');
    const regenerateBtn = document.getElementById('regenerate-text');
    
    // Set default values
    textType.value = config.textDefaults.type;
    textLength.value = config.textDefaults.length;
    textStyle.value = config.textDefaults.style;
    
    // Generate text on button click
    generateBtn.addEventListener('click', function() {
        if (!textPrompt.value.trim()) {
            showNotification('يرجى إدخال موضوع أو سؤال', 'error');
            return;
        }
        
        // Show loading indicator
        textLoader.style.display = 'block';
        textResult.innerHTML = '';
        
        // Disable buttons during generation
        generateBtn.disabled = true;
        
        // Build the prompt with style and quality
        let fullPrompt = textPrompt.value;
        
        // Add text type, length and style information
        fullPrompt += ` (كـ${getTextTypeLabel(textType.value)} ${getTextLengthLabel(textLength.value)} بأسلوب ${getTextStyleLabel(textStyle.value)})`;
        
        // Generate text using Pollinations API
        generateText(fullPrompt)
            .then(generatedText => {
                // Hide loader and update result
                textLoader.style.display = 'none';
                textResult.textContent = generatedText;
                
                // Enable control buttons
                copyBtn.disabled = false;
                downloadBtn.disabled = false;
                regenerateBtn.disabled = false;
                
                // Set copy functionality
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(generatedText)
                        .then(() => showNotification('تم نسخ النص', 'success'))
                        .catch(() => showNotification('حدث خطأ أثناء نسخ النص', 'error'));
                };
                
                // Set download functionality
                downloadBtn.onclick = () => {
                    const blob = new Blob([generatedText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'generated-text.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };
                
                // Set regenerate functionality
                regenerateBtn.onclick = () => {
                    generateBtn.click();
                };
                
                // Re-enable generate button
                generateBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error generating text:', error);
                textLoader.style.display = 'none';
                generateBtn.disabled = false;
                showNotification('حدث خطأ أثناء توليد النص', 'error');
            });
    });
}

// Generate text using Pollinations API
async function generateText(prompt) {
    try {
        // Encode the prompt for URL
        const encodedPrompt = encodeURIComponent(prompt);
        
        // Make request to Pollinations text API
        const response = await fetch(`${config.apis.text.baseUrl}${encodedPrompt}`);
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get the text response
        const text = await response.text();
        return text;
    } catch (error) {
        console.error('Error in generateText:', error);
        throw error;
    }
}

// Helper functions for text generator
function getTextTypeLabel(type) {
    const labels = {
        'article': 'مقال',
        'story': 'قصة',
        'poem': 'قصيدة',
        'summary': 'ملخص',
        'code': 'كود برمجي'
    };
    return labels[type] || type;
}

function getTextLengthLabel(length) {
    const labels = {
        'short': 'قصير',
        'medium': 'متوسط',
        'long': 'طويل'
    };
    return labels[length] || length;
}

function getTextStyleLabel(style) {
    const labels = {
        'formal': 'رسمي',
        'casual': 'غير رسمي',
        'creative': 'إبداعي',
        'academic': 'أكاديمي'
    };
    return labels[style] || style;
}

// ---------- AUDIO GENERATOR ----------
function initAudioGenerator() {
    const generateBtn = document.getElementById('generate-audio');
    const audioPrompt = document.getElementById('audio-prompt');
    const voiceType = document.getElementById('voice-type');
    const speechSpeed = document.getElementById('speech-speed');
    const audioQuality = document.getElementById('audio-quality');
    const audioPlayer = document.getElementById('audio-element');
    const audioLoader = document.getElementById('audio-loader');
    const downloadBtn = document.getElementById('download-audio');
    const regenerateBtn = document.getElementById('regenerate-audio');
    
    // Set default values
    voiceType.value = config.audioDefaults.voice;
    speechSpeed.value = config.audioDefaults.speed;
    audioQuality.value = config.audioDefaults.quality;
    
    // Generate audio on button click
    generateBtn.addEventListener('click', function() {
        if (!audioPrompt.value.trim()) {
            showNotification('يرجى إدخال النص المراد تحويله إلى صوت', 'error');
            return;
        }
        
        // Show loading indicator
        audioLoader.style.display = 'block';
        audioPlayer.style.display = 'none';
        
        // Disable buttons during generation
        generateBtn.disabled = true;
        
        // Generate audio using Pollinations API
        generateAudio(audioPrompt.value, voiceType.value)
            .then(audioUrl => {
                // Hide loader and update player
                audioLoader.style.display = 'none';
                audioPlayer.style.display = 'block';
                
                // Set audio source
                audioPlayer.src = audioUrl;
                audioPlayer.playbackRate = parseFloat(speechSpeed.value);
                
                // Enable control buttons
                downloadBtn.disabled = false;
                regenerateBtn.disabled = false;
                
                // Set download functionality
                downloadBtn.onclick = () => downloadAudio(audioUrl, 'generated-audio.mp3');
                
                // Set regenerate functionality
                regenerateBtn.onclick = () => {
                    generateBtn.click();
                };
                
                // Re-enable generate button
                generateBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error generating audio:', error);
                audioLoader.style.display = 'none';
                generateBtn.disabled = false;
                showNotification('حدث خطأ أثناء توليد الصوت', 'error');
            });
    });
    
    // Update playback rate when speed changes
    speechSpeed.addEventListener('change', function() {
        if (audioPlayer.src) {
            audioPlayer.playbackRate = parseFloat(this.value);
        }
    });
}

// Generate audio using Pollinations API
async function generateAudio(text, voice) {
    const encodedText = encodeURIComponent(text);
    // Using the exact text as input without any modifications
    const audioUrl = `${config.apis.text.baseUrl}${encodedText}?model=openai-audio&voice=${voice}`;
    
    // In a real implementation, we'd handle actual API response
    // For now, we just return the URL since Pollinations API returns the audio directly
    return audioUrl;
}

// Download generated audio
function downloadAudio(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error downloading audio:', error);
            showNotification('حدث خطأ أثناء تحميل الصوت', 'error');
        });
}

// ---------- UTILITY FUNCTIONS ----------
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add icon based on type
    const icon = document.createElement('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    } else {
        icon.className = 'fas fa-info-circle';
    }
    notification.prepend(icon);
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        document.body.removeChild(notification);
    };
    notification.appendChild(closeBtn);
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 5000);
}
