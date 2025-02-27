// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navHeight - 40;  // Single consistent offset
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active section highlighting with Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -80%',  // Consistent margins for all sections
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's link
                const id = entry.target.getAttribute('id');
                const currentLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (currentLink) {
                    currentLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });
});

// Increase typing speed for chat messages
async function streamMessage(message, element) {
    const streamDelay = 10; // Reduced from default (usually 20-30ms)
    // ... rest of your streaming logic
}
