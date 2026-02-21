document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add a slight delay to the outline for a smooth trailing effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects for the cursor
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .service-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });

    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navItems = document.querySelectorAll('.nav-links li a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Scroll Animations (Reveal on Scroll) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .fade-up');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Uncomment to animate only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Hero Text Animation ---
    const heroTitle = document.querySelector('.reveal-text');
    if (heroTitle) {
        // Simple GSAP-like entrance
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }

    // --- Counter Animation ---
    const stats = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                stats.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCounter();
                });
                hasAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) statsObserver.observe(heroSection);

    // --- 3D Tilt Effect on Service Cards ---
    const tiltCards = document.querySelectorAll('.hover-tilt');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            // Add transition for smooth return
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        card.addEventListener('mouseenter', () => {
            // Remove transition while moving so it responds instantly to mouse
            card.style.transition = 'none';
        });
    });

    // --- Contact Form Submission (Formspree via AJAX) ---
    const form = document.getElementById('contactForm');
    const statusDiv = document.querySelector('.form-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            const data = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    form.reset();

                    statusDiv.innerText = 'Message sent successfully! We will be in touch soon.';
                    statusDiv.style.color = 'var(--accent-color)';
                    statusDiv.style.marginTop = '15px';
                    statusDiv.style.fontWeight = '500';

                    setTimeout(() => {
                        statusDiv.innerText = '';
                    }, 5000);
                } else {
                    throw new Error('Form submission failed.');
                }
            } catch (error) {
                btn.innerText = originalText;
                btn.disabled = false;

                statusDiv.innerText = 'Oops! There was a problem submitting your form.';
                statusDiv.style.color = 'red';
                statusDiv.style.marginTop = '15px';
                statusDiv.style.fontWeight = '500';

                setTimeout(() => {
                    statusDiv.innerText = '';
                }, 5000);
            }
        });
    }

});
