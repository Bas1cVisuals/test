document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
// PORTFOLIO PREMIUM INTERACTIONS (Append to main.js)
// ==========================================================================

// 1. Segmented Control / Filter Physics
const initSegmentedFilters = () => {
    const filterBtns = document.querySelectorAll('.seg-btn');
    const indicator = document.querySelector('.seg-indicator');
    const galleryCards = document.querySelectorAll('.ed-card');

    if (!filterBtns.length || !indicator || !galleryCards.length) return;

    // Set initial indicator position
    const activeBtn = document.querySelector('.seg-btn.active') || filterBtns[0];
    updateIndicator(activeBtn);

    function updateIndicator(btn) {
        indicator.style.width = `${btn.offsetWidth}px`;
        indicator.style.transform = `translateX(${btn.offsetLeft - 6}px)`; // -6px for container padding
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update UI
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateIndicator(btn);

            // Filter Logic
            const targetCategory = btn.getAttribute('data-filter');
            galleryCards.forEach(card => {
                card.classList.remove('filter-hide');
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = null;

                if (targetCategory !== 'all' && card.getAttribute('data-category') !== targetCategory) {
                    card.classList.add('filter-hide');
                }
            });
        });
    });

    // Handle window resize for indicator
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.seg-btn.active');
        if (currentActive) updateIndicator(currentActive);
    });
};
initSegmentedFilters();

// 2. Premium Project Modal Controller
const initProjectModal = () => {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('modal-close');
    const backdrop = document.getElementById('modal-backdrop');
    const iframe = document.getElementById('modal-iframe');
    const videoWrapper = document.getElementById('modal-video-wrapper');
    
    // Data nodes
    const nodes = {
        title: document.getElementById('m-title'),
        cat: document.getElementById('m-cat'),
        desc: document.getElementById('m-desc'),
        client: document.getElementById('m-client'),
        role: document.getElementById('m-role'),
        software: document.getElementById('m-software'),
        style: document.getElementById('m-style'),
        deliv: document.getElementById('m-deliv'),
        dur: document.getElementById('m-dur'),
        ext: document.getElementById('m-external')
    };

    const parseYouTubeEmbed = (url) => {
        if (!url) return '';
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : '';
    };

    document.querySelectorAll('.ed-card, .showreel-container[data-video]').forEach(card => {
        card.addEventListener('click', () => {
            const rawUrl = card.dataset.video;
            if (!rawUrl) return;

            // Geometry Detection (Shorts vs Standard)
            const isVertical = rawUrl.includes('shorts') || rawUrl.includes('instagram');
            if (isVertical) {
                videoWrapper.classList.add('is-vertical');
                videoWrapper.classList.remove('is-horizontal');
            } else {
                videoWrapper.classList.add('is-horizontal');
                videoWrapper.classList.remove('is-vertical');
            }

            // Populate Metadata
            nodes.title.textContent = card.dataset.title || 'Project Archive';
            nodes.cat.textContent = card.dataset.category || 'Editorial';
            nodes.desc.textContent = card.dataset.desc || '';
            nodes.client.textContent = card.dataset.client || 'N/A';
            nodes.role.textContent = card.dataset.role || 'N/A';
            nodes.software.textContent = card.dataset.software || 'N/A';
            nodes.style.textContent = card.dataset.style || 'N/A';
            nodes.deliv.textContent = card.dataset.deliverables || 'N/A';
            nodes.dur.textContent = card.dataset.duration || 'N/A';
            nodes.ext.href = rawUrl;

            // Trigger Modal
            iframe.src = parseYouTubeEmbed(rawUrl);
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => iframe.src = '', 400); // Wait for transition
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
};
initProjectModal();

// 3. Animated Data Counters
const initDataCounters = () => {
    const counters = document.querySelectorAll('.counter-num');
    if (!counters.length) return;

    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;

        const timer = setInterval(() => {
            current += Math.ceil(target / 50); // Acceleration
            if (current >= target) {
                el.innerText = target;
                clearInterval(timer);
            } else {
                el.innerText = current;
            }
        }, stepTime);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target); // Run only once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
};
initDataCounters();

    const init3DNetworkCards = () => {
        const query = window.matchMedia('(hover: hover) and (pointer: fine)');
        if (!query.matches) return;

        const cards = document.querySelectorAll('.social-node-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });

            card.addEventListener('mouseenter', () => {
                document.body.classList.add('hover-active');
                state.hovering = true;
                state.hudText = 'CONNECT';
            });
            
            card.addEventListener('mouseleave', () => {
                document.body.classList.remove('hover-active');
                state.hovering = false;
            });
        });
    };
    // NOTE: init3DNetworkCards() moved below `state` declaration — was calling state before it existed

    const buildBioluminescence = () => {
        if (window.innerWidth < 768 || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const container = document.createElement('div');
        container.className = 'firefly-matrix';
        container.setAttribute('aria-hidden', 'true');

        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firefly-node';
            
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            
            const driftDuration = Math.random() * 15 + 10;
            const pulseDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 5;
            
            particle.style.animationDuration = `${driftDuration}s, ${pulseDuration}s`;
            particle.style.animationDelay = `-${delay}s, -${delay}s`;
            
            container.appendChild(particle);
        }

        document.body.prepend(container);
    };
    buildBioluminescence();

    const buildThemeReactiveBackground = () => {
        if (window.innerWidth < 768 || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const container = document.createElement('div');
        container.className = 'rainbow-bg-container';
        container.setAttribute('aria-hidden', 'true');

        const colors = [
            ['rgb(232,121,249)', 'rgb(96,165,250)', 'rgb(94,234,212)'],
            ['rgb(232,121,249)', 'rgb(94,234,212)', 'rgb(96,165,250)'],
            ['rgb(94,234,212)', 'rgb(232,121,249)', 'rgb(96,165,250)'],
            ['rgb(94,234,212)', 'rgb(96,165,250)', 'rgb(232,121,249)'],
            ['rgb(96,165,250)', 'rgb(94,234,212)', 'rgb(232,121,249)'],
            ['rgb(96,165,250)', 'rgb(232,121,249)', 'rgb(94,234,212)']
        ];

        const length = 25;
        const baseTime = 45;

        for (let i = 1; i <= length; i++) {
            const el = document.createElement('div');
            el.className = 'rainbow-beam';
            
            const r = Math.floor(Math.random() * 6);
            const c = colors[r];
            
            el.style.setProperty('--c1', c[0]);
            el.style.setProperty('--c2', c[1]);
            el.style.setProperty('--c3', c[2]);
            
            const animTime = baseTime - (baseTime / length / 2 * i);
            const delay = -(i / length * baseTime);
            
            el.style.animationDuration = `${animTime}s`;
            el.style.animationDelay = `${delay}s`;
            
            container.appendChild(el);
        }

        const h = document.createElement('div'); h.className = 'rainbow-h';
        const v = document.createElement('div'); v.className = 'rainbow-v';
        container.appendChild(h);
        container.appendChild(v);

        document.body.prepend(container);
    };
    buildThemeReactiveBackground();

    const applyMagneticPhysics = () => {
        const query = window.matchMedia('(hover: hover) and (pointer: fine)');
        if (!query.matches) return;

        const targets = document.querySelectorAll('.nav-link, .review-btn, .theme-btn, .cv-download-card');
        
        targets.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
                el.style.transition = 'none';
                el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                el.style.transform = 'translate3d(0px, 0px, 0)';
            });
        });
    };

    applyMagneticPhysics();

    const hasLenis = typeof Lenis === 'function';

