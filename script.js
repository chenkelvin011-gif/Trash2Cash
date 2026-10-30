/* ============================================================
   TRASH2CASH — EXHIBITION WEBSITE
   Interactive JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. NAVBAR — scroll state + progress + mobile toggle
  // ============================================================
  const navbar   = document.getElementById('navbar');
  const progress = document.getElementById('navProgress');
  const burger   = document.getElementById('navBurger');
  const mobileNav = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    // Scrolled style
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Progress bar
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    progress.style.width = ((scrolled / total) * 100) + '%';
  }, { passive: true });

  // Mobile burger
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });

  // ============================================================
  // 2. SCROLL REVEAL — IntersectionObserver
  // ============================================================
  const revealEls = document.querySelectorAll('.scroll-reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.animationDelay || '0s';
        const ms = parseFloat(delay) * 1000 || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, ms);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  // ============================================================
  // 3. HERO CANVAS — Particles & Data Points
  // ============================================================
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let W, H, particles = [];

    function resizeHeroCanvas() {
      W = heroCanvas.width  = heroCanvas.offsetWidth;
      H = heroCanvas.height = heroCanvas.offsetHeight;
    }
    resizeHeroCanvas();
    window.addEventListener('resize', resizeHeroCanvas);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * W;
        this.y    = Math.random() * H;
        this.r    = Math.random() * 2 + 0.5;
        this.vx   = (Math.random() - 0.5) * 0.3;
        this.vy   = (Math.random() - 0.5) * 0.3 - 0.2;
        this.life = Math.random();
        this.type = Math.random() > 0.7 ? 'data' : 'particle';
        this.color = this.type === 'data'
          ? `rgba(200,241,53,${Math.random() * 0.2 + 0.05})`
          : `rgba(34,197,94,${Math.random() * 0.12 + 0.04})`;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.002;
        if (this.life <= 0 || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
          this.reset();
          this.y = H + 10;
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        if (this.type === 'data') {
          // Square data point
          ctx.fillRect(this.x - 1, this.y - 1, 3, 3);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // Connection lines between nearby particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 80) * 0.08;
            ctx.strokeStyle = 'rgba(45,139,78,0.12)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    // Init
    for (let i = 0; i < 90; i++) particles.push(new Particle());

    function animateHero() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateHero);
    }
    animateHero();
  }

  // ============================================================
  // 4. HERO TRANSFORM — Cycle active items
  // ============================================================
  let tCurrent = 0;
  const tItems = document.querySelectorAll('.transform-item');
  setInterval(() => {
    tItems.forEach(el => el.classList.remove('active'));
    tCurrent = (tCurrent + 1) % tItems.length;
    tItems[tCurrent].classList.add('active');
  }, 1600);

  // ============================================================
  // 5. IDEA FLOW — Animate steps on scroll
  // ============================================================
  const flowSteps = document.querySelectorAll('.flow-step');
  const ideaObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        flowSteps.forEach((step, i) => {
          setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
          }, i * 120);
        });
        ideaObs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  flowSteps.forEach(step => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(20px)';
    step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  const ideaSection = document.getElementById('idea');
  if (ideaSection) ideaObs.observe(ideaSection);

  // ============================================================
  // 6. IoT TOGGLE VIEW
  // ============================================================
  window.setIoTView = function(view) {
    const simple    = document.getElementById('iotSimple');
    const tech      = document.getElementById('iotTech');
    const btnSimple = document.getElementById('toggleSimple');
    const btnTech   = document.getElementById('toggleTech');

    if (view === 'simple') {
      simple.classList.remove('hidden');
      tech.classList.add('hidden');
      btnSimple.classList.add('active');
      btnTech.classList.remove('active');
    } else {
      tech.classList.remove('hidden');
      simple.classList.add('hidden');
      btnTech.classList.add('active');
      btnSimple.classList.remove('active');
    }
  };

  // ============================================================
  // 7. USER JOURNEY SIMULATION
  // ============================================================
  const journeyData = [
    {
      icon: '🎒',
      title: 'Membawa Botol',
      desc:  'Pengguna datang ke titik pengumpulan Trash2Cash membawa botol plastik yang sudah tidak terpakai.'
    },
    {
      icon: '📥',
      title: 'Memasukkan Botol',
      desc:  'Botol dimasukkan ke dalam slot sistem Trash2Cash. Proses dimulai secara otomatis.'
    },
    {
      icon: '🔍',
      title: 'Sistem Mendeteksi',
      desc:  'Sensor IoT mendeteksi dan memvalidasi bahwa objek yang dimasukkan adalah botol plastik.'
    },
    {
      icon: '💾',
      title: 'Data Tercatat',
      desc:  'Transaksi dicatat secara digital — memberikan transparansi dan keterlacakan penuh.'
    },
    {
      icon: '🎁',
      title: 'Reward Diterima',
      desc:  'Pengguna memperoleh insentif sesuai mekanisme yang diterapkan. Aksi kecil, nilai nyata!'
    }
  ];

  let jCurrent = 0;

  function updateJourney(index) {
    const data     = journeyData[index];
    const screen   = document.getElementById('jscreenContent');
    const prev     = document.getElementById('jPrev');
    const next     = document.getElementById('jNext');
    const indicator = document.getElementById('jIndicator');

    // Fade out
    screen.style.opacity  = '0';
    screen.style.transform = 'translateY(10px)';

    setTimeout(() => {
      screen.innerHTML = `
        <div class="jscreen-icon">${data.icon}</div>
        <h3 class="jscreen-title">${data.title}</h3>
        <p class="jscreen-desc">${data.desc}</p>
      `;
      screen.style.opacity  = '1';
      screen.style.transform = 'translateY(0)';
    }, 200);

    screen.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

    // Update step highlights
    document.querySelectorAll('.journey-step').forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });

    // Update nav
    prev.disabled = (index === 0);
    next.disabled = (index === journeyData.length - 1);
    if (index === journeyData.length - 1) {
      next.textContent = '✓ Selesai';
      next.classList.add('primary');
    } else {
      next.textContent = 'Selanjutnya →';
    }
    indicator.textContent = `${index + 1} / ${journeyData.length}`;
  }

  // Step click handlers
  document.querySelectorAll('.journey-step').forEach((step, i) => {
    step.addEventListener('click', () => {
      jCurrent = i;
      updateJourney(jCurrent);
    });
  });

  window.journeyNext = function() {
    if (jCurrent < journeyData.length - 1) {
      jCurrent++;
      updateJourney(jCurrent);
    }
  };
  window.journeyPrev = function() {
    if (jCurrent > 0) {
      jCurrent--;
      updateJourney(jCurrent);
    }
  };

  // Init first step
  updateJourney(0);

  // ============================================================
  // 8. BOTTLE WOBBLE — staggered animation
  // ============================================================
  document.querySelectorAll('.bottle-pile span').forEach((span, i) => {
    span.style.setProperty('--i', i);
    span.style.animationDelay = (i * 0.15) + 's';
  });

  // ============================================================
  // 9. CTA CANVAS — Starfield / Data Particles
  // ============================================================
  const ctaCanvas = document.getElementById('ctaCanvas');
  if (ctaCanvas) {
    const cc  = ctaCanvas.getContext('2d');
    let cW, cH, cParticles = [];

    function resizeCta() {
      cW = ctaCanvas.width  = ctaCanvas.offsetWidth;
      cH = ctaCanvas.height = ctaCanvas.offsetHeight;
    }
    resizeCta();
    window.addEventListener('resize', resizeCta);

    class CtaParticle {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * cW;
        this.y    = Math.random() * cH;
        this.r    = Math.random() * 1.5 + 0.3;
        this.vy   = -(Math.random() * 0.4 + 0.1);
        this.vx   = (Math.random() - 0.5) * 0.15;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.dAlpha = (Math.random() > 0.5 ? 1 : -1) * 0.005;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha += this.dAlpha;
        if (this.alpha > 0.6 || this.alpha < 0.05) this.dAlpha *= -1;
        if (this.y < -10) { this.y = cH + 10; this.x = Math.random() * cW; }
      }
      draw() {
        cc.save();
        cc.globalAlpha = this.alpha;
        cc.fillStyle = 'rgba(200,241,53,0.6)';
        cc.beginPath();
        cc.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        cc.fill();
        cc.restore();
      }
    }

    for (let i = 0; i < 70; i++) cParticles.push(new CtaParticle());

    function animateCta() {
      cc.clearRect(0, 0, cW, cH);
      cParticles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateCta);
    }
    animateCta();
  }

  // ============================================================
  // 10. SMOOTH SCROLL for all anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        mobileNav.classList.remove('open');
      }
    });
  });

  // ============================================================
  // 11. SWOT CARDS — staggered reveal
  // ============================================================
  const swotCards = document.querySelectorAll('.swot-card');
  const swotObs   = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        swotCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity  = '1';
            card.style.transform = 'translateY(0)';
          }, i * 100);
        });
        swotObs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  swotCards.forEach(card => {
    card.style.opacity  = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  const swotSection = document.getElementById('swot');
  if (swotSection) swotObs.observe(swotSection);

  // ============================================================
  // 12. TIMELINE — staggered reveal
  // ============================================================
  const tlItems  = document.querySelectorAll('.timeline-item');
  const tlObs    = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tlItems.forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity  = '1';
            item.style.transform = 'translateX(0)';
          }, i * 120);
        });
        tlObs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  tlItems.forEach(item => {
    item.style.opacity  = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  const futureSection = document.getElementById('future');
  if (futureSection) tlObs.observe(futureSection);

  // ============================================================
  // 13. STEP CARDS — staggered reveal
  // ============================================================
  const stepCards = document.querySelectorAll('.step-card');
  const stepObs   = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stepCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity  = '1';
            card.style.transform = 'translateY(0)';
          }, i * 100);
        });
        stepObs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  stepCards.forEach(card => {
    card.style.opacity  = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  const howSection = document.getElementById('how-it-works');
  if (howSection) stepObs.observe(howSection);

  // ============================================================
  // 14. SDG CARD hover tilt
  // ============================================================
  document.querySelectorAll('.sdg-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
  });

  // ============================================================
  // 15. VALUE ECOSYSTEM — animated flow highlight
  // ============================================================
  const ecoNodes  = document.querySelectorAll('.eco-node');
  const ecoArrows = document.querySelectorAll('.eco-arrow');
  let ecoIdx = 0;
  setInterval(() => {
    ecoNodes.forEach(n => n.style.filter = '');
    if (ecoNodes[ecoIdx]) {
      ecoNodes[ecoIdx].style.filter = 'brightness(1.3)';
    }
    ecoIdx = (ecoIdx + 1) % ecoNodes.length;
  }, 900);

  // ============================================================
  // 16. COUNTER animation (placeholder = 0)
  // ============================================================
  // Future implementation note: Replace with actual data when available
  // Values are kept at 0 as they are prototypes/placeholders

  console.log('%c🌿 Trash2Cash Exhibition Website Loaded', 'color: #5dba6b; font-weight: bold; font-size: 14px;');
  console.log('%cBuang Botol, Dapat Uang! — IoT Sustainability Innovation', 'color: #a8d5a2; font-size: 11px;');

});

// ============================================================
// 17. PHONE MOCKUP — Slide switcher + auto-rotate
// ============================================================
let phoneSlideIdx = 0;
const phoneSlideCount = 3;

window.setPhoneSlide = function(idx) {
  const slides = document.querySelectorAll('.phone-slide');
  const dots   = document.querySelectorAll('.phone-dot');
  if (!slides.length) return;

  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  phoneSlideIdx = idx;
  if (slides[idx]) slides[idx].classList.add('active');
  if (dots[idx])   dots[idx].classList.add('active');
};

// Auto-rotate phone slides
setInterval(() => {
  setPhoneSlide((phoneSlideIdx + 1) % phoneSlideCount);
}, 4000);

// ============================================================
// 18. COMING SOON TOAST
// ============================================================
window.showComingSoon = function(e, store) {
  e.preventDefault();
  const toast    = document.getElementById('csToast');
  const title    = document.getElementById('csToastTitle');
  const sub      = document.getElementById('csToastSub');

  if (!toast) return;
  title.textContent = `${store} — Segera Hadir!`;
  sub.textContent   = 'Aplikasi sedang dalam pengembangan aktif';

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
};

// ============================================================
// 19. WAITLIST FORM
// ============================================================
window.handleWaitlist = function(e) {
  e.preventDefault();
  const email  = document.getElementById('waitlistEmail');
  const btn    = document.querySelector('.waitlist-btn');
  const note   = document.getElementById('waitlistNote');
  const btnTxt = document.getElementById('waitlistBtnText');

  if (!email || !email.value) return;
  if (btn) btn.disabled = true;
  if (btnTxt) btnTxt.textContent = 'Mendaftar...';

  // Static mode — simulate submission
  // To connect to a real backend, replace this setTimeout with a fetch() call
  setTimeout(() => {
    if (note) {
      note.textContent = `✅ ${email.value} berhasil didaftarkan! Kami akan menghubungimu.`;
      note.style.color = '#4caf71';
    }
    if (email) email.value = '';
    if (btn) btn.disabled = false;
    if (btnTxt) btnTxt.textContent = 'Daftarkan Saya';
  }, 1000);
};

// ============================================================
// 20. CONTACT FORM — Validation + Submit
// ============================================================
// Character counter
const msgArea = document.getElementById('cfMessage');
const charCnt = document.getElementById('charCount');
if (msgArea && charCnt) {
  msgArea.addEventListener('input', () => {
    const len = msgArea.value.length;
    charCnt.textContent = len;
    charCnt.style.color = len > 900 ? '#e74c3c' : '';
    if (len > 1000) msgArea.value = msgArea.value.slice(0, 1000);
  });
}

// Inline validation on blur
['cfName','cfEmail','cfSubject','cfMessage','cfCategory'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('blur', () => validateField(el));
  el.addEventListener('input', () => {
    el.classList.remove('error');
    const errEl = document.getElementById('err' + id.replace('cf', ''));
    if (errEl) errEl.textContent = '';
  });
});

function validateField(el) {
  const errId = 'err' + el.id.replace('cf', '');
  const errEl = document.getElementById(errId);
  let msg = '';

  if (el.id === 'cfEmail' && el.value) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(el.value)) msg = 'Format email tidak valid.';
  }
  if (!el.value.trim() && el.required) {
    msg = 'Field ini wajib diisi.';
  }

  if (errEl) errEl.textContent = msg;
  if (msg) {
    el.classList.add('error');
    return false;
  } else {
    el.classList.remove('error');
    return true;
  }
}

window.handleContact = function(e) {
  e.preventDefault();
  const fields = ['cfName','cfEmail','cfCategory','cfSubject','cfMessage'];
  let valid = true;

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && !validateField(el)) valid = false;
  });

  if (!valid) return;

  const btn    = document.getElementById('formSubmitBtn');
  const btnTxt = document.getElementById('formBtnText');
  const spin   = document.getElementById('formSpinner');
  const form   = document.getElementById('contactForm');
  const succ   = document.getElementById('formSuccess');

  if (btn) btn.disabled = true;
  if (btnTxt) btnTxt.textContent = 'Mengirim...';
  if (spin) spin.style.display = 'block';

  // Static mode — simulate submission
  // To connect to a real backend, replace this setTimeout with a fetch() call
  setTimeout(() => {
    if (form) form.style.display = 'none';
    if (succ) succ.style.display = 'block';
    if (btn) btn.disabled = false;
    if (btnTxt) btnTxt.textContent = 'Kirim Pesan';
    if (spin) spin.style.display = 'none';
  }, 1400);
};

window.resetForm = function() {
  const form = document.getElementById('contactForm');
  const succ = document.getElementById('formSuccess');
  if (form) { form.reset(); form.style.display = 'block'; }
  if (succ) succ.style.display = 'none';
  const charCntEl = document.getElementById('charCount');
  if (charCntEl) charCntEl.textContent = '0';
};

// ============================================================
// 21. FAQ ACCORDION
// ============================================================
window.toggleFaq = function(item) {
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  // Open clicked if it was closed
  if (!isOpen) item.classList.add('open');
};

// ============================================================
// 22. TEAM CARDS — staggered reveal
// ============================================================
const teamCards  = document.querySelectorAll('.team-card');
const teamObs    = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      teamCards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity  = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80);
      });
      teamObs.disconnect();
    }
  });
}, { threshold: 0.2 });

teamCards.forEach(card => {
  card.style.opacity  = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});
const aboutSection = document.getElementById('about');
if (aboutSection) teamObs.observe(aboutSection);

// ============================================================
// 23. CV CARDS — staggered reveal
// ============================================================
const cvCards = document.querySelectorAll('.cv-card');
const cvObs   = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      cvCards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity  = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80);
      });
      cvObs.disconnect();
    }
  });
}, { threshold: 0.2 });

cvCards.forEach(card => {
  card.style.opacity  = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});
if (aboutSection) cvObs.observe(aboutSection);

// ============================================================
// 24. VISI MISI CARDS — reveal
// ============================================================
const vmCards = document.querySelectorAll('.visi-misi-card');
const vmObs   = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      vmCards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity  = '1';
          card.style.transform = 'translateX(0)';
        }, i * 120);
      });
      vmObs.disconnect();
    }
  });
}, { threshold: 0.2 });

vmCards.forEach(card => {
  card.style.opacity  = '0';
  card.style.transform = 'translateX(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});
if (aboutSection) vmObs.observe(aboutSection);

// ============================================================
// 25. APP FEATURES — stagger on scroll
// ============================================================
const appFeats = document.querySelectorAll('.app-feat');
const appObs   = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      appFeats.forEach((feat, i) => {
        setTimeout(() => {
          feat.style.opacity  = '1';
          feat.style.transform = 'translateX(0)';
        }, i * 70);
      });
      appObs.disconnect();
    }
  });
}, { threshold: 0.2 });

appFeats.forEach(feat => {
  feat.style.opacity  = '0';
  feat.style.transform = 'translateX(-16px)';
  feat.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});
const appSection = document.getElementById('app');
if (appSection) appObs.observe(appSection);

// ============================================================
// 26. CONTACT CARDS — stagger reveal
// ============================================================
const ccCards = document.querySelectorAll('.contact-card');
const ccObs   = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      ccCards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity  = '1';
          card.style.transform = 'translateX(0)';
        }, i * 80);
      });
      ccObs.disconnect();
    }
  });
}, { threshold: 0.2 });

ccCards.forEach(card => {
  card.style.opacity  = '0';
  card.style.transform = 'translateX(-16px)';
  card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});
const contactSection = document.getElementById('contact');
if (contactSection) ccObs.observe(contactSection);


// ============================================================
// MACHINE ANIMATION — Full bottle-to-reward demo
// ============================================================
let machineAnimRunning = false;
let machineAnimTimeouts = [];

function mTimeout(fn, delay) {
  machineAnimTimeouts.push(setTimeout(fn, delay));
}

window.resetMachineAnim = function () {
  // Clear all pending timeouts
  machineAnimTimeouts.forEach(clearTimeout);
  machineAnimTimeouts = [];
  machineAnimRunning = false;

  // Reset DOM states
  const person      = document.getElementById('mPerson');
  const bottleFly   = document.getElementById('mBottleFly');
  const bottleIn    = document.getElementById('mBottleInside');
  const scanBeam    = document.getElementById('mScanBeam');
  const dataParts   = document.getElementById('mDataParticles');
  const reward      = document.getElementById('mReward');
  const progressFill= document.getElementById('mProgressFill');
  const playBtn     = document.getElementById('mPlayBtn');
  const resetBtn    = document.getElementById('mResetBtn');
  const scene       = document.getElementById('machineScene');
  const ledStrip    = document.getElementById('mLedStrip');

  if (person)      { person.className = 'mscene-person'; }
  if (bottleFly)   { bottleFly.className = 'mscene-bottle-fly'; }
  if (bottleIn)    { bottleIn.className = 'machine-bottle-inside'; }
  if (scanBeam)    { scanBeam.className = 'machine-scan-beam'; }
  if (dataParts)   { dataParts.className = 'machine-data-particles'; }
  if (reward)      { reward.className = 'mscene-reward'; }
  if (progressFill){ progressFill.style.width = '0%'; }
  if (scene)       { scene.className = 'machine-scene'; }

  // Remove confetti
  document.querySelectorAll('.confetti-piece').forEach(el => el.remove());

  // Reset screen text
  setMachineScreen('TRASH2CASH', 'Masukkan botol...', 'untuk memulai');

  // Reset step labels
  showMachineStep(1);

  // Reset progress dots
  document.querySelectorAll('.mp-step').forEach(s => s.classList.remove('active'));

  // Buttons
  if (playBtn)  { playBtn.style.display = 'inline-flex'; playBtn.disabled = false; }
  if (resetBtn) { resetBtn.style.display = 'none'; }
};

function setMachineScreen(l1, l2, l3) {
  const s1 = document.getElementById('mScreenLine1');
  const s2 = document.getElementById('mScreenLine2');
  const s3 = document.getElementById('mScreenLine3');
  if (s1) s1.textContent = l1;
  if (s2) s2.textContent = l2;
  if (s3) s3.textContent = l3;
}

function showMachineStep(n) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById('mlStep' + i);
    if (!el) continue;
    if (i === n) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }
}

function setProgress(pct, stepIdx) {
  const fill = document.getElementById('mProgressFill');
  if (fill) fill.style.width = pct + '%';

  document.querySelectorAll('.mp-step').forEach((s, i) => {
    s.classList.toggle('active', i <= stepIdx);
  });
}

function spawnConfetti(scene) {
  if (!scene) return;
  const colors = ['#f1c40f', '#4caf71', '#e74c3c', '#3498db', '#a8d5a2', '#f39c12'];
  for (let i = 0; i < 22; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = (Math.random() * 80 + 10) + '%';
    piece.style.top  = (Math.random() * 40 + 30) + '%';
    piece.style.setProperty('--cx', (Math.random() * 120 - 60) + 'px');
    piece.style.setProperty('--cy', (Math.random() * -120 - 20) + 'px');
    piece.style.setProperty('--cr', (Math.random() * 360) + 'deg');
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    scene.appendChild(piece);
    // trigger reflow then add class
    requestAnimationFrame(() => {
      setTimeout(() => piece.classList.add('burst'), 10);
    });
  }
}

window.startMachineAnim = function () {
  if (machineAnimRunning) return;
  machineAnimRunning = true;

  const person    = document.getElementById('mPerson');
  const bottleFly = document.getElementById('mBottleFly');
  const bottleIn  = document.getElementById('mBottleInside');
  const scanBeam  = document.getElementById('mScanBeam');
  const dataParts = document.getElementById('mDataParticles');
  const reward    = document.getElementById('mReward');
  const scene     = document.getElementById('machineScene');
  const playBtn   = document.getElementById('mPlayBtn');
  const resetBtn  = document.getElementById('mResetBtn');

  if (playBtn) { playBtn.disabled = true; playBtn.style.display = 'none'; }
  if (resetBtn) resetBtn.style.display = 'none';

  // ── PHASE 1: Person walks forward (0ms)
  setProgress(5, -1);
  setMachineScreen('READY', 'Menunggu botol...', '');
  showMachineStep(1);

  mTimeout(() => {
    if (person) person.classList.add('walk');
  }, 200);

  // ── PHASE 2: Person throws bottle (1200ms)
  mTimeout(() => {
    if (person) { person.classList.add('throwing'); person.classList.add('bottle-gone'); }

    // Launch flying bottle
    if (bottleFly) {
      bottleFly.style.display = 'block';
      requestAnimationFrame(() => bottleFly.classList.add('fly'));
    }
    setProgress(25, 0);
    setMachineScreen('DETECTING', 'Botol masuk...', 'harap tunggu');
  }, 1200);

  // ── PHASE 3: Bottle enters machine (2100ms)
  mTimeout(() => {
    if (bottleIn) bottleIn.classList.add('visible');
    setMachineScreen('SCANNING', '◉ Scanning...', 'memvalidasi botol');
    showMachineStep(2);
    setProgress(45, 1);

    // Scan beam
    if (scanBeam) {
      scanBeam.className = 'machine-scan-beam';
      void scanBeam.offsetWidth; // force reflow
      scanBeam.classList.add('scan');
    }

    // LED pulse
    const led = document.getElementById('mLedStrip');
    if (led) { led.classList.add('machine-led-pulse'); }

    // Scene flash
    if (scene) {
      scene.classList.add('flash');
      setTimeout(() => scene.classList.remove('flash'), 300);
    }
  }, 2100);

  // ── PHASE 4: Data recording (3800ms)
  mTimeout(() => {
    setMachineScreen('VERIFIED ✓', '>>> Mencatat data', 'transaksi berhasil');
    showMachineStep(3);
    setProgress(68, 2);

    if (dataParts) dataParts.classList.add('emit');
  }, 3800);

  // ── PHASE 5: Reward dispensed (5400ms)
  mTimeout(() => {
    setMachineScreen('SUCCESS! ✓', 'REWARD DIBERIKAN', '+POIN DITAMBAH!');
    showMachineStep(4);
    setProgress(100, 3);

    if (reward) reward.classList.add('show');
    if (dataParts) dataParts.classList.remove('emit');

    // Confetti!
    spawnConfetti(scene);

    // Bottle inside disappears (crushed/processed)
    if (bottleIn) {
      setTimeout(() => {
        bottleIn.style.transition = 'opacity 0.5s, transform 0.5s';
        bottleIn.style.opacity = '0';
        bottleIn.style.transform = 'translateX(-50%) scale(0.3)';
      }, 300);
    }
  }, 5400);

  // ── PHASE 6: Show reset button (7000ms)
  mTimeout(() => {
    if (resetBtn) resetBtn.style.display = 'inline-flex';
    machineAnimRunning = false;
  }, 7000);
};

// Auto-trigger animation when section scrolls into view
const machineSectionEl = document.getElementById('machine-demo');
if (machineSectionEl) {
  const machineAutoObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !machineAnimRunning) {
        // Small delay so user sees the scene first
        setTimeout(() => {
          if (!machineAnimRunning) startMachineAnim();
        }, 800);
        machineAutoObs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  machineAutoObs.observe(machineSectionEl);
}

/* ============================================================
   ENHANCEMENT PACK — Animasi Menarik + Mobile JS v2.0
============================================================ */

