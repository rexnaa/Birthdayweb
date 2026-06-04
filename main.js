/* ================================================================
   NAMSHIV'S 1ST BIRTHDAY — Main JavaScript
   All interactive features: balloon pop, scratch, countdown,
   gallery, bubbles, floating balloons, music, RSVP
   ================================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────────
   CONFIGURATION — Edit these values to update your site easily
──────────────────────────────────────────────────────────────────── */
const CONFIG = {
  /* EDIT: Party date and time (ISO 8601 format) */
  partyDateTime: '2026-06-13T18:00:00+05:30',

  /* EDIT: Venue details */
  venueName: 'Janaki Complex',
  venueAddress: 'C4HH+FMV, Kizhakkummuri \nPeringottukara, Kerala 680571',

  /* EDIT: Google Maps URL for your venue */
  mapsUrl: 'https://maps.app.goo.gl/CQCHZcr3zDwEBWSb7',

  /* 
     EDIT: Webhook URL for RSVPs (Discord Channel Webhook or Google Sheets Web App)
     - Discord URL format: https://discord.com/api/webhooks/...
     - Google Sheet URL: Paste your published Google Apps Script Web App URL.
     - Leave blank or default to fall back to direct WhatsApp messages.
  */
  rsvpWebhookUrl: 'https://script.google.com/macros/s/AKfycbzEFmMbRVwIPIUQpP2TqDeZ0F8sjGAJxZLMyuHK1688KKRna8xlNr1JbISnEGt2HToi/exec',
};

/* ──────────────────────────────────────────────────────────────────
   APPLY CONFIG TO DOM
──────────────────────────────────────────────────────────────────── */
(function applyConfig() {
  const venueNameEls = document.querySelectorAll('#venueName');
  venueNameEls.forEach(el => { if (el) el.textContent = CONFIG.venueName; });

  const venueAddr = document.getElementById('venueAddress');
  if (venueAddr) venueAddr.innerHTML = CONFIG.venueAddress.replace(/\n/g, '<br/>');

  const inviteVenue = document.getElementById('inviteVenue');
  if (inviteVenue) inviteVenue.textContent = CONFIG.venueName;

  const mapBtn = document.getElementById('mapBtn');
  if (mapBtn) mapBtn.href = CONFIG.mapsUrl;

  const waShare = document.getElementById('whatsappShare');
  if (waShare) waShare.href = CONFIG.whatsappShareUrl;
  if (mapBtn && CONFIG.mapsUrl.includes('YOUR_VENUE')) {
    mapBtn.style.opacity = '0.6';
    mapBtn.style.pointerEvents = 'none';
    mapBtn.querySelector('span:last-child').textContent = 'Location — Coming Soon';
  }
})();

/* ──────────────────────────────────────────────────────────────────
   UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────────── */
const qs = (sel) => document.querySelector(sel);
const pad = (n) => String(n).padStart(2, '0');

function randomBetween(a, b) { return a + Math.random() * (b - a); }

/* ──────────────────────────────────────────────────────────────────
   GOLD STARS (background sparkle)
──────────────────────────────────────────────────────────────────── */
(function initStars() {
  const container = document.getElementById('goldStars');
  if (!container) return;
  const symbols = ['✦', '✧', '⋆', '★', '✺'];
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('span');
    s.className = 'gold-star';
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      animation-delay: ${randomBetween(0, 5)}s;
      animation-duration: ${randomBetween(2, 5)}s;
      font-size: ${randomBetween(8, 16)}px;
    `;
    container.appendChild(s);
  }
})();

/* ──────────────────────────────────────────────────────────────────
   BUBBLE BACKGROUND (hero cover)
──────────────────────────────────────────────────────────────────── */
(function initBubbles() {
  const container = document.getElementById('bubblesBg');
  if (!container) return;

  function createBubble() {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = randomBetween(18, 60);
    b.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${randomBetween(0, 100)}%;
      animation-duration: ${randomBetween(6, 18)}s;
      animation-delay: ${randomBetween(-10, 0)}s;
    `;
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      b.classList.add('popping');
      playTick();
      setTimeout(() => b.remove(), 300);
    });
    b.addEventListener('touchstart', (e) => {
      e.preventDefault();
      b.classList.add('popping');
      playTick();
      setTimeout(() => b.remove(), 300);
    }, { passive: false });
    container.appendChild(b);
    b.addEventListener('animationend', () => {
      b.remove();
    });
  }

  // Create initial batch
  for (let i = 0; i < 12; i++) createBubble();
  // Keep spawning
  setInterval(createBubble, 1800);
})();

