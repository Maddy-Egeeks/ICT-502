// Scroll Animations
window.addEventListener('scroll', () => {
    document.querySelectorAll('section').forEach(section => {
        const position = section.getBoundingClientRect().top;
        if (position < window.innerHeight - 100) {
            section.classList.add('visible');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('open');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll animations
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    
    // Initial check on page load
    checkScroll();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkScroll);
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        animateOnScrollElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }
    
    // Sticky header behavior
    const header = document.querySelector('.sticky-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            if (header) {
                header.classList.add('scrolled');
                
                // Hide header when scrolling down, show when scrolling up
                if (scrollTop > lastScrollTop) {
                    header.style.top = '-80px'; // Hide (adjust value based on header height)
                } else {
                    header.style.top = '0'; // Show
                }
            }
        } else {
            if (header) {
                header.classList.remove('scrolled');
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Budget Calculator functionality
    const calculateButton = document.querySelector('.calculate-btn');
    
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateBudget);
    }
    
    // Fallback for older version of button
    const oldCalculateButton = document.querySelector('#budget-form button[type="button"]');
    if (oldCalculateButton && oldCalculateButton !== calculateButton) {
        oldCalculateButton.addEventListener('click', calculateBudget);
    }
    
    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.removeAttribute('onsubmit');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {
                // show the success message
                showSuccess('Thank you for your message! We will get back to you soon.');
            }
        });
    }
});

// Budget Calculator function
function calculateBudget() {
    // Get form values
    const eventType = document.getElementById('eventType').value;
    const guestCount = parseInt(document.getElementById('guests').value);
    const venueType = document.querySelector('input[name="venue"]:checked').value;
    
    // Validate input
    if (isNaN(guestCount) || guestCount <= 0) {
        alert("Please enter a valid number of guests");
        return;
    }
    
    // Base pricing for different event types
    const basePrices = {
        'wedding': 5000,
        'corporate': 3500,
        'birthday': 1500,
        'anniversary': 2500
    };
    
    // Cost per guest for different event types
    const perGuestCost = {
        'wedding': 85,
        'corporate': 65,
        'birthday': 45,
        'anniversary': 55
    };
    
    // Venue pricing (additional)
    const venuePricing = {
        'indoor': 1000,
        'outdoor': 1500
    };
    
    // Calculate costs
    const basePrice = basePrices[eventType];
    const guestsCost = guestCount * perGuestCost[eventType];
    const venueCost = venuePricing[venueType];
    const totalCost = basePrice + guestsCost + venueCost;
    
    // Format event type for display
    const formattedEventType = eventType.charAt(0).toUpperCase() + eventType.slice(1);
    
    // Display the results
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        const breakdownDiv = resultDiv.querySelector('.estimate-breakdown');
        
        breakdownDiv.innerHTML = `
            <div class="breakdown-item">
                <span>${formattedEventType} base package:</span>
                <span>$${basePrice.toLocaleString()}</span>
            </div>
            <div class="breakdown-item">
                <span>Guest services (${guestCount} guests):</span>
                <span>$${guestsCost.toLocaleString()}</span>
            </div>
            <div class="breakdown-item">
                <span>${venueType.charAt(0).toUpperCase() + venueType.slice(1)} venue fee:</span>
                <span>$${venueCost.toLocaleString()}</span>
            </div>
            <div class="total-cost">
                <span>Estimated Total:</span>
                <span>$${totalCost.toLocaleString()}</span>
            </div>
        `;
        
        // Show the result div
        resultDiv.style.display = 'block';
        
        // Scroll to the result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Contact form validation
function validateForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const event = document.getElementById('event').value;
    const message = document.getElementById('message').value;
    const formMessage = document.getElementById('form-message');
    
    // Reset message
    if (formMessage) {
        formMessage.style.display = 'none';
        formMessage.className = '';
    }
    
    // Validate name (at least 2 characters)
    if (name.length < 2) {
        showError('Please enter a valid name (at least 2 characters)');
        return false;
    }
    
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    // Validate event selection
    if (!event) {
        showError('Please select an event type');
        return false;
    }
    
    // Validate message (at least 10 characters)
    if (message.length < 10) {
        showError('Please enter a detailed message (at least 10 characters)');
        return false;
    }
    
    return true;
}

function showError(message) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'error-message';
        formMessage.style.display = 'block';
    }
}

function showSuccess(message) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'success-message';
        formMessage.style.display = 'block';
        
        // Clear form fields
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.reset();
        }
    }
}
