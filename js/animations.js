/**
 * WASSHOT Studio - Ultra Premium 3D Animations
 * Immersive realistic scroll animations and 3D interactions
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileNav();
    initScrollAnimations();
    init3DCards();
    // init3DParallax(); // Disabled - causing glitchy movement
    initMouseFollow();
    // initTextSplit(); // Disabled - causing letter glitches
    initMagneticButtons();
    initSmoothScroll();
    initFloatingElements();
    // initParticleSystem(); // Disabled - performance issues
    // initCursorTrail(); // Disabled - performance issues
    // initLightRays(); // Disabled - performance issues
    initImageReveal();
    // initDepthLayers(); // Disabled - causing movement issues
    // initMorphingShapes(); // Disabled - performance issues
    // initTextGlitch(); // Disabled - causing text glitches
    // initScrollVelocity(); // Disabled - causing text movement
    initFounderSection();
});

/**
 * Navbar Scroll Effect
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show on scroll
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

/**
 * Mobile Navigation
 */
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

/**
 * Scroll Reveal Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Stagger animation for grid children
                if (entry.target.classList.contains('services-grid') ||
                    entry.target.classList.contains('stats-grid') ||
                    entry.target.classList.contains('pricing-grid') ||
                    entry.target.classList.contains('reels-grid') ||
                    entry.target.classList.contains('service-preview-grid')) {
                    staggerChildren(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with reveal class
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
    });

    // Observe grid containers
    document.querySelectorAll('.services-grid, .stats-grid, .pricing-grid, .reels-grid, .service-preview-grid').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Stagger Children Animation
 */
function staggerChildren(parent) {
    const children = parent.children;
    Array.from(children).forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.1}s`;
        child.classList.add('revealed');
    });
}

/**
 * 3D Card Tilt Effect
 */
function init3DCards() {
    const cards = document.querySelectorAll('.service-card, .pricing-card, .reel-card, .stat-item, .service-preview-card, .event-option, .package-card, .contact-card');
    
    cards.forEach(card => {
        card.classList.add('tilt-card');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Move shine effect
            const shine = card.querySelector('.card-shine') || createShine(card);
            shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,254,245,0.15) 0%, transparent 60%)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            const shine = card.querySelector('.card-shine');
            if (shine) shine.style.background = 'transparent';
        });
    });
}

function createShine(card) {
    const shine = document.createElement('div');
    shine.className = 'card-shine';
    shine.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        z-index: 1;
    `;
    card.style.position = 'relative';
    card.appendChild(shine);
    return shine;
}

/**
 * 3D Parallax on Scroll
 */
function init3DParallax() {
    const parallaxElements = document.querySelectorAll('.hero-content, .section-header, .cta-content, .founder-content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const visible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (visible) {
                const speed = 0.1;
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                el.style.transform = `translateY(${yPos}px) translateZ(0)`;
            }
        });
    });
    
    // Parallax for background elements
    const bgElements = document.querySelectorAll('.hero-bg, .hero-grid');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        bgElements.forEach((el, i) => {
            const speed = 0.3 + (i * 0.1);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/**
 * Mouse Follow Effect for Hero
 */
function initMouseFollow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create floating cursor glow
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(205,127,50,0.1) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(glow);
    
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        
        // Show glow when over hero
        const heroRect = hero.getBoundingClientRect();
        if (e.clientY < heroRect.bottom) {
            glow.style.opacity = '1';
        } else {
            glow.style.opacity = '0';
        }
    });
    
    // 3D tilt for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            heroTitle.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
        });
        
        hero.addEventListener('mouseleave', () => {
            heroTitle.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });
    }
}

/**
 * Text Split Animation
 */