/* ──────────────────────────────────────────────────────────────────
   SOUND EFFECTS (Web Audio API — no file needed)
──────────────────────────────────────────────────────────────────── */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
  }
  return audioCtx;
}

function playPop() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

function playTick() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = 600;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.08);
}

function playChime() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.15;
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.start(t);
    osc.stop(t + 0.6);
  });
}

/* ──────────────────────────────────────────────────────────────────
   BALLOON POP (Section 1)
──────────────────────────────────────────────────────────────────── */
(function initBalloonPop() {
  const wrap = document.getElementById('bigBalloonWrap');
  const balloon = document.getElementById('bigBalloon');
  const particles = document.getElementById('popParticles');
  const prompt = document.getElementById('tapPrompt');
  const cover = document.getElementById('heroCover');
  if (!wrap || !balloon) return;

  let popped = false;

  const colors = ['#D4AF37', '#F2D675', '#ffffff', '#FFD700', '#FFC107', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD'];

  function doPopBalloon() {
    if (popped) return;
    popped = true;

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate([30, 10, 30]);

    playPop();

    // ── START MUSIC IMMEDIATELY ──────────────────────────────────────
    // Must be called synchronously here (still inside user-gesture chain)
    // so mobile browsers allow audio playback without restriction.
    const bgMusicEl = document.getElementById('bgMusic');
    const hasMusicSrc = bgMusicEl &&
      bgMusicEl.querySelector('source[src]:not([src=""])') !== null;
    if (bgMusicEl && hasMusicSrc && !window._musicPlaying) {
      bgMusicEl.volume = 0.45;
      bgMusicEl.play().then(() => {
        window._musicPlaying = true;
        const iconOn  = document.getElementById('musicOnIcon');
        const iconOff = document.getElementById('musicOffIcon');
        if (iconOn)  iconOn.style.display  = '';
        if (iconOff) iconOff.style.display = 'none';
      }).catch(() => { /* autoplay blocked — user can tap music button */ });
    }

    // Hide balloon
    balloon.style.transition = 'transform 0.15s ease, opacity 0.2s ease';
    balloon.style.transform = 'scale(1.4)';
    balloon.style.opacity = '0';
    if (prompt) prompt.style.opacity = '0';

    // Burst particles
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'pop-particle';
      const angle = (i / 30) * 360;
      const dist = randomBetween(80, 220);
      const rad = angle * Math.PI / 180;
      p.style.cssText = `
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        --tx: ${Math.cos(rad) * dist}px;
        --ty: ${Math.sin(rad) * dist}px;
        animation-duration: ${randomBetween(0.5, 1.1)}s;
        animation-delay: ${randomBetween(0, 0.1)}s;
        width: ${randomBetween(6, 14)}px;
        height: ${randomBetween(6, 14)}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
      `;
      particles.appendChild(p);
    }

    // Trigger confetti
    setTimeout(() => launchConfetti(80), 200);

    // Play chime
    setTimeout(playChime, 150);

    // Smooth transition to next section
    setTimeout(() => {
      cover.style.transition = 'transform 0.9s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease';
      cover.style.transform = 'scale(1.5)';
      cover.style.opacity = '0';
      const nameSection = document.getElementById('nameSection');
      if (nameSection) {
        nameSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(() => {
        cover.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'auto' });

        // Show the large scroll-down hint for elder users
        const scrollHint = document.getElementById('postPopScrollHint');
        if (scrollHint) {
          setTimeout(() => scrollHint.classList.add('visible'), 300);
          // Auto-hide once user scrolls
          window.addEventListener('scroll', function hideHint() {
            if (window.scrollY > 60) {
              scrollHint.classList.remove('visible');
              window.removeEventListener('scroll', hideHint);
            }
          }, { passive: true });
          // Also hide on tap
          scrollHint.addEventListener('click', () => {
            scrollHint.classList.remove('visible');
            window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
          });
        }
      }, 900);
    }, 700);
  }

  wrap.addEventListener('click', doPopBalloon);
  wrap.addEventListener('touchstart', (e) => {
    e.preventDefault();
    doPopBalloon();
  }, { passive: false });
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') doPopBalloon();
  });
})();

