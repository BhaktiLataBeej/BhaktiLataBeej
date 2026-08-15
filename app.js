// ============================================================
// BHAKTI LATA BEEJ — Premium App Script v4
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Initialise all modules
  initSmoothScroll();
  initHeaderBehaviour();
  initMobileMenu();
  initScrollReveal();
  initHeroAnimations();
  initJapaPhoneParallax();
  initTransformationPath();
  initMagneticButtons();
  initInteractiveJapaWidget();
  // initCourseModal(); (Removed signup)
});

// ============================================================
// 1. LENIS SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Smooth anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.6 });
      // Close mobile menu if open
      closeMobileMenu();
    });
  });
}

// ============================================================
// 2. HEADER — scroll styling
// ============================================================
function initHeaderBehaviour() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on init
}

// ============================================================
// 3. MOBILE MENU
// ============================================================
function closeMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  toggle.classList.remove('active');
  toggle.setAttribute('aria-expanded', 'false');
  menu.classList.remove('open');
}

function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');

      if (typeof gsap !== 'undefined') {
        gsap.from(menu.querySelectorAll('li'), {
          opacity: 0,
          y: -12,
          stagger: 0.06,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

// ============================================================
// 4. SCROLL REVEAL — Intersection Observer
// ============================================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          const revealSiblings = parent
            ? Array.from(parent.children).filter(c => c.classList.contains('reveal-up') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right'))
            : [];
          const idx = revealSiblings.indexOf(entry.target);
          const delay = idx > 0 ? idx * 110 : 0;

          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

// ============================================================
// 5. HERO ANIMATIONS
// ============================================================
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.from('.hero-line-1, .hero-line-2', {
    opacity: 0,
    y: 24,
    stagger: 0.18,
    duration: 1.2,
    delay: 0.4,
    ease: 'power4.out',
  });

  gsap.from('.hero-eyebrow, .hero-brand-badge', {
    opacity: 0,
    y: 12,
    duration: 1,
    delay: 0.2,
    ease: 'power4.out',
  });

  gsap.from('.hero-sub', {
    opacity: 0,
    y: 18,
    duration: 1.1,
    delay: 0.85,
    ease: 'power4.out',
  });

  gsap.from('.hero-actions', {
    opacity: 0,
    y: 14,
    duration: 1,
    delay: 1.1,
    ease: 'power4.out',
  });
}

// ============================================================
// 6. JAPA PHONE PARALLAX
// ============================================================
function initJapaPhoneParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const container = document.querySelector('.phone-mockup-container');
  if (!container) return;

  gsap.to(container, {
    scrollTrigger: {
      trigger: '#japa-sanga',
      start: 'top 80%',
      end: 'bottom center',
      scrub: 1.5,
    },
    transform: 'rotateY(-6deg) rotateX(3deg) rotateZ(1deg) translateY(-20px)',
    ease: 'none',
  });
}

// ============================================================
// 7. TRANSFORMATION PATH — counter animation
// ============================================================
function initTransformationPath() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.from('.path-step', {
    scrollTrigger: {
      trigger: '.transformation-path',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    opacity: 0,
    y: 20,
    stagger: 0.12,
    duration: 0.7,
    ease: 'power3.out',
  });
}

// ============================================================
// 8. MAGNETIC BUTTONS
// ============================================================
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  const btns = document.querySelectorAll('.btn-primary, .btn-ghost, .btn-playstore-large');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.25;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ============================================================
// 9. LIVE WEB JAPA BEAD COUNTER WIDGET
// ============================================================
function initInteractiveJapaWidget() {
  const beadCircle = document.getElementById('bead-circle');
  const beadCountEl = document.getElementById('bead-count');
  const roundCountEl = document.getElementById('round-count');
  const btnCount = document.getElementById('btn-count');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.getElementById('sound-label');
  const btnReset = document.getElementById('btn-reset-japa');

  if (!beadCircle || !btnCount) return;

  let currentBead = 1;
  let roundsCompleted = 0;
  let soundEnabled = true;
  const TOTAL_BEADS = 108;
  const DISPLAY_BEADS = 36; // Visual ring dots

  // Render visual beads around the circle
  function renderBeadCircle() {
    beadCircle.innerHTML = '';
    const radius = 135; // px from center
    for (let i = 0; i < DISPLAY_BEADS; i++) {
      const bead = document.createElement('div');
      bead.className = 'mini-bead';
      const angle = (i / DISPLAY_BEADS) * (2 * Math.PI) - Math.PI / 2;
      const x = 145 + radius * Math.cos(angle);
      const y = 145 + radius * Math.sin(angle);
      bead.style.left = `${x}px`;
      bead.style.top = `${y}px`;
      bead.dataset.index = i;
      beadCircle.appendChild(bead);
    }
    updateVisualBeads();
  }

  function updateVisualBeads() {
    const beads = beadCircle.querySelectorAll('.mini-bead');
    const activeVisualIndex = Math.floor(((currentBead - 1) / TOTAL_BEADS) * DISPLAY_BEADS);

    beads.forEach((bead, idx) => {
      if (idx === activeVisualIndex) {
        bead.className = 'mini-bead active-bead';
      } else if (idx < activeVisualIndex) {
        bead.className = 'mini-bead completed-bead';
      } else {
        bead.className = 'mini-bead';
      }
    });

    const rotDegree = ((currentBead - 1) / TOTAL_BEADS) * 360;
    beadCircle.style.transform = `rotate(-${rotDegree}deg)`;
  }

  // Web Audio Chime generator
  let audioCtx = null;
  function playBeadChime() {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      const freq = currentBead === 108 ? 880 : 523.25 + (currentBead % 12) * 15;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Ignore audio errors
    }
  }

  function countBead() {
    playBeadChime();

    if (currentBead >= TOTAL_BEADS) {
      currentBead = 1;
      roundsCompleted += 1;
      roundCountEl.textContent = roundsCompleted;

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(beadCountEl, { scale: 1.5, color: '#D45B34' }, { scale: 1, color: '#DDB96A', duration: 0.6 });
      }
    } else {
      currentBead += 1;
    }

    beadCountEl.textContent = currentBead;
    updateVisualBeads();
  }

  btnCount.addEventListener('click', countBead);

  // Spacebar shortcut when widget is in view
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      const rect = beadCircle.getBoundingClientRect();
      const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (inView) {
        e.preventDefault();
        countBead();
      }
    }
  });

  // Toggle Sound
  btnSoundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔔' : '🔕';
    soundLabel.textContent = `Sound: ${soundEnabled ? 'On' : 'Off'}`;
  });

  // Reset Japa
  btnReset.addEventListener('click', () => {
    currentBead = 1;
    roundsCompleted = 0;
    beadCountEl.textContent = '1';
    roundCountEl.textContent = '0';
    updateVisualBeads();
  });

  renderBeadCircle();
}









