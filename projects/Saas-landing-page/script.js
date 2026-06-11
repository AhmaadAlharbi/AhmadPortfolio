/**
 * CloudPilot — SaaS Landing Page
 * JavaScript: Navigation, FAQ, Scroll animations, Pricing toggle
 */

'use strict';

/* =============================================================
   Utilities
   ============================================================= */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =============================================================
   1. Header — scroll state
   ============================================================= */
(function initHeader() {
  const header = qs('#header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* =============================================================
   2. Mobile Navigation
   ============================================================= */
(function initMobileNav() {
  const hamburger = qs('#hamburger');
  const navLinks  = qs('#navLinks');
  if (!hamburger || !navLinks) return;

  const toggle = () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const close = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggle);

  // Close when a nav link is clicked
  qsa('.nav__link', navLinks).forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      close();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* =============================================================
   3. Smooth Scrolling for Nav Links
   ============================================================= */
(function initSmoothScroll() {
  const headerHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72',
    10
  );

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const target = qs(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* =============================================================
   4. Active Nav Link on Scroll (Intersection Observer)
   ============================================================= */
(function initActiveNav() {
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* =============================================================
   5. Scroll Animations (Intersection Observer)
   ============================================================= */
(function initScrollAnimations() {
  const elements = qsa('.fade-in');
  if (!elements.length) return;

  // Stagger siblings within the same parent
  const staggerParents = qsa('.features__grid, .pricing__cards, .testimonials__grid, .steps, .benefits__right, .db-stats');

  staggerParents.forEach((parent) => {
    qsa('.fade-in', parent).forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* =============================================================
   6. FAQ Accordion
   ============================================================= */
(function initFAQ() {
  const items = qsa('.faq__item');
  if (!items.length) return;

  items.forEach((item) => {
    const btn    = qs('.faq__question', item);
    const answer = qs('.faq__answer', item);
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      items.forEach((other) => {
        if (other !== item) other.classList.remove('open');
      });

      // Toggle current item
      item.classList.toggle('open', !isOpen);

      // Accessibility
      btn.setAttribute('aria-expanded', !isOpen);
    });

    // Keyboard accessibility
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('role', 'button');
  });
})();

/* =============================================================
   7. Pricing Toggle (Monthly / Annual)
   ============================================================= */
(function initPricingToggle() {
  const toggle         = qs('#billingToggle');
  const toggleMonthly  = qs('#toggleMonthly');
  const toggleAnnual   = qs('#toggleAnnual');
  const amounts        = qsa('.pricing-card__amount[data-monthly]');
  if (!toggle) return;

  const update = () => {
    const isAnnual = toggle.checked;

    toggleMonthly?.classList.toggle('pricing__toggle-label--active', !isAnnual);
    toggleAnnual?.classList.toggle('pricing__toggle-label--active', isAnnual);

    amounts.forEach((el) => {
      const value = isAnnual
        ? el.getAttribute('data-annual')
        : el.getAttribute('data-monthly');

      // Animate number change
      animateCounter(el, parseInt(el.textContent, 10), parseInt(value, 10), 300);
    });
  };

  toggle.addEventListener('change', update);
})();

/* Animated counter helper */
function animateCounter(el, from, to, duration) {
  const start    = performance.now();
  const range    = to - from;

  const step = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.round(from + range * ease);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/* =============================================================
   8. Dashboard Chart Period Buttons
   ============================================================= */
(function initChartPeriod() {
  const btns = qsa('.db-chart__period-btn');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('db-chart__period-btn--active'));
      btn.classList.add('db-chart__period-btn--active');
    });
  });
})();

/* =============================================================
   9. Floating Cards Parallax (subtle)
   ============================================================= */
(function initParallax() {
  const cards = qsa('.float-card');
  if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      cards.forEach((card, i) => {
        const factor = (i + 1) * 4;
        card.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });

      ticking = false;
    });
  });
})();

/* =============================================================
   10. Dashboard Table Row Hover (highlight)
   ============================================================= */
(function initTableInteraction() {
  const rows = qsa('.db-table__table tbody tr');
  rows.forEach((row) => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      rows.forEach((r) => r.style.background = '');
      row.style.background = 'rgba(79, 70, 229, 0.04)';
    });
  });
})();

/* =============================================================
   11. Notification Bell (micro-interaction)
   ============================================================= */
(function initNotifBell() {
  const bell = qs('.dashboard__notif-btn');
  if (!bell) return;

  bell.addEventListener('click', () => {
    bell.style.transform = 'rotate(-15deg)';
    setTimeout(() => { bell.style.transform = 'rotate(10deg)'; }, 100);
    setTimeout(() => { bell.style.transform = 'rotate(-5deg)'; }, 200);
    setTimeout(() => { bell.style.transform = 'rotate(0)';     }, 300);
  });
})();

/* =============================================================
   12. Stats Counter Animation (on scroll into view)
   ============================================================= */
(function initStatsCounters() {
  const stats = qsa('.db-stat__value');
  if (!stats.length) return;

  const parseValue = (text) => {
    const clean = text.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  const formatValue = (original, current) => {
    if (original.startsWith('$')) return '$' + current.toLocaleString();
    if (original.includes(',')) return current.toLocaleString();
    return String(current);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el       = entry.target;
        const original = el.textContent.trim();
        const target   = parseValue(original);

        if (!target) return;

        animateCounter(
          el,
          0,
          target,
          1200,
        );

        // Re-format with symbol after animation
        setTimeout(() => {
          el.textContent = formatValue(original, target);
        }, 1250);

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => observer.observe(stat));
})();

/* =============================================================
   13. "Start Free Trial" CTA — ripple effect
   ============================================================= */
(function initRipple() {
  qsa('.btn--primary, .btn--white').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;

      const ripple = document.createElement('span');
      Object.assign(ripple.style, {
        position:     'absolute',
        width:        '0',
        height:       '0',
        borderRadius: '50%',
        background:   'rgba(255,255,255,0.35)',
        left:         x + 'px',
        top:          y + 'px',
        transform:    'translate(-50%, -50%)',
        pointerEvents: 'none',
        animation:    'rippleExpand 0.55s ease-out forwards',
      });

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe once
  if (!qs('#rippleStyle')) {
    const style    = document.createElement('style');
    style.id       = 'rippleStyle';
    style.textContent = `
      @keyframes rippleExpand {
        to { width: 300px; height: 300px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();