/* ──────────────────────────────────────────────────────────────────
   CONFETTI LAUNCHER
──────────────────────────────────────────────────────────────────── */
function launchConfetti(count = 60) {
  const wrap = document.getElementById('confettiWrap');
  if (!wrap) return;
  const colors = ['#D4AF37', '#F2D675', '#FFFFFF', '#FFD700', '#FFC0CB', '#87CEEB', '#98FB98', '#DDA0DD', '#FF8C00'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = randomBetween(0, 100);
    const dur = randomBetween(2.5, 5);
    const delay = randomBetween(0, 1.5);
    const rot = randomBetween(-180, 180);
    c.style.cssText = `
      left: ${left}%;
      background: ${color};
      animation: confettiFall ${dur}s ${delay}s linear forwards;
      transform: rotate(${rot}deg);
      width: ${randomBetween(6, 12)}px;
      height: ${randomBetween(10, 20)}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    wrap.appendChild(c);
    setTimeout(() => c.remove(), (dur + delay) * 1000 + 200);
  }
}

/* ──────────────────────────────────────────────────────────────────
   SCRATCH-TO-REVEAL
──────────────────────────────────────────────────────────────────── */
(function initScratch() {
  const canvas = document.getElementById('scratchCanvas');
  const hint = document.getElementById('scratchHint');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const SIZE = 280;
  canvas.width = SIZE;
  canvas.height = SIZE;

  // Draw gold scratch surface
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, '#8B6914');
  grad.addColorStop(0.3, '#C9960C');
  grad.addColorStop(0.5, '#F2D675');
  grad.addColorStop(0.7, '#C9960C');
  grad.addColorStop(1, '#8B6914');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, SIZE, SIZE, 20);
  ctx.fill();

  // Stars pattern
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let i = 0; i < 30; i++) {
    ctx.font = `${randomBetween(12, 22)}px serif`;
    ctx.fillText('✦', randomBetween(10, SIZE - 20), randomBetween(20, SIZE - 10));
  }

  // Label
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.font = 'bold 14px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ Scratch to Reveal ✨', SIZE / 2, SIZE / 2 - 4);
  ctx.fillText('👆 Use your finger!', SIZE / 2, SIZE / 2 + 22);

  let isDrawing = false;
  let revealed = false;
  let totalPixels = 0;

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function scratch(e) {
    if (!isDrawing || revealed) return;
    e.preventDefault();
    const pos = getPos(e, canvas);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
    ctx.fill();
    playTick();
    checkReveal();
  }

  function checkReveal() {
    if (revealed) return;
    const imgData = ctx.getImageData(0, 0, SIZE, SIZE);
    let transparent = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] < 128) transparent++;
    }
    const ratio = transparent / (SIZE * SIZE);
    if (ratio > 0.55) {
      revealed = true;
      canvas.style.transition = 'opacity 0.5s ease';
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      if (hint) hint.style.display = 'none';
      playChime();
      setTimeout(() => launchConfetti(100), 200);
    }
  }

  canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('mouseup', () => { isDrawing = false; });
  canvas.addEventListener('mouseleave', () => { isDrawing = false; });

  canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, { passive: false });
  canvas.addEventListener('touchmove', scratch, { passive: false });
  canvas.addEventListener('touchend', () => { isDrawing = false; });
})();

/* ──────────────────────────────────────────────────────────────────
   COUNTDOWN TIMER
──────────────────────────────────────────────────────────────────── */
(function initCountdown() {
  const target = new Date(CONFIG.partyDateTime).getTime();
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMinutes');
  const secsEl = document.getElementById('cdSeconds');
  if (!daysEl) return;

  function update() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    function setVal(el, val) {
      const formatted = pad(val);
      if (el.textContent !== formatted) {
        el.classList.remove('flip');
        void el.offsetWidth; // reflow
        el.classList.add('flip');
        el.textContent = formatted;
      }
    }
    setVal(daysEl, d);
    setVal(hoursEl, h);
    setVal(minsEl, m);
    setVal(secsEl, s);
  }

  update();
  setInterval(update, 1000);
})();

/* ──────────────────────────────────────────────────────────────────
   GALLERY LIGHTBOX
──────────────────────────────────────────────────────────────────── */
(function initGallery() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  if (!lightbox) return;

  document.querySelectorAll('.gal-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src;
      const alt = item.querySelector('img').alt;
      lbImg.src = src;
      lbImg.alt = alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Haptic
      if (navigator.vibrate) navigator.vibrate(15);
    });
  });

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

  // Swipe to close on mobile
  let touchStartY = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 80) closeLb();
  }, { passive: true });
})();
/* ================================================================
   SMART HEADER — hide on scroll-down, show on scroll-up
================================================================ */
(function initSmartHeader() {
  const header = document.getElementById('floatingHeader');
  if (!header) return;

  let lastY = 0;
  let ticking = false;

  function handleScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const hero = document.getElementById('heroCover');
      const isHeroVisible = hero && window.getComputedStyle(hero).display !== 'none';
      const heroH = isHeroVisible ? hero.offsetHeight * 0.6 : 0;

      if (y < heroH) {
        // Within hero — hide header completely
        header.classList.remove('visible', 'hidden');
      } else {
        const nameSection = document.getElementById('nameSection');
        let inNameSection = false;
        if (nameSection) {
          const rect = nameSection.getBoundingClientRect();
          if (rect.bottom > 60) {
            inNameSection = true;
          }
        }

        if (inNameSection) {
          // Fixed visible within name section
          header.classList.add('visible');
          header.classList.remove('hidden');
        } else {
          // Scrolling DOWN — hide
          if (y > lastY + 4) {
            header.classList.add('hidden');
            header.classList.remove('visible');
          } else if (y < lastY - 4) {
            // Scrolling UP — show
            header.classList.remove('hidden');
            header.classList.add('visible');
          }
        }
      }

      lastY = y;
      ticking = false;
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
})();


/* ──────────────────────────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
──────────────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const sections = document.querySelectorAll('.reveal-section');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  sections.forEach(s => obs.observe(s));
})();

(function initMusic() {
  const ctrl = document.getElementById('musicCtrl');
  const bgMusic = document.getElementById('bgMusic');
  const iconOn = document.getElementById('musicOnIcon');
  const iconOff = document.getElementById('musicOffIcon');
  if (!ctrl || !bgMusic) return;

  let playing = false;

  // Check if there's a source
  const hasSrc = bgMusic.querySelector('source[src]:not([src=""])') !== null ||
    (bgMusic.src && bgMusic.src !== window.location.href);

  if (!hasSrc) {
    ctrl.title = 'Add audio/birthday_music.mp3 to enable music';
    ctrl.style.opacity = '0.45';
  }

  function toggle() {
    if (!hasSrc) {
      // Visual feedback that music file is not set
      ctrl.style.transform = 'scale(0.9)';
      setTimeout(() => ctrl.style.transform = '', 200);
      return;
    }
    getAudioCtx(); // unlock audio context
    if (playing) {
      bgMusic.pause();
      playing = false;
      iconOn.style.display = 'none';
      iconOff.style.display = '';
    } else {
      bgMusic.volume = 0.45;
      bgMusic.play().catch(() => { });
      playing = true;
      iconOn.style.display = '';
      iconOff.style.display = 'none';
    }
    if (navigator.vibrate) navigator.vibrate(15);
  }

  ctrl.addEventListener('click', toggle);
  ctrl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') toggle();
  });

  // Auto-play attempt after user first interaction
  // (skipped if music already started from balloon pop)
  document.addEventListener('click', function firstInteraction() {
    document.removeEventListener('click', firstInteraction);
    if (hasSrc && !playing && !window._musicPlaying) {
      bgMusic.volume = 0.35;
      bgMusic.play().then(() => {
        playing = true;
        window._musicPlaying = true;
        iconOn.style.display = '';
        iconOff.style.display = 'none';
      }).catch(() => { });
    }
  }, { once: true });

  // Sync icon state if music was started externally (e.g. balloon pop)
  bgMusic.addEventListener('play', () => {
    playing = true;
    window._musicPlaying = true;
    iconOn.style.display  = '';
    iconOff.style.display = 'none';
  });
  bgMusic.addEventListener('pause', () => {
    playing = false;
    window._musicPlaying = false;
    iconOn.style.display  = 'none';
    iconOff.style.display = '';
  });
})();

/* ──────────────────────────────────────────────────────────────────
   RSVP FORM
──────────────────────────────────────────────────────────────────── */
(function initRSVP() {
  const form = document.getElementById('rsvpForm');
  const success = document.getElementById('rsvpSuccess');
  const btn = document.getElementById('rsvpSubmitBtn');
  if (!form) return;

  // Dynamic button text based on guest count
  const guestsInput = document.getElementById('rsvpGuests');
  const btnText = document.getElementById('rsvpBtnText');
  function updateBtnText() {
    const n = parseInt(guestsInput ? guestsInput.value : 1) || 1;
    if (btnText) btnText.innerHTML = n > 1 ? 'Count Us In! <i class="ph-fill ph-confetti"></i>' : 'Count Me In! <i class="ph-fill ph-confetti"></i>';
  }
  if (guestsInput) { guestsInput.addEventListener('input', updateBtnText); updateBtnText(); }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvpName').value.trim();
    const phone = document.getElementById('rsvpPhone').value.trim();
    const attending = document.getElementById('rsvpAttending').value;
    const guests = document.getElementById('rsvpGuests').value;
    const message = document.getElementById('rsvpMessage').value.trim();

    // Validation
    if (!name) { alert('Please enter your name.'); return; }
    if (!phone) { alert('Please enter your WhatsApp number.'); return; }
    if (!attending) { alert('Please select attendance status.'); return; }

    // Visual feedback
    btn.innerHTML = '<span class="rsvp-btn-text">Sending... <i class="ph-fill ph-heart"></i></span>';
    btn.disabled = true;

    const attendingMap = {
      'yes_all': "Yes, I'll be there! 🎉",
      'yes_some': "Coming, but might be late",
      'no': "Sorry, can't make it 😢"
    };

    const rsvpData = {
      name,
      phone,
      attending: attendingMap[attending] || attending,
      guests,
      message,
      timestamp: new Date().toISOString()
    };

    function completeRSVP() {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
      playChime();
      launchConfetti(60);
      if (navigator.vibrate) navigator.vibrate([50, 20, 50, 20, 100]);
    }

    // Store locally too
    try {
      const rsvps = JSON.parse(localStorage.getItem('namshiv_rsvps') || '[]');
      rsvps.push(rsvpData);
      localStorage.setItem('namshiv_rsvps', JSON.stringify(rsvps));
    } catch (e) { }

    const hasWebhook = CONFIG.rsvpWebhookUrl &&
      CONFIG.rsvpWebhookUrl.trim() !== '' &&
      !CONFIG.rsvpWebhookUrl.includes('YOUR_DISCORD_OR_SHEETS_WEBHOOK_URL');

    if (hasWebhook) {
      let fetchPromise;
      if (CONFIG.rsvpWebhookUrl.includes('discord.com/api/webhooks/')) {
        // Send to Discord
        const discordPayload = {
          embeds: [{
            title: "🎉 New RSVP Received! 🎉",
            description: `**Namshiv's 1st Birthday Invitation Response**`,
            color: 13937463, // Gold #D4AF37
            fields: [
              { name: "👤 Guest Name", value: name, inline: true },
              { name: "📞 WhatsApp Number", value: phone, inline: true },
              { name: "✨ Status", value: attendingMap[attending] || attending, inline: true },
              { name: "👥 Number of Guests", value: String(guests), inline: true },
              { name: "💌 Message/Wishes", value: message || "_None_" }
            ],
            footer: { text: "Sent via Namshiv's Invitation Site 🎈" },
            timestamp: new Date().toISOString()
          }]
        };
        fetchPromise = fetch(CONFIG.rsvpWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordPayload)
        });
      } else {
        // Google Sheets / Custom webhook Web App
        
        const rsvpPayload = {
          name,
          phone,
          attending: attendingMap[attending] || attending,
          guests,
          message,
          timestamp: new Date().toISOString()
        };

        fetchPromise = fetch(CONFIG.rsvpWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rsvpPayload)
        });
      }

      fetchPromise
        .then(() => {
          setTimeout(completeRSVP, 400);
        })
        .catch(err => {
          console.error("Webhook submission failed, showing local success:", err);
          setTimeout(completeRSVP, 400);
        });
    } else {
      console.warn("No webhook URL configured in CONFIG. RSVP saved locally only.");
      setTimeout(completeRSVP, 600);
    }
  });
})();

