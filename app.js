// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeContactForm();
    initializeScrollEffects();
    initializeSmoothScrolling();
    initializeCTAButtons();
});

// Initialize CTA buttons functionality
function initializeCTAButtons() {
    // Handle "Get a Free Consultation" button
    const consultationButtons = document.querySelectorAll('a[href*="mailto:contact@framesinmind.co.in"]:not([href*="subject="])');
    consultationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Scroll to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 64;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Pre-fill service field after scrolling
                setTimeout(() => {
                    const serviceSelect = document.getElementById('service');
                    if (serviceSelect) {
                        serviceSelect.value = 'General Inquiry';
                        serviceSelect.focus();
                    }
                }, 800);
            }
        });
    });

    // Handle "Request Service" buttons with specific services
    const serviceButtons = document.querySelectorAll('a[href*="mailto:contact@framesinmind.co.in"][href*="subject="]');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Extract service type from the mailto subject
            const href = this.getAttribute('href');
            let serviceType = 'General Inquiry';
            
            if (href.includes('Web%20Application%20Security') || href.includes('Web Application Security')) {
                serviceType = 'Web Application Security';
            } else if (href.includes('Endpoint%20Security') || href.includes('Endpoint Security')) {
                serviceType = 'Endpoint Security';
            } else if (href.includes('SOC') || href.includes('SIEM') || href.includes('SOAR')) {
                serviceType = 'SOC/SIEM/SOAR Consulting';
            }
            
            // Scroll to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 64;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Pre-fill service field after scrolling
                setTimeout(() => {
                    const serviceSelect = document.getElementById('service');
                    if (serviceSelect) {
                        serviceSelect.value = serviceType;
                        // Add visual feedback
                        serviceSelect.style.borderColor = 'var(--color-primary)';
                        setTimeout(() => {
                            serviceSelect.style.borderColor = '';
                        }, 2000);
                    }
                    
                    // Focus on name field
                    const nameField = document.getElementById('name');
                    if (nameField) {
                        nameField.focus();
                    }
                }, 800);
            }
            
            // Show notification
            setTimeout(() => {
                showNotification(`Ready to discuss ${serviceType}! Please fill out the form below.`, 'info');
            }, 1000);
        });
    });

    // Handle "View Services" button
    const viewServicesButtons = document.querySelectorAll('a[href="#services"]');
    viewServicesButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                const offsetTop = servicesSection.offsetTop - 64;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Update active navigation link based on scroll position
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPos = window.pageYOffset + 100; // Offset for fixed navbar

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Scroll effects
function initializeScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 64; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Handle form submission
function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Validate all fields
    if (!validateForm(form)) {
        showNotification('Please fix the errors in the form before submitting.', 'error');
        return;
    }

    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Prepare email content
    const name = formData.get('name');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');

    const subject = service ? `${service} Inquiry from ${name}` : `Contact Form Submission from ${name}`;
    const body = `Hello FramesInMind Team,

Name: ${name}
Email: ${email}
Service Interested In: ${service || 'General Inquiry'}

Message:
${message}

--
This message was sent from the FramesInMind website contact form.`;

    // Create mailto link
    const mailtoLink = `mailto:contact@framesinmind.co.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Simulate processing delay for better UX
    setTimeout(() => {
        try {
            // Open mailto link
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Email client opened! Please send the pre-filled message. We will respond within 24-48 hours.', 'success');
            
            // Reset form after successful submission
            form.reset();
            
        } catch (error) {
            console.error('Mailto error:', error);
            showNotification('Please copy this email address: contact@framesinmind.co.in', 'warning');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    }, 1500);
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Clear previous errors
    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(fieldName)} is required.`);
        return false;
    }

    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address.');
            return false;
        }
    }

    // Name validation
    if (fieldName === 'name' && value) {
        if (value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters long.');
            return false;
        }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            showFieldError(field, 'Please enter a valid name.');
            return false;
        }
    }

    // Message validation
    if (fieldName === 'message' && value) {
        if (value.length < 10) {
            showFieldError(field, 'Message must be at least 10 characters long.');
            return false;
        }
        if (value.length > 1000) {
            showFieldError(field, 'Message must be less than 1000 characters.');
            return false;
        }
    }

    return true;
}

// Get field label for error messages
function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Name',
        'email': 'Email',
        'service': 'Service',
        'message': 'Message'
    };
    return labels[fieldName] || fieldName;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    errorElement.style.display = 'block';
    
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: '10000',
        maxWidth: '400px',
        minWidth: '300px',
        padding: 'var(--space-16)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
        transform: 'translateX(100%)',
        transition: 'transform var(--duration-normal) var(--ease-standard)',
        fontSize: 'var(--font-size-sm)',
        lineHeight: 'var(--line-height-normal)'
    });

    // Add type-specific styling
    if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.backgroundColor = `rgba(var(--color-success-rgb), 0.1)`;
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.backgroundColor = `rgba(var(--color-error-rgb), 0.1)`;
    } else if (type === 'warning') {
        notification.style.borderColor = 'var(--color-warning)';
        notification.style.backgroundColor = `rgba(var(--color-warning-rgb), 0.1)`;
    }

    // Style the content
    const notificationContent = notification.querySelector('.notification-content');
    Object.assign(notificationContent.style, {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-12)'
    });

    // Style the icon
    const iconElement = notification.querySelector('.notification-icon');
    Object.assign(iconElement.style, {
        fontSize: '16px',
        flexShrink: '0'
    });

    // Style the message
    const messageElement = notification.querySelector('.notification-message');
    Object.assign(messageElement.style, {
        flex: '1'
    });

    // Style the close button
    const closeButton = notification.querySelector('.notification-close');
    Object.assign(closeButton.style, {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        color: 'var(--color-text-secondary)',
        padding: '0',
        lineHeight: '1',
        flexShrink: '0'
    });

    // Add to document
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });

    // Auto remove after 7 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 7000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || icons['info'];
}

// Remove notification
function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Intersection Observer for animations
function initializeAnimations() {
    if (!('IntersectionObserver' in window)) {
        return; // Skip if not supported
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe elements that should animate in
    document.querySelectorAll('.service-card, .portfolio-item, .card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize animations when page loads
window.addEventListener('load', initializeAnimations);

// Utility functions
function debounce(func, wait) {
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

// Add debounced scroll handler for performance
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add CSS for error states and animations
const style = document.createElement('style');
style.textContent = `
    .form-control.error {
        border-color: var(--color-error) !important;
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-close:hover {
        color: var(--color-text) !important;
        transform: scale(1.1);
    }
    
    .field-error {
        animation: slideInError 0.3s ease-out;
    }
    
    @keyframes slideInError {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Responsive design improvements */
    @media (max-width: 768px) {
        .notification {
            left: 20px !important;
            right: 20px !important;
            max-width: none !important;
            min-width: none !important;
        }
        
        .hero-buttons {
            flex-direction: column;
            align-items: center;
        }
        
        .hero-buttons .btn {
            width: 100%;
            max-width: 280px;
        }
    }
`;

document.head.appendChild(style);