// A. SCROLL TO TOP BUTTON
(function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
})();

// B. NAVBAR BURGER animated state
(function initBurgerAnim() {
  const burger = document.getElementById('navBurger');
  if (!burger) return;
  burger.addEventListener('click', () => { burger.classList.toggle('open'); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) burger.classList.remove('open');
  });
})();

// C. ANIMATED COUNTER — counts up when scrolled into view
(function initCounters() {
  let started = false;
  const data = [
    { target: 500, suffix: '+' },
    { target: 50,  suffix: '+' },
    { target: 12,  suffix: ' kg' }
  ];
  function animateCounter(valueEl, target, suffix, duration) {
    const startTime = performance.now();
    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      valueEl.textContent = Math.floor(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else valueEl.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  const dashboard = document.querySelector('.impact-dashboard');
  if (!dashboard) return;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      document.querySelectorAll('.counter-card').forEach((card, i) => {
        const d = data[i]; if (!d) return;
        const el = card.querySelector('.counter-value');
        if (el) setTimeout(() => animateCounter(el, d.target, d.suffix, 1800), i * 200);
      });
      obs.disconnect();
    }
  }, { threshold: 0.4 });
  obs.observe(dashboard);
})();

// D. FLOATING DECORATION DOTS on dark sections
(function spawnFloatingDots() {
  const ids = ['sdgs','machine-demo','iot','future','about','cta'];
  ids.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
    for (let i = 0; i < 6; i++) {
      const d = document.createElement('div');
      d.className = 'float-dot';
      const s = [6,8,10,14,18,24][i];
      d.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*85+5}%;top:${Math.random()*75+10}%;--dur:${7+Math.random()*5}s;--delay:${Math.random()*4}s;`;
      sec.appendChild(d);
    }
  });
})();

// E. STAGGER REVEAL — adds reveal direction classes + re-observes
(function initStaggerReveal() {
  document.querySelectorAll('.ps-item').forEach((el, i) => {
    el.classList.add('scroll-reveal', i % 2 === 0 ? 'reveal-left' : 'reveal-right');
  });
  document.querySelectorAll('.value-card').forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
  });
  document.querySelectorAll('.why-pillar').forEach(el => el.classList.add('reveal-scale'));
  document.querySelectorAll('.cv-card').forEach(el => el.classList.add('reveal-scale'));
  document.querySelectorAll('.impact-circle').forEach((el, i) => {
    el.classList.add('scroll-reveal');
    el.style.transitionDelay = (i * 0.12) + 's';
  });
  // Re-observe all
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.scroll-reveal:not(.visible)').forEach(el => obs.observe(el));
})();

// F. CARD TILT EFFECT — desktop only 3D hover tilt
(function initCardTilt() {
  if ('ontouchstart' in window) return;
  const cards = document.querySelectorAll('.ps-item, .value-card, .why-pillar, .step-card, .sdg-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2) / (r.width/2);
      const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
      card.style.transform = `translateY(-8px) rotateX(${-dy*4}deg) rotateY(${dx*4}deg) scale(1.02)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
})();

