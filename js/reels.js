/**
 * WASSHOT Studio - Reels Gallery
 * Video playback with sound controls
 */

document.addEventListener('DOMContentLoaded', () => {
    initVideoReels();
});

/**
 * Initialize Video Reels with Sound Controls
 */
function initVideoReels() {
    const videos = document.querySelectorAll('.reel-video');
    const playBtns = document.querySelectorAll('.reel-play-btn');
    const soundBtns = document.querySelectorAll('.reel-sound-btn');
    const globalSoundBtn = document.querySelector('.global-sound-btn');
    
    let globalMuted = true; // Start with all videos muted
    
    // Initialize all videos as muted
    videos.forEach(video => {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
    });
    
    // Play/Pause buttons
    playBtns.forEach((btn, index) => {
        const video = videos[index];
        if (!video) return;
        
        btn.addEventListener('click', () => {
            if (video.paused) {
                // Pause all other videos first
                videos.forEach((v, i) => {
                    if (i !== index && !v.paused) {
                        v.pause();
                        playBtns[i].classList.remove('playing');
                        playBtns[i].innerHTML = getPlayIcon();
                    }
                });
                
                video.play();
                btn.classList.add('playing');
                btn.innerHTML = getPauseIcon();
            } else {
                video.pause();
                btn.classList.remove('playing');
                btn.innerHTML = getPlayIcon();
            }
        });
    });
    
    // Individual sound buttons
    soundBtns.forEach((btn, index) => {
        const video = videos[index];
        if (!video) return;
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            
            if (video.muted) {
                btn.classList.add('muted');
                btn.innerHTML = getMutedIcon();
            } else {
                btn.classList.remove('muted');
                btn.innerHTML = getSoundIcon();
                
                // Mute all other videos when unmuting one
                videos.forEach((v, i) => {
                    if (i !== index) {
                        v.muted = true;
                        soundBtns[i].classList.add('muted');
                        soundBtns[i].innerHTML = getMutedIcon();
                    }
                });
            }
        });
        
        // Set initial state
        btn.classList.add('muted');
        btn.innerHTML = getMutedIcon();
    });
    
    // Global sound toggle
    if (globalSoundBtn) {
        globalSoundBtn.addEventListener('click', () => {
            globalMuted = !globalMuted;
            
            videos.forEach((video, i) => {
                video.muted = globalMuted;
                
                if (globalMuted) {
                    soundBtns[i].classList.add('muted');
                    soundBtns[i].innerHTML = getMutedIcon();
                } else {
                    soundBtns[i].classList.remove('muted');
                    soundBtns[i].innerHTML = getSoundIcon();
                }
            });
            
            if (globalMuted) {
                globalSoundBtn.innerHTML = getMutedIcon() + '<span>Unmute All</span>';
            } else {
                globalSoundBtn.innerHTML = getSoundIcon() + '<span>Mute All</span>';
            }
        });
        
        // Set initial state
        globalSoundBtn.innerHTML = getMutedIcon() + '<span>Unmute All</span>';
    }
    
    // Auto-play on hover (optional enhancement)
    const containers = document.querySelectorAll('.reel-video-container');
    containers.forEach((container, index) => {
        const video = videos[index];
        const playBtn = playBtns[index];
        if (!video || !playBtn) return;
        
        // Click on container also toggles play
        container.addEventListener('click', (e) => {
            if (e.target.closest('.reel-sound-btn') || e.target.closest('.reel-play-btn')) return;
            playBtn.click();
        });
    });
}

// SVG Icons
function getPlayIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
    </svg>`;
}

function getPauseIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>`;
}

function getSoundIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>`;
}

function getMutedIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>`;
}
