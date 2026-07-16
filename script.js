/* =====================================================
   Arti Shelar — Portfolio Script
   All interactivity in one file: nav, reveals, filters,
   flip cards, carousel, lightbox, contact copy, and the
   scroll-driven "dynamic" effects (progress bar, header
   state, back-to-top, active-link, hero parallax).
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     1. Mobile menu toggle
  --------------------------------------------------- */
  (function mobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.navigation');
    const overlay = document.querySelector('.overlay');
    if (!toggle || !nav || !overlay) return;

    const openMenu = () => {
      nav.classList.add('active');
      toggle.classList.add('active');
      overlay.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    };

    const closeMenu = () => {
      nav.classList.remove('active');
      toggle.classList.remove('active');
      overlay.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => {
      nav.classList.contains('active') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && nav.classList.contains('active')) closeMenu();
    });
  })();

  /* ---------------------------------------------------
     2. Scroll-driven chrome: header state, progress bar,
        back-to-top button — this is what makes the page
        feel alive while scrolling on mobile too.
  --------------------------------------------------- */
  (function scrollChrome() {
    const header = document.querySelector('header');
    const progressBar = document.getElementById('scroll-progress-bar');
    const backToTop = document.getElementById('back-to-top');
    if (!header && !progressBar && !backToTop) return;

    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (progressBar) progressBar.style.width = pct + '%';

      if (header) header.classList.toggle('is-scrolled', scrollTop > 40);

      if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 480);

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    }
  })();

  /* ---------------------------------------------------
     3. Hero parallax — subtle drift of the holographic
        sphere as you scroll past it (skipped on touch
        devices and reduced-motion to keep scrolling snappy).
  --------------------------------------------------- */
  (function heroParallax() {
    if (isTouch || prefersReducedMotion) return;
    const visual = document.querySelector('.hero-visual');
    const hero = document.querySelector('.hero');
    if (!visual || !hero) return;

    let ticking = false;

    const update = () => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const progress = 1 - Math.max(0, Math.min(1, rect.bottom / (rect.height + window.innerHeight)));
        visual.style.transform = `translateY(${progress * 40}px)`;
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ---------------------------------------------------
     4. Scroll reveal — fades/slides sections & cards in
        as they enter the viewport (works while navigating
        via nav links too, since those trigger scrolling).
  --------------------------------------------------- */
  (function scrollReveal() {
    const revealEls = document.querySelectorAll(
      '.journal-entry, .exp-card, .skill-card, .project-card, .timeline-item, .info-box-wide, .medal-card, .cert-card, .section h2'
    );

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('reveal-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: isTouch ? 0.08 : 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => {
      el.classList.add('reveal-el');
      io.observe(el);
    });
  })();

  /* ---------------------------------------------------
     5. Nav: highlight the link for whichever section is
        in view while the user scrolls or taps a nav item.
  --------------------------------------------------- */
  (function activeNav() {
    const navLinks = document.querySelectorAll('.navigation a[href^="#"]');
    const sections = Array.from(navLinks)
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return;

    const setActive = (id) => {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => io.observe(section));
  })();

  /* ---------------------------------------------------
     6. About: journal page-turn carousel
  --------------------------------------------------- */
  (function journalCarousel() {
    const slides = document.querySelectorAll('#journal-slides .journal-entry');
    const dots = document.querySelectorAll('#journal-dots .journal-dot');
    const prevBtn = document.getElementById('journal-prev');
    const nextBtn = document.getElementById('journal-next');
    if (!slides.length || !prevBtn || !nextBtn) return;

    let current = 0;

    const goTo = (index) => {
      if (index === current) return;
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    };

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Swipe support for touch devices
    const page = document.querySelector('.journal-page');
    if (page) {
      let touchStartX = 0;
      page.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      page.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const delta = touchEndX - touchStartX;
        if (Math.abs(delta) > 40) {
          delta < 0 ? goTo(current + 1) : goTo(current - 1);
        }
      }, { passive: true });
    }
  })();

  /* ---------------------------------------------------
     7. Skills: filter bar + flip cards
  --------------------------------------------------- */
  (function skillsFilterAndFlip() {
    const filterBtns = document.querySelectorAll('#skills .skills-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.dataset.filter;

        skillCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.remove('is-flipped');
          if (match) {
            card.classList.remove('is-hidden');
            card.classList.remove('is-filtering-in');
            void card.offsetWidth;
            card.classList.add('is-filtering-in');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });

    const toggleFlip = (card) => card.classList.toggle('is-flipped');

    skillCards.forEach(card => {
      card.addEventListener('click', () => toggleFlip(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFlip(card);
        }
      });
    });
  })();

  /* ---------------------------------------------------
     8. Extracurricular: filter bar
  --------------------------------------------------- */
  (function extracurricularFilter() {
    const extraFilterBar = document.querySelector('.extra-filter-bar');
    if (!extraFilterBar) return;

    const extraBtns = extraFilterBar.querySelectorAll('.skills-filter-btn');
    const timelineItems = document.querySelectorAll('#extracurricular .timeline-item');

    extraBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        extraBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.dataset.filter;

        timelineItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          if (match) {
            item.classList.remove('is-hidden');
            item.classList.remove('is-filtering-in');
            void item.offsetWidth;
            item.classList.add('is-filtering-in');
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  })();

  /* ---------------------------------------------------
     9. Certifications: lightbox
  --------------------------------------------------- */
  (function certLightbox() {
    const modal = document.getElementById('cert-modal');
    if (!modal) return;

    const modalName = document.getElementById('cert-modal-name');
    const modalIssuerBadge = document.getElementById('cert-modal-issuer');
    const modalTitle = document.getElementById('cert-modal-title');
    const modalIssuerLine = document.getElementById('cert-modal-issuer-line');

    const openModal = (card) => {
      const thumbName = card.querySelector('.cert-thumb-name');
      const thumbIssuer = card.querySelector('.cert-thumb-issuer');
      const name = card.querySelector('.cert-name');
      const issuer = card.querySelector('.cert-issuer');

      modalName.innerHTML = thumbName ? thumbName.innerHTML : '';
      modalIssuerBadge.textContent = thumbIssuer ? thumbIssuer.textContent : '';
      modalTitle.textContent = name ? name.textContent : '';
      modalIssuerLine.innerHTML = issuer ? issuer.innerHTML : '';

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    };

    document.querySelectorAll('.cert-card').forEach(card => {
      const thumb = card.querySelector('.cert-thumb');
      const btn = card.querySelector('.btn-view-cert');
      if (thumb) thumb.addEventListener('click', () => openModal(card));
      if (btn) btn.addEventListener('click', () => openModal(card));
    });

    modal.querySelectorAll('[data-cert-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  })();

  /* ---------------------------------------------------
     10. Contact: click-to-copy email with toast
  --------------------------------------------------- */
  (function contactCopy() {
    const emailLink = document.getElementById('contact-email-link');
    const toast = document.getElementById('copy-toast');
    if (!emailLink || !toast) return;

    let toastTimer;

    emailLink.addEventListener('click', (e) => {
      const email = emailLink.dataset.email;
      if (navigator.clipboard && window.isSecureContext) {
        e.preventDefault();
        navigator.clipboard.writeText(email).then(() => {
          toast.textContent = 'Copied ' + email;
          toast.classList.add('is-visible');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
        }).catch(() => {
          // Clipboard failed silently — default mailto: link still fires
        });
      }
    });
  })();

  /* ---------------------------------------------------
     11. Footer year
  --------------------------------------------------- */
  (function footerYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  })();

});