// G. PARALLAX SCROLL — hero badge + logo subtle parallax
(function initParallax() {
  if ('ontouchstart' in window) return;
  const badge = document.querySelector('.hero-badge');
  const logoWrap = document.querySelector('.hero-logo-wrap');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (badge) badge.style.transform = `translateY(${y * 0.08}px)`;
    if (logoWrap) logoWrap.style.transform = `translateY(${y * 0.05}px)`;
  }, { passive: true });
})();

// H. IMPACT CIRCLES — Animate rings on enter
(function initImpactCircles() {
  const circles = document.querySelectorAll('.impact-circle');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0) scale(1)';
        }, i * 150);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  circles.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(30px) scale(0.9)';
    c.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    obs.observe(c);
  });
})();

// I. WHY PILLAR stagger bounce-in
(function initPillarAnim() {
  const pillars = document.querySelectorAll('.why-pillar');
  const obs = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      pillars.forEach((p, i) => {
        setTimeout(() => {
          p.style.opacity = '1';
          p.style.transform = 'translateY(0) scale(1)';
        }, i * 80);
      });
      obs.disconnect();
    }
  }, { threshold: 0.15 });
  pillars.forEach(p => {
    p.style.opacity = '0';
    p.style.transform = 'translateY(24px) scale(0.95)';
    p.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  });
  const whySec = document.getElementById('swot');
  if (whySec) obs.observe(whySec);
})();