function initTextSplit() {
    const splitTexts = document.querySelectorAll('.split-text');
    
    splitTexts.forEach(text => {
        const content = text.textContent;
        text.innerHTML = '';
        
        content.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(50px) rotateX(-90deg);
                animation: splitReveal 0.6s ease forwards;
                animation-delay: ${i * 0.03}s;
            `;
            text.appendChild(span);
        });
    });
}

/**
 * Magnetic Button Effect
 */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Floating Elements Animation
 */
function initFloatingElements() {
    // Create floating shapes
    const sections = document.querySelectorAll('.section, .hero');
    
    sections.forEach(section => {
        // Add floating orbs
        for (let i = 0; i < 3; i++) {
            const orb = document.createElement('div');
            orb.className = 'floating-orb';
            const size = Math.random() * 200 + 100;
            const colors = ['rgba(205,127,50,0.05)', 'rgba(255,254,245,0.03)', 'rgba(232,228,221,0.04)'];
            
            orb.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[i % colors.length]};
                border-radius: 50%;
                filter: blur(40px);
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
                animation: floatOrb ${10 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${-Math.random() * 10}s;
                z-index: 0;
            `;
            section.style.position = 'relative';
            section.insertBefore(orb, section.firstChild);
        }
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

/**
 * Utility: Throttle Function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add 3D Animation Styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    /* Reveal Animations */
    .reveal, .reveal-left, .reveal-right, .reveal-scale {
        opacity: 0;
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .reveal {
        transform: translateY(60px) rotateX(-10deg);
        transform-origin: center top;
    }
    
    .reveal-left {
        transform: translateX(-80px) rotateY(10deg);
        transform-origin: left center;
    }
    
    .reveal-right {
        transform: translateX(80px) rotateY(-10deg);
        transform-origin: right center;
    }
    
    .reveal-scale {
        transform: scale(0.8) rotateX(-5deg);
    }
    
    .reveal.revealed, .reveal-left.revealed, .reveal-right.revealed, .reveal-scale.revealed {
        opacity: 1;
        transform: translate(0, 0) rotate(0) scale(1);
    }
    
    /* 3D Card Effects */
    .tilt-card {
        transition: transform 0.2s ease-out, box-shadow 0.3s ease;
        transform-style: preserve-3d;
        will-change: transform;
    }
    
    .tilt-card:hover {
        box-shadow: 
            0 25px 50px -12px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,254,245,0.1);
    }
    
    /* Split Text Animation */
    @keyframes splitReveal {
        to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
        }
    }
    
    /* Floating Orb Animation */
    @keyframes floatOrb {
        0%, 100% {
            transform: translate(0, 0) scale(1);
        }
        25% {
            transform: translate(30px, -40px) scale(1.1);
        }
        50% {
            transform: translate(-20px, 20px) scale(0.9);
        }
        75% {
            transform: translate(40px, 30px) scale(1.05);
        }
    }
    
    /* Hero 3D Title */
    .hero-title {
        transform-style: preserve-3d;
        transition: transform 0.3s ease-out;
    }
    
    /* Service Cards 3D */
    .service-card, .service-preview-card {
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }
    
    .service-card::before, .service-preview-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255,254,245,0.05) 0%, transparent 50%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }
    
    .service-card:hover::before, .service-preview-card:hover::before {
        opacity: 1;
    }
    
    /* Stats Counter 3D */
    .stat-value {
        transform-style: preserve-3d;
        transition: transform 0.5s ease;
    }
    
    .stat-item:hover .stat-value {
        transform: translateZ(20px) scale(1.1);
    }
    
    /* Pricing Cards 3D Layers */
    .pricing-card {
        transform-style: preserve-3d;
    }
    
    .pricing-card.featured {
        transform: translateZ(30px) scale(1.02);
    }
    
    /* Reel Cards 3D Hover */
    .reel-card {
        transform-style: preserve-3d;
    }
    
    .reel-card:hover .reel-play {
        transform: translate(-50%, -50%) translateZ(30px) scale(1.2);
    }
    
    .reel-play {
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    /* Page Header 3D */
    .page-header h1 {
        transform-style: preserve-3d;
        animation: header3DFloat 6s ease-in-out infinite;
    }
    
    @keyframes header3DFloat {
        0%, 100% {
            transform: translateZ(0) rotateX(0);
        }
        50% {
            transform: translateZ(20px) rotateX(2deg);
        }
    }
    
    /* CTA Section 3D */
    .cta-content {
        transform-style: preserve-3d;
    }
    
    .cta-title {
        animation: ctaFloat 4s ease-in-out infinite;
    }
    
    @keyframes ctaFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    /* Scroll indicator bounce */
    .hero-scroll {
        animation: scrollBounce 2s ease-in-out infinite;
    }
    
    @keyframes scrollBounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(10px); }
    }
    
    /* Contact Card 3D */
    .contact-card {
        transform-style: preserve-3d;
    }
    
    .contact-item {
        transition: transform 0.3s ease;
    }
    
    .contact-item:hover {
        transform: translateX(10px) translateZ(10px);
    }
    
    /* Footer 3D hover */
    .footer-logo {
        transition: transform 0.3s ease, text-shadow 0.3s ease;
    }
    
    .footer-logo:hover {
        transform: scale(1.05) translateZ(10px);
        text-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    
    /* No scroll for mobile menu */
    body.no-scroll {
        overflow: hidden;
    }
    
    /* Smooth perspective for all sections */
    section {
        perspective: 1000px;
    }
    
    /* Cursor Trail */
    .cursor-trail {
        position: fixed;
        width: 8px;
        height: 8px;
        background: var(--bronze, #cd7f32);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        mix-blend-mode: screen;
    }
    
    /* Light Rays */
    .light-ray {
        position: absolute;
        width: 2px;
        height: 100%;
        background: linear-gradient(to bottom, transparent, rgba(255,254,245,0.1), transparent);
        transform-origin: top;
        animation: rayFloat 8s ease-in-out infinite;
        pointer-events: none;
    }
    
    @keyframes rayFloat {
        0%, 100% { transform: translateX(0) skewX(-5deg); opacity: 0.3; }
        50% { transform: translateX(20px) skewX(5deg); opacity: 0.6; }
    }
    
    /* Particle System */
    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, rgba(205,127,50,0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: particleFloat 15s linear infinite;
    }
    
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
            transform: translateY(80vh) translateX(20px) scale(1);
        }
        90% {
            opacity: 1;
            transform: translateY(10vh) translateX(-20px) scale(1);
        }
        100% {
            transform: translateY(-10vh) translateX(0) scale(0);
            opacity: 0;
        }
    }
    
    /* Depth Layers */
    .depth-layer {
        transform-style: preserve-3d;
        will-change: transform;
    }
    
    .depth-layer-1 { transform: translateZ(10px); }
    .depth-layer-2 { transform: translateZ(20px); }
    .depth-layer-3 { transform: translateZ(30px); }
    
    /* Morphing Background */
    .morph-bg {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
    }
    
    .morph-shape {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        animation: morphFloat 20s ease-in-out infinite;
    }
    
    @keyframes morphFloat {
        0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: translate(0, 0) rotate(0deg);
        }
        25% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: translate(50px, -50px) rotate(90deg);
        }
        50% {
            border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
            transform: translate(0, 50px) rotate(180deg);
        }
        75% {
            border-radius: 60% 40% 70% 30% / 70% 30% 50% 60%;
            transform: translate(-50px, -25px) rotate(270deg);
        }
    }
    
    /* Text Glitch */
    .glitch {
        position: relative;
    }
    
    .glitch::before,
    .glitch::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    
    .glitch::before {
        left: 2px;
        text-shadow: -2px 0 rgba(205,127,50,0.7);
        clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        animation: glitch-anim 2s infinite linear alternate-reverse;
    }
    
    .glitch::after {
        left: -2px;
        text-shadow: 2px 0 rgba(255,254,245,0.7);
        clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        animation: glitch-anim 2s infinite linear alternate-reverse;
        animation-delay: -1s;
    }
    
    @keyframes glitch-anim {
        0% { clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); }
        25% { clip-path: polygon(0 20%, 100% 20%, 100% 55%, 0 55%); }
        50% { clip-path: polygon(0 40%, 100% 40%, 100% 75%, 0 75%); }
        75% { clip-path: polygon(0 10%, 100% 10%, 100% 35%, 0 35%); }
        100% { clip-path: polygon(0 30%, 100% 30%, 100% 65%, 0 65%); }
    }
    
    /* Founder Image 3D */
    .founder-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .founder-image:hover .founder-img {
        transform: scale(1.05);
    }
    
    .founder-image-glow {
        position: absolute;
        inset: -20px;
        background: radial-gradient(ellipse at center, rgba(205,127,50,0.2) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.5s ease;
        z-index: -1;
    }
    
    .founder-image:hover .founder-image-glow {
        opacity: 1;
    }
    
    .founder-image-border {
        position: absolute;
        inset: -5px;
        border: 1px solid rgba(205,127,50,0.3);
        transform: translate(10px, 10px);
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
    }
    
    .founder-image:hover .founder-image-border {
        transform: translate(15px, 15px);
    }
    
    /* Signature Animation */
    .signature-path {
        stroke-dasharray: 500;
        stroke-dashoffset: 500;
        animation: signatureDraw 3s ease forwards 1s;
    }
    
    @keyframes signatureDraw {
        to { stroke-dashoffset: 0; }
    }
    
    /* Quote Marks */
    .quote-mark {
        font-family: Georgia, serif;
        font-size: 3em;
        color: var(--bronze, #cd7f32);
        opacity: 0.5;
        line-height: 0;
        vertical-align: middle;
    }
    
    /* Label Lines */
    .label-line {
        display: inline-block;
        width: 30px;
        height: 1px;
        background: var(--bronze, #cd7f32);
        vertical-align: middle;
        margin: 0 10px;
        animation: labelLineExpand 1s ease forwards;
        transform: scaleX(0);
    }
    
    @keyframes labelLineExpand {
        to { transform: scaleX(1); }
    }
    
    /* Floating Particles Container */
    .floating-particles {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    }
    
    /* Scroll Velocity Effect */
    .velocity-text {
        transition: letter-spacing 0.3s ease;
    }
    
    /* Image Reveal Clip */
    .image-reveal {
        clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
        transition: clip-path 1s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .image-reveal.revealed {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
    
    /* Enhanced Service Cards */
    .service-card {
        transform: perspective(1000px) rotateX(0) rotateY(0);
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .service-card:hover {
        box-shadow: 
            0 50px 80px -20px rgba(0,0,0,0.5),
            0 30px 40px -30px rgba(205,127,50,0.3),
            inset 0 -2px 0 0 rgba(205,127,50,0.5);
    }
    
    /* Pricing Cards Enhanced */
    .pricing-card {
        transform: perspective(1000px) rotateX(0) rotateY(0);
        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .pricing-card:hover {
        transform: perspective(1000px) translateY(-20px) translateZ(50px);
        box-shadow: 
            0 60px 100px -30px rgba(0,0,0,0.6),
            0 0 60px -15px rgba(205,127,50,0.2);
    }
    
    /* Button Ripple */
    .btn-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyles);

/**
 * Particle System
 */
function initParticleSystem() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'floating-particles';
    hero.insertBefore(particleContainer, hero.firstChild);
    
    for (let i = 0; i < 30; i++) {
        createParticle(particleContainer, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 6 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${-delay}s;
        animation-duration: ${duration}s;
    `;
    
    container.appendChild(particle);
}

/**
 * Cursor Trail Effect
 */
function initCursorTrail() {
    const trailCount = 12;
    const trails = [];
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            width: ${8 - i * 0.5}px;
            height: ${8 - i * 0.5}px;
            transition: transform ${0.1 + i * 0.02}s ease, opacity 0.3s ease;
        `;
        document.body.appendChild(trail);
        trails.push({ element: trail, x: 0, y: 0 });
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        trails.forEach(trail => {
            trail.element.style.opacity = '1';
        });
    });
    
    document.addEventListener('mouseleave', () => {
        trails.forEach(trail => {
            trail.element.style.opacity = '0';
        });
    });
    
    function animateTrails() {
        let x = mouseX;
        let y = mouseY;
        
        trails.forEach((trail, index) => {
            trail.x += (x - trail.x) * (0.3 - index * 0.02);
            trail.y += (y - trail.y) * (0.3 - index * 0.02);
            
            trail.element.style.transform = `translate(${trail.x - 4}px, ${trail.y - 4}px)`;
            
            x = trail.x;
            y = trail.y;
        });
        
        requestAnimationFrame(animateTrails);
    }
    
    animateTrails();
}

/**
 * Light Rays Effect
 */
function initLightRays() {
    const sections = document.querySelectorAll('.hero, .cta-section');
    
    sections.forEach(section => {
        for (let i = 0; i < 5; i++) {
            const ray = document.createElement('div');
            ray.className = 'light-ray';
            ray.style.cssText = `
                left: ${10 + i * 20}%;
                animation-delay: ${i * -1.5}s;
                animation-duration: ${8 + Math.random() * 4}s;
                height: ${50 + Math.random() * 50}%;
                top: 0;
            `;
            section.style.position = 'relative';
            section.style.overflow = 'hidden';
            section.appendChild(ray);
        }
    });
}

/**
 * Image Reveal Animation
 */
function initImageReveal() {
    const images = document.querySelectorAll('.founder-img, .reel-thumb');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('image-reveal', 'revealed');
            }
        });
    }, { threshold: 0.3 });
    
    images.forEach(img => {
        img.classList.add('image-reveal');
        observer.observe(img);
    });
}