/* ──────────────────────────────────────────────────────────────────
   PARALLAX SHIMMER on scroll (subtle gold glow)
──────────────────────────────────────────────────────────────────── */
(function initParallax() {
  const glow = qs('.name-bg-glow');
  if (!glow) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.3;
    glow.style.transform = `translateX(-50%) translateY(${y}px)`;
  }, { passive: true });
})();

/* ──────────────────────────────────────────────────────────────────
   TOUCH RIPPLE on interactive elements
──────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.map-btn, .rsvp-submit, .whatsapp-share').forEach(el => {
  el.addEventListener('touchstart', function (e) {
    this.style.transform = 'scale(0.97)';
  }, { passive: true });
  el.addEventListener('touchend', function () {
    this.style.transform = '';
  }, { passive: true });
});

/* ──────────────────────────────────────────────────────────────────
   SPOTLIGHT CARD — tap ripple on mobile
──────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    if (img) {
      // Show overlay text briefly
      const overlay = card.querySelector('.sc-overlay');
      if (overlay) {
        overlay.style.opacity = '1';
        setTimeout(() => { overlay.style.opacity = ''; }, 1500);
      }
    }
    playTick();
  });
});

/* ──────────────────────────────────────────────────────────────────
   LOG stored RSVPs (accessible via browser console: window.getRSVPs())
──────────────────────────────────────────────────────────────────── */
window.getRSVPs = function () {
  const data = JSON.parse(localStorage.getItem('namshiv_rsvps') || '[]');
  console.table(data);
  return data;
};