// J. PS-ITEM stagger on scroll
(function initPsAnim() {
  const items = document.querySelectorAll('.ps-item');
  const obs = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      items.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, i * 100);
      });
      obs.disconnect();
    }
  }, { threshold: 0.15 });
  items.forEach((item, i) => {
    const fromLeft = i % 2 === 0;
    item.style.opacity = '0';
    item.style.transform = fromLeft ? 'translateX(-30px)' : 'translateX(30px)';
    item.style.transition = 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
  });
  const probSec = document.getElementById('problem');
  if (probSec) obs.observe(probSec);
})();

// K. VALUE CARDS stagger
(function initValueAnim() {
  const cards = document.querySelectorAll('.value-card');
  const obs = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      cards.forEach((c, i) => {
        setTimeout(() => {
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        }, i * 120);
      });
      obs.disconnect();
    }
  }, { threshold: 0.2 });
  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(32px)';
    c.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  });
  const valSec = document.getElementById('value');
  if (valSec) obs.observe(valSec);
})();

// L. SDG CARDS fan-in from below
(function initSdgAnim() {
  const cards = document.querySelectorAll('.sdg-card');
  const obs = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      cards.forEach((c, i) => {
        setTimeout(() => {
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        }, i * 130);
      });
      obs.disconnect();
    }
  }, { threshold: 0.2 });
  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(40px)';
    c.style.transition = 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
  });
  const sdgSec = document.getElementById('sdgs');
  if (sdgSec) obs.observe(sdgSec);
})();

