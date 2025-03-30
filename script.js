document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            // Optional: Toggle ARIA attribute for accessibility
            const isExpanded = navbarMenu.classList.contains('active');
            navbarToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Optional: Close menu when a link is clicked (good for SPAs or hash links)
        navbarMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                    navbarToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- Experience Card Flip ---
    const experienceCardContainers = document.querySelectorAll('.experience-card-container');

    experienceCardContainers.forEach(container => {
        const cardInner = container.querySelector('.experience-card-inner');
        const frontFaceTrigger = container.querySelector('.card-front'); // Trigger flip by clicking front
        const closeBtn = container.querySelector('.close-btn');

        if (cardInner && frontFaceTrigger && closeBtn) {
            // Flip to back
            frontFaceTrigger.addEventListener('click', (e) => {
                // Prevent flipping if the click was on an interactive element within the front face (if any)
                // Example: if (e.target.closest('a, button')) return;
                container.classList.add('is-flipped');
            });

            // Flip back to front using the close button
            closeBtn.addEventListener('click', () => {
                container.classList.remove('is-flipped');
            });
        } else {
            console.warn('Flip card elements not found in one of the containers:', container);
        }
    });

    // --- Optional: Simple Scroll Animations (Add 'animate-on-scroll' class to elements in HTML) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });

        // You'll need corresponding CSS like this:
        /*
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .animate-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
        */
    }


    // --- Basic Contact Form Handling Placeholder ---
    const contactForm = document.querySelector('.contact-form');
    const formMessage = document.querySelector('.form-message'); // General message area

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default browser submission

            // Hide previous messages
            formMessage.style.display = 'none';
            formMessage.textContent = '';
            formMessage.classList.remove('success', 'error');

            // --- Form Data ---
            const formData = new FormData(contactForm);

            // --- Basic Validation Example (Optional) ---
            const name = formData.get('name'); // Assuming input name="name"
            const email = formData.get('email'); // Assuming input name="email"
            const message = formData.get('message'); // Assuming textarea name="message"

            if (!name || !email || !message) {
                formMessage.textContent = 'Please fill out all required fields.';
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
                return; // Stop submission
            }

            // --- AJAX Submission Placeholder ---
            console.log("Form submitted! Data:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            // Replace console logs with actual fetch() call to your backend endpoint
            /*
            fetch('/your-backend-endpoint', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json()) // Or response.text() depending on backend
            .then(data => {
                console.log('Success:', data);
                formMessage.textContent = 'Thank you! Your message has been sent.';
                formMessage.classList.add('success');
                formMessage.style.display = 'block';
                contactForm.reset(); // Clear the form
            })
            .catch((error) => {
                console.error('Error:', error);
                formMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
            });
            */

            // --- Simulate success for demonstration ---
            setTimeout(() => {
                 formMessage.textContent = 'Thank you! Your message has been sent (Simulated).';
                 formMessage.classList.add('success');
                 formMessage.style.display = 'block';
                 contactForm.reset(); // Clear the form
            }, 1000);
            // --- End Simulation ---

        });
    }

}); // End DOMContentLoaded