console.log('%c🎈 Namshiv\'s 1st Birthday Website 🎈', 'color: #D4AF37; font-size: 18px; font-weight: bold;');
console.log('%cTo view RSVPs: type getRSVPs() in console', 'color: #F2D675;');

/* ──────────────────────────────────────────────────────────────────
   EMOJI GOLD COLORIZER
──────────────────────────────────────────────────────────────────── */
(function colorizeEmojis() {
  const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
  function wrapEmojis(node) {
    if (node.nodeType === 3) {
      const match = node.nodeValue.match(emojiRegex);
      if (match) {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(emojiRegex, '<span class="gold-emoji">$&</span>');
        node.parentNode.replaceChild(span, node);
      }
    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && node.nodeName !== 'OPTION' && node.nodeName !== 'TEXTAREA' && node.className !== 'gold-emoji') {
      Array.from(node.childNodes).forEach(wrapEmojis);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => wrapEmojis(document.body));
  } else {
    wrapEmojis(document.body);
  }
})();
/* ================================================================
   NAMSHIV'S 1ST BIRTHDAY — Anti-Gravity 3D Scene
   Three.js r128 + GSAP 3 ScrollTrigger
   Scroll-triggered floating 3D objects with parallax depth
================================================================ */
(function initAntiGravity() {
  'use strict';

  const canvas  = document.getElementById('agCanvas');
  if (!canvas || typeof THREE === 'undefined' || typeof gsap === 'undefined') return;

  /* ── Register GSAP plugin ── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── Palette — soft warm pastels + golds ── */
  const PALETTE = [
    0xE8C96A, // gold
    0xF2D675, // gold light
    0xC9A84C, // gold mid
    0xFFB3C6, // soft rose
    0xFFCE85, // warm peach
    0xB5EAD7, // mint green
    0xC7CEEA, // periwinkle
    0xFFDAC1, // salmon
    0xE2F0CB, // light lime
    0xFDE2E4, // blush
    0xDDD8FF, // lavender
    0xFFF1BA, // champagne
  ];

  /* ── Scene setup ── */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // transparent background

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 18);

  /* ── Lighting ── */
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);

  const dirLight1 = new THREE.DirectionalLight(0xffe8a0, 1.2);
  dirLight1.position.set(5, 10, 8);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffc8e0, 0.5);
  dirLight2.position.set(-6, -4, 4);
  scene.add(dirLight2);

  /* ── Create meshes (Responsive count) ── */
  const isMobile = window.innerWidth < 768;
  const COUNT = isMobile ? 20 : 40;
  const meshes  = [];
  const seeds   = []; // per-mesh random data for drift animation

  for (let i = 0; i < COUNT; i++) {
    const isBox   = Math.random() > 0.55;
    const size    = 0.3 + Math.random() * 0.85;
    const color   = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const depth   = -4 + Math.random() * 8; // z-depth: -4 (back) to +4 (front)

    let geo;
    if (isBox) {
      geo = new THREE.BoxGeometry(size, size, size);
    } else {
      const seg = Math.random() > 0.4 ? 16 : 8;
      geo = new THREE.SphereGeometry(size * 0.55, seg, seg);
    }

    const mat = new THREE.MeshPhongMaterial({
      color,
      shininess:  80 + Math.random() * 80,
      specular:   new THREE.Color(0xffffff),
      transparent: true,
      opacity:     0.82 + Math.random() * 0.18,
    });

    const mesh = new THREE.Mesh(geo, mat);

    /* ── Scatter at bottom of page viewport ── */
    const spreadX = 26;
    const startY  = -15 - Math.random() * 10;   // start below centre

    mesh.position.set(
      (Math.random() - 0.5) * spreadX,
      startY,
      depth
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    scene.add(mesh);
    meshes.push(mesh);

    /* ── Per-mesh drift seed ── */
    seeds.push({
      rx: (Math.random() - 0.5) * 0.006,
      ry: (Math.random() - 0.5) * 0.010,
      rz: (Math.random() - 0.5) * 0.005,
      swayAmp:   0.015 + Math.random() * 0.02,
      swaySpeed: 0.4  + Math.random() * 0.8,
      swayOff:   Math.random() * Math.PI * 2,
    });
  }

  /* ── GSAP ScrollTrigger — form the number "1" ── */
  let scrollProgress = 0;
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
    onUpdate: (self) => { scrollProgress = self.progress; }
  });

  const targetCoords = [
    {x: -1.5, y: 2}, {x: -1, y: 2.5}, {x: -1, y: 1}, 
    {x: -1, y: 0}, {x: -1, y: -1}, {x: -1.5, y: -2}, 
    {x: -1, y: -2}, {x: -0.5, y: -2}
  ];
  const SHAPE_SCALE = 3.5;

  meshes.forEach((mesh, i) => {
    const tCoord = targetCoords[i % targetCoords.length];
    const endX = tCoord.x * SHAPE_SCALE;
    const endY = tCoord.y * SHAPE_SCALE;
    
    gsap.to(mesh.position, {
      x: endX,
      y: endY,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        scroller: window,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });
  });

  /* ── Resize handler ── */
  function onResize() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }
  onResize();
  window.addEventListener('resize', onResize, { passive: true });

  /* ── Render loop — continuous gentle rotation + sway ── */
  let frameId;
  let clock = 0;

  function animate() {
    frameId = requestAnimationFrame(animate);
    clock += 0.016;

    const dampen = Math.max(0, 1 - scrollProgress);

    meshes.forEach((mesh, i) => {
      const s = seeds[i];
      // Gentle continuous rotation dampens to 0 at bottom
      mesh.rotation.x += s.rx * dampen;
      mesh.rotation.y += s.ry * dampen;
      mesh.rotation.z += s.rz * dampen;
      // Subtle sway (horizontal bob) dampens to 0
      mesh.position.x += Math.sin(clock * s.swaySpeed + s.swayOff) * s.swayAmp * 0.04 * dampen;
    });

    renderer.render(scene, camera);
  }

  // Start immediately
  animate();
})();