// M. HERO CANVAS — more particles + bottle shapes
(function enhanceHeroCanvas() {
  const c = document.getElementById('heroCanvas');
  if (!c) return;
  // Add extra bottle-shaped floating items via CSS overlay
  const hero = document.getElementById('hero');
  if (!hero) return;
  const symbols = ['♻', '🌿', '💧', '✨'];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('span');
    el.className = 'leaf';
    el.textContent = symbols[i % symbols.length];
    el.style.cssText = `left:${5 + Math.random()*90}%;top:${5 + Math.random()*80}%;font-size:${1 + Math.random()*1.2}rem;opacity:0.2;animation-duration:${10+Math.random()*8}s;animation-delay:${Math.random()*-10}s;`;
    const leavesEl = hero.querySelector('.hero-leaves') || hero;
    leavesEl.appendChild(el);
  }
})();

// N. FINAL CTA — text glow pulse
(function initCtaGlow() {
  const headline = document.querySelector('.cta-headline');
  if (headline) headline.style.animation = 'textGlow 4s ease-in-out infinite';
})();

// O. COUNTER CARDS hover flip
(function initCounterHover() {
  document.querySelectorAll('.counter-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const v = card.querySelector('.counter-value');
      if (v) { v.style.transform = 'scale(1.15)'; v.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'; }
    });
    card.addEventListener('mouseleave', () => {
      const v = card.querySelector('.counter-value');
      if (v) { v.style.transform = ''; }
    });
  });
})();

console.log('%c✨ Trash2Cash v2.0 — Animations Enhanced!', 'color:#5dba6b;font-weight:bold;font-size:13px;');
