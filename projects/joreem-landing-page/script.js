/* =====================================================
   JOREEM — Luxury Landing Page
   Vanilla JavaScript — All Interactions
   ===================================================== */

(function () {
  'use strict';

  /* ---- Sticky Header ---- */
  const header = document.getElementById('site-header');
  const SCROLL_THRESHOLD = 60;

  function updateHeader() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---- Mobile Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileClose = document.getElementById('mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    animateHamburger(true);
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    animateHamburger(false);
  }

  function animateHamburger(open) {
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---- Smooth Scrolling ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- Active Nav Link ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const h = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + h) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ---- Scroll Reveal (IntersectionObserver) ---- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;
          setTimeout(() => el.classList.add('visible'), delay);
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- Animated Counters ---- */
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(easedProgress * target);
      el.textContent = current.toLocaleString('ar-EG');
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const statsSection = document.getElementById('stats');
  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach((counter, i) => {
          setTimeout(() => animateCounter(counter), i * 150);
        });
        statsObserver.unobserve(statsSection);
      }
    },
    { threshold: 0.3 }
  );

  if (statsSection) statsObserver.observe(statsSection);

  /* ---- Custom Cursor ---- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (window.matchMedia('(hover: hover)').matches && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animId;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    });

    function animRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      animId = requestAnimationFrame(animRing);
    }
    animRing();

    const hoverEls = document.querySelectorAll('a, button, .why-item, .col-card, .insp-card, .testi-card, .pillar, .ctile');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width = '56px';
        cursorRing.style.height = '56px';
        cursorRing.style.borderColor = 'rgba(198,166,91,0.8)';
        cursorDot.style.transform += ' scale(0)';
        cursorDot.style.opacity = '0';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.borderColor = '';
        cursorDot.style.opacity = '1';
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  /* ---- Parallax Hero ---- */
  const hero = document.getElementById('hero');
  const heroBg = hero ? hero.querySelector('.hero-bg') : null;
  const heroSlab = hero ? hero.querySelector('.hero-slab') : null;

  function updateParallax() {
    if (!hero || window.scrollY > hero.offsetHeight) return;
    const progress = window.scrollY / hero.offsetHeight;
    if (heroBg) {
      heroBg.style.transform = `translateY(${progress * 40}px)`;
    }
    if (heroSlab) {
      heroSlab.style.transform = `translateY(calc(-50% + ${progress * 30}px))`;
    }
  }

  window.addEventListener('scroll', updateParallax, { passive: true });

  /* ---- Hero Mouse Parallax ---- */
  if (hero && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) / cx;
      const dy = (e.clientY - rect.top - cy) / cy;

      const slab = hero.querySelector('.slab-inner');
      const floats = hero.querySelectorAll('.float-card');

      if (slab) {
        slab.style.transform = `rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg)`;
        slab.style.transition = 'transform 0.3s ease-out';
      }
      floats.forEach((f, i) => {
        const factor = 0.5 + i * 0.3;
        f.style.transform = `translate(${dx * factor * 6}px, ${dy * factor * 6}px)`;
        f.style.transition = 'transform 0.4s ease-out';
      });
    });

    hero.addEventListener('mouseleave', () => {
      const slab = hero.querySelector('.slab-inner');
      const floats = hero.querySelectorAll('.float-card');
      if (slab) { slab.style.transform = ''; slab.style.transition = ''; }
      floats.forEach(f => { f.style.transform = ''; });
    });
  }

  /* ---- Ceramic Tile Hover (Product Section) ---- */
  const ceramicCanvas = document.querySelector('.ceramic-canvas');
  if (ceramicCanvas) {
    const tiles = ceramicCanvas.querySelectorAll('.ctile');
    tiles.forEach((tile, i) => {
      tile.addEventListener('mouseenter', () => {
        tiles.forEach((t, j) => {
          const dist = Math.abs(i - j);
          t.style.opacity = dist === 0 ? '1' : (1 - dist * 0.15).toString();
          t.style.transform = dist === 0 ? 'scale(1.05)' : `scale(${1 - dist * 0.02})`;
          t.style.transition = `all ${0.3 + dist * 0.05}s cubic-bezier(0.16,1,0.3,1)`;
        });
      });
    });
    ceramicCanvas.addEventListener('mouseleave', () => {
      tiles.forEach(t => { t.style.opacity = ''; t.style.transform = ''; });
    });
  }

  /* ---- Contact Form ---- */
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.querySelector('span').textContent = 'جاري الإرسال...';

      setTimeout(() => {
        btn.style.display = 'none';
        formSuccess.classList.add('visible');
        form.reset();
        setTimeout(() => {
          btn.style.display = '';
          btn.disabled = false;
          btn.style.opacity = '';
          btn.querySelector('span').textContent = 'إرسال الرسالة';
          formSuccess.classList.remove('visible');
        }, 5000);
      }, 1200);
    });

    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.closest('.form-group').classList.add('focused');
      });
      input.addEventListener('blur', () => {
        input.closest('.form-group').classList.remove('focused');
        if (input.value.trim()) input.closest('.form-group').classList.add('filled');
        else input.closest('.form-group').classList.remove('filled');
      });
    });
  }

  /* ---- Ripple Effect on Buttons ---- */
  document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        top: ${y - size / 2}px;
        left: ${x - size / 2}px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.6s linear;
        pointer-events: none;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }';
  document.head.appendChild(rippleStyle);

  /* ---- Collection card tilt ---- */
  document.querySelectorAll('.col-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const x = (e.clientX - rect.left - cx) / cx;
      const y = (e.clientY - rect.top - cy) / cy;
      card.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => card.style.transition = '', 400);
    });
  });

  /* ---- Why items stagger on scroll ---- */
  const whyItems = document.querySelectorAll('.why-item');
  const whyObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
          whyObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.15 }
  );

  whyItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    whyObserver.observe(item);
  });

  /* ---- Stat items stagger ---- */
  const statItems = document.querySelectorAll('.stat-item');
  const statObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );

  statItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px)';
    item.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    statObserver.observe(item);
  });

  /* ---- Gold line pulse on hover for sections ---- */
  document.querySelectorAll('.product-divider').forEach(div => {
    const parent = div.closest('.product-info');
    if (!parent) return;
    parent.addEventListener('mouseenter', () => {
      div.style.width = '80px';
      div.style.transition = 'width 0.4s cubic-bezier(0.16,1,0.3,1)';
    });
    parent.addEventListener('mouseleave', () => {
      div.style.width = '48px';
    });
  });

  /* ---- Slab shimmer on hover ---- */
  const marbleCanvas = document.querySelector('.marble-canvas');
  if (marbleCanvas) {
    const shimmer = marbleCanvas.querySelector('.m-shimmer');
    marbleCanvas.addEventListener('mouseenter', () => {
      if (shimmer) shimmer.style.opacity = '0.6';
    });
    marbleCanvas.addEventListener('mouseleave', () => {
      if (shimmer) shimmer.style.opacity = '';
    });
  }

  /* ---- Footer: Fade in brand on scroll ---- */
  const footer = document.querySelector('.site-footer');
  if (footer) {
    const footerObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          footer.querySelectorAll('.footer-nav-col, .footer-contact-col, .footer-brand').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
            requestAnimationFrame(() => {
              setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              }, 50 + i * 80);
            });
          });
          footerObserver.unobserve(footer);
        }
      },
      { threshold: 0.1 }
    );
    footerObserver.observe(footer);
  }

  /* ---- Prevent layout shift: initial scroll check ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateHeader();
      updateActiveNav();
    });
  }

})();
