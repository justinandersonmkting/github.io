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

    // --- Animate Stats Numbers on Hero Section ---
    function animateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const numberElement = card.querySelector('.stat-number');
            const targetAttr = numberElement.getAttribute('data-target');

            if (!targetAttr || !numberElement) {
                console.warn("Stat card missing number element or data-target attribute:", card);
                return; // Skip if no target or element
            }

            const formatHintText = numberElement.textContent; // e.g., "0%", "$0", "0+"
            const targetNumber = parseInt(targetAttr.replace(/[^\d.-]/g, '')); // Parse digits/decimal/negative

            if (isNaN(targetNumber)) {
                console.warn("Could not parse target number from data-target:", targetAttr, card);
                return; // Skip if target is not a number
            }

            const duration = 2000; // 2 seconds
            let startTimestamp = null;

            numberElement.textContent = formatStatNumber(0, formatHintText, targetNumber);

            function step(timestamp) {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                let currentValue = Math.floor(easedProgress * targetNumber);

                if (progress === 1) {
                    currentValue = targetNumber;
                }

                numberElement.textContent = formatStatNumber(currentValue, formatHintText, targetNumber);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            function formatStatNumber(number, hint, targetNum) {
                if (hint.includes('%')) {
                    return number + '%';
                } else if (hint.includes('$')) {
                    if (targetNum >= 1000000) {
                        const millions = number / 1000000;
                        const decimalPlaces = (number % 1000000 !== 0 && number !== 0) ? 1 : 0;
                        return '$' + millions.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimalPlaces }) + 'M';
                    }
                    return '$' + number.toLocaleString(); // Add commas
                } else if (hint.includes('+')) {
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
    
    // Call animation functions
    animateStats();
    
    // ----- EXPERTISE TIMELINE FUNCTIONALITY -----
    initExpertiseTimeline();
});

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Expertise Timeline Functionality
function initExpertiseTimeline() {
    // Timeline data based on your actual skills and experience
    const timelineData = [
        {
            id: 1,
            year: '2015-2016',
            title: 'Digital Marketing Foundations',
            description: 'Started career focusing on core marketing capabilities and content creation.',
            skills: [
                { name: 'SEO & Content Strategy', level: 75, description: 'Developed fundamental search optimization techniques and content strategies.' },
                { name: 'Copywriting & Storytelling', level: 80, description: 'Created compelling narratives and marketing copy for diverse audiences.' },
                { name: 'Social Media Marketing', level: 70, description: 'Managed brand presence across multiple social platforms.' }
            ]
        },
        {
            id: 2,
            year: '2017-2018',
            title: 'Marketing Technology Expansion',
            description: 'Enhanced technical capabilities and marketing platform expertise.',
            skills: [
                { name: 'Google Analytics & Tag Manager', level: 80, description: 'Implemented tracking solutions and performance monitoring.' },
                { name: 'WordPress & CMS Platforms', level: 75, description: 'Developed and maintained content management systems.' },
                { name: 'HTML & CSS', level: 70, description: 'Created and modified web content with custom styling.' }
            ]
        },
        {
            id: 3,
            year: '2019-2020',
            title: 'Analytics & Performance Focus',
            description: 'Specialized in data-driven marketing strategies and optimization.',
            skills: [
                { name: 'Data Analysis & Insights', level: 85, description: 'Extracted actionable intelligence from marketing performance data.' },
                { name: 'Performance Tracking', level: 80, description: 'Developed comprehensive tracking systems for marketing initiatives.' },
                { name: 'ROI Measurement', level: 75, description: 'Created frameworks for calculating marketing return on investment.' },
                { name: 'A/B Testing', level: 80, description: 'Implemented systematic testing to optimize marketing elements.' }
            ]
        },
        {
            id: 4,
            year: '2021-2022',
            title: 'Creative Strategy & Production',
            description: 'Led creative initiatives with enhanced production capabilities.',
            skills: [
                { name: 'Adobe Creative Suite', level: 85, description: 'Mastered design tools for creating professional marketing assets.' },
                { name: 'Video Production', level: 75, description: 'Developed video content from concept to final production.' },
                { name: 'Brand Development', level: 80, description: 'Created cohesive brand identities and guidelines.' },
                { name: 'Content Strategy', level: 85, description: 'Developed comprehensive content plans aligned with business goals.' }
            ]
        },
        {
            id: 5,
            year: '2023-Present',
            title: 'Integrated Marketing Leadership',
            description: 'Driving comprehensive marketing strategies with focus on automation and optimization.',
            skills: [
                { name: 'PPC & SEM Campaigns', level: 90, description: 'Managing sophisticated paid search and display campaigns.' },
                { name: 'Conversion Optimization', level: 85, description: 'Implementing data-driven strategies to maximize conversions.' },
                { name: 'Marketing Automation', level: 80, description: 'Developing automated workflows for marketing processes.' },
                { name: 'HubSpot & CRM Systems', level: 85, description: 'Utilizing customer relationship management platforms for marketing.' }
            ]
        }
    ];

    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    let expandedId = null;

    // Create timeline items - improved mobile-friendly version
    function createTimelineItems() {
        timeline.innerHTML = ''; // Clear existing items except timeline-line
        
        // Make sure the timeline line element exists
        let timelineLine = timeline.querySelector('.timeline-line');
        if (!timelineLine) {
            timelineLine = document.createElement('div');
            timelineLine.className = 'timeline-line';
            timeline.appendChild(timelineLine);
        }
        
        // Create a grid layout container for the timeline cards
        const timelineGrid = document.createElement('div');
        timelineGrid.className = 'timeline-grid';
        timeline.appendChild(timelineGrid);
        
        timelineData.sort((a, b) => a.id - b.id); // Sort by id to ensure correct order
        
        timelineData.forEach((item) => {
            // Create timeline card
            const card = document.createElement('div');
            card.className = 'timeline-card mobile-friendly';
            card.dataset.id = item.id;
            
            // Card content
            const cardContent = document.createElement('div');
            cardContent.className = 'timeline-card-content';
            
            cardContent.innerHTML = `
                <div class="timeline-header">
                    <h3 class="timeline-title">${item.title}</h3>
                    <span class="timeline-year">${item.year}</span>
                </div>
                <p class="timeline-description">${item.description}</p>
                
                <div class="skills-container-timeline">
                    ${item.skills.map(skill => `
                        <div class="skill-item-timeline">
                            <div class="skill-header">
                                <span class="skill-name-timeline">${skill.name}</span>
                                <span class="skill-level">${skill.level}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: 0%;" data-width="${skill.level}"></div>
                            </div>
                            <p class="skill-description">${skill.description}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="card-footer">
                    <span class="details-text">Click for details</span>
                    <div class="arrow-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            `;
            
            card.appendChild(cardContent);
            timelineGrid.appendChild(card);
            
            // Add click event
            card.addEventListener('click', () => toggleExpand(item.id));
        });
    }

    // Toggle expand/collapse
    function toggleExpand(id) {
        const allCards = document.querySelectorAll('.timeline-card');
        const clickedCard = document.querySelector(`.timeline-card[data-id="${id}"]`);
        const detailsText = clickedCard.querySelector('.details-text');
        
        // If clicking the already expanded card, collapse it
        if (expandedId === id) {
            clickedCard.classList.remove('expanded');
            detailsText.textContent = 'Click for details';
            expandedId = null;
        } else {
            // Collapse any expanded card
            if (expandedId !== null) {
                const expandedCard = document.querySelector(`.timeline-card[data-id="${expandedId}"]`);
                if (expandedCard) {
                    expandedCard.classList.remove('expanded');
                    expandedCard.querySelector('.details-text').textContent = 'Click for details';
                }
            }
            
            // Expand the clicked card
            clickedCard.classList.add('expanded');
            detailsText.textContent = 'Click to collapse';
            expandedId = id;
            
            // Animate skill bars
            setTimeout(() => {
                const progressBars = clickedCard.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const width = bar.dataset.width;
                    bar.style.width = `${width}%`;
                });
            }, 100);
        }
    }

    // Initialize Intersection Observer for animation on scroll
    function initIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // When a card comes into view, animate its appearance
                    const card = entry.target;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        }, options);
        
        // Observe all timeline cards
        document.querySelectorAll('.timeline-card').forEach(card => {
            // Set initial state for animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            observer.observe(card);
        });
    }

    // Create and initialize
    createTimelineItems();
    initIntersectionObserver();
}