const lenis = hasLenis
    ? new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    })
    : {
        on: () => {},
        raf: () => {},
        scrollTo: (target) => window.scrollTo({ top: target, behavior: 'smooth' }),
        stop: () => document.documentElement.classList.add('lenis-stopped'),
        start: () => document.documentElement.classList.remove('lenis-stopped')
    };

    const progressBar = document.createElement('div');
    progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:var(--text-primary);z-index:10000;transform-origin:0 50%;transform:scaleX(0);will-change:transform;';
    document.body.appendChild(progressBar);

    const distortionTargets = document.querySelectorAll('h1.hero-title, h2.section-title');

    lenis.on('scroll', (e) => {
        const ratio = e.scroll / e.limit || 0;
        progressBar.style.transform = `scaleX(${ratio})`;

        const skew = Math.min(Math.max(e.velocity * 0.15, -5), 5);
        distortionTargets.forEach(el => {
            el.style.transform = `skewY(${skew}deg)`;
        });
    });

    if (!hasLenis) {
        window.addEventListener('scroll', () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = max > 0 ? window.scrollY / max : 0;
            progressBar.style.transform = `scaleX(${ratio})`;
        }, { passive: true });
    }

    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.2 });
        });
    }

    const initWelcomeSequence = () => {
        const loader = document.getElementById('page-loader');
        const welcomeOverlay = document.getElementById('welcome-overlay');
        
        const isInternalNav = sessionStorage.getItem('bas1c_internal_nav') === 'true';
        sessionStorage.removeItem('bas1c_internal_nav');
        
        const navEntry = performance.getEntriesByType("navigation")[0];
        const isReload = navEntry && navEntry.type === "reload";
        
        const executeSequence = !isInternalNav || isReload;
        
        if (executeSequence && welcomeOverlay) { 
            if (loader) loader.style.display = 'none';
            
            setTimeout(() => {
                welcomeOverlay.classList.add('active');
                
                setTimeout(() => {
                    welcomeOverlay.classList.add('exit');
                    document.body.classList.add('loaded');
                    
                    setTimeout(() => {
                        welcomeOverlay.classList.remove('active', 'exit');
                    }, 800);
                }, 2400); 
                
            }, 100);
        } else {
            if (welcomeOverlay) welcomeOverlay.style.display = 'none';
            if (loader) loader.style.display = 'block'; 
            
            // Standardized internal routing delay
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 800);
        }
    };
    initWelcomeSequence();

    const cursor = document.getElementById('cursor');
    const hud = document.getElementById('intent-hud');
    const spotlight = document.querySelector('.spotlight-grid');
    
    const state = { 
        mouseX: 0, mouseY: 0, 
        x: 0, y: 0, 
        vx: 0, vy: 0, 
        scale: 1, scaleV: 0, 
        angle: 0, 
        hudText: '', hovering: false,
        initialized: false
    };

    window.addEventListener('mousemove', (e) => {
        if (!state.initialized) {
            state.x = e.clientX;
            state.y = e.clientY;
            state.initialized = true;
            if (cursor) cursor.style.opacity = '1';
        }
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
    }, { passive: true });

    const renderLoop = (time) => {
        if (hasLenis) lenis.raf(time);
        
        // 01. Follow-Through & Overlapping Action (Spring Physics)
        state.vx += (state.mouseX - state.x) * 0.25;
        state.vy += (state.mouseY - state.y) * 0.25;
        state.vx *= 0.65; // Friction constraint
        state.vy *= 0.65;
        state.x += state.vx;
        state.y += state.vy;

        // 02. Squash & Stretch (Velocity-based Geometry)
        const speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
        const stretch = Math.min(speed * 0.05, 1.2); 
        if (speed > 0.1) state.angle = Math.atan2(state.vy, state.vx);

        // 03. Smooth Interpolation (Hover Expansion)
        const targetScale = state.hovering ? 3 : 1;
        state.scale += (targetScale - state.scale) * 0.12;

        // Execute Render Vectors
        if (cursor) {
            cursor.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%) rotate(${state.angle}rad) scaleX(${1 + stretch}) scaleY(${1 - stretch * 0.3}) scale(${Math.max(state.scale, 0.1)})`;
        }

        if (hud) {
            hud.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%)`;
            if (state.hovering) { 
                hud.textContent = state.hudText; 
                hud.classList.add('active'); 
            } else { 
                hud.classList.remove('active'); 
            }
        }

        if (spotlight) {
            spotlight.style.setProperty('--mouse-x', `${state.x}px`);
            spotlight.style.setProperty('--mouse-y', `${state.y}px`);
        }

        requestAnimationFrame(renderLoop);
    };
    requestAnimationFrame(renderLoop);

    init3DNetworkCards(); // Moved here so `state` is already declared

    const reactiveCards = document.querySelectorAll('.op-card, .gallery-card, .about-card, .social-node-card');
    window.addEventListener('mousemove', (e) => {
        reactiveCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    },
    { passive: true });

    const bindInteraction = (selector, actionLabel) => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('mouseenter', () => { document.body.classList.add('hover-active'); state.hovering = true; state.hudText = actionLabel; });
            el.addEventListener('mouseleave', () => { document.body.classList.remove('hover-active'); state.hovering = false; });
        });
    };

    bindInteraction('a', 'CLICK');
    bindInteraction('.gallery-card', 'WATCH');
    bindInteraction('[data-copy]', 'COPY');
    bindInteraction('#scroll-top-btn', 'TOP');

    const applyVideoPlayback = () => {
        const query = window.matchMedia('(hover: hover) and (pointer: fine)');
        if (!query.matches) return;

        document.querySelectorAll('.gallery-card').forEach(card => {
            const vid = card.querySelector('video');
            if (!vid) return;
            
            card.addEventListener('mouseenter', () => vid.play());
            card.addEventListener('mouseleave', () => { 
                vid.pause(); 
                vid.currentTime = 0; 
            });
        });
    };
    applyVideoPlayback();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-block').forEach(el => observer.observe(el));

    document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="index"], a[href^="work"], a[href^="about"], a[href^="contact"], a[href^="network"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = link.getAttribute('href');
            if (target && !target.startsWith('#') && !target.includes('mailto:') && link.target !== '_blank') {
                e.preventDefault();
                sessionStorage.setItem('bas1c_internal_nav', 'true');
                document.body.classList.remove('loaded');
                document.body.classList.add('is-exporting');
                setTimeout(() => window.location.href = target, 1200);
            }
        });
    });

    const lightbox = document.getElementById('lightbox');
    const iframe = document.getElementById('lightbox-frame');
    
    const parseYouTubeUrl = (url) => {
        if (!url) return '';
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : '';
    };

    document.querySelectorAll('[data-video]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            if (!lightbox || !iframe) return;
            const rawUrl = trigger.dataset.video;
            if (!rawUrl) return; // Guard: skip placeholder cards with no URL
            const embedUrl = parseYouTubeUrl(rawUrl);
            if (!embedUrl) return; // Guard: skip if URL couldn't be parsed
            iframe.src = embedUrl;
            lightbox.classList.add('active');
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        setTimeout(() => iframe.src = '', 400);
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }

    document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                state.hudText = 'COPIED';
            } catch (error) {
                const fallback = document.createElement('textarea');
                fallback.value = btn.dataset.copy;
                fallback.setAttribute('readonly', '');
                fallback.style.position = 'fixed';
                fallback.style.opacity = '0';
                document.body.appendChild(fallback);
                fallback.select();
                const copied = document.execCommand('copy');
                fallback.remove();
                state.hudText = copied ? 'COPIED' : 'COPY FAILED';
            }
            setTimeout(() => state.hudText = 'COPY', 1500);
        });
    });

    const eeTrigger = document.getElementById('easter-egg-trigger');
    const eeModal = document.getElementById('easter-egg-modal');
    const eeClose = document.getElementById('close-modal');

    if (eeTrigger && eeModal && eeClose) {
        eeTrigger.addEventListener('click', () => { 
            eeModal.classList.add('active');
            if (typeof lenis !== 'undefined') lenis.stop();
        });
        
        eeClose.addEventListener('click', () => { 
            eeModal.classList.remove('active');
            if (typeof lenis !== 'undefined') lenis.start();
        });
        
        eeModal.addEventListener('click', (e) => {
            if (e.target === eeModal) {
                eeModal.classList.remove('active');
                if (typeof lenis !== 'undefined') lenis.start();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                eeModal.classList.remove('active');
                if (typeof lenis !== 'undefined') lenis.start();
            }
        });

        eeTrigger.addEventListener('mouseenter', () => { 
            document.body.classList.add('hover-active'); 
            state.hovering = true; 
            state.hudText = 'ACCESS'; 
        });
        eeTrigger.addEventListener('mouseleave', () => { 
            document.body.classList.remove('hover-active'); 
            state.hovering = false; 
        });

        eeClose.addEventListener('mouseenter', () => { 
            document.body.classList.add('hover-active'); 
            state.hovering = true; 
            state.hudText = 'CLOSE'; 
        });
        eeClose.addEventListener('mouseleave', () => { 
            document.body.classList.remove('hover-active'); 
            state.hovering = false; 
        });
    }
    // Filter Architecture Execution (moved inside DOMContentLoaded)
    const initPortfolioFilter = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryCards = document.querySelectorAll('.gallery-card');

        if (!filterBtns.length || !galleryCards.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetCategory = btn.getAttribute('data-filter');

                galleryCards.forEach(card => {
                    card.classList.remove('filter-hide');
                    void card.offsetWidth; // Force reflow to re-trigger animation phase

                    if (targetCategory !== 'all' && card.getAttribute('data-category') !== targetCategory) {
                        card.classList.add('filter-hide');
                    }
                });
            });
        });
    };
    initPortfolioFilter();

    // Dynamic Year Execution (moved inside DOMContentLoaded)
    const yearNode = document.getElementById('dynamic-year');
    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }
});

const initThemeController = () => {
    const root = document.documentElement;
    const buttons = document.querySelectorAll('.theme-btn');
    const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const setTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('bas1c-theme', theme);
        
        buttons.forEach(btn => {
            if (btn.dataset.setTheme === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    };

    const currentTheme = localStorage.getItem('bas1c-theme') || 'system';
    setTheme(currentTheme);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.setTheme));
    });

    systemQuery.addEventListener('change', () => {
        if (root.getAttribute('data-theme') === 'system') {
            root.style.display = 'none';
            root.offsetHeight; 
            root.style.display = '';
        }
    });
};

initThemeController()
