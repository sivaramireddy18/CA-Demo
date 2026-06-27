/* ==========================================================================
   Chartered Accountant Website - Client-Side Interactivity Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollAnimations();
  initCounterAnimations();
  initFAQAccordion();
  initTestimonialSlider();
  initServicesTabs();
  initFormValidation();
  initBackToTop();
  initActiveNavLinkHighlight();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('header');
  
  function checkScroll() {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  }

  // Check on load
  checkScroll();
  
  // Check on scroll
  window.addEventListener('scroll', checkScroll);
}

/* ==========================================================================
   2. Mobile Hamburger Menu
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  // Toggle Menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    
    // Toggle body scroll
    if (navMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close Menu on Link Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on resize if open
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   3. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // Viewport
      threshold: 0.15, // Trigger when 15% of element is visible
      rootMargin: '0px 0px -50px 0px' // Adjust trigger zone slightly above bottom edge
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback if observer not supported
    animatedElements.forEach(element => {
      element.classList.add('revealed');
    });
  }
}

/* ==========================================================================
   4. Statistics Number Counters Animation
   ========================================================================== */
function initCounterAnimations() {
  const statNumbers = document.querySelectorAll('.counter-number');
  
  if (statNumbers.length === 0) return;

  function startCounter(counterElement) {
    const target = parseInt(counterElement.getAttribute('data-target'), 10);
    const suffix = counterElement.getAttribute('data-suffix') || '';
    const duration = 2000; // Animation duration in ms
    const stepTime = 30; // Frequency of update in ms
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;
    
    let currentNumber = 0;
    let stepCount = 0;

    const timer = setInterval(() => {
      currentNumber += increment;
      stepCount++;

      if (stepCount >= totalSteps) {
        clearInterval(timer);
        counterElement.textContent = target + suffix;
      } else {
        counterElement.textContent = Math.floor(currentNumber) + suffix;
      }
    }, stepTime);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(number => {
      observer.observe(number);
    });
  } else {
    // Fallback
    statNumbers.forEach(number => {
      const target = number.getAttribute('data-target');
      const suffix = number.getAttribute('data-suffix') || '';
      number.textContent = target + suffix;
    });
  }
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      const isOpen = item.classList.contains('active');

      // Close all other FAQ items
      const allItems = document.querySelectorAll('.faq-item');
      allItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   6. Testimonial Slider
   ========================================================================== */
function initTestimonialSlider() {
  const wrapper = document.querySelector('.testimonial-wrapper');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-controls');
  
  if (!wrapper || slides.length === 0) return;

  let currentSlide = 0;
  const slideCount = slides.length;
  let autoplayTimer;

  // Create Dot indicators
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    currentSlide = index;
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slideCount) next = 0;
    goToSlide(next);
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Start Autoplay
  startAutoplay();

  // Pause on hover
  const container = document.querySelector('.testimonial-slider-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    container.addEventListener('mouseleave', startAutoplay);
  }
}

/* ==========================================================================
   7. Services Tabs & Details Expanders
   ========================================================================== */
function initServicesTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabButtons.length === 0) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update active button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active panel
      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      // Re-trigger scroll animations inside the new panel
      initScrollAnimations();
    });
  });

  // Details drawer handler within services
  const detailsButtons = document.querySelectorAll('.details-btn');
  detailsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.card');
      const drawer = card.querySelector('.details-drawer');
      
      if (!drawer) return;

      const isOpen = btn.classList.contains('open');

      if (isOpen) {
        btn.classList.remove('open');
        btn.innerHTML = `Read Details <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        drawer.style.display = 'none';
      } else {
        btn.classList.add('open');
        btn.innerHTML = `Hide Details <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
        drawer.style.display = 'block';
      }
    });
  });
}

/* ==========================================================================
   8. Form Validation
   ========================================================================== */
function initFormValidation() {
  const form = document.querySelector('.validated-form');
  if (!form) return;

  const inputs = form.querySelectorAll('.form-control');

  // Input event triggers for real-time check
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      // Clear error immediately if user corrects
      if (input.closest('.form-group').classList.contains('invalid')) {
        validateField(input);
      }
    });
  });

  // Form submit trigger
  form.addEventListener('submit', (e) => {
    let isFormValid = true;

    inputs.forEach(input => {
      const isValid = validateField(input);
      if (!isValid) isFormValid = false;
    });

    if (!isFormValid) {
      e.preventDefault();
      // Focus on first invalid element
      const firstInvalid = form.querySelector('.form-group.invalid .form-control');
      if (firstInvalid) firstInvalid.focus();
    } else {
      // Simulate successful submission for demonstration
      e.preventDefault();
      showFormSuccess(form);
    }
  });

  function validateField(input) {
    const group = input.closest('.form-group');
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Check empty value for required fields
    if (input.hasAttribute('required') && value === '') {
      isValid = false;
      errorMessage = 'This field is required.';
    } 
    // Check specific formats
    else if (value !== '') {
      if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address.';
        }
      } 
      else if (input.type === 'tel') {
        const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number (minimum 10 digits).';
        }
      }
    }

    // Set styling states
    if (!isValid) {
      group.classList.add('invalid');
      let errSpan = group.querySelector('.error-message');
      if (!errSpan) {
        errSpan = document.createElement('span');
        errSpan.classList.add('error-message');
        group.appendChild(errSpan);
      }
      errSpan.textContent = errorMessage;
      errSpan.style.display = 'block';
    } else {
      group.classList.remove('invalid');
      const errSpan = group.querySelector('.error-message');
      if (errSpan) errSpan.style.display = 'none';
    }

    return isValid;
  }

  function showFormSuccess(validatedForm) {
    const originalContent = validatedForm.innerHTML;
    const parent = validatedForm.parentElement;
    
    parent.innerHTML = `
      <div class="form-success-container text-center reveal revealed" style="padding: 40px 20px;">
        <div class="success-icon-circle flex-center" style="width: 72px; height: 72px; border-radius: 50%; background-color: rgba(56, 161, 105, 0.1); color: var(--success-color); margin: 0 auto 20px auto;">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 style="margin-bottom: 12px; color: var(--primary-navy);">Thank You!</h3>
        <p style="color: var(--text-muted); margin-bottom: 25px; max-width: 400px; margin-left: auto; margin-right: auto;">Your consultation request has been successfully submitted. We will review your requirements and reach out to you within 24 business hours.</p>
        <button class="btn btn-outline reset-form-btn">Submit Another Request</button>
      </div>
    `;

    parent.querySelector('.reset-form-btn').addEventListener('click', () => {
      parent.innerHTML = '';
      const newForm = document.createElement('form');
      newForm.className = validatedForm.className;
      newForm.action = validatedForm.action;
      newForm.method = validatedForm.method;
      newForm.innerHTML = originalContent;
      parent.appendChild(newForm);
      initFormValidation(); // Re-initialize listeners
    });
  }
}

/* ==========================================================================
   9. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   10. Active Navigation Link Highlighting
   ========================================================================== */
function initActiveNavLinkHighlight() {
  const links = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
