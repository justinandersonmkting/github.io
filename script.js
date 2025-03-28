document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        // Set initial ARIA attributes for accessibility
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'navMenu');
        navMenu.setAttribute('aria-hidden', 'true');

        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.setAttribute('aria-hidden', isExpanded);
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.navbar-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            });
        });

        // Add keyboard support for closing menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                navToggle.focus(); // Return focus to the toggle button
            }
        });
    }

    // Update Footer Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formSuccess = document.getElementById('formSuccess');
            const formError = document.getElementById('formError');

            // Basic client-side validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showFormMessage(formError, 'Please fill in all fields.');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showFormMessage(formError, 'Please enter a valid email address.');
                return;
            }

            showLoadingState(contactForm, true);

            // Simulate form submission success
            setTimeout(() => {
                showLoadingState(contactForm, false);
                showFormMessage(formSuccess, 'Thank you! Your message has been sent.');
                contactForm.reset();
            }, 1000);
        });
    }

    function showLoadingState(form, isLoading) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    }

    function showFormMessage(element, message) {
        element.style.display = 'block';
        element.textContent = message;
        setTimeout(() => element.style.display = 'none', 5000);
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition =
                    targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        });
    });

    // Highlight Active Section in Navigation
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-menu a');

        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.navbar-menu a[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    window.addEventListener(
        'scroll',
        debounce(highlightActiveSection, 100)
    );

  // --- Animate Stats Numbers on Hero Section (CORRECTED) ---
    function animateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const numberElement = card.querySelector('.stat-number');
            // *** FIX: Read from data-target attribute ***
            const targetAttr = numberElement.getAttribute('data-target');

            if (!targetAttr || !numberElement) {
                console.warn("Stat card missing number element or data-target attribute:", card);
                return; // Skip if no target or element
            }

            // Keep original text content ONLY as a hint for formatting
            const formatHintText = numberElement.textContent; // e.g., "0%", "$0", "0+"

            // *** FIX: Use targetAttr for parsing the target number ***
            const targetNumber = parseInt(targetAttr.replace(/[^\d.-]/g, '')); // Parse digits/decimal/negative

            if (isNaN(targetNumber)) {
               console.warn("Could not parse target number from data-target:", targetAttr, card);
               return; // Skip if target is not a number
            }

            const duration = 2000; // 2 seconds
            let startTimestamp = null;

            // Set initial display using format hint, animating from 0
            numberElement.textContent = formatStatNumber(0, formatHintText, targetNumber);

            function step(timestamp) {
                if (!startTimestamp) startTimestamp = timestamp;
                // Ensure progress doesn't exceed 1, especially on fast scrolls/intersections
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // Use easing function for smoother animation (e.g., easeOutQuad)
                const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                let currentValue = Math.floor(easedProgress * targetNumber);

                // Ensure final value matches target exactly on completion
                if (progress === 1) {
                    currentValue = targetNumber;
                }

                // *** FIX: Pass formatHintText for formatting guidance ***
                numberElement.textContent = formatStatNumber(currentValue, formatHintText, targetNumber);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            // Updated formatting function
            function formatStatNumber(number, hint, targetNum) {
                if (hint.includes('%')) {
                    return number + '%';
                } else if (hint.includes('$')) {
                    // Check targetNum for large values to decide on 'M' formatting
                    if (targetNum >= 1000000) {
                        const millions = number / 1000000;
                        // Show decimal only if not perfectly divisible by 1M (unless it's 0)
                        const decimalPlaces = (number % 1000000 !== 0 && number !== 0) ? 1 : 0;
                        // Ensure minimumFractionDigits prevents trailing ".0"
                        return '$' + millions.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimalPlaces }) + 'M';
                    }
                    return '$' + number.toLocaleString(); // Add commas
                } else if (hint.includes('+')) {
                     // Ensure '+' is only added when the number reaches the target
                     return (number === targetNum ? number + '+' : number.toLocaleString());
                }
                return number.toLocaleString(); // Default to locale string formatting
            }

            const statObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startTimestamp = null; // Reset timestamp
                        requestAnimationFrame(step);
                        statObserver.unobserve(card); // Animate only once
                    }
                });
            }, { threshold: 0.4 }); // Trigger when 40% visible

            statObserver.observe(card);
        });
    }
    animateStats(); // Call the corrected function

});

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
