class MindScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: window.devicePixelRatio < 2,
            alpha: true,
            powerPreference: 'high-performance',
            precision: 'mediump'
        });
        this.particles = [];
        this.isLowPowerMode = false;
        this.frameId = null;
        this.lastTime = 0;
        this.fps = 60;
        this.fpsInterval = 1000 / this.fps;
        this.init();
        this.checkPerformance();
    }

    init() {
        // Setup renderer with pixel ratio optimization
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.sortObjects = false;
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = this.calculateOptimalCameraDistance();

        // Add ambient light with optimized parameters
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Add directional light with optimized parameters
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        // Create particle system
        this.createParticles();

        // Event listeners with debouncing
        this.setupEventListeners();

        // Start animation loop
        this.lastTime = performance.now();
        this.animate();
    }

    setupEventListeners() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.onWindowResize(), 100);
        }, false);

        let orientationTimeout;
        window.addEventListener('orientationchange', () => {
            if (orientationTimeout) clearTimeout(orientationTimeout);
            orientationTimeout = setTimeout(() => this.onOrientationChange(), 100);
        }, false);

        document.addEventListener('visibilitychange', () => this.handleVisibilityChange(), false);
    }

    calculateOptimalCameraDistance() {
        const isMobile = window.innerWidth <= 768;
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isMobile) {
            return isLandscape ? 4 : 6;
        }
        return 5;
    }

    createParticles() {
        const particleCount = this.isLowPowerMode ? 30 : 60;
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            vertices[i3] = (Math.random() - 0.5) * 10;
            vertices[i3 + 1] = (Math.random() - 0.5) * 10;
            vertices[i3 + 2] = (Math.random() - 0.5) * 10;
            
            sizes[i] = Math.random() * 0.1 + 0.05;
            
            colors[i3] = 0.4 + Math.random() * 0.2;
            colors[i3 + 1] = 0.4 + Math.random() * 0.2;
            colors[i3 + 2] = 0.7 + Math.random() * 0.3;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                opacity: { value: 1.0 }
            },
            vertexShader: `
                uniform float time;
                uniform float pixelRatio;
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vOpacity;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Optimized wave motion
                    float wave = time * 0.001;
                    pos.y += sin(wave + position.x) * 0.1;
                    pos.x += cos(wave + position.y) * 0.1;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                    
                    // Distance-based opacity
                    vOpacity = smoothstep(50.0, 0.0, length(mvPosition.xyz));
                }
            `,
            fragmentShader: `
                uniform float opacity;
                varying vec3 vColor;
                varying float vOpacity;
                
                void main() {
                    float d = length(gl_PointCoord - vec2(0.5));
                    if (d > 0.5) discard;
                    
                    float alpha = smoothstep(0.5, 0.4, d) * vOpacity * opacity;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push(particles);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.position.z = this.calculateOptimalCameraDistance();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    onOrientationChange() {
        // Wait for the orientation change to complete
        setTimeout(() => {
            this.onWindowResize();
        }, 100);
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    checkPerformance() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
        const isLowEndGPU = !this.renderer.capabilities.isWebGL2;
        
        if (isMobile || isLowMemory || isLowEndGPU) {
            this.isLowPowerMode = true;
            this.renderer.setPixelRatio(1);
            this.fps = 30;
            this.fpsInterval = 1000 / this.fps;
        }
    }

    pause() {
        this.isAnimating = false;
    }

    resume() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }

    animate(currentTime = performance.now()) {
        if (!this.isAnimating) return;

        this.frameId = requestAnimationFrame(time => this.animate(time));

        // Throttle frame rate
        const elapsed = currentTime - this.lastTime;
        if (elapsed < this.fpsInterval) return;

        this.lastTime = currentTime - (elapsed % this.fpsInterval);

        // Update particle animations with delta time
        const time = currentTime * 0.001;
        this.particles.forEach(particles => {
            particles.material.uniforms.time.value = time;
            
            if (!this.isLowPowerMode) {
                particles.rotation.y += 0.0002;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }

    transitionToNextQuestion(duration = 1.0) {
        return new Promise(resolve => {
            const startOpacity = 1.0;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = (currentTime - startTime) / (duration * 1000);
                const progress = Math.min(elapsed, 1.0);
                
                // Smooth easing
                const eased = 1 - Math.pow(1 - progress, 3);
                
                this.particles.forEach(particle => {
                    // Fade out particles
                    particle.material.uniforms.opacity.value = startOpacity * (1 - eased);
                    
                    // Rotate and scale effect
                    particle.rotation.y = eased * Math.PI * 2;
                    particle.scale.set(
                        1 + eased * 0.2,
                        1 + eased * 0.2,
                        1 + eased * 0.2
                    );
                });
                
                if (progress < 1.0) {
                    requestAnimationFrame(animate);
                } else {
                    // Reset and resolve
                    this.particles.forEach(particle => {
                        particle.material.uniforms.opacity.value = startOpacity;
                        particle.scale.set(1, 1, 1);
                    });
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    // Update particle colors based on answers
    updateVisualization(questionType, score) {
        const colors = this.particles[0].geometry.attributes.color.array;
        
        // Define color schemes for different question types
        const colorSchemes = {
            intelligence: [0.2, 0.6, 1.0], // Blue
            creativity: [1.0, 0.4, 0.8],   // Pink
            personality: [0.4, 1.0, 0.4]   // Green
        };

        const scheme = colorSchemes[questionType];
        
        // Update a portion of particles based on score
        const updateCount = Math.floor(colors.length / 3 * (score / 100));
        
        for (let i = 0; i < updateCount; i += 3) {
            colors[i] = scheme[0];
            colors[i + 1] = scheme[1];
            colors[i + 2] = scheme[2];
        }

        this.particles[0].geometry.attributes.color.needsUpdate = true;
    }

    dispose() {
        // Clean up resources
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
        }
        
        this.particles.forEach(particle => {
            particle.geometry.dispose();
            particle.material.dispose();
        });
        
        this.renderer.dispose();
        
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
        window.removeEventListener('orientationchange', this.onOrientationChange);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

export default MindScene; 