// ============================================================
// LEGAL / POLICIES MODAL CONTROLLER (Direct Smooth Scrolling)
// ============================================================
function initLegalModal() {
  const legalModal = document.getElementById('legal-modal');
  const modalBody = document.querySelector('.legal-modal-body');
  const closeBtn = document.getElementById('legal-modal-close');
  const tabBtns = document.querySelectorAll('.legal-tab-btn');
  const tabPanes = document.querySelectorAll('.legal-tab-pane');

  if (!legalModal || !modalBody) return;

  let currentTab = 'privacy';
  const tabScrollPositions = {
    privacy: 0,
    terms: 0,
    disclaimer: 0
  };

  let savedPageScroll = 0;

  function openLegalTab(tabId) {
    if (!legalModal.classList.contains('active')) {
      savedPageScroll = window.scrollY;
    }

    // Save scroll of previous tab
    if (currentTab && tabScrollPositions.hasOwnProperty(currentTab)) {
      tabScrollPositions[currentTab] = modalBody.scrollTop;
    }

    currentTab = tabId;

    // Update buttons
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update panes
    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `pane-${tabId}`);
    });

    legalModal.classList.add('active');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-locked');

    // Restore scroll for this tab or start at top
    modalBody.scrollTop = tabScrollPositions[tabId] || 0;

    // Focus modal body so mousewheel, touchpad, and arrow keys scroll naturally
    setTimeout(() => {
      modalBody.focus();
    }, 50);
  }

  function closeLegalModal() {
    // Save current tab scroll
    if (currentTab && tabScrollPositions.hasOwnProperty(currentTab)) {
      tabScrollPositions[currentTab] = modalBody.scrollTop;
    }

    legalModal.classList.remove('active');
    legalModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-locked');

    // Seamlessly maintain background scroll position
    window.scrollTo(0, savedPageScroll);
  }

  // Footer link triggers
  const privacyLink = document.getElementById('link-privacy');
  const termsLink = document.getElementById('link-terms');
  const disclaimerLink = document.getElementById('link-disclaimer');

  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalTab('privacy');
    });
  }

  if (termsLink) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalTab('terms');
    });
  }

  if (disclaimerLink) {
    disclaimerLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalTab('disclaimer');
    });
  }

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openLegalTab(btn.dataset.tab);
    });
  });

  // Track scroll position dynamically
  modalBody.addEventListener('scroll', () => {
    if (currentTab && tabScrollPositions.hasOwnProperty(currentTab)) {
      tabScrollPositions[currentTab] = modalBody.scrollTop;
    }
  }, { passive: true });

  // Close handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLegalModal);
  }

  legalModal.addEventListener('click', (e) => {
    if (e.target === legalModal) {
      closeLegalModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal.classList.contains('active')) {
      closeLegalModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLegalModal();
});
