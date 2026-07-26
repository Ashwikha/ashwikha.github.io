/* ============================================================
   Portfolio Script - Premium Vanilla JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     UTILITIES
  ---------------------------------------------------------- */
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  /* ----------------------------------------------------------
     1. PRELOADER
  ---------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');
  const preloaderText = document.getElementById('preloaderText');

  function runPreloader() {
    const messages = ['Initializing...', 'Loading assets...', 'Almost ready...', 'Welcome!'];
    let progress = 0;
    const duration = 2000;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      progress = Math.min((elapsed / duration) * 100, 100);

      if (preloaderProgress) preloaderProgress.style.width = progress + '%';

      const msgIndex = Math.min(Math.floor(progress / 25), messages.length - 1);
      if (preloaderText) preloaderText.textContent = messages[msgIndex];

      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
          }
        }, 300);
      }
    }

    requestAnimationFrame(tick);
  }

  /* ----------------------------------------------------------
     2. CUSTOM CURSOR
  ---------------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;
  let cursorVisible = false;

  function initCursor() {
    if (isMobile()) {
      if (cursorDot) cursorDot.style.display = 'none';
      if (cursorOutline) cursorOutline.style.display = 'none';
      return;
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      }

      if (!cursorVisible) {
        cursorVisible = true;
        if (cursorDot) cursorDot.style.opacity = '1';
        if (cursorOutline) cursorOutline.style.opacity = '1';
      }
    }, { passive: true });

    const interactiveEls = document.querySelectorAll('a, button, .glass-card');
    interactiveEls.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (cursorOutline) cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
      });
      el.addEventListener('mouseleave', function () {
        if (cursorOutline) cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

  function animateCursor() {
    if (!isMobile() && cursorOutline) {
      outlineX = lerp(outlineX, mouseX, 0.15);
      outlineY = lerp(outlineY, mouseY, 0.15);
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top = outlineY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }

  /* ----------------------------------------------------------
     3. MOUSE GLOW
  ---------------------------------------------------------- */
  const mouseGlow = document.getElementById('mouseGlow');
  let glowX = 0, glowY = 0;

  function animateGlow() {
    if (mouseGlow && !isMobile()) {
      glowX = lerp(glowX, mouseX, 0.05);
      glowY = lerp(glowY, mouseY, 0.05);
      mouseGlow.style.left = (glowX - 250) + 'px';
      mouseGlow.style.top = (glowY - 250) + 'px';
    }
    requestAnimationFrame(animateGlow);
  }

  /* ----------------------------------------------------------
     4. SCROLL PROGRESS
  ---------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = percent + '%';
  }

  /* ----------------------------------------------------------
     5. COMMAND PALETTE
  ---------------------------------------------------------- */
  const commandPalette = document.getElementById('commandPalette');
  const cmdInput = document.getElementById('cmdInput');
  const cmdResults = document.getElementById('cmdResults');
  const cmdTrigger = document.getElementById('cmdTrigger');

  const commands = [
    { label: 'Go to Home', action: 'navigate', target: '#hero' },
    { label: 'Go to About', action: 'navigate', target: '#about' },
    { label: 'Go to Skills', action: 'navigate', target: '#skills' },
    { label: 'Go to Projects', action: 'navigate', target: '#projects' },
    { label: 'Go to Experience', action: 'navigate', target: '#experience' },
    { label: 'Go to Contact', action: 'navigate', target: '#contact' },
    { label: 'Toggle Theme', action: 'theme', target: '' },
    { label: 'Download Resume', action: 'download', target: 'resume.pdf' },
    { label: 'Open GitHub', action: 'link', target: 'https://github.com' },
    { label: 'Open LinkedIn', action: 'link', target: 'https://linkedin.com' }
  ];

  function openCommandPalette() {
    if (commandPalette) {
      commandPalette.classList.add('active');
      if (cmdInput) { cmdInput.value = ''; cmdInput.focus(); }
      renderCommands('');
    }
  }

  function closeCommandPalette() {
    if (commandPalette) commandPalette.classList.remove('active');
  }

  function renderCommands(filter) {
    if (!cmdResults) return;
    const filtered = commands.filter(function (cmd) {
      return cmd.label.toLowerCase().includes(filter.toLowerCase());
    });
    cmdResults.innerHTML = filtered.map(function (cmd) {
      return '<div class="cmd-item" data-action="' + cmd.action + '" data-target="' + cmd.target + '">' + cmd.label + '</div>';
    }).join('');

    cmdResults.querySelectorAll('.cmd-item').forEach(function (item) {
      item.addEventListener('click', function () {
        executeCommand(item.dataset.action, item.dataset.target);
      });
    });
  }

  function executeCommand(action, target) {
    switch (action) {
      case 'navigate':
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'theme':
        toggleThemePanel();
        break;
      case 'download':
        const a = document.createElement('a');
        a.href = target; a.download = ''; a.click();
        break;
      case 'link':
        window.open(target, '_blank');
        break;
    }
    closeCommandPalette();
  }

  function initCommandPalette() {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
      }
      if (e.key === 'Escape') closeCommandPalette();
    });

    if (cmdTrigger) cmdTrigger.addEventListener('click', openCommandPalette);

    if (commandPalette) {
      commandPalette.addEventListener('click', function (e) {
        if (e.target === commandPalette) closeCommandPalette();
      });
    }

    if (cmdInput) {
      cmdInput.addEventListener('input', function () {
        renderCommands(cmdInput.value);
      });
    }
  }

  /* ----------------------------------------------------------
     6. THEME SYSTEM
  ---------------------------------------------------------- */
  const themeBtn = document.getElementById('themeBtn');
  const themePanel = document.getElementById('themePanel');

  function toggleThemePanel() {
    if (themePanel) themePanel.classList.toggle('active');
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (themePanel) themePanel.classList.remove('active');
  }

  function initTheme() {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);

    if (themeBtn) themeBtn.addEventListener('click', toggleThemePanel);

    document.querySelectorAll('.tp-option[data-theme]').forEach(function (opt) {
      opt.addEventListener('click', function () {
        setTheme(opt.dataset.theme);
      });
    });

    document.addEventListener('click', function (e) {
      if (themePanel && !themePanel.contains(e.target) && e.target !== themeBtn) {
        themePanel.classList.remove('active');
      }
    });
  }

  /* ----------------------------------------------------------
     7. NAVIGATION
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link');

  function initNavigation() {
    if (navToggle) {
      navToggle.addEventListener('click', function () {
        if (navMenu) navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
    }

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
      });
    });

    document.addEventListener('click', function (e) {
      if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }

  function updateNavOnScroll() {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ----------------------------------------------------------
     8. TYPING ANIMATION
  ---------------------------------------------------------- */
  const roleText = document.getElementById('roleText');
  const roles = [
    'Computer Science Student',
    'Competitive Programmer',
    'C++ Developer',
    'Problem Solver',
    'DSA Enthusiast',
    'Aspiring Software Engineer'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeRole() {
    if (!roleText) return;
    const current = roles[roleIndex];

    if (!isDeleting) {
      roleText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeRole, 1500);
        return;
      }
      setTimeout(typeRole, 80);
    } else {
      roleText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 400);
        return;
      }
      setTimeout(typeRole, 40);
    }
  }

  /* ----------------------------------------------------------
     9. PARTICLE CANVAS
  ---------------------------------------------------------- */
  const particleCanvas = document.getElementById('particleCanvas');
  let ctx = null;
  let particles = [];
  let animationId = null;
  let canvasWidth = 0, canvasHeight = 0;

  function initParticles() {
    if (!particleCanvas) return;
    ctx = particleCanvas.getContext('2d');
    resizeCanvas();

    const count = Math.min(60, Math.floor((canvasWidth * canvasHeight) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    animateParticles();
  }

  function resizeCanvas() {
    if (!particleCanvas) return;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    particleCanvas.width = canvasWidth;
    particleCanvas.height = canvasHeight;
  }

  function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvasWidth) p.vx *= -1;
      if (p.y < 0 || p.y > canvasHeight) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, ' + ((1 - dist / 120) * 0.3) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animateParticles);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
    } else {
      if (!animationId && ctx) animateParticles();
    }
  });

  /* ----------------------------------------------------------
     10. SCROLL REVEAL
  ---------------------------------------------------------- */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     11. SKILL BARS
  ---------------------------------------------------------- */
  function initSkillBars() {
    const skillFills = document.querySelectorAll('.sb-fill[data-width]');
    if (!skillFills.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          entry.target.style.width = width + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillFills.forEach(function (fill) {
      fill.style.width = '0%';
      observer.observe(fill);
    });
  }

  /* ----------------------------------------------------------
     12. CERT BARS
  ---------------------------------------------------------- */
  function initCertBars() {
    const certFills = document.querySelectorAll('.cert-fill[data-width]');
    if (!certFills.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          entry.target.style.width = width + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    certFills.forEach(function (fill) {
      fill.style.width = '0%';
      observer.observe(fill);
    });
  }

  /* ----------------------------------------------------------
     13. COUNTER ANIMATION
  ---------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('.counter-value[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === 'true';
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* ----------------------------------------------------------
     14. CONTACT FORM
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');

  function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const subject = formData.get('subject') || 'Portfolio Contact';
      const message = formData.get('message') || '';

      const mailto = 'mailto:contact@example.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message);

      window.location.href = mailto;

      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span>';
        btn.classList.add('success');
        setTimeout(function () {
          btn.innerHTML = originalText;
          btn.classList.remove('success');
        }, 3000);
      }
    });
  }

  /* ----------------------------------------------------------
     15. COPY BUTTONS
  ---------------------------------------------------------- */
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const text = btn.dataset.copy;
        navigator.clipboard.writeText(text).then(function () {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i>';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
          }, 2000);
        });
      });
    });
  }

  /* ----------------------------------------------------------
     16. BACK TO TOP
  ---------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  function updateBackToTop() {
    if (!backToTop) return;

    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    const circle = backToTop.querySelector('svg circle');
    if (circle) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      const circumference = parseFloat(circle.getAttribute('r')) * 2 * Math.PI;
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference * (1 - progress);
    }
  }

  function initBackToTop() {
    if (!backToTop) return;
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     17. MAGNETIC BUTTONS
  ---------------------------------------------------------- */
  function initMagneticButtons() {
    if (isMobile()) return;

    const magneticEls = document.querySelectorAll('.cta-primary, .cta-secondary, .cta-icon');

    magneticEls.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ----------------------------------------------------------
     18. KONAMI CODE EASTER EGG
  ---------------------------------------------------------- */
  const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'
  ];
  let konamiIndex = 0;

  function initKonami() {
    document.addEventListener('keydown', function (e) {
      if (e.key === konamiSequence[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
          konamiIndex = 0;
          activateKonamiEgg();
        }
      } else {
        konamiIndex = 0;
      }
    });
  }

  function activateKonamiEgg() {
    document.documentElement.setAttribute('data-theme', 'matrix');
    console.log(
      '%c KONAMI CODE ACTIVATED! ',
      'background: #00ff00; color: #000; font-size: 20px; font-weight: bold;'
    );
    launchConfetti();
  }

  function launchConfetti() {
    const colors = ['#ff0', '#0ff', '#f0f', '#0f0', '#f00', '#00f'];
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 8 + 6;
      const duration = Math.random() * 2 + 2;
      confetti.style.cssText =
        'position:fixed;width:' + size + 'px;height:' + size + 'px;top:-10px;left:'
        + (Math.random() * 100) + 'vw;background:' + colors[Math.floor(Math.random() * colors.length)]
        + ';pointer-events:none;z-index:99999;border-radius:' + (Math.random() > 0.5 ? '50%' : '0')
        + ';animation:confettiFall ' + duration + 's linear forwards;';
      document.body.appendChild(confetti);
      setTimeout(function () { confetti.remove(); }, 4500);
    }

    if (!document.getElementById('confettiStyle')) {
      const style = document.createElement('style');
      style.id = 'confettiStyle';
      style.textContent = '@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(720deg);opacity:0;}}';
      document.head.appendChild(style);
    }
  }

  /* ----------------------------------------------------------
     19. RANDOM CODING QUOTES
  ---------------------------------------------------------- */
  const quoteToast = document.getElementById('quoteToast');
  const quoteTextEl = document.getElementById('quoteText');

  const codingQuotes = [
    '"Code is poetry." - WordPress',
    '"First, solve the problem. Then, write the code." - John Johnson',
    '"Talk is cheap. Show me the code." - Linus Torvalds',
    '"Programs must be written for people to read." - Harold Abelson',
    '"Any fool can write code that a computer can understand." - Martin Fowler',
    '"The best error message is the one that never shows up." - Thomas Fuchs',
    '"Simplicity is the soul of efficiency." - Austin Freeman',
    '"Code never lies, comments sometimes do." - Ron Jeffries',
    '"Fix the cause, not the symptom." - Steve Maguire',
    '"Make it work, make it right, make it fast." - Kent Beck'
  ];

  function showRandomQuote() {
    if (!quoteToast || !quoteTextEl) return;
    const quote = codingQuotes[Math.floor(Math.random() * codingQuotes.length)];
    quoteTextEl.textContent = quote;
    quoteToast.classList.add('active');

    setTimeout(function () {
      quoteToast.classList.remove('active');
    }, 5000);
  }

  function initQuotes() {
    setInterval(showRandomQuote, 30000);
  }

  /* ----------------------------------------------------------
     20. CONSOLE EASTER EGG
  ---------------------------------------------------------- */
  function consoleEasterEgg() {
    console.log(
      '%c Welcome to my Portfolio! %c\n' +
      '%c Built with passion and vanilla JavaScript %c\n' +
      '%c Feel free to explore the code! ',
      'background: linear-gradient(90deg, #667eea, #764ba2); color: #fff; font-size: 18px; padding: 10px 20px; border-radius: 5px; font-weight: bold;',
      '',
      'color: #667eea; font-size: 12px; padding: 5px 0;',
      '',
      'color: #764ba2; font-size: 12px; padding: 5px 0;'
    );
  }

  /* ----------------------------------------------------------
     21. FOOTER YEAR
  ---------------------------------------------------------- */
  function setFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     22. SCROLL EVENT HANDLER (performance-optimized)
  ---------------------------------------------------------- */
  function onScroll() {
    updateScrollProgress();
    updateNavOnScroll();
    updateBackToTop();
  }

  /* ----------------------------------------------------------
     RESIZE HANDLER (debounced)
  ---------------------------------------------------------- */
  const handleResize = debounce(function () {
    resizeCanvas();
    if (isMobile()) {
      if (cursorDot) cursorDot.style.display = 'none';
      if (cursorOutline) cursorOutline.style.display = 'none';
    } else {
      if (cursorDot) cursorDot.style.display = '';
      if (cursorOutline) cursorOutline.style.display = '';
    }
  }, 200);

  /* ----------------------------------------------------------
     INITIALIZATION
  ---------------------------------------------------------- */
  function init() {
    runPreloader();
    initCursor();
    animateCursor();
    animateGlow();
    initCommandPalette();
    initTheme();
    initNavigation();
    typeRole();
    initParticles();
    initScrollReveal();
    initSkillBars();
    initCertBars();
    initCounters();
    initContactForm();
    initCopyButtons();
    initBackToTop();
    initMagneticButtons();
    initKonami();
    initQuotes();
    consoleEasterEgg();
    setFooterYear();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    onScroll();
  }

  /* ----------------------------------------------------------
     GITHUB HEATMAP
  ---------------------------------------------------------- */
  function initHeatmap() {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;

    const cells = 52 * 7;
    let totalContribs = 0;
    let streak = 0;
    let longestStreak = 0;
    let currentStreakCount = 0;

    for (let i = 0; i < cells; i++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      const rand = Math.random();
      let level = 0;
      if (rand > 0.7) level = 1;
      if (rand > 0.82) level = 2;
      if (rand > 0.9) level = 3;
      if (rand > 0.95) level = 4;
      cell.setAttribute('data-level', level);
      if (level > 0) {
        totalContribs += level;
        currentStreakCount++;
        if (currentStreakCount > longestStreak) longestStreak = currentStreakCount;
      } else {
        currentStreakCount = 0;
      }
      grid.appendChild(cell);
    }

    streak = Math.floor(Math.random() * 15) + 5;
    const totalEl = document.getElementById('totalContribs');
    const streakEl = document.getElementById('currentStreak');
    const longestEl = document.getElementById('longestStreak');
    if (totalEl) totalEl.textContent = totalContribs;
    if (streakEl) streakEl.textContent = streak;
    if (longestEl) longestEl.textContent = longestStreak;
  }

  function initStreakTracker() { }

  /* ----------------------------------------------------------
     INTERACTIVE GLOBE
  ---------------------------------------------------------- */
  function initGlobe() {
    const canvas = document.getElementById('globeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = size * 0.4;
    let angle = 0;

    const points = [
      { lat: 13.08, lng: 80.27, color: '#6366f1', label: 'Chennai' },
      { lat: 37.77, lng: -122.42, color: '#06b6d4', label: 'Online' },
      { lat: 28.61, lng: 77.21, color: '#00d4aa', label: 'NTech' },
      { lat: 51.51, lng: -0.13, color: '#f59e0b', label: 'Global' }
    ];

    function latLngToXY(lat, lng, rotation) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + rotation) * (Math.PI / 180);
      const x = center + radius * Math.sin(phi) * Math.cos(theta);
      const y = center - radius * Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      return { x: x, y: y, visible: z > -0.2 };
    }

    function draw() {
      ctx.clearRect(0, 0, size, size);

      // Globe sphere
      const gradient = ctx.createRadialGradient(center - 30, center - 30, 0, center, center, radius);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.05)');
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Grid lines
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 0.5;
      for (let i = -80; i <= 80; i += 20) {
        ctx.beginPath();
        for (let j = 0; j <= 360; j += 5) {
          const p = latLngToXY(i, j, angle);
          if (p.visible) {
            if (j === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Points
      points.forEach(function (pt) {
        const p = latLngToXY(pt.lat, pt.lng, angle);
        if (p.visible) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      angle += 0.3;
      requestAnimationFrame(draw);
    }

    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        draw();
        observer.unobserve(canvas);
      }
    }, { threshold: 0.2 });
    observer.observe(canvas);
  }

  /* ----------------------------------------------------------
     MINI GAME - TYPING SPEED
  ---------------------------------------------------------- */
  function initMiniGame() {
    var overlay = document.getElementById('gameStartOverlay');
    var startBtn = document.getElementById('gameStartBtn');
    var wpmEl = document.getElementById('gameWpm');
    var timeEl = document.getElementById('gameTime');
    var highEl = document.getElementById('gameHigh');
    var typingGame = document.getElementById('typingGame');
    var typingDisplay = document.getElementById('typingDisplay');
    var typingInput = document.getElementById('typingInput');
    var correctEl = document.getElementById('correctWords');
    var wrongEl = document.getElementById('wrongWords');
    var accuracyEl = document.getElementById('accuracy');

    if (!startBtn || !typingGame) return;

    var codeSnippets = [
      'const arr = [1, 2, 3];',
      'function sum(a, b) { return a + b; }',
      'for (let i = 0; i < n; i++)',
      'if (node.left !== null)',
      'while (stack.length > 0)',
      'arr.filter(x => x > 0)',
      'map.set(key, value);',
      'class Node { constructor(val) {} }',
      'return Math.max(left, right) + 1;',
      'dp[i] = dp[i-1] + dp[i-2];',
      'const result = arr.reduce((a, b) => a + b, 0);',
      'str.split("").reverse().join("");',
      'async function fetchData(url) {}',
      'obj = {...obj, newKey: val};',
      'arr.sort((a, b) => a - b);',
      'try { await api.get(url); } catch(e) {}',
      'const [first, ...rest] = arr;',
      'new Promise((resolve, reject) => {})',
      'console.log(JSON.stringify(data));',
      'export default function App() {}'
    ];

    var words = [];
    var currentWordIndex = 0;
    var correctCount = 0;
    var wrongCount = 0;
    var timeLeft = 30;
    var timer = null;
    var startTime = 0;
    var highScore = parseInt(localStorage.getItem('typingHighWpm') || '0');
    if (highEl) highEl.textContent = highScore;

    function generateWords() {
      words = [];
      for (var i = 0; i < 30; i++) {
        var snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        var parts = snippet.split(' ');
        parts.forEach(function(w) { words.push(w); });
      }
    }

    function renderDisplay() {
      typingDisplay.innerHTML = '';
      words.forEach(function(word, idx) {
        var span = document.createElement('span');
        span.className = 'typing-word';
        if (idx === currentWordIndex) span.classList.add('current');
        else if (idx < currentWordIndex) span.classList.add('done');
        span.textContent = word;
        typingDisplay.appendChild(span);
        if (idx < words.length - 1) typingDisplay.appendChild(document.createTextNode(' '));
      });
      var currentSpan = typingDisplay.querySelector('.current');
      if (currentSpan) currentSpan.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }

    function updateStats() {
      var elapsed = (30 - timeLeft) || 1;
      var wpm = Math.round((correctCount / elapsed) * 60);
      if (wpmEl) wpmEl.textContent = wpm;
      if (correctEl) correctEl.textContent = correctCount;
      if (wrongEl) wrongEl.textContent = wrongCount;
      var total = correctCount + wrongCount;
      var acc = total > 0 ? Math.round((correctCount / total) * 100) : 100;
      if (accuracyEl) accuracyEl.textContent = acc;
    }

    function endGame() {
      clearInterval(timer);
      var finalWpm = parseInt(wpmEl ? wpmEl.textContent : '0');
      if (finalWpm > highScore) {
        highScore = finalWpm;
        localStorage.setItem('typingHighWpm', String(highScore));
        if (highEl) highEl.textContent = highScore;
        showAchievement('New Record!', finalWpm + ' WPM!');
      }
      typingGame.classList.add('hidden');
      overlay.classList.remove('hidden');
      overlay.querySelector('h3').textContent = 'Time\'s Up!';
      overlay.querySelector('p').textContent = finalWpm + ' WPM | ' + correctCount + ' words | Best: ' + highScore + ' WPM';
      startBtn.textContent = 'Try Again';
    }

    startBtn.addEventListener('click', function() {
      overlay.classList.add('hidden');
      typingGame.classList.remove('hidden');
      currentWordIndex = 0;
      correctCount = 0;
      wrongCount = 0;
      timeLeft = 30;
      if (timeEl) timeEl.textContent = '30';
      if (wpmEl) wpmEl.textContent = '0';
      generateWords();
      renderDisplay();
      typingInput.value = '';
      typingInput.focus();
      startTime = Date.now();
      timer = setInterval(function() {
        timeLeft--;
        if (timeEl) timeEl.textContent = timeLeft;
        updateStats();
        if (timeLeft <= 0) endGame();
      }, 1000);
    });

    typingInput.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        var typed = typingInput.value.trim();
        if (!typed) return;
        if (typed === words[currentWordIndex]) {
          correctCount++;
        } else {
          wrongCount++;
        }
        currentWordIndex++;
        typingInput.value = '';
        updateStats();
        if (currentWordIndex >= words.length) {
          generateWords();
          currentWordIndex = 0;
        }
        renderDisplay();
      }
    });
  }

  /* ----------------------------------------------------------
     ACHIEVEMENT SYSTEM
  ---------------------------------------------------------- */
  const unlockedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
  let achievementQueue = [];
  let showingAchievement = false;

  function showAchievement(title, desc) {
    achievementQueue.push({ title: title, desc: desc });
    if (!showingAchievement) processAchievementQueue();
  }

  function processAchievementQueue() {
    if (achievementQueue.length === 0) { showingAchievement = false; return; }
    showingAchievement = true;
    const item = achievementQueue.shift();
    const popup = document.getElementById('achievementPopup');
    const titleEl = document.getElementById('apTitle');
    const descEl = document.getElementById('apDesc');
    if (!popup) return;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;
    popup.classList.add('show');
    setTimeout(function () {
      popup.classList.remove('show');
      setTimeout(processAchievementQueue, 300);
    }, 3000);
  }

  function checkExplorationAchievements() {
    const sections = ['about', 'skills', 'experience', 'achievements', 'profiles', 'contact'];
    const visited = JSON.parse(localStorage.getItem('visitedSections') || '[]');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (!visited.includes(id)) {
            visited.push(id);
            localStorage.setItem('visitedSections', JSON.stringify(visited));
            if (visited.length === 3 && !unlockedAchievements.includes('explorer')) {
              unlockedAchievements.push('explorer');
              localStorage.setItem('achievements', JSON.stringify(unlockedAchievements));
              showAchievement('Explorer!', 'You visited 3 sections');
            }
            if (visited.length === sections.length && !unlockedAchievements.includes('completionist')) {
              unlockedAchievements.push('completionist');
              localStorage.setItem('achievements', JSON.stringify(unlockedAchievements));
              showAchievement('Completionist!', 'You explored the entire portfolio!');
            }
          }
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     AI CHATBOT
  ---------------------------------------------------------- */
  function initChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const window_ = document.getElementById('chatbotWindow');
    const close = document.getElementById('cbClose');
    const input = document.getElementById('cbInput');
    const send = document.getElementById('cbSend');
    const messages = document.getElementById('cbMessages');

    if (!toggle || !window_) return;

    toggle.addEventListener('click', function () { window_.classList.toggle('active'); });
    if (close) close.addEventListener('click', function () { window_.classList.remove('active'); });

    const responses = {
      'skills': 'I know C++, C, Python, Data Structures, Algorithms, OOP, and Machine Learning fundamentals. My strongest skills are C++ and Problem Solving!',
      'education': 'I am pursuing B.E. in Computer Science at St. Joseph\'s College of Engineering, Chennai with a CGPA of 9.23.',
      'experience': 'I completed a 20-day AI & ML internship at NTech Computer Education and I am a student member at HOPE (House Of Programming Expertise).',
      'contact': 'You can reach me at ashwikhas@gmail.com or +91 72001 25076. I am based in Chennai, Tamil Nadu.',
      'certifications': 'I have completed Fundamentals of Computing (INI, 87%) and Python for Data Science (NPTEL, 77%).',
      'coding': 'I am active on LeetCode, Codeforces, AtCoder, Skillrack, and GitHub. I focus on competitive programming and DSA.',
      'projects': 'I am currently building projects related to my coursework. Check my GitHub for latest updates!',
      'cgpa': 'My current CGPA is 9.23 in Computer Science Engineering at St. Joseph\'s College.',
      'hello': 'Hello! Nice to meet you. I am Ashwikha\'s AI assistant. How can I help you?',
      'hi': 'Hi there! Ask me about Ashwikha\'s skills, education, experience, or anything else!',
      'name': 'I am Ashwikha S, a Computer Science Engineering student passionate about building scalable applications and problem solving.',
      'location': 'I am based in Chennai, Tamil Nadu, India.',
      'default': 'I am not sure about that. Try asking about skills, education, experience, certifications, coding profiles, or contact information!'
    };

    function getResponse(input_) {
      const lower = input_.toLowerCase();
      for (var key in responses) {
        if (key !== 'default' && lower.includes(key)) return responses[key];
      }
      return responses['default'];
    }

    function addMessage(text, type) {
      const div = document.createElement('div');
      div.className = 'cb-msg ' + type;
      div.innerHTML = '<span>' + text + '</span>';
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function handleSend() {
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, 'user');
      input.value = '';
      setTimeout(function () {
        addMessage(getResponse(text), 'bot');
      }, 500);
    }

    if (send) send.addEventListener('click', handleSend);
    if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') handleSend(); });
  }

  /* ----------------------------------------------------------
     MUSIC TOGGLE
  ---------------------------------------------------------- */
  function initMusic() {
    const btn = document.getElementById('musicToggle');
    const audio = document.getElementById('bgMusic');
    const icon = document.getElementById('musicIcon');
    if (!btn || !audio) return;

    btn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().then(function () {
          btn.classList.add('playing');
          if (icon) icon.className = 'fas fa-volume-up';
        }).catch(function () {});
      } else {
        audio.pause();
        btn.classList.remove('playing');
        if (icon) icon.className = 'fas fa-volume-mute';
      }
    });
  }

  /* ----------------------------------------------------------
     LANGUAGE SWITCHER
  ---------------------------------------------------------- */
  function initLanguageSwitcher() {
    const btn = document.getElementById('langBtn');
    const menu = document.getElementById('langMenu');
    const options = document.querySelectorAll('.lang-option');
    const currentLangEl = document.getElementById('currentLang');

    if (!btn || !menu) return;

    const translations = {
      en: { greeting: 'Hello, I\'m', name: 'Ashwikha S', role: 'Computer Science Student', desc: 'Passionate Computer Science student building scalable applications, mastering algorithms, and solving complex problems with elegant code.' },
      ta: { greeting: 'வணக்கம், நான்', name: 'அஸ்விகா S', role: 'கணினி அறிவியல் மாணவி', desc: 'அளவிடக்கூடிய பயன்பாடுகளை உருவாக்கும், அல்காரிதம்களை கற்றுக்கொள்ளும் கணினி அறிவியல் மாணவி.' },
      hi: { greeting: 'नमस्ते, मैं हूँ', name: 'अश्विखा S', role: 'कंप्यूटर साइंस छात्रा', desc: 'स्केलेबल एप्लिकेशन बनाने, एल्गोरिदम में महारत हासिल करने और कोड से जटिल समस्याओं को हल करने वाली कंप्यूटर साइंस छात्रा।' }
    };

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('active');
    });

    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        const lang = opt.dataset.lang;
        options.forEach(function (o) { o.classList.remove('active'); });
        opt.classList.add('active');
        if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();
        menu.classList.remove('active');

        const t = translations[lang];
        const introEl = document.querySelector('.intro-line');
        const descEl = document.querySelector('.hero-desc');
        if (introEl && t) introEl.textContent = t.greeting;
        if (descEl && t) descEl.textContent = t.desc;
      });
    });

    document.addEventListener('click', function () { menu.classList.remove('active'); });
  }

  /* ----------------------------------------------------------
     VISITOR COUNTER
  ---------------------------------------------------------- */
  function initVisitorCounter() {
    let count = parseInt(localStorage.getItem('visitorCount') || '0');
    const lastVisit = localStorage.getItem('lastVisitDate');
    const today = new Date().toDateString();
    if (lastVisit !== today) {
      count++;
      localStorage.setItem('visitorCount', count);
      localStorage.setItem('lastVisitDate', today);
    }
    const el = document.getElementById('visitorCount');
    if (el) el.textContent = count;
  }

  /* ----------------------------------------------------------
     TIME-BASED BACKGROUND
  ---------------------------------------------------------- */
  function initTimeBackground() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      document.body.classList.add('daytime');
    } else {
      document.body.classList.remove('daytime');
    }
  }

  /* ----------------------------------------------------------
     RESUME DOWNLOAD (blob-based for reliable PDF delivery)
  ---------------------------------------------------------- */
  function initResumeDownload() {
    var resumeLinks = document.querySelectorAll('a[href="assets/resume.pdf"]');
    resumeLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'assets/resume.pdf', true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
          if (xhr.status === 200) {
            var blob = new Blob([xhr.response], { type: 'application/pdf' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'Ashwikha_S_Resume.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        };
        xhr.send();
      });
    });
  }

  /* ----------------------------------------------------------
     INIT ALL NEW FEATURES
  ---------------------------------------------------------- */
  function initNewFeatures() {
    initHeatmap();
    initStreakTracker();
    initGlobe();
    initMiniGame();
    checkExplorationAchievements();
    initChatbot();
    initMusic();
    initLanguageSwitcher();
    initVisitorCounter();
    initTimeBackground();
    initResumeDownload();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); initNewFeatures(); });
  } else {
    init();
    initNewFeatures();
  }

})();
