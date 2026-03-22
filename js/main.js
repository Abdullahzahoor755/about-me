/**
 * FUTURISTIC PORTFOLIO - ADVANCED 3D INTERACTIVE EXPERIENCE
 * Features: Three.js 3D background, animations, scroll effects
 */

// ============================================
// THREE.JS 3D BACKGROUND
// ============================================

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        try {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true
            });

            this.mouse = { x: 0, y: 0 };
            this.particles = [];
            this.particleGroup = new THREE.Group();

            this.init();
        } catch (e) {
            console.log('Three.js initialization failed:', e);
        }
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        this.camera.position.z = 50;

        this.createParticles();
        this.createFloatingShapes();
        this.scene.add(this.particleGroup);
        this.setupLights();
        this.animate();

        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    createParticles() {
        const particleCount = 80;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color1 = new THREE.Color(0x00f3ff);
        const color2 = new THREE.Color(0xbc13fe);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;

            this.particles.push({
                x: positions[i * 3],
                y: positions[i * 3 + 1],
                z: positions[i * 3 + 2],
                vx: (Math.random() - 0.5) * 0.02,
                vy: (Math.random() - 0.5) * 0.02,
                vz: (Math.random() - 0.5) * 0.01
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.particleGroup.add(this.particleSystem);
    }

    createFloatingShapes() {
        const geometries = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.TetrahedronGeometry(1, 0),
            new THREE.BoxGeometry(1, 1, 1)
        ];

        const materials = [
            new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 }),
            new THREE.MeshBasicMaterial({ color: 0xbc13fe, wireframe: true, transparent: true, opacity: 0.3 })
        ];

        this.floatingShapes = [];

        for (let i = 0; i < 10; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)].clone();
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 40
            );

            mesh.scale.setScalar(Math.random() * 2 + 0.5);
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.5 + 0.2,
                floatOffset: Math.random() * Math.PI * 2
            };

            this.particleGroup.add(mesh);
            this.floatingShapes.push(mesh);
        }
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00f3ff, 1, 100);
        pointLight1.position.set(20, 20, 20);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xbc13fe, 1, 100);
        pointLight2.position.set(-20, -20, 20);
        this.scene.add(pointLight2);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        if (this.particleSystem) {
            const positions = this.particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < this.particles.length; i++) {
                const particle = this.particles[i];
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.z += particle.vz;

                if (Math.abs(particle.x) > 50) particle.vx *= -1;
                if (Math.abs(particle.y) > 50) particle.vy *= -1;
                if (Math.abs(particle.z) > 25) particle.vz *= -1;

                positions[i * 3] = particle.x;
                positions[i * 3 + 1] = particle.y;
                positions[i * 3 + 2] = particle.z;
            }
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        if (this.floatingShapes) {
            this.floatingShapes.forEach((shape) => {
                shape.rotation.x += shape.userData.rotationSpeed.x;
                shape.rotation.y += shape.userData.rotationSpeed.y;
                shape.position.y += Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.02;
            });
        }

        this.particleGroup.rotation.y += 0.0005;
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouse.y * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    }
}

// ============================================
// TYPING EFFECT
// ============================================

class TypingEffect {
    constructor(element, words, options = {}) {
        this.element = element;
        this.words = words;
        this.currentWord = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.options = {
            typeSpeed: options.typeSpeed || 100,
            deleteSpeed: options.deleteSpeed || 50,
            pauseDuration: options.pauseDuration || 2000,
            ...options
        };
        this.type();
    }

    type() {
        const word = this.words[this.currentWord];

        if (this.isDeleting) {
            this.currentChar--;
        } else {
            this.currentChar++;
        }

        this.element.textContent = word.substring(0, this.currentChar);

        let speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

        if (!this.isDeleting && this.currentChar === word.length) {
            speed = this.options.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentWord = (this.currentWord + 1) % this.words.length;
            speed = 500;
        }

        setTimeout(() => this.type(), speed);
    }
}

// ============================================
// CUSTOM CURSOR
// ============================================

class CustomCursor {
    constructor() {
        this.glow = document.querySelector('.cursor-glow');
        this.dot = document.querySelector('.cursor-dot');
        this.mouseX = 0;
        this.mouseY = 0;
        this.glowX = 0;
        this.glowY = 0;

        this.init();
    }

    init() {
        if (!this.glow || !this.dot) return;
        if (window.matchMedia('(pointer: coarse)').matches) {
            this.glow.style.display = 'none';
            this.dot.style.display = 'none';
            return;
        }

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.dot.style.left = this.mouseX + 'px';
            this.dot.style.top = this.mouseY + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .stat-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.dot.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.dot.classList.remove('hover'));
        });

        this.animate();
    }

    animate() {
        this.glowX += (this.mouseX - this.glowX) * 0.1;
        this.glowY += (this.mouseY - this.glowY) * 0.1;
        this.glow.style.left = this.glowX + 'px';
        this.glow.style.top = this.glowY + 'px';
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        this.nav = document.querySelector('nav');
        this.init();
    }

    init() {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.revealElements.forEach(el => revealObserver.observe(el));
        window.addEventListener('scroll', () => this.onScroll());
    }

    onScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 100) {
            this.nav?.classList.add('scrolled');
        } else {
            this.nav?.classList.remove('scrolled');
        }

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ============================================
// 3D CARD TILT EFFECT
// ============================================

class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.skill-card, .project-card, .stat-card');
        this.init();
    }

    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`;
    }

    handleMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
    }
}

// ============================================
// MOBILE MENU
// ============================================

class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        if (!this.toggle || !this.navLinks) return;
        this.init();
    }

    init() {
        this.toggle.addEventListener('click', () => this.toggleMenu());
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.toggle.classList.remove('active');
        this.navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// NUMBER COUNTER ANIMATION
// ============================================

class NumberCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animate(element) {
        const text = element.innerText;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const target = parseInt(text.replace(/\D/g, ''));
        let current = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const update = () => {
            current += increment;
            if (current < target) {
                element.innerText = Math.floor(current) + (hasPlus ? '+' : hasPercent ? '%' : '');
                requestAnimationFrame(update);
            } else {
                element.innerText = target + (hasPlus ? '+' : hasPercent ? '%' : '');
            }
        };

        update();
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js
    try {
        new ParticleSystem();
    } catch (e) {
        console.log('Particle system failed:', e);
    }

    // Initialize typing effect
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new TypingEffect(typingElement, [
            'AI Developer',
            'Agentic AI Engineer',
            'Python Developer',
            'Full Stack Developer',
            'Chatbot Developer'
        ], {
            typeSpeed: 80,
            deleteSpeed: 50,
            pauseDuration: 2000
        });
    }

    // Initialize other components
    new CustomCursor();
    new ScrollAnimations();
    new CardTilt();
    new MobileMenu();
    new NumberCounter();

    // Hero character reveal animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${i * 0.05}s`;
            heroTitle.appendChild(span);
        });
    }

    // Stagger skill cards
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