/**
 * Depth Layers System
 */
function initDepthLayers() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    
    const title = heroContent.querySelector('.hero-title');
    const desc = heroContent.querySelector('.hero-description');
    const actions = heroContent.querySelector('.hero-actions');
    
    if (title) title.classList.add('depth-layer', 'depth-layer-3');
    if (desc) desc.classList.add('depth-layer', 'depth-layer-2');
    if (actions) actions.classList.add('depth-layer', 'depth-layer-1');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const layers = document.querySelectorAll('.depth-layer-1, .depth-layer-2, .depth-layer-3');
        
        layers.forEach(layer => {
            const speed = layer.classList.contains('depth-layer-3') ? 0.15 :
                         layer.classList.contains('depth-layer-2') ? 0.1 : 0.05;
            layer.style.transform = `translateY(${scrolled * speed}px) translateZ(${layer.classList.contains('depth-layer-3') ? 30 : layer.classList.contains('depth-layer-2') ? 20 : 10}px)`;
        });
    });
}

/**
 * Morphing Background Shapes
 */
function initMorphingShapes() {
    const sections = document.querySelectorAll('.section-lg, .stats-section');
    
    sections.forEach(section => {
        const morphBg = document.createElement('div');
        morphBg.className = 'morph-bg';
        
        for (let i = 0; i < 3; i++) {
            const shape = document.createElement('div');
            shape.className = 'morph-shape';
            const size = 200 + Math.random() * 300;
            const colors = [
                'rgba(205,127,50,0.03)',
                'rgba(255,254,245,0.02)',
                'rgba(232,228,221,0.03)'
            ];
            
            shape.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${colors[i % colors.length]};
                left: ${Math.random() * 80}%;
                top: ${Math.random() * 80}%;
                animation-delay: ${-i * 5}s;
                animation-duration: ${20 + i * 5}s;
            `;
            morphBg.appendChild(shape);
        }
        
        section.style.position = 'relative';
        section.insertBefore(morphBg, section.firstChild);
    });
}

/**
 * Text Glitch Effect on Hover
 */
function initTextGlitch() {
    const titles = document.querySelectorAll('.hero-title-line .text-accent, .cta-title .text-accent');
    
    titles.forEach(title => {
        const text = title.textContent;
        title.setAttribute('data-text', text);
        
        title.addEventListener('mouseenter', () => {
            title.classList.add('glitch');
        });
        
        title.addEventListener('mouseleave', () => {
            title.classList.remove('glitch');
        });
    });
}

/**
 * Scroll Velocity Text
 */
function initScrollVelocity() {
    let lastScrollTop = 0;
    let velocity = 0;
    
    const velocityTexts = document.querySelectorAll('.section-title, .founder-name, .cta-title');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        velocity = Math.abs(scrollTop - lastScrollTop);
        lastScrollTop = scrollTop;
        
        const letterSpacing = Math.min(velocity * 0.02, 0.3);
        
        velocityTexts.forEach(text => {
            text.style.letterSpacing = `${letterSpacing}em`;
        });
    });
}

/**
 * Founder Section Special Effects
 */
function initFounderSection() {
    const founderSection = document.querySelector('.founder-section-wrap');
    if (!founderSection) return;
    
    // Add floating particles specific to founder section
    const particleContainer = founderSection.querySelector('#founder-particles');
    if (particleContainer) {
        for (let i = 0; i < 20; i++) {
            createParticle(particleContainer, i);
        }
    }
    
    // 3D tilt for founder image
    const founderImage = document.querySelector('.founder-image');
    if (founderImage) {
        founderImage.addEventListener('mousemove', (e) => {
            const rect = founderImage.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            founderImage.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        });
        
        founderImage.addEventListener('mouseleave', () => {
            founderImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });
    }
    
    // Animate signature on scroll
    const signature = document.querySelector('.signature-svg');
    if (signature) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const path = signature.querySelector('.signature-path');
                    if (path) {
                        path.style.animation = 'signatureDraw 3s ease forwards';
                    }
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(signature);
    }
}

/**
 * Button Ripple Effect
 */
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
    `;
    
    btn.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});
