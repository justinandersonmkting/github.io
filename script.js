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

    // Animate Stats Numbers on Hero Section
    function animateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const numberElement = card.querySelector('.stat-number');
            const targetNumber = parseInt(numberElement.textContent.replace('%', '').replace('$', '').replace('M', '000000')); // Remove % and $ and M for parsing
            const duration = 2000; // Updated animation duration in milliseconds
            let startTimestamp = null;

            function step(timestamp) {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                numberElement.textContent = formatStatNumber(Math.floor(progress * targetNumber), numberElement.textContent); // Format and update text
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            function formatStatNumber(number, originalText) {
                if (originalText.includes('%')) {
                    return number + '%';
                } else if (originalText.includes('$')) {
                    if (number >= 1000000) {
                        return '$' + (number / 1000000).toFixed(1) + 'M';
                    }
                    return '$' + number.toLocaleString(); // Updated dollar formatting with commas
                } else if (originalText.includes('+')) {
                    return number + '+';
                }
                return number.toString();
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(step);
                        observer.unobserve(card); // Animate only once
                    }
                });
            }, { threshold: 0.5 }); // Trigger when 50% of card is visible

            observer.observe(card);
        });
    }

    animateStats(); // Call animateStats function after DOMContentLoaded

});

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
