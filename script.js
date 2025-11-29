// ============================================
// CASA VOV INSPIRACIÓN - FUNCIONALIDAD PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- INICIALIZACIÓN DE AOS (Animate On Scroll) ---
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-in-out',
        disable: () => window.innerWidth <= 768
    });

    // --- NAVEGACIÓN INTELIGENTE ---
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Cambiar estilo de nav al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.remove('nav-transparent');
            nav.classList.add('nav-solid');
        } else {
            nav.classList.add('nav-transparent');
            nav.classList.remove('nav-solid');
        }
    });

    // Intersection Observer para navegación activa
    const navObserverOptions = {
        threshold: 0.5,
        rootMargin: '-20% 0px -70% 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Smooth scrolling para los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- MENÚ MÓVIL MEJORADO ---
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        const mobileNavLinks = document.querySelectorAll('.nav-link');

        function toggleMenu() {
            navMenu.classList.toggle('nav-menu-active');
            mobileToggle.classList.toggle('toggle-active');

            // Bloquear scroll cuando el menú está abierto
            if (navMenu.classList.contains('nav-menu-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }

        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // CERRAR MENÚ AUTOMÁTICAMENTE AL DAR CLIC EN UN LINK
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('nav-menu-active')) {
                    toggleMenu();
                }
            });
        });

        // CERRAR MENÚ AL DAR CLIC FUERA
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('nav-menu-active') &&
                !navMenu.contains(e.target) &&
                !mobileToggle.contains(e.target)) {
                toggleMenu();
            }
        });
    }

    // --- ANIMACIÓN DEL ALA EN HERO CON GSAP ---
    if (typeof gsap !== 'undefined') {
        // Animación inicial del ala
        gsap.fromTo('.hero-wing',
            {
                x: -200,
                y: -100,
                rotation: 0,
                opacity: 0
            },
            {
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 0.4,
                duration: 2.5,
                ease: 'power3.out'
            }
        );

        // Animación flotante continua (solo vertical, sin rotación)
        gsap.to('.hero-wing', {
            y: '+=20',
            rotation: 0,
            duration: 3,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true
        });

        // Parallax suave en el scroll del hero (solo para contenido, no para el ala)
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = document.querySelector('.hero-content');
            const heroWing = document.querySelector('.hero-wing');

            if (heroContent) {
                gsap.to(heroContent, {
                    y: scrolled * 0.5,
                    opacity: 1 - (scrolled * 0.001),
                    duration: 0.5,
                    ease: 'power1.out'
                });
            }

            if (heroWing) {
                gsap.to(heroWing, {
                    y: scrolled * 0.3,
                    rotation: 0,
                    duration: 0.5,
                    ease: 'power1.out'
                });
            }
            // El ala ya no sigue el scroll - se mantiene en el centro con solo animación flotante
        });

        // --- ANIMACIÓN DE BOTELLAS 3D ---
        const productBottles = document.querySelectorAll('.product-bottle');

        productBottles.forEach((bottle) => {
            bottle.addEventListener('mouseenter', () => {
                gsap.to(bottle, {
                    rotationY: 360,
                    duration: 1.5,
                    ease: 'power2.inOut'
                });
            });

            bottle.addEventListener('mouseleave', () => {
                gsap.to(bottle, {
                    rotationY: 0,
                    duration: 1,
                    ease: 'power2.inOut'
                });
            });
        });

        // --- TIMELINE DE PREMIOS ANIMADO ---
        const awardItems = document.querySelectorAll('.award-item');

        awardItems.forEach((item, index) => {
            gsap.fromTo(item,
                {
                    opacity: 0,
                    x: index % 2 === 0 ? -100 : 100
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    // --- PARTÍCULAS FLOTANTES EN HERO ---
    function createParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;

        const particleCount = window.innerWidth <= 768 ? 20 : 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(212, 165, 116, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // --- BURBUJAS DE SABOR EN MEZCLADAS ---
    function createFlavorParticles() {
        const flavorParticles = document.querySelector('.flavor-particles');
        if (!flavorParticles) return;

        const colors = ['#6B46C1', '#FF8C42', '#8B6F47'];

        const bubbleCount = window.innerWidth <= 768 ? 14 : 30;

        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            bubble.className = 'flavor-bubble-particle';
            bubble.style.cssText = `
                position: absolute;
                width: ${Math.random() * 30 + 10}px;
                height: ${Math.random() * 30 + 10}px;
                background: ${color};
                opacity: ${Math.random() * 0.3 + 0.1};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatBubble ${Math.random() * 15 + 10}s infinite ease-in-out;
                animation-delay: ${Math.random() * 5}s;
            `;
            flavorParticles.appendChild(bubble);
        }
    }

    createFlavorParticles();

    // --- MODAL DE PRODUCTOS ---
    const modal = document.getElementById('productModal');
    const modalClose = document.querySelector('.modal-close');
    const detailButtons = document.querySelectorAll('.btn-detail');

    const productDetails = {
        natural: {
            title: 'Mezcal Natural',
            subtitle: '100% Agave Cupreata Ancestral',
            description: 'Proceso ancestral sin aditivos. La expresión más pura del agave con notas minerales y terrosas.',
            process: 'Cocción en horno cónico de piedra, fermentación natural en tinas de madera, destilación en alambique de cobre.',
            pairing: 'Perfecto para degustar solo, acompañado de sales tradicionales o frutas de temporada.',
            awards: 'Reconocido por su pureza y sabor auténtico',
            image: 'assets/bottles/main/bottle_natural.png'
        },
        joven: {
            title: 'Mezcal Joven',
            subtitle: '100% Agave Cupreata',
            description: 'Nuestro mezcal joven es la expresión más pura del agave cupreata. Sin añejamiento, conserva todos los sabores originales del agave cocido.',
            process: 'Cocción en horno cónico de piedra, fermentación natural en tinas de madera, doble destilación en alambique de cobre.',
            pairing: 'Ideal con cítricos, sal de gusano, o como base para cocteles premium.',
            awards: 'Medalla de Plata - Spirits Selection 2022',
            image: 'assets/bottles/main/bottle_joven.png'
        },
        premium: {
            title: 'Mezcal Premium',
            subtitle: '100% Agave Cupreata Seleccionado',
            description: 'Selección exclusiva de agaves de más de 10 años. Notas intensas y complejas con final sedoso.',
            process: 'Selección rigurosa de agaves maduros, fermentación prolongada y destilación cuidadosa para resaltar los perfiles más finos.',
            pairing: 'Maridaje excepcional con alta cocina mexicana y postres de chocolate amargo.',
            awards: 'La joya de la corona de Casa VOV',
            image: 'assets/bottles/main/bottle_premium.png'
        },
        reposado: {
            title: 'Mezcal Reposado',
            subtitle: '100% Agave Cupreata',
            description: 'Reposado durante 6 meses en barricas de roble blanco, adquiere notas suaves de vainilla y caramelo sin perder el carácter del agave.',
            process: 'Mismo proceso artesanal que el joven, más reposo en barricas seleccionadas que anteriormente contuvieron whisky.',
            pairing: 'Excelente con chocolate oscuro, frutos secos, o solo con hielo.',
            awards: 'Nuestro mezcal más premiado internacionalmente',
            image: 'assets/bottles/main/bottle_reposado.png'
        },
        anejo: {
            title: 'Mezcal Añejo',
            subtitle: '100% Agave Cupreata',
            description: 'Añejado por más de un año en barricas de roble, desarrolla una complejidad única con notas de chocolate, tabaco y especias.',
            process: 'Selección especial de agaves de más de 10 años, proceso tradicional y añejamiento extendido.',
            pairing: 'Perfecto con carnes rojas, quesos maduros o como digestivo.',
            awards: 'Edición limitada para conocedores',
            image: 'assets/bottles/main/bottle_anejo.png'
        }
    };

    // Event Delegation para botones de detalle (funciona con elementos clonados por el carrusel)
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-discover');
        if (button) {
            const product = button.dataset.product;
            const details = productDetails[product];

            if (details && modal) {
                const modalBody = modal.querySelector('.modal-body');
                modalBody.innerHTML = `
                    <div class="modal-grid">
                        <div class="modal-image-col">
                            <div class="modal-image-wrapper">
                                <img src="${details.image}" alt="${details.title}" class="modal-bottle-img">
                                <div class="modal-glow"></div>
                            </div>
                        </div>
                        <div class="modal-content-col">
                            <h2 class="modal-title">${details.title}</h2>
                            <h3 class="modal-subtitle">${details.subtitle}</h3>
                            <div class="modal-divider"></div>
                            <p class="modal-description">${details.description}</p>
                            
                            <div class="modal-specs">
                                <div class="modal-spec-item">
                                    <h4>Proceso</h4>
                                    <p>${details.process}</p>
                                </div>
                                <div class="modal-spec-item">
                                    <h4>Maridaje</h4>
                                    <p>${details.pairing}</p>
                                </div>
                                <div class="modal-spec-item">
                                    <h4>Reconocimientos</h4>
                                    <p>${details.awards}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- SECCIÓN DE RECETAS ---
    const recipesModal = document.getElementById('recipesModal');
    const recipesClose = document.querySelector('.recipes-close');
    const recipesBtn = document.querySelector('.flavored-cta .btn-secondary');

    const recipes = [
        {
            title: 'Mezcal Spritz de Arándano',
            image: 'assets/bottles/flavored/bottle_arandano.png',
            ingredients: [
                '60ml Mezcal de Arándano',
                '30ml Prosecco o Vino Espumoso',
                'Agua mineral',
                'Hielo',
                'Arándanos frescos y romero'
            ],
            steps: [
                'Llenar una copa de vino con mucho hielo.',
                'Agregar el Mezcal de Arándano.',
                'Añadir el Prosecco y completar con un top de agua mineral.',
                'Decorar con arándanos frescos y una ramita de romero.'
            ]
        },
        {
            title: 'Mango Mezcal Margarita',
            image: 'assets/bottles/flavored/bottle_mango.png',
            ingredients: [
                '60ml Mezcal de Mango',
                '30ml Jugo de limón fresco',
                '15ml Néctar de agave',
                'Sal de gusano para escarchar',
                'Rodaja de mango deshidratado'
            ],
            steps: [
                'Escarchar un vaso old fashioned con sal de gusano.',
                'En un shaker con hielo, mezclar el mezcal, limón y agave.',
                'Agitar vigorosamente por 15 segundos.',
                'Servir sobre hielo fresco y decorar con el mango.'
            ]
        },
        {
            title: 'Mezcalindo Picante',
            image: 'assets/bottles/flavored/bottle_tamarindo.png',
            ingredients: [
                '60ml Mezcal de Tamarindo',
                'Top de refresco de toronja',
                'Jugo de media naranja',
                'Chile en polvo (Tajín)',
                'Rodaja de toronja'
            ],
            steps: [
                'Escarchar un vaso alto con chile en polvo.',
                'Agregar hielo y el Mezcal de Tamarindo.',
                'Exprimir el jugo de naranja y completar con refresco de toronja.',
                'Revolver suavemente y decorar con la rodaja de toronja.'
            ]
        }
    ];

    if (recipesBtn && recipesModal) {
        recipesBtn.addEventListener('click', () => {
            const recipesGrid = recipesModal.querySelector('.recipes-grid');
            recipesGrid.innerHTML = recipes.map(recipe => `
                <div class="recipe-card">
                    <div class="recipe-image">
                        <img src="${recipe.image}" alt="${recipe.title}">
                    </div>
                    <div class="recipe-content">
                        <h3>${recipe.title}</h3>
                        <div class="recipe-section">
                            <h4>Ingredientes</h4>
                            <ul>
                                ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="recipe-section">
                            <h4>Preparación</h4>
                            <ol>
                                ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                        </div>
                    </div>
                </div>
            `).join('');

            recipesModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        if (recipesClose) {
            recipesClose.addEventListener('click', () => {
                recipesModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === recipesModal) {
                recipesModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // --- FORMULARIO DE CONTACTO ---
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Animación del botón
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Enviando...</span> <svg class="btn-wing" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 8px;"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
            submitBtn.disabled = true;

            // Simulación de envío (aquí conectarías con tu backend)
            setTimeout(() => {
                submitBtn.innerHTML = '<span>¡Mensaje enviado!</span> <svg class="btn-wing" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 8px;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
                submitBtn.style.background = '#4CAF50';

                // Reset del formulario
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 2000);
            }, 1500);
        });
    }

    // --- EFECTO PARALLAX PARA SECCIÓN PUERTO ---
    const puertoSection = document.getElementById('puerto-lazaro');

    if (puertoSection) {
        const videoWrapper = puertoSection.querySelector('.video-bg-wrapper');
        const videoFrame = puertoSection.querySelector('.video-bg-iframe');

        const updateParallax = () => {
            if (!videoWrapper) return;
            const rect = puertoSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (rect.bottom <= 0 || rect.top >= viewportHeight) {
                videoWrapper.style.transform = 'translateY(0)';
                return;
            }

            const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
            const translate = (progress - 0.5) * 60;
            videoWrapper.style.transform = `translateY(${translate}px)`;
        };

        let puertoParallaxTicking = false;
        const handleScroll = () => {
            if (!puertoParallaxTicking) {
                puertoParallaxTicking = true;
                requestAnimationFrame(() => {
                    updateParallax();
                    puertoParallaxTicking = false;
                });
            }
        };

        updateParallax();
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Slider de relatos
        const slides = Array.from(puertoSection.querySelectorAll('.paralelismo-slide'));
        const dots = Array.from(puertoSection.querySelectorAll('.puerto-dot'));
        const prevBtn = puertoSection.querySelector('.puerto-prev');
        const nextBtn = puertoSection.querySelector('.puerto-next');
        const slidesContainer = puertoSection.querySelector('.paralelismo-slides');
        let currentSlide = 0;

        const updateNavState = () => {
            if (prevBtn) prevBtn.disabled = currentSlide === 0;
            if (nextBtn) nextBtn.disabled = currentSlide === slides.length - 1;
        };

        const showSlide = (index) => {
            if (!slides.length) return;
            if (index < 0 || index >= slides.length) return;
            currentSlide = index;
            slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
            updateNavState();
        };

        if (slides.length) {
            showSlide(0);
        }

        prevBtn?.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn?.addEventListener('click', () => showSlide(currentSlide + 1));

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        let touchStartX = 0;
        slidesContainer?.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        slidesContainer?.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) {
                showSlide(currentSlide + 1);
            } else if (touchEndX - touchStartX > 50) {
                showSlide(currentSlide - 1);
            }
        }, { passive: true });

        // Control de video
        if (videoFrame && typeof Vimeo !== 'undefined') {
            const player = new Vimeo.Player(videoFrame);

            player.ready().then(() => {
                player.setMuted(true).catch(() => { });
                player.setLoop(true).catch(() => { });
                player.play().catch(() => { });
            });

            const setPlayingState = (isPlaying) => {
                if (videoWrapper) {
                    videoWrapper.classList.toggle('playing', isPlaying);
                }
            };

            if ('IntersectionObserver' in window) {
                const intersectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            player.play().catch(() => { });
                        } else {
                            player.pause().catch(() => { });
                        }
                    });
                }, { threshold: 0.35 });

                intersectionObserver.observe(puertoSection);
            }

            player.on('play', () => setPlayingState(true));
            const markPaused = () => setPlayingState(false);
            player.on('pause', markPaused);
            player.on('ended', markPaused);
        }
    }

    // --- ANIMACIÓN DE NÚMEROS/ESTADÍSTICAS ---
    function animateNumbers() {
        const numbers = document.querySelectorAll('[data-number]');

        numbers.forEach(number => {
            const target = parseInt(number.dataset.number);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    number.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    number.textContent = target;
                }
            };

            // Iniciar animación cuando sea visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateNumber();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(number);
        });
    }

    animateNumbers();

    // --- LAZY LOADING DE IMÁGENES ---
    const lazyImages = document.querySelectorAll('img[data-lazy]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.lazy;
                    img.removeAttribute('data-lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // --- EFECTOS DE HOVER PERSONALIZADOS ---
    const hoverElements = document.querySelectorAll('.flavor-card, .product-card, .award-item');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(212, 165, 116, 0.3);
                border-radius: 50%;
                pointer-events: none;
                width: 0;
                height: 0;
                left: ${x}px;
                top: ${y}px;
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s, opacity 0.6s;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.style.width = '200px';
                ripple.style.height = '200px';
                ripple.style.opacity = '0';
            }, 10);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // --- CONTROL DE VIDEO DE VIMEO ---

    // --- PRECARGA DE IMÁGENES CRÍTICAS ---
    function preloadImages() {
        const criticalImages = [
            'assets/logos/logo_wing.svg',
            'assets/logos/logo_complete.svg',
            'assets/bottles/main/bottle_joven.png',
            'assets/bottles/main/bottle_reposado.png',
            'assets/bottles/main/bottle_anejo.png'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    preloadImages();

    // --- ANIMACIÓN DE TEXTO TYPING ---
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // Aplicar efecto typing al tagline del hero cuando sea visible
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) {
        const originalText = heroTagline.textContent;
        heroTagline.textContent = '';

        setTimeout(() => {
            typeWriter(heroTagline, originalText, 80);
        }, 1000);
    }

    // --- SMOOTH REVEAL PARA ELEMENTOS ---
    const revealElements = document.querySelectorAll('.story-chapter, .flavor-card, .premium-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        revealObserver.observe(element);
    });

    // --- EASTER EGG: KONAMI CODE ---
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateKonami();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateKonami() {
        alert('¡Modo Fiesta Activado! 🎉');
        document.body.style.animation = 'rainbow 5s infinite';

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // --- CERRAR MENÚ FLOTANTE ---
    document.addEventListener('click', function (e) {
        const container = document.querySelector('.whatsapp-item-container');
        if (container && !container.contains(e.target)) {
            container.classList.remove('active');
        }
    });




    // --- PERFORMANCE: THROTTLE SCROLL EVENTS ---
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Aplicar throttle a eventos de scroll pesados
    const throttledScroll = throttle(() => {
        // Funciones de scroll aquí
    }, 100);

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // --- INICIALIZACIÓN COMPLETA ---
    console.log('✨ Casa VOV Inspiración - Sitio web cargado correctamente');
    console.log('📍 Etúcuaro, Michoacán - Donde la tierra toma vuelo');

});

// --- ESTILOS CSS PARA PARTÍCULAS (Agregar al CSS) ---
const particleStyles = `
@keyframes float {
    0 %, 100 % {
        transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
    }
    10 %, 90 % {
        opacity: 1;
    }
    25 % {
        transform: translateY(-100px) translateX(20px) rotate(90deg);
    }
    50 % {
        transform: translateY(-200px) translateX(- 20px) rotate(180deg);
}
75 % {
    transform: translateY(-100px) translateX(30px) rotate(270deg);
}
    }

@keyframes floatBubble {
    0 %, 100 % {
        transform: translateY(0) translateX(0) scale(1);
    }
    25 % {
        transform: translateY(-30px) translateX(30px) scale(1.1);
    }
    50 % {
        transform: translateY(20px) translateX(- 30px) scale(0.9);
}
75 % {
    transform: translateY(-40px) translateX(- 20px) scale(1.05);
        }
    }
    
    .modal - section {
    margin - top: 1.5rem;
    padding - top: 1.5rem;
    border - top: 1px solid #eee;
}
    
    .modal - section h4 {
    color: var(--color - oro - viejo);
    margin - bottom: 0.5rem;
    font - family: var(--font - principal);
}
`;

// Inyectar estilos adicionales si es necesario
const styleSheet = document.createElement('style');
styleSheet.textContent = particleStyles;
document.head.appendChild(styleSheet);
// === FUNCIONALIDAD ADICIONAL MÓVIL ===
// El menú móvil ya está manejado en el primer DOMContentLoaded (líneas 71-112)

// Sección Puerto collapsible en móvil
if (window.innerWidth <= 768) {
    const puertoSection = document.querySelector('#puerto-lazaro');
    if (puertoSection) {
        const storyGrid = puertoSection.querySelector('.story-grid');
        if (storyGrid) {
            // Crear botón expandir
            const expandBtn = document.createElement('button');
            expandBtn.className = 'expand-btn';
            expandBtn.textContent = 'Ver más detalles';

            storyGrid.parentElement.insertBefore(expandBtn, storyGrid);

            expandBtn.addEventListener('click', () => {
                storyGrid.classList.toggle('expanded');
                expandBtn.textContent = storyGrid.classList.contains('expanded')
                    ? 'Ver menos'
                    : 'Ver más detalles';
            });
        }
    }
}

// Cambio de idioma
const langButtons = document.querySelectorAll('.lang-btn');
const translatableElements = document.querySelectorAll('[data-es][data-en]');

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;

        // Cambiar clase activa
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Traducir elementos
        translatableElements.forEach(el => {
            if (el.placeholder !== undefined) {
                el.placeholder = el.dataset[lang];
            } else if (el.tagName === 'OPTION') {
                el.textContent = el.dataset[lang];
            } else {
                el.textContent = el.dataset[lang];
            }
        });
    });
});

// Centrar botellas en móvil
function centerBottles() {
    if (window.innerWidth <= 768) {
        const bottles = document.querySelectorAll('.product-bottle, .flavor-image img');
        bottles.forEach(bottle => {
            bottle.style.margin = '0 auto';
            bottle.style.display = 'block';
        });
    }
}

window.addEventListener('resize', centerBottles);
centerBottles();

// Arreglar imagen añejo chueca
const anejoBottle = document.querySelector('[alt="Mezcal Añejo"]');
if (anejoBottle) {
    anejoBottle.style.transform = 'rotate(0deg)';
}
// Mostrar popup al cargar la página
window.addEventListener('load', () => {
    const hasSelectedCountry = localStorage.getItem('countrySelected');
    if (!hasSelectedCountry) {
        document.getElementById('countrySelector').classList.add('show');
    }
});

// Función para seleccionar país (Global)
window.selectCountry = function (country) {
    localStorage.setItem('countrySelected', country);
    const selector = document.getElementById('countrySelector');
    if (selector) {
        selector.classList.remove('show');
    }

    // Cambiar idioma si es USA
    if (country === 'us') {
        // Activar traducción al inglés
        const langBtn = document.querySelector('[data-lang="en"]');
        if (langBtn) langBtn.click();
    }
};
// --- FASE 2: INICIALIZACIÓN DE CARRUSELES (MÓVIL) ---

let elevacionSlider; // Declaramos la variable fuera
const breakpoint = window.matchMedia('(max-width: 768px)'); // Definimos el punto de quiebre

const initializeElevacionSlider = () => {
    if (breakpoint.matches === true) { // Si estamos en móvil
        if (elevacionSlider === undefined) { // Y el slider no existe, lo creamos
            elevacionSlider = new Swiper('.product-slider-main', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.product-arrow-next',
                    prevEl: '.product-arrow-prev',
                },
            });
        }
    } else { // Si estamos en escritorio
        if (elevacionSlider !== undefined) { // Y el slider SÍ existe, lo destruimos
            elevacionSlider.destroy(true, true);
            elevacionSlider = undefined; // Lo reiniciamos
        }
    }
};

// Ejecutamos la función al cargar la página
initializeElevacionSlider();

// Y volvemos a ejecutarla CADA VEZ que el tamaño de la ventana cambie
window.addEventListener('resize', initializeElevacionSlider);



// ========== CAROUSEL DE PRODUCTOS ==========
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.product-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;

    function showSlide(index) {
        // Remover clases activas
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        indicators.forEach(ind => ind.classList.remove('active'));

        // Activar slide actual
        slides[index].classList.add('active');
        indicators[index].classList.add('active');

        // Marcar slides anteriores
        for (let i = 0; i < index; i++) {
            slides[i].classList.add('prev');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Event listeners
    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);

    // Indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-play (opcional)
    setInterval(nextSlide, 8000);

    // Swipe para móvil
    let startX = 0;
    let endX = 0;

    const carousel = document.querySelector('.products-carousel');

    carousel?.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carousel?.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) nextSlide();
        if (endX - startX > 50) prevSlide();
    });
});

// ========== FLAVORED CAROUSEL ==========
document.addEventListener('DOMContentLoaded', function () {
    const flavorSlides = document.querySelectorAll('.flavor-slide');
    const flavorIndicators = document.querySelectorAll('.flavor-indicator');
    const flavorPrevBtn = document.getElementById('flavorPrevBtn');
    const flavorNextBtn = document.getElementById('flavorNextBtn');
    let currentFlavorSlide = 0;

    if (flavorSlides.length === 0) return; // Exit if no slides found

    function showFlavorSlide(index) {
        // Remover clases activas
        flavorSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        flavorIndicators.forEach(ind => ind.classList.remove('active'));

        // Activar slide actual
        if (flavorSlides[index]) {
            flavorSlides[index].classList.add('active');
        }
        if (flavorIndicators[index]) {
            flavorIndicators[index].classList.add('active');
        }
    }

    function nextFlavorSlide() {
        currentFlavorSlide = (currentFlavorSlide + 1) % flavorSlides.length;
        showFlavorSlide(currentFlavorSlide);
    }

    function prevFlavorSlide() {
        currentFlavorSlide = (currentFlavorSlide - 1 + flavorSlides.length) % flavorSlides.length;
        showFlavorSlide(currentFlavorSlide);
    }

    // Event listeners
    flavorNextBtn?.addEventListener('click', nextFlavorSlide);
    flavorPrevBtn?.addEventListener('click', prevFlavorSlide);

    // Indicadores
    flavorIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentFlavorSlide = index;
            showFlavorSlide(currentFlavorSlide);
        });
    });

    // Swipe para móvil
    let flavorStartX = 0;
    let flavorEndX = 0;

    const flavorCarousel = document.querySelector('.flavored-carousel');

    flavorCarousel?.addEventListener('touchstart', (e) => {
        flavorStartX = e.touches[0].clientX;
    });

    flavorCarousel?.addEventListener('touchend', (e) => {
        flavorEndX = e.changedTouches[0].clientX;
        if (flavorStartX - flavorEndX > 50) nextFlavorSlide();
        if (flavorEndX - flavorStartX > 50) prevFlavorSlide();
    });
});

// ========== PARALLAX MEJORADO ==========
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // Efecto parallax en alas de fondo
    document.querySelectorAll('.wing-background').forEach(wing => {
        const speed = 0.5;
        wing.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
    });
});
// ============================================
// LA CONSAGRACIÓN - SCROLL ANIMATIONS
// Add this code to your script.js file
// ============================================

// Function to animate awards on scroll
function initAwardsAnimation() {
    const awardsTimeline = document.querySelector('.awards-timeline');
    const awardItems = document.querySelectorAll('.award-item');

    if (!awardsTimeline || awardItems.length === 0) return;

    // Configuration for Intersection Observer
    const observerOptions = {
        root: null, // viewport
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before element fully enters viewport
    };

    // Callback function when elements intersect
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animation
                entry.target.classList.add('award-visible');

                // Optional: Stop observing after animation (performance optimization)
                // Comment out the line below if you want animations to repeat
                observer.unobserve(entry.target);
            }
        });
    };

    // Create the observer
    const awardObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all award items
    awardItems.forEach(item => {
        awardObserver.observe(item);
    });

    // Animate timeline line
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-animated');
            }
        });
    }, {
        threshold: 0.2
    });

    timelineObserver.observe(awardsTimeline);
}

// Alternative: Scroll-based progressive reveal (more advanced)
function initProgressiveAwardsReveal() {
    const awardsSection = document.querySelector('.awards-section');
    const awardsTimeline = document.querySelector('.awards-timeline');
    const awardItems = document.querySelectorAll('.award-item');

    if (!awardsSection || awardItems.length === 0) return;

    let hasAnimated = false;

    // Check on scroll
    const checkAwardsScroll = () => {
        if (hasAnimated) return; // Only animate once

        const sectionTop = awardsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // When section is 30% into viewport
        if (sectionTop < windowHeight * 0.7) {
            // Animate timeline
            if (awardsTimeline) {
                awardsTimeline.classList.add('timeline-animated');
            }

            // Animate awards sequentially
            awardItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('award-visible');
                }, index * 200); // 200ms delay between each award
            });

            hasAnimated = true;
            // Remove listener after animation
            window.removeEventListener('scroll', checkAwardsScroll);
        }
    };

    // Initial check
    checkAwardsScroll();

    // Check on scroll
    window.addEventListener('scroll', checkAwardsScroll, { passive: true });
}

// GSAP version (if you want smoother animations with GSAP)
function initAwardsGSAP() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Using standard animations.');
        return;
    }

    const awardItems = document.querySelectorAll('.award-item');

    // ScrollTrigger for each award
    awardItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'top 20%',
                toggleActions: 'play none none none',
                // markers: true, // Uncomment for debugging
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.15
        });

        // Animate year badge
        const yearBadge = item.querySelector('.award-year');
        if (yearBadge) {
            gsap.from(yearBadge, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                },
                scale: 0,
                rotation: 180,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: (index * 0.15) + 0.2
            });
        }
    });

    // Animate timeline
    const timeline = document.querySelector('.awards-timeline');
    if (timeline) {
        gsap.from(timeline, {
            scrollTrigger: {
                trigger: timeline,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1,
            },
            '--timeline-height': '0%'
        });
    }
}

// Mobile-specific enhancements
function initMobileAwardsOptimization() {
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) return;

    const awardItems = document.querySelectorAll('.award-item');

    // Simpler, more performant animations for mobile
    const mobileObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('award-visible');
                // Unobserve immediately for performance
                mobileObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Lower threshold for mobile
        rootMargin: '0px'
    });

    awardItems.forEach(item => {
        mobileObserver.observe(item);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {

    // Choose ONE of these methods:

    // METHOD 1: Simple Intersection Observer (Recommended - works best)
    initAwardsAnimation();

    // METHOD 2: Progressive reveal with scroll
    // initProgressiveAwardsReveal();

    // METHOD 3: GSAP version (if GSAP is loaded and you want more control)
    // Make sure to load GSAP ScrollTrigger plugin first:
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    // initAwardsGSAP();

    // Mobile optimizations (works with any method above)
    initMobileAwardsOptimization();
});

// Re-check on window resize (for responsive behavior)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize if needed
        const awardItems = document.querySelectorAll('.award-item');
        awardItems.forEach(item => {
            if (!item.classList.contains('award-visible')) {
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    item.classList.add('award-visible');
                }
            }
        });
    }, 250);
});

// Inicialización del Popup de País
document.addEventListener('DOMContentLoaded', () => {
    const countrySelector = document.getElementById('countrySelector');
    if (countrySelector && !localStorage.getItem('countrySelected')) {
        setTimeout(() => {
            countrySelector.classList.add('show');
        }, 500);
    }
});