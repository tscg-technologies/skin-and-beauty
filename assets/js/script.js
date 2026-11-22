/**
 * SKIN & BEAUTY CLINIC — MAIN JAVASCRIPT
 * Pure Vanilla JavaScript • No Frameworks or External Libraries
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initActiveNav();
  initFaqAccordion();
  initGallery();
  initAppointmentForm();
  initContactForm();
  initScrollTop();
});

/* ==========================================================================
   1. STICKY HEADER SCROLL EFFECT
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close drawer on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Automatically close mobile drawer when window resizes to desktop breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 868 && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. ACTIVE NAVIGATION HIGHLIGHTER
   ========================================================================== */
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link, .mobile-sub-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');

      // If it's inside a dropdown, also highlight the parent nav-link
      const parentDropdown = link.closest('.has-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });

  // If on any treatment subpage, highlight 'Services' in the navigation
  const treatmentPages = [
    'skin-treatments.html',
    'acne-care.html',
    'pigmentation.html',
    'facial-treatments.html',
    'anti-aging.html',
    'hair-care.html'
  ];
  if (treatmentPages.includes(currentPath)) {
    document.querySelectorAll('a[href="services.html"]').forEach(l => l.classList.add('active'));
  }
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current FAQ
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. GALLERY FILTERS & LIGHTBOX
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');

  if (!galleryItems.length) return;

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox functionality
  if (!lightbox) return;

  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxCategory = lightbox.querySelector('.lightbox-category');
  const lightboxFilename = lightbox.querySelector('.lightbox-filename');
  const lightboxDimensions = lightbox.querySelector('.lightbox-dimensions');
  const lightboxNote = lightbox.querySelector('.lightbox-note');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  const visibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

  const updateLightboxContent = (index) => {
    const items = visibleItems();
    if (!items.length) return;

    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentIndex = index;

    const currentItem = items[currentIndex];
    const title = currentItem.getAttribute('data-title') || 'Clinic Visual';
    const category = currentItem.getAttribute('data-category') || 'Interior';
    const filename = currentItem.getAttribute('data-filename') || 'placeholder.webp';
    const dimensions = currentItem.getAttribute('data-dimensions') || '1200 x 800 (3:2)';
    const desc = currentItem.getAttribute('data-desc') || 'Illustrative clinic photograph.';
    const currentImg = currentItem.querySelector('img');
    const imgSrc = currentItem.getAttribute('data-src') || (currentImg ? currentImg.getAttribute('src') : '');

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category.toUpperCase();
    if (lightboxFilename) lightboxFilename.textContent = filename;
    if (lightboxDimensions) lightboxDimensions.textContent = dimensions;
    if (lightboxNote) lightboxNote.textContent = desc;
    if (lightboxImg && imgSrc) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = title;
    }
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const items = visibleItems();
      const actualIndex = items.indexOf(item);
      if (actualIndex !== -1) {
        updateLightboxContent(actualIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentIndex + 1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) updateLightboxContent(currentIndex - 1);
    if (e.key === 'ArrowRight' && nextBtn) updateLightboxContent(currentIndex + 1);
  });
}

