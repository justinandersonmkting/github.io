document.addEventListener('DOMContentLoaded', function () {
    // --- GSAP Plugin Registration ---
    gsap.registerPlugin(ScrollTrigger);
    // Optional: Register ScrollToPlugin if replacing native smooth scroll
    // gsap.registerPlugin(ScrollToPlugin);

    // --- Custom Cursor Logic ---
    const cursor = document.querySelector('.custom-cursor');
    // More robust selector for interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .flip-prompt, .close-btn, .flip-back-btn, input, textarea, [onclick]'
    );

    if (cursor) { // Check if cursor element exists
        let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (!isTouchDevice) {
            // Move cursor
            window.addEventListener('mousemove', e => {
                gsap.to(cursor, {
                    duration: 0.1, // Fast smoothing
                    x: e.clientX,
                    y: e.clientY,
                    ease: 'power2.out'
                });
            });

            // Handle hover effects (JS method for wider browser support)
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hover-effect'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hover-effect'));
            });

             // Hide cursor if mouse leaves the window
             document.addEventListener('mouseleave', () => {
                gsap.to(cursor, { duration: 0.2, autoAlpha: 0 }); // Use autoAlpha for opacity and visibility
            });
            document.addEventListener('mouseenter', () => {
                gsap.to(cursor, { duration: 0.2, autoAlpha: 1 });
            });

        } else {
             // On touch devices, remove the custom cursor element or hide it permanently
             cursor.style.display = 'none';
             document.body.style.cursor = 'auto'; // Restore default cursor
        }
    }


    // --- Mobile Navigation Toggle (Keep Existing) ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
     if (navToggle && navMenu) {
         navToggle.setAttribute('aria-expanded', 'false');
         navToggle.setAttribute('aria-controls', 'navMenu');
         navMenu.setAttribute('aria-hidden', 'true');

         navToggle.addEventListener('click', () => {
             const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
             navMenu.classList.toggle('active');
             navToggle.setAttribute('aria-expanded', !isExpanded);
             navMenu.setAttribute('aria-hidden', isExpanded);
             // Toggle icon class
             const icon = navToggle.querySelector('i');
             if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
             }
         });

         document.querySelectorAll('.navbar-menu a').forEach(link => {
             link.addEventListener('click', () => {
                 if (navMenu.classList.contains('active')) { // Only close if mobile menu is active
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.setAttribute('aria-hidden', 'true');
                     const icon = navToggle.querySelector('i');
                     if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                     }
                 }
             });
         });

         document.addEventListener('keydown', (e) => {
             if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                 navMenu.classList.remove('active');
                 navToggle.setAttribute('aria-expanded', 'false');
                 navMenu.setAttribute('aria-hidden', 'true');
                 const icon = navToggle.querySelector('i');
                 if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                 }
                 navToggle.focus();
             }
         });
     }


    // --- Update Footer Year (Keep Existing) ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Form Submission Handling (Keep Existing - relies on Netlify attribute in HTML) ---
    // The JS below provides client-side validation and simulation/feedback
    // It will run BEFORE Netlify processes the form if type="submit" is used.
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
         contactForm.addEventListener('submit', function (e) {
             // Keep simulation for local testing, but Netlify handles the actual submit
             // If you wanted purely Netlify feedback, you'd remove this or check env
             const isNetlify = contactForm.hasAttribute('netlify');
             if (!isNetlify) { // Only simulate if not Netlify
                e.preventDefault(); // Prevent default only if simulating
             }

             const formSuccess = document.getElementById('formSuccess');
             const formError = document.getElementById('formError');

             // Hide messages initially
             formSuccess.style.display = 'none';
             formError.style.display = 'none';

             // Basic client-side validation
             const name = document.getElementById('name').value.trim();
             const email = document.getElementById('email').value.trim();
             const subject = document.getElementById('subject').value.trim();
             const message = document.getElementById('message').value.trim();
             let isValid = true;

             if (!name || !email || !subject || !message) {
                 showFormMessage(formError, 'Please fill in all fields.');
                 isValid = false;
             } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                 showFormMessage(formError, 'Please enter a valid email address.');
                 isValid = false;
             }

             if (!isValid) {
                 e.preventDefault(); // Prevent submission if validation fails
                 return;
             }

             // If validation passes and it's NOT Netlify (simulation mode)
             if (!isNetlify) {
                 showLoadingState(contactForm, true);
                 setTimeout(() => {
                     showLoadingState(contactForm, false);
                     showFormMessage(formSuccess, 'Thank you! Your message has been sent (Simulated).');
                     contactForm.reset();
                 }, 1000);
             } else {
                 // If using Netlify, show loading state briefly, Netlify handles the rest
                 showLoadingState(contactForm, true);
                 // Optional: You might reset the loading state after a short delay
                 // or rely on Netlify's success page/redirect.
                 // setTimeout(() => showLoadingState(contactForm, false), 1500);
                 // Note: Netlify replaces the form with its success message by default,
                 // unless you use custom AJAX submission. This code assumes default Netlify behavior.
             }
         });
    }

    function showLoadingState(form, isLoading) {
         const submitButton = form.querySelector('button[type="submit"]');
         if (!submitButton) return;
         if (isLoading) {
             submitButton.disabled = true;
             submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
         } else {
             submitButton.disabled = false;
             submitButton.innerHTML = 'Send Message';
         }
    }

    function showFormMessage(element, message) {
         if (!element) return;
         element.textContent = message; // Set text content first
         element.style.display = 'block'; // Then display
         // Auto-hide after 5 seconds
         setTimeout(() => {
            element.style.display = 'none';
            element.textContent = ''; // Clear text content after hiding
        }, 5000);
    }


    // --- Smooth Scrolling for Anchor Links (Keep Existing) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) { // Ensure href exists and starts with #
                 e.preventDefault();
                 const targetId = href.substring(1);
                 const targetElement = document.getElementById(targetId);

                 if (targetElement) {
                     const header = document.querySelector('.header');
                     const headerHeight = header ? header.offsetHeight : 0;
                     // Calculate position slightly above the element top edge
                     const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20; // Increased offset

                     window.scrollTo({
                         top: targetPosition,
                         behavior: 'smooth',
                     });

                     // Optional: Close mobile menu if open after clicking a link
                     if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.setAttribute('aria-expanded', 'false');
                        navMenu.setAttribute('aria-hidden', 'true');
                        const icon = navToggle.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                     }
                 }
            }
        });
    });


    // --- Scrollspy (NEW - Intersection Observer) ---
    const sections = document.querySelectorAll('section.content-section[id]');
    const navLinks = document.querySelectorAll('.navbar-menu a');
    const navLinksMap = new Map(); // For faster lookups
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            navLinksMap.set(href.substring(1), link);
        }
    });

    const observerOptions = {
        root: null,
        // Adjust top margin: -(header height + desired offset)
        // Adjust bottom margin: controls when the *next* section triggers activation.
        // e.g., -40% means the link stays active until the section is 60% scrolled past the top.
        rootMargin: `-${(document.querySelector('.header')?.offsetHeight || 70) + 30}px 0px -40% 0px`,
        threshold: 0 // Trigger as soon as the boundary is crossed
    };

    const scrollspyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const correspondingNavLink = navLinksMap.get(id);

            if (correspondingNavLink) {
                if (entry.isIntersecting) {
                    // Remove active class from all links first
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to the intersecting one
                    correspondingNavLink.classList.add('active');
                }
                // Optional: Remove active class when element exits the rootMargin area completely
                // else {
                //    correspondingNavLink.classList.remove('active');
                // }
            }
        });
         // Fallback for when no section is 'active' (e.g., at the very top/bottom)
         // Check if *any* link has the active class after processing entries
         const anyActive = Array.from(navLinks).some(link => link.classList.contains('active'));
         if (!anyActive && window.scrollY < sections[0].offsetTop) {
             // If near the top before the first section, activate the first link (e.g., Home)
             const firstLink = navLinksMap.get(sections[0].getAttribute('id'));
             if (firstLink) firstLink.classList.add('active');
         }


    }, observerOptions);

    sections.forEach(section => {
        scrollspyObserver.observe(section);
    });


    // --- Animate Stats Numbers on Hero Section (Keep Existing - with data-target fix) ---
    function animateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
             const numberElement = card.querySelector('.stat-number');
             const targetAttr = numberElement.getAttribute('data-target');

             if (!targetAttr || !numberElement) return; // Skip if no target or element

             const targetText = numberElement.textContent; // Original text for formatting hints (e.g., $0, 0%)
             const targetNumber = parseInt(targetAttr.replace(/[^\d.-]/g, '')); // Parse digits, allow negative/decimal potentially

             if (isNaN(targetNumber)) return; // Skip if target is not a number

             const duration = 2000; // 2 seconds
             let startTimestamp = null;

             // Reset number to initial state (e.g., 0%, $0) using the formatting function
             numberElement.textContent = formatStatNumber(0, targetText, targetNumber);

             function step(timestamp) {
                 if (!startTimestamp) startTimestamp = timestamp;
                 const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                 let currentValue = Math.floor(progress * targetNumber);

                 // Ensure final value matches target exactly
                 if (progress === 1) {
                     currentValue = targetNumber;
                 }

                 numberElement.textContent = formatStatNumber(currentValue, targetText, targetNumber); // Format and update text

                 if (progress < 1) {
                     requestAnimationFrame(step);
                 }
             }

             function formatStatNumber(number, originalTextHint, targetNum) {
                 if (originalTextHint.includes('%')) {
                     return number + '%';
                 } else if (originalTextHint.includes('$')) {
                    // Check targetNum for large values to decide on 'M' formatting
                     if (targetNum >= 1000000) {
                         // Only show decimal if number is not perfectly divisible by 1M or is not 0
                         const millions = number / 1000000;
                         const decimalPlaces = (number % 1000000 !== 0 && number !== 0) ? 1 : 0;
                         return '$' + millions.toFixed(decimalPlaces) + 'M';
                     }
                     return '$' + number.toLocaleString(); // Add commas
                 } else if (originalTextHint.includes('+')) {
                     return number + '+';
                 }
                 return number.toString();
             }

             const statObserver = new IntersectionObserver((entries) => {
                 entries.forEach(entry => {
                     if (entry.isIntersecting) {
                         startTimestamp = null; // Reset timestamp for animation replay if needed (currently unobserves)
                         requestAnimationFrame(step);
                         statObserver.unobserve(card); // Animate only once
                     }
                 });
             }, { threshold: 0.4 }); // Trigger when 40% visible

             statObserver.observe(card);
        });
    }
    animateStats();


    // --- GSAP Scroll-Triggered Animations (NEW - Replaces AOS) ---
    // Helper function for simple fade-in-up animations
    const fadeInUp = (selector, triggerElement, delay = 0, stagger = 0) => {
        const elements = gsap.utils.toArray(selector);
        elements.forEach((element, i) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: triggerElement || element,
                    start: "top 88%", // Start animation slightly sooner
                    toggleActions: "play none none none",
                    // markers: true, // Uncomment for debugging trigger points
                },
                duration: 1,
                opacity: 0,
                y: 40,
                delay: delay + (i * stagger),
                ease: "power2.out"
            });
        });
    };
     // Helper function for simple slide-in animations
     const slideIn = (selector, triggerElement, fromDirection = 'left', delay = 0, stagger = 0) => {
        const elements = gsap.utils.toArray(selector);
        elements.forEach((element, i) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: triggerElement || element,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
                duration: 1.1,
                opacity: 0,
                x: fromDirection === 'left' ? -60 : 60,
                delay: delay + (i * stagger),
                ease: "power3.out"
            });
        });
    };


    // Apply Animations
    // Hero
    fadeInUp(".hero-title", ".hero", 0);
    fadeInUp(".hero-subtitle", ".hero", 0.15);
    fadeInUp(".hero-cta .btn", ".hero-cta", 0.3, 0.15); // Stagger buttons
    // Stats animation is handled by its own IntersectionObserver logic
    slideIn(".hero-image", ".hero", "right", 0.1); // Slide in from right


    // Section Titles (using the helper class)
    fadeInUp(".section-title.fade-in-up"); // Trigger is the element itself

    // About Content
    fadeInUp(".about-content", "#about");

    // Competencies
    fadeInUp(".competency-column", ".competencies-grid", 0, 0.1); // Stagger columns

    // Experience Cards
    slideIn(".experience-card-container", ".experience-container", "left", 0, 0.15); // Stagger cards

    // Skills Overview
    fadeInUp(".skills-overview", "#skills");
    fadeInUp(".skills-container .skill-category", ".skills-container", 0, 0.1); // Stagger categories

    // Additional Skills Tags
    fadeInUp(".tags-container .skill-tag", ".tags-container", 0, 0.03); // Stagger tags faster

    // Technical Skills Categories
    fadeInUp(".tech-skills-grid .tech-category", ".tech-skills-grid", 0, 0.1);

    // Portfolio
    fadeInUp(".portfolio-intro", "#portfolio");
    fadeInUp(".portfolio-item", ".portfolio-grid", 0, 0.15); // Stagger items

    // Services
    fadeInUp(".service-card", ".services-grid", 0, 0.1); // Stagger cards

    // Testimonials
    fadeInUp(".testimonial", ".testimonials-grid", 0, 0.15); // Stagger items

    // Contact
    fadeInUp(".contact-intro", "#contact");
    fadeInUp(".contact-options .contact-option", ".contact-options", 0, 0.1);
    fadeInUp(".contact-form-container", "#contact");


}); // End DOMContentLoaded


// Debounce Function (Keep available, though not actively used by core features now)
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
