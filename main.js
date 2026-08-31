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

// ---- Popup Modal ---- (only on pages that include the modal markup)
const modalOverlay = document.getElementById('cr-modal-overlay');
const modalClose = document.getElementById('cr-modal-close');
let modalShown = false;

if (modalOverlay && modalClose) {
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

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  document.querySelectorAll('.cr-modal-trigger').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      modalShown = false;
      openModal();
    });
  });

  if (!sessionStorage.getItem('cr-modal-shown')) {
    setTimeout(openModal, 15000);

    document.addEventListener('mouseleave', function onExitIntent(e) {
      if (e.clientY <= 0) {
        openModal();
        document.removeEventListener('mouseleave', onExitIntent);
      }
    });

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

// ============================================================
// 6-Figure Detailer conversion pass — Revenue Leak Audit funnel
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const auditUrl = '/audit';

  // Hide pricing from cold traffic while proof is being built.
  const pricing = document.getElementById('cr-pricing');
  if (pricing) pricing.style.display = 'none';
  document.querySelectorAll('a[href="#cr-pricing"]').forEach(el => el.remove());

  // Reposition the hero around revenue recovery instead of warranty-only messaging.
  const heroHeading = document.querySelector('#cr-hero h1');
  if (heroHeading) {
    heroHeading.innerHTML = 'Stop Losing Ceramic Coating &amp; PPF Revenue to<br><em>Missed Calls, Forgotten Quotes &amp; Missed Maintenance Visits.</em>';
  }

  const heroSub = document.querySelector('#cr-hero .cr-hero-sub');
  if (heroSub) {
    heroSub.textContent = '6-Figure Detailer installs an automated follow-up system that responds to new leads, follows up unclosed estimates, tracks coating customers, and brings them back when maintenance is due.';
  }

  const trustItems = document.querySelectorAll('#cr-hero .cr-hero-trust-item');
  if (trustItems[2]) {
    trustItems[2].innerHTML = '<span class="cr-hero-trust-check">✓</span> Recover opportunities without manually chasing every lead';
  }

  // Replace application-style CTAs with the audit CTA.
  document.querySelectorAll('a').forEach(a => {
    const text = (a.textContent || '').trim().toLowerCase();
    const href = a.getAttribute('href');
    if (
      text.includes('apply') ||
      text.includes('book a strategy call') ||
      href === '#cr-booking'
    ) {
      a.setAttribute('href', auditUrl);
      a.textContent = 'Get My Free Revenue Leak Audit';
    }
  });

  // Reframe the AI demo as one component of the broader system.
  const demoSection = document.getElementById('cr-demo');
  if (demoSection) {
    const demoTitle = demoSection.querySelector('h2');
    const demoSub = demoSection.querySelector('.cr-sub, p');
    if (demoTitle) demoTitle.textContent = 'See One Part of the Revenue Recovery System in Action.';
    if (demoSub) demoSub.textContent = 'Try the AI receptionist that handles missed calls and new inquiries. The complete system also handles estimate follow-up, customer reactivation, and coating maintenance reminders.';
  }

  // Reposition the final CTA around the audit.
  const finalCta = document.getElementById('cr-cta');
  if (finalCta) {
    const heading = finalCta.querySelector('h2');
    const sub = finalCta.querySelector('p');
    if (heading) heading.innerHTML = 'Find the Revenue Leaks<br>Inside Your Shop.';
    if (sub) sub.textContent = 'We review how your shop handles new leads, missed calls, unclosed estimates, and existing coating customers — then show you where follow-up may be breaking down.';
  }

  // Re-label the embedded section in case a visitor reaches an old anchor.
  const booking = document.getElementById('cr-booking');
  if (booking) {
    const heading = booking.querySelector('h2');
    const sub = booking.querySelector('p');
    if (heading) heading.textContent = 'Free Revenue Leak Audit';
    if (sub) sub.textContent = 'Qualified ceramic coating and PPF shops only. Complete the short qualification form and, if there is a fit, we will review your lead follow-up and implementation opportunities.';
  }

  // Sticky CTA should point to the audit page.
  const sticky = document.querySelector('#cr-stickybar a');
  if (sticky) {
    sticky.href = auditUrl;
    sticky.textContent = 'Get My Free Revenue Leak Audit';
  }

  // Update metadata for social sharing/browser context.
  document.title = 'Revenue Recovery Automation for Ceramic Coating & PPF Shops | 6-Figure Detailer';
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', '6-Figure Detailer helps ceramic coating and PPF shops recover missed opportunities with automated lead response, quote follow-up, maintenance reminders, and customer reactivation.');
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Revenue Recovery Automation for Ceramic Coating & PPF Shops | 6-Figure Detailer');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', 'Recover opportunities lost to missed calls, forgotten quotes, and missed maintenance follow-up.');
});