/* ==========================================================================
   6. APPOINTMENT FORM VALIDATION & SUMMARY PREVIEW
   ========================================================================== */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  const dateInput = document.getElementById('aptDate');
  if (dateInput) {
    // Prevent selecting past dates
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  const summaryModal = document.getElementById('summaryModal');
  const closeSummaryBtn = document.getElementById('closeSummaryBtn');
  const confirmBookingBtn = document.getElementById('confirmBookingBtn');
  const successBanner = document.getElementById('appointmentSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Field references
    const fullName = document.getElementById('fullName');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const aptDate = document.getElementById('aptDate');
    const aptTime = document.getElementById('aptTime');
    const clientType = document.querySelector('input[name="clientType"]:checked');
    const consultType = document.getElementById('consultType');
    const message = document.getElementById('message');

    let isValid = true;

    // Validate Full Name
    if (!fullName.value.trim() || fullName.value.trim().length < 2) {
      showFieldError(fullName, 'Please enter your full name (minimum 2 characters).');
      isValid = false;
    } else {
      clearFieldError(fullName);
    }

    // Validate Phone (10 digits)
    const phoneClean = phone.value.replace(/[\s\-\+\(\)]/g, '');
    const phoneRegex = /^[0-9]{10,12}$/;
    if (!phoneClean || !phoneRegex.test(phoneClean)) {
      showFieldError(phone, 'Please enter a valid 10-digit contact number.');
      isValid = false;
    } else {
      clearFieldError(phone);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearFieldError(email);
    }

    // Validate Service
    if (!service.value) {
      showFieldError(service, 'Please select a service or consultation topic.');
      isValid = false;
    } else {
      clearFieldError(service);
    }

    // Validate Date
    if (!aptDate.value) {
      showFieldError(aptDate, 'Please select your preferred date.');
      isValid = false;
    } else {
      const selected = new Date(aptDate.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        showFieldError(aptDate, 'Appointment date cannot be in the past.');
        isValid = false;
      } else {
        clearFieldError(aptDate);
      }
    }

    // Validate Time
    if (!aptTime.value) {
      showFieldError(aptTime, 'Please select a preferred consultation time.');
      isValid = false;
    } else {
      clearFieldError(aptTime);
    }

    if (!isValid) return;

    // Populate Summary Preview Modal
    if (summaryModal) {
      document.getElementById('sumName').textContent = fullName.value.trim();
      document.getElementById('sumPhone').textContent = phone.value.trim();
      document.getElementById('sumEmail').textContent = email.value.trim();
      document.getElementById('sumService').textContent = service.options[service.selectedIndex].text;
      document.getElementById('sumDate').textContent = aptDate.value;
      document.getElementById('sumTime').textContent = aptTime.options[aptTime.selectedIndex].text;
      document.getElementById('sumClient').textContent = clientType ? clientType.value : 'New Client';
      document.getElementById('sumType').textContent = consultType ? consultType.options[consultType.selectedIndex].text : 'In-Clinic Consultation';
      document.getElementById('sumNotes').textContent = message.value.trim() || 'No additional notes provided.';

      summaryModal.classList.add('active');
    }
  });

  // Close summary modal
  if (closeSummaryBtn && summaryModal) {
    closeSummaryBtn.addEventListener('click', () => {
      summaryModal.classList.remove('active');
    });
  }

  // Final Confirmation inside modal
  if (confirmBookingBtn && summaryModal) {
    confirmBookingBtn.addEventListener('click', () => {
      summaryModal.classList.remove('active');
      if (successBanner) {
        successBanner.classList.add('show');
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }
}

/* ==========================================================================
   7. CONTACT ENQUIRY FORM VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successBanner = document.getElementById('contactSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName');
    const phone = document.getElementById('contactPhone');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');

    let isValid = true;

    if (!name.value.trim()) {
      showFieldError(name, 'Please enter your name.');
      isValid = false;
    } else {
      clearFieldError(name);
    }

    const phoneClean = phone.value.replace(/[\s\-\+\(\)]/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      showFieldError(phone, 'Please provide a valid 10-digit phone number.');
      isValid = false;
    } else {
      clearFieldError(phone);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearFieldError(email);
    }

    if (!message.value.trim() || message.value.trim().length < 5) {
      showFieldError(message, 'Please enter your enquiry or question (minimum 5 characters).');
      isValid = false;
    } else {
      clearFieldError(message);
    }

    if (!isValid) return;

    if (successBanner) {
      successBanner.classList.add('show');
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.reset();
  });
}

function showFieldError(input, message) {
  input.classList.add('error');
  const errorElem = input.parentElement.querySelector('.error-message');
  if (errorElem) {
    errorElem.textContent = message;
    errorElem.classList.add('show');
  }
}

function clearFieldError(input) {
  input.classList.remove('error');
  const errorElem = input.parentElement.querySelector('.error-message');
  if (errorElem) {
    errorElem.classList.remove('show');
  }
}

/* ==========================================================================
   8. SCROLL TO TOP BUTTON
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
