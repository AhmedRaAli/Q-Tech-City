// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Slider state
  let currentSlide = 0;
  let slideInterval;
  let isInViewport = false;

  // Initialize slider functionality
  function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    // Create indicators
    createIndicators(slides.length);
    
    // Show first slide
    showSlide(0);
    
    // Add touch events for mobile
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
      let touchStartX = 0;
      let touchEndX = 0;

      sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(touchStartX, touchEndX);
      });
    }

    // Start auto-sliding if in viewport
    startAutoSlide();
  }

  // Handle swipe gestures
  function handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Setup intersection observer for slider
  function setupIntersectionObserver() {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isInViewport = entry.isIntersecting;
        if (isInViewport) {
          startAutoSlide();
          sliderContainer.classList.remove('out-of-viewport');
        } else {
          stopAutoSlide();
          sliderContainer.classList.add('out-of-viewport');
        }
      });
    }, {
      threshold: 0.5
    });

    observer.observe(sliderContainer);
  }

  // Show specific slide
  function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlide].classList.add('active');

    if (indicators.length > 0) {
      indicators.forEach(indicator => indicator.classList.remove('active'));
      indicators[currentSlide].classList.add('active');
    }
  }

  // Navigation functions
  function nextSlide() {
    showSlide(currentSlide + 1);
    resetAutoSlide();
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
    resetAutoSlide();
  }

  // Auto slide functions
  function startAutoSlide() {
    if (isInViewport && !slideInterval) {
      slideInterval = setInterval(nextSlide, 5000);
    }
  }

  function stopAutoSlide() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Create slide indicators
  function createIndicators(count) {
    const indicators = document.querySelector('.indicators');
    if (!indicators) return;

    indicators.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const indicator = document.createElement('div');
      indicator.className = 'indicator';
      if (i === 0) indicator.classList.add('active');
      
      indicator.addEventListener('click', () => {
        showSlide(i);
        resetAutoSlide();
      });
      
      indicators.appendChild(indicator);
    }
  }

  // Toggle mobile menu - simplified for better reliability
  function toggleMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    
    if (!menuToggle || !navLinks) return;
    
    // Toggle active state
    const isActive = navLinks.classList.contains('active');
    
    // If we're closing the menu, remove active classes first
    if (isActive) {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
      if (navOverlay) navOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    } else {
      // If we're opening the menu, add active classes
      navLinks.classList.add('active');
      menuToggle.classList.add('active');
      if (navOverlay) navOverlay.classList.add('active');
      document.body.classList.add('menu-open');
    }
  }

  // Setup navigation - simplified for better reliability
  function setupNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create overlay if it doesn't exist
    if (!document.querySelector('.nav-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
      
      // Add click event to overlay
      overlay.addEventListener('click', toggleMenu);
    }
    
    // Toggle menu on button click
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Close menu when clicking any nav link
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
          // Wait for the click event to complete before toggling
          if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
            setTimeout(toggleMenu, 10);
          }
        });
      });
    }
    
    // Handle escape key to close menu
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
    
    // Setup language switcher
    const languageBtn = document.querySelector('.language-btn');
    if (languageBtn) {
      languageBtn.addEventListener('click', toggleLanguage);
    }
  }
  
  // تحديث الروابط النشطة بناءً على موقع التمرير
  function updateActiveLinks() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSectionId = '';
    
    // العثور على القسم المرئي حاليًا
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (sectionId && window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = sectionId;
      }
    });
    
    // تحديث الروابط النشطة
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (href && href.substring(1) === currentSectionId) {
        link.classList.add('active');
      }
    });
  }
  
  // إضافة مستمع للتمرير لتحديث الروابط النشطة
  window.addEventListener('scroll', debounce(updateActiveLinks, 100));
  
  // تنفيذ التمرير السلس للروابط الداخلية
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      // التحقق من أن الهدف موجود ومتاح
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // إغلاق القائمة المتنقلة إذا كانت مفتوحة
          const navLinks = document.querySelector('.nav-links');
          
          if (navLinks && navLinks.classList.contains('active')) {
            toggleMenu();
          }
          
          // حساب موضع العنصر مع مراعاة الهيدر الثابت
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          // التمرير إلى الموضع المحسوب
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // تنفيذ وظيفة التمرير للأعلى
  const scrollTopBtn = document.querySelector('.scroll-to-top') || createScrollTopButton();
  
  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // إنشاء زر التمرير للأعلى إذا لم يكن موجودًا
  function createScrollTopButton() {
    const btn = document.createElement('div');
    btn.className = 'scroll-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);
    return btn;
  }
  
  // إظهار/إخفاء زر التمرير للأعلى
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  // تهيئة عارض الصور
  initializeSlider();
  
  // إعداد القائمة
  setupNavigation();
  
  // إعداد مراقب التقاطع
  setupIntersectionObserver();
  
  // تنفيذ التحديث الأولي للروابط النشطة
  updateActiveLinks();
});