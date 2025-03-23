document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) { // Check if elements exist
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.navbar-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', false);
            });
        });
    }

    // Update Footer Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Form Submission (Placeholder - Requires Server-Side Handling)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) { // Check if the form exists
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic form data (for demonstration - you'd usually send this to a server)
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            console.log('Form Data:', formData); // Log form data

            // Simulate form submission success (replace with actual AJAX/Fetch request)
            const formSuccess = document.getElementById('formSuccess');
            const formError = document.getElementById('formError');

            if (formSuccess && formError) { // Check if elements exist
                formSuccess.style.display = 'block';
                formError.style.display = 'none';
                                contactForm.reset();
            }
        });
    }
});
