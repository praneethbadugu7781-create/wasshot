/**
 * WASSHOT STUDIO - Cinematic 3D Introduction
 * Ultra-realistic Three.js Scene
 */

(function() {
    'use strict';

    // Scene Configuration
    const CONFIG = {
        camera: {
            fov: 45,
            near: 0.1,
            far: 1000,
            position: { x: 0, y: 0, z: 8 }
        },
        animation: {
            autoRotate: true,
            rotationSpeed: 0.003,
            floatSpeed: 0.001,
            floatAmplitude: 0.15
        },
        particles: {
            count: 600,
            size: 0.015,
            spread: 25
        },
        lighting: {
            ambient: 0x1a1a1a,
            key: { color: 0xfffef5, intensity: 1.2 },
            fill: { color: 0xcd7f32, intensity: 0.4 },
            rim: { color: 0xe8e4dd, intensity: 0.8 }
        }
    };

    // Global variables
    let scene, camera, renderer, composer;
    let cameraModel, particles;
    let loadingProgress = 0;
    let isLoaded = false;
    let clock;

    // Initialize
    function init() {
        const canvas = document.getElementById('intro-canvas');
        if (!canvas) return;

        clock = new THREE.Clock();

        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0c0b0a);
        scene.fog = new THREE.FogExp2(0x0c0b0a, 0.08);

        // Camera
        camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fov,
            window.innerWidth / window.innerHeight,
            CONFIG.camera.near,
            CONFIG.camera.far
        );
        camera.position.set(
            CONFIG.camera.position.x,
            CONFIG.camera.position.y,
            CONFIG.camera.position.z
        );

        // Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Create scene elements
        createLighting();
        createCameraModel();
        createParticles();
        createEnvironment();

        // Post-processing (if available)
        setupPostProcessing();

        // Events
        window.addEventListener('resize', onResize);
        
        // Start loading simulation
        simulateLoading();

        // Animate
        animate();
    }

    function createLighting() {
        // Ambient
        const ambient = new THREE.AmbientLight(CONFIG.lighting.ambient, 0.5);
        scene.add(ambient);

        // Key Light (main)
        const keyLight = new THREE.DirectionalLight(
            CONFIG.lighting.key.color,
            CONFIG.lighting.key.intensity
        );
        keyLight.position.set(5, 5, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.bias = -0.0001;
        scene.add(keyLight);

        // Fill Light (warm bronze)
        const fillLight = new THREE.DirectionalLight(
            CONFIG.lighting.fill.color,
            CONFIG.lighting.fill.intensity
        );
        fillLight.position.set(-4, 2, -3);
        scene.add(fillLight);

        // Rim Light
        const rimLight = new THREE.DirectionalLight(
            CONFIG.lighting.rim.color,
            CONFIG.lighting.rim.intensity
        );
        rimLight.position.set(0, 3, -5);
        scene.add(rimLight);

        // Bottom fill
        const bottomLight = new THREE.DirectionalLight(0x1a1a1a, 0.3);
        bottomLight.position.set(0, -3, 2);
        scene.add(bottomLight);
    }

    function createCameraModel() {
        cameraModel = new THREE.Group();

        // Materials
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1918,
            metalness: 0.3,
            roughness: 0.7
        });

        const metalMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2928,
            metalness: 0.85,
            roughness: 0.2
        });

        const chromeMaterial = new THREE.MeshStandardMaterial({
            color: 0xe8e4dd,
            metalness: 1.0,
            roughness: 0.1,
            envMapIntensity: 1.5
        });

        const lensMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            metalness: 0.1,
            roughness: 0.05,
            transmission: 0.7,
            thickness: 0.5,
            ior: 2.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });

        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xcd7f32,
            transparent: true,
            opacity: 0.8
        });

        // Main body - cinema camera shape
        const bodyGeometry = new THREE.BoxGeometry(2.4, 1.4, 1.8);
        bodyGeometry.translate(0, 0, 0);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        cameraModel.add(body);

        // Body chamfers (rounded edges effect)
        const chamferGeometry = new THREE.BoxGeometry(2.5, 0.1, 1.9);
        const topChamfer = new THREE.Mesh(chamferGeometry, metalMaterial);
        topChamfer.position.y = 0.75;
        cameraModel.add(topChamfer);

        const bottomChamfer = new THREE.Mesh(chamferGeometry, metalMaterial);
        bottomChamfer.position.y = -0.75;
        cameraModel.add(bottomChamfer);

        // Lens mount
        const mountGeometry = new THREE.CylinderGeometry(0.6, 0.55, 0.3, 32);
        mountGeometry.rotateX(Math.PI / 2);
        const mount = new THREE.Mesh(mountGeometry, metalMaterial);
        mount.position.z = 1.05;
        mount.castShadow = true;
        cameraModel.add(mount);

        // Lens barrel
        const barrelGeometry = new THREE.CylinderGeometry(0.5, 0.55, 0.8, 32);
        barrelGeometry.rotateX(Math.PI / 2);
        const barrel = new THREE.Mesh(barrelGeometry, bodyMaterial);
        barrel.position.z = 1.55;
        barrel.castShadow = true;
        cameraModel.add(barrel);

        // Lens rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(0.52, 0.03, 8, 32);
            ringGeometry.rotateX(Math.PI / 2);
            const ring = new THREE.Mesh(ringGeometry, chromeMaterial);
            ring.position.z = 1.3 + i * 0.25;
            cameraModel.add(ring);
        }

        // Front lens element
        const frontLensGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.15, 32);
        frontLensGeometry.rotateX(Math.PI / 2);
        const frontLens = new THREE.Mesh(frontLensGeometry, lensMaterial);
        frontLens.position.z = 2.0;
        cameraModel.add(frontLens);

        // Lens hood
        const hoodGeometry = new THREE.CylinderGeometry(0.55, 0.48, 0.4, 32, 1, true);
        hoodGeometry.rotateX(Math.PI / 2);
        const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
        hood.position.z = 2.25;
        cameraModel.add(hood);

        // Viewfinder
        const viewfinderGeometry = new THREE.BoxGeometry(0.5, 0.4, 0.6);
        const viewfinder = new THREE.Mesh(viewfinderGeometry, metalMaterial);
        viewfinder.position.set(-0.5, 0.9, -0.2);
        viewfinder.castShadow = true;
        cameraModel.add(viewfinder);

        // Viewfinder eyepiece
        const eyepieceGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.15, 16);
        eyepieceGeometry.rotateX(Math.PI / 2);
        const eyepiece = new THREE.Mesh(eyepieceGeometry, chromeMaterial);
        eyepiece.position.set(-0.5, 0.9, -0.55);
        cameraModel.add(eyepiece);

        // Top handle
        const handleGeometry = new THREE.BoxGeometry(1.2, 0.15, 0.3);
        const handle = new THREE.Mesh(handleGeometry, metalMaterial);
        handle.position.set(0.3, 1.1, 0);
        cameraModel.add(handle);

        // Handle supports
        const supportGeometry = new THREE.BoxGeometry(0.1, 0.25, 0.2);
        const support1 = new THREE.Mesh(supportGeometry, metalMaterial);
        support1.position.set(-0.2, 0.92, 0);
        cameraModel.add(support1);

        const support2 = new THREE.Mesh(supportGeometry, metalMaterial);
        support2.position.set(0.8, 0.92, 0);
        cameraModel.add(support2);

        // Recording indicator (glowing)
        const indicatorGeometry = new THREE.CircleGeometry(0.05, 16);
        const indicator = new THREE.Mesh(indicatorGeometry, glowMaterial);
        indicator.position.set(1.0, 0.4, 0.91);
        cameraModel.add(indicator);

        // Side details
        const detailGeometry = new THREE.BoxGeometry(0.02, 0.5, 0.8);
        const detail1 = new THREE.Mesh(detailGeometry, chromeMaterial);
        detail1.position.set(1.22, 0, -0.2);
        cameraModel.add(detail1);

        const detail2 = new THREE.Mesh(detailGeometry.clone(), chromeMaterial);
        detail2.position.set(-1.22, 0, -0.2);
        cameraModel.add(detail2);

        // Buttons
        for (let i = 0; i < 3; i++) {
            const buttonGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 8);
            const button = new THREE.Mesh(buttonGeometry, chromeMaterial);
            button.position.set(1.22, 0.3 - i * 0.2, 0.3);
            button.rotation.z = Math.PI / 2;
            cameraModel.add(button);
        }

        // Film magazine (back)
        const magazineGeometry = new THREE.BoxGeometry(1.0, 1.2, 0.4);
        const magazine = new THREE.Mesh(magazineGeometry, bodyMaterial);
        magazine.position.set(0, 0, -1.1);
        magazine.castShadow = true;
        cameraModel.add(magazine);

        // Magazine detail
        const magDetailGeometry = new THREE.BoxGeometry(0.8, 1.0, 0.05);
        const magDetail = new THREE.Mesh(magDetailGeometry, metalMaterial);
        magDetail.position.set(0, 0, -1.32);
        cameraModel.add(magDetail);

        // Position and rotate
        cameraModel.position.set(0, 0, 0);
        cameraModel.rotation.y = Math.PI * 0.1;
        cameraModel.rotation.x = Math.PI * 0.05;

        scene.add(cameraModel);
    }

    function createParticles() {
        const geometry = new THREE.BufferGeometry();
        const count = CONFIG.particles.count;
        
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const colors = new Float32Array(count * 3);

        const colorPalette = [
            new THREE.Color(0xfffef5), // Ivory
            new THREE.Color(0xe8e4dd), // Platinum
            new THREE.Color(0xcd7f32), // Bronze (few)
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Spread particles in a sphere
            const radius = Math.random() * CONFIG.particles.spread;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            sizes[i] = Math.random() * CONFIG.particles.size + 0.005;
            
            // Color selection - mostly light, few bronze
            const colorIndex = Math.random() > 0.95 ? 2 : (Math.random() > 0.5 ? 0 : 1);
            const color = colorPalette[colorIndex];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Custom shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vAlpha;
                uniform float uTime;
                uniform float uPixelRatio;
                
                void main() {
                    vColor = color;
                    
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    
                    // Subtle movement
                    modelPosition.x += sin(uTime * 0.3 + position.y * 0.5) * 0.05;
                    modelPosition.y += cos(uTime * 0.2 + position.x * 0.5) * 0.05;
                    
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    
                    gl_Position = projectedPosition;
                    
                    // Size attenuation
                    gl_PointSize = size * uPixelRatio * (150.0 / -viewPosition.z);
                    
                    // Fade based on distance
                    float dist = length(position);
                    vAlpha = smoothstep(25.0, 5.0, dist) * 0.6;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    // Soft circular point
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
                    
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    function createEnvironment() {
        // Subtle grid floor
        const gridHelper = new THREE.GridHelper(30, 30, 0x1a1a1a, 0x0f0f0f);
        gridHelper.position.y = -3;
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);

        // Ground plane for shadows
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        scene.add(ground);
    }

    function setupPostProcessing() {
        // Simple vignette via CSS, keeping Three.js simple
    }

    function simulateLoading() {
        const progressCircle = document.getElementById('progress-circle');
        const progressText = document.getElementById('progress-text');
        const lightRays = document.getElementById('light-rays');
        const barTop = document.getElementById('bar-top');
        const barBottom = document.getElementById('bar-bottom');
        const introScreen = document.getElementById('intro-screen');
        
        const circumference = 170; // 2 * PI * 27
        let progress = 0;
        
        // Activate light rays
        setTimeout(() => {
            if (lightRays) lightRays.classList.add('active');
        }, 500);
        
        const interval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                isLoaded = true;
                
                // Update final progress
                if (progressCircle) {
                    const offset = circumference - (progress / 100) * circumference;
                    progressCircle.style.strokeDashoffset = offset;
                }
                if (progressText) progressText.textContent = '100%';
                
                // Start cinematic bars closing
                setTimeout(() => {
                    if (barTop) barTop.classList.add('closing');
                    if (barBottom) barBottom.classList.add('closing');
                }, 200);
                
                // Auto redirect after cinematic effect
                setTimeout(() => {
                    if (introScreen) introScreen.classList.add('exit');
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 1000);
                }, 1200);
            }
            
            // Update circular progress
            if (progressCircle) {
                const offset = circumference - (progress / 100) * circumference;
                progressCircle.style.strokeDashoffset = offset;
            }
            if (progressText) progressText.textContent = Math.floor(progress) + '%';
        }, 80);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (particles && particles.material.uniforms) {
            particles.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Camera model animation
        if (cameraModel && CONFIG.animation.autoRotate) {
            cameraModel.rotation.y = Math.PI * 0.1 + Math.sin(elapsed * 0.3) * 0.1;
            cameraModel.position.y = Math.sin(elapsed * CONFIG.animation.floatSpeed * 500) * CONFIG.animation.floatAmplitude;
        }

        // Particle animation
        if (particles && particles.material.uniforms) {
            particles.material.uniforms.uTime.value = elapsed;
            particles.rotation.y = elapsed * 0.02;
        }

        renderer.render(scene, camera);
    }

    // Entry transition
    function enterSite() {
        const introScreen = document.querySelector('.intro-screen');
        if (introScreen) {
            introScreen.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            introScreen.style.opacity = '0';
            introScreen.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 800);
        }
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        init();
    });

})();
