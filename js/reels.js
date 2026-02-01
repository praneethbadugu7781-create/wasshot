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
    
    // Add modal styles
    const styles = document.createElement('style');
    styles.textContent = `
        .video-modal {
            position: fixed;
            inset: 0;
            z-index: 10000;
            background: rgba(12, 11, 10, 0.98);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(20px);
        }
        
        .video-modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .video-modal-content {
            position: relative;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
        }
        
        .modal-close {
            position: absolute;
            top: -50px;
            right: 0;
            width: 40px;
            height: 40px;
            background: rgba(255, 254, 245, 0.1);
            border: 1px solid rgba(255, 254, 245, 0.2);
            border-radius: 50%;
            color: #fffef5;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10;
        }
        
        .modal-close:hover {
            background: rgba(255, 254, 245, 0.2);
            transform: scale(1.1);
        }
        
        .modal-close svg {
            width: 20px;
            height: 20px;
        }
        
        .modal-video-wrapper {
            position: relative;
            width: 100%;
            aspect-ratio: 9/16;
            background: #0c0b0a;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .modal-video-wrapper video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: pointer;
        }
        
        .modal-info {
            padding: 16px 0;
            text-align: center;
        }
        
        .modal-info h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.5rem;
            color: #fffef5;
            margin-bottom: 4px;
        }
        
        .modal-info span {
            font-size: 0.875rem;
            color: #a8a29e;
        }
        
        .modal-controls {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: rgba(255, 254, 245, 0.05);
            border-radius: 12px;
        }
        
        .control-btn {
            width: 44px;
            height: 44px;
            background: rgba(255, 254, 245, 0.1);
            border: none;
            border-radius: 50%;
            color: #fffef5;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }
        
        .control-btn:hover {
            background: rgba(205, 127, 50, 0.3);
        }
        
        .control-btn svg {
            width: 20px;
            height: 20px;
        }
        
        .progress-container {
            flex: 1;
            height: 6px;
            background: rgba(255, 254, 245, 0.1);
            border-radius: 3px;
            cursor: pointer;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #cd7f32, #fffef5);
            border-radius: 3px;
            width: 0%;
            transition: width 0.1s linear;
        }
        
        .time-display {
            font-size: 0.75rem;
            color: #a8a29e;
            min-width: 80px;
            text-align: center;
        }
        
        /* Disable 3D effects on reel cards */
        .reel-card {
            transform: none !important;
            cursor: pointer;
        }
        
        .reel-card:hover {
            transform: translateY(-5px) !important;
        }
        
        @media (max-width: 768px) {
            .video-modal-content {
                width: 95%;
                max-width: 400px;
            }
            
            .modal-close {
                top: -45px;
            }
            
            .modal-controls {
                gap: 8px;
                padding: 10px 12px;
            }
            
            .control-btn {
                width: 40px;
                height: 40px;
            }
            
            .time-display {
                font-size: 0.7rem;
                min-width: 70px;
            }
        }
    `;
    document.head.appendChild(styles);
}
