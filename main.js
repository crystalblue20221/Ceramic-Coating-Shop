// Classic Reach — main.js
// Nav scroll, mobile menu, fade-in animations, stats counter

// ---- Nav scroll effect ----
const nav = document.getElementById('cr-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---- Mobile menu toggle ----
const hamburger = document.getElementById('cr-hamburger');
const mobileMenu = document.getElementById('cr-mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Fade-in on scroll ----
const fadeEls = document.querySelectorAll('.cr-fade');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => fadeObserver.observe(el));

// ---- Popup Modal ----
const modalOverlay = document.getElementById('cr-modal-overlay');
const modalClose = document.getElementById('cr-modal-close');
let modalShown = false;

function openModal() {
  if (modalShown) return;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  modalShown = true;
  sessionStorage.setItem('cr-modal-shown', '1');
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close on X button
modalClose.addEventListener('click', closeModal);

// Close on overlay background click
modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// Open on any trigger button click (always opens even if session-shown)
document.querySelectorAll('.cr-modal-trigger').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    modalShown = false;
    openModal();
  });
});

// Auto-triggers — only if not already shown this session
if (!sessionStorage.getItem('cr-modal-shown')) {
  // 1. 15-second delay trigger
  setTimeout(openModal, 15000);

  // 2. Exit intent — desktop (mouse leaves top of viewport)
  document.addEventListener('mouseleave', function onExitIntent(e) {
    if (e.clientY <= 0) {
      openModal();
      document.removeEventListener('mouseleave', onExitIntent);
    }
  });

  // 3. Exit intent — mobile (user scrolls back up quickly = about to leave)
  let lastScrollY = window.scrollY;
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const currentY = window.scrollY;
        if (lastScrollY - currentY > 80 && currentY > 300) {
          openModal();
        }
        lastScrollY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ---- Stats counter animation ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.cr-stat-number[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
counterEls.forEach(el => counterObserver.observe(el));
