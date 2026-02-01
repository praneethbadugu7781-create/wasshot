/**
 * WASSHOT Studio - Reels Gallery
 * Modal-based video player with sound controls
 */

document.addEventListener('DOMContentLoaded', () => {
    initVideoModal();
});

/**
 * Initialize Video Modal Player
 */
function initVideoModal() {
    // Create modal HTML
    createVideoModal();
    
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const closeBtn = document.getElementById('modalClose');
    const playPauseBtn = document.getElementById('modalPlayPause');
    const soundBtn = document.getElementById('modalSound');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    
    let isMuted = true;
    
    // Get all reel cards
    const reelCards = document.querySelectorAll('.reel-card');
    
    reelCards.forEach(card => {
        // Remove any existing tilt effects
        card.removeAttribute('data-tilt');
        card.style.transform = 'none';
        
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const video = card.querySelector('.reel-video');
            const title = card.querySelector('.reel-title')?.textContent || 'Untitled';
            const category = card.querySelector('.reel-category')?.textContent || '';
            
            if (video) {
                const videoSrc = video.querySelector('source')?.src || video.src;
                openModal(videoSrc, title, category);
            }
        });
    });
    
    // Open modal function
    function openModal(src, title, category) {
        modalVideo.src = src;
        modalTitle.textContent = title;
        modalCategory.textContent = category;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset state
        isMuted = true;
        modalVideo.muted = true;
        updateSoundIcon();
        updatePlayPauseIcon(false);
        
        // Auto play
        modalVideo.play().then(() => {
            updatePlayPauseIcon(true);
        }).catch(() => {});
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalVideo.pause();
        modalVideo.src = '';
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (modalVideo.paused) {
            modalVideo.play();
            updatePlayPauseIcon(true);
        } else {
            modalVideo.pause();
            updatePlayPauseIcon(false);
        }
    });
    
    // Click on video to play/pause
    modalVideo.addEventListener('click', () => {
        if (modalVideo.paused) {
            modalVideo.play();
            updatePlayPauseIcon(true);
        } else {
            modalVideo.pause();
            updatePlayPauseIcon(false);
        }
    });
    
    // Sound toggle
    soundBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        modalVideo.muted = isMuted;
        updateSoundIcon();
    });
    
    // Progress bar
    modalVideo.addEventListener('timeupdate', () => {
        const progress = (modalVideo.currentTime / modalVideo.duration) * 100;
        progressFill.style.width = progress + '%';
        currentTimeEl.textContent = formatTime(modalVideo.currentTime);
    });
    
    modalVideo.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(modalVideo.duration);
    });
    
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        modalVideo.currentTime = pos * modalVideo.duration;
    });
    
    // Video ended - loop
    modalVideo.addEventListener('ended', () => {
        modalVideo.currentTime = 0;
        modalVideo.play();
    });
    
    function updatePlayPauseIcon(isPlaying) {
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }
    
    function updateSoundIcon() {
        const soundOn = soundBtn.querySelector('.sound-on');
        const soundOff = soundBtn.querySelector('.sound-off');
        if (isMuted) {
            soundOn.style.display = 'none';
            soundOff.style.display = 'block';
        } else {
            soundOn.style.display = 'block';
            soundOff.style.display = 'none';
        }
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

/**
 * Create Video Modal HTML
 */
function createVideoModal() {
    const modalHTML = `
    <div class="video-modal" id="videoModal">
        <div class="video-modal-content">
            <button class="modal-close" id="modalClose">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            
            <div class="modal-video-wrapper">
                <video id="modalVideo" playsinline></video>
            </div>
            
            <div class="modal-info">
                <h3 id="modalTitle">Video Title</h3>
                <span id="modalCategory">Category</span>
            </div>
            
            <div class="modal-controls">
                <button class="control-btn" id="modalPlayPause">
                    <svg class="play-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    <svg class="pause-icon" fill="currentColor" viewBox="0 0 24 24" style="display: none;">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                </button>
                
                <div class="progress-container" id="progressBar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                
                <span class="time-display">
                    <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
                </span>
                
                <button class="control-btn" id="modalSound">
                    <svg class="sound-on" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                    </svg>
                    <svg class="sound-off" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles - completely rewritten for reliability
    const styles = document.createElement('style');
    styles.textContent = `
        /* Video Modal Overlay */
        .video-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999;
            background: rgba(0, 0, 0, 0.95);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }
        
        .video-modal.active {
            display: flex;
        }
        
        /* Modal Content Container */
        .video-modal-content {
            position: relative;
            width: 320px;
            max-width: 90vw;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        /* Close Button */
        .modal-close {
            position: absolute;
            top: -55px;
            right: 0;
            width: 45px;
            height: 45px;
            background: #333;
            border: 2px solid #555;
            border-radius: 50%;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
        }
        
        .modal-close svg {
            width: 22px;
            height: 22px;
        }
        
        /* Video Container */
        .modal-video-wrapper {
            width: 100%;
            height: 500px;
            max-height: 55vh;
            background: #000;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-video-wrapper video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #000;
        }
        
        /* Video Info */
        .modal-info {
            padding: 15px 0;
            text-align: center;
            width: 100%;
        }
        
        .modal-info h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.4rem;
            color: #fff;
            margin: 0 0 5px 0;
        }
        
        .modal-info span {
            font-size: 0.85rem;
            color: #999;
        }
        
        /* Controls Bar */
        .modal-controls {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            width: 100%;
            box-sizing: border-box;
        }
        
        .control-btn {
            width: 44px;
            height: 44px;
            min-width: 44px;
            background: rgba(255, 255, 255, 0.15);
            border: none;
            border-radius: 50%;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .control-btn svg {
            width: 20px;
            height: 20px;
        }
        
        .progress-container {
            flex: 1;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            cursor: pointer;
            overflow: hidden;
            min-width: 50px;
        }
        
        .progress-fill {
            height: 100%;
            background: #cd7f32;
            border-radius: 4px;
            width: 0%;
        }
        
        .time-display {
            font-size: 0.8rem;
            color: #fff;
            min-width: 75px;
            text-align: center;
            white-space: nowrap;
        }
        
        /* Disable transforms on reel cards */
        .reel-card {
            transform: none !important;
            cursor: pointer;
        }
        
        .reel-card:hover {
            transform: translateY(-5px) !important;
        }
        
        /* Desktop - larger screens */
        @media (min-width: 769px) {
            .video-modal-content {
                width: 380px;
            }
            
            .modal-video-wrapper {
                height: 600px;
                max-height: 65vh;
            }
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
            .video-modal {
                padding: 15px;
            }
            
            .video-modal-content {
                width: 100%;
                max-width: 350px;
            }
            
            .modal-close {
                top: -50px;
                width: 40px;
                height: 40px;
            }
            
            .modal-video-wrapper {
                height: 450px;
                max-height: 50vh;
                border-radius: 10px;
            }
            
            .modal-info h3 {
                font-size: 1.2rem;
            }
            
            .modal-controls {
                gap: 8px;
                padding: 10px 12px;
            }
            
            .control-btn {
                width: 40px;
                height: 40px;
                min-width: 40px;
            }
            
            .control-btn svg {
                width: 18px;
                height: 18px;
            }
            
            .time-display {
                font-size: 0.7rem;
                min-width: 65px;
            }
        }
        
        /* Very small phones */
        @media (max-width: 400px) {
            .video-modal-content {
                max-width: 300px;
            }
            
            .modal-video-wrapper {
                height: 400px;
                max-height: 45vh;
            }
            
            .modal-controls {
                gap: 6px;
                padding: 8px 10px;
            }
            
            .control-btn {
                width: 36px;
                height: 36px;
                min-width: 36px;
            }
            
            .time-display {
                font-size: 0.65rem;
                min-width: 55px;
            }
        }
    `;
    document.head.appendChild(styles);
}
