/*  
   TYPING EFFECT
     */

class TypingEffect {
    constructor(element, texts, speed = 100, deleteSpeed = 50, delayBetweenTexts = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.delayBetweenTexts = delayBetweenTexts;
        this.index = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.index];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
            
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.index = (this.index + 1) % this.texts.length;
                setTimeout(() => this.type(), this.delayBetweenTexts / 2);
            } else {
                setTimeout(() => this.type(), this.deleteSpeed);
            }
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
            
            if (this.charIndex === currentText.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.delayBetweenTexts);
            } else {
                setTimeout(() => this.type(), this.speed);
            }
        }
    }
}

/*  
   INTERSECTION OBSERVER FOR ANIMATIONS
     */

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
        this.init();
    }

    init() {
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            this.observer.observe(section);
        });

        // Observe project cards
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });

        // Observe experience cards
        document.querySelectorAll('.experience-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });

        // Observe skill categories
        document.querySelectorAll('.skill-category').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                this.observer.unobserve(entry.target);
            }
        });
    }
}

/*  
   DARK/LIGHT MODE TOGGLE
     */

class ThemeToggle {
    constructor() {
        this.toggleBtn = document.querySelector('.theme-toggle');
        this.htmlElement = document.documentElement;
        this.body = document.body;
        this.storageKey = 'theme-preference';
        this.init();
    }

    init() {
        this.loadTheme();
        this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        this.updateIcon();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem(this.storageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(theme);
    }

    toggleTheme() {
        const currentTheme = this.body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        localStorage.setItem(this.storageKey, newTheme);
    }

    applyTheme(theme) {
        if (theme === 'light') {
            this.body.classList.add('light-mode');
        } else {
            this.body.classList.remove('light-mode');
        }
        this.updateIcon();
    }

    updateIcon() {
        const icon = this.toggleBtn.querySelector('i');
        const isLight = this.body.classList.contains('light-mode');
        icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    }
}

/*  
   MOBILE MENU TOGGLE
     */

class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

/*  
   ACTIVE NAV LINK
     */

class ActiveNavLink {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateActiveLink());
        // Initial update
        this.updateActiveLink();
    }

    updateActiveLink() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

/*  
   FORM VALIDATION
     */

class FormValidator {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (this.validateForm(name, email, subject, message)) {
            this.submitForm();
        }
    }

    validateForm(name, email, subject, message) {
        if (!name) {
            this.showError('Please enter your name');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }

        if (!subject) {
            this.showError('Please enter a subject');
            return false;
        }

        if (!message || message.length < 10) {
            this.showError('Please enter a message (at least 10 characters)');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(message) {
        alert(message);
    }

    submitForm() {
        alert('Thank you for your message! I\'ll get back to you soon.');
        this.form.reset();
    }
}

/*  
   BACK TO TOP BUTTON
     */

class BackToTop {
    constructor() {
        this.btn = document.querySelector('.back-to-top');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.btn.addEventListener('click', () => this.scrollToTop());
    }

    toggleVisibility() {
        if (window.pageYOffset > 300) {
            this.btn.classList.add('visible');
        } else {
            this.btn.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

/*  
   SMOOTH SCROLLING FOR ANCHOR LINKS
     */

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

/*  
   SCROLL INDICATOR CLICK
     */

class ScrollIndicator {
    constructor() {
        this.indicator = document.querySelector('.scroll-indicator');
        if (this.indicator) {
            this.init();
        }
    }

    init() {
        this.indicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const offsetTop = aboutSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

/*  
   PAGE LOAD ANIMATION
     */

class PageLoader {
    constructor() {
        this.init();
    }

    init() {
        // Add fade-in animation to hero section on load
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.opacity = '0';
            hero.style.animation = 'slideUp 0.8s ease-out forwards';
        }
    }
}

/*  
   PARALLAX SCROLL EFFECT (Optional Enhancement)
     */

class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        if (this.elements.length > 0) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => this.updateParallax());
    }

    updateParallax() {
        this.elements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementOffset = element.offsetTop;
            const distance = scrollPosition - elementOffset;
            const speed = 0.5;

            element.style.transform = `translateY(${distance * speed}px)`;
        });
    }
}

/*  
   PROJECT CARD TILT EFFECT (Optional)
     */

class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.02)
        `;
    }

    handleMouseLeave(e, card) {
        card.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
        `;
    }
}

/*  
   COUNTER ANIMATION (Optional)
     */

class CounterAnimation {
    constructor(selector = '.counter', duration = 2000) {
        this.elements = document.querySelectorAll(selector);
        this.duration = duration;
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        this.elements.forEach(element => {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        this.animateCounter(element);
                        observer.unobserve(element);
                    }
                },
                { threshold: 0.5 }
            );
            observer.observe(element);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const increment = target / (this.duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

/*  
   INITIALIZATION
     */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    new PageLoader();
    new ThemeToggle();
    new MobileMenu();
    new ActiveNavLink();
    new SmoothScroll();
    new FormValidator();
    new BackToTop();
    new ScrollIndicator();
    new ScrollAnimations();
    new CardTilt();
    new ParallaxEffect();
    new CounterAnimation();

    // Initialize typing effect
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const texts = [
            'Software Engineer',
            'Full Stack Developer',
            'Creative Problem Solver',
            'Tech Enthusiast',
            'Designer & Developer'
        ];
        new TypingEffect(typingElement, texts, 80, 40, 2000);
    }

    // Log successful initialization
    console.log('Portfolio website initialized successfully!');
});

/*  
   UTILITY FUNCTIONS
     */

// Debounce function for scroll events
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

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add CSS class with animation
function animateElement(element, className, duration = 600) {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, duration);
}

// Create ripple effect on click
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.hamburger');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.click();
        }
    }
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add service worker for PWA support (optional)
if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('sw.js').catch(() => {});
}