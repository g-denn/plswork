document.addEventListener('DOMContentLoaded', () => {
    // Track key combination
    let ctrlPressed = false;
    let shiftPressed = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Control') ctrlPressed = true;
        if (e.key === 'Shift') shiftPressed = true;
        
        // Check for Ctrl + Shift + P combination
        if (ctrlPressed && shiftPressed && e.key === 'P') {
            e.preventDefault(); // Prevent default browser behavior
            
            // Check if property lookup link already exists
            const navLinks = document.querySelector('.nav-links');
            const existingLink = navLinks.querySelector('.property-lookup-link');
            
            if (!existingLink) {
                // Create and insert the property lookup link
                const propertyLookupLink = document.createElement('a');
                propertyLookupLink.href = '/property-lookup.html';
                propertyLookupLink.className = 'property-lookup-link';
                propertyLookupLink.textContent = 'Property Lookup';
                
                // Insert before the Get Started button
                const contactBtn = navLinks.querySelector('.contact-btn');
                navLinks.insertBefore(propertyLookupLink, contactBtn);
                
                // Add fade-in animation
                propertyLookupLink.style.animation = 'fadeIn 0.5s ease-in-out';
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Control') ctrlPressed = false;
        if (e.key === 'Shift') shiftPressed = false;
    });
}); 