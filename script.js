/**
 * JOGI MOHAN KRISHNA - PORTFOLIO INTERACTION ENGINE
 * Features: Particle Constellation, 3D Card Tilt, Web Audio FX,
 * Typewriter, RAG & ATS Interactive Simulator, Smooth Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCustomCursor();
  initTypewriter();
  init3DTilt();
  initStatsCounter();
  initSkillProgress();
  initFilters();
  initDemoSandbox();
  initAudioFX();
  initClipboardAndContact();
  initMobileMenu();
  initNavbarScroll();
});

/* ==========================================================================
   1. INTERACTIVE PARTICLE CONSTELLATION CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const maxDistance = 125;

  const mouse = { x: -1000, y: -1000, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = (Math.random() - 0.5) * 0.65;
      this.radius = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ';
      this.baseAlpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity - subtle repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 2.5;
        this.y -= Math.sin(angle) * force * 2.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.baseAlpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. CUSTOM GLOWING MOUSE CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');
  if (!dot || !glow || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100, mouseY = -100;
  let glowX = -100, glowY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function loop() {
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Hover animations on clickable elements
  const hoverTargets = document.querySelectorAll('a, button, .tilt-card, .filter-btn, .skill-tab, input, select, textarea');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'AI-Powered Applications',
    'Enterprise RAG Systems',
    'Deep Learning Pipelines',
    'Full-Stack Web Architectures',
    'Robust Python & React Tools'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 45;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 90;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      delay = 1800; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   4. 3D CARD TILT EFFECT (Mouse-tracking perspective)
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card, .hero-card-3d');
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   5. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-num');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statElements.forEach((el) => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (target === 743) {
            // CGPA 7.43 formatting
            animateValue(el, 0, 7.43, 1400, true);
          } else {
            animateValue(el, 0, target, 1200, false);
          }
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);

  function animateValue(obj, start, end, duration, isDecimal) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = easeOutQuad(progress);
      if (isDecimal) {
        obj.textContent = (easeProgress * end).toFixed(2);
      } else {
        obj.textContent = Math.floor(easeProgress * (end - start) + start);
      }
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
  }
}

/* ==========================================================================
   6. SKILL BARS & CATEGORY FILTERING
   ========================================================================== */
function initSkillProgress() {
  const progressBars = document.querySelectorAll('.skill-progress-bar .progress');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.style.getPropertyValue('--width') || '85%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  progressBars.forEach((bar) => observer.observe(bar));
}

function initFilters() {
  // Skills Filter Tabs
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');
      skillCards.forEach((card) => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          setTimeout(() => (card.style.opacity = '1'), 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => (card.style.display = 'none'), 200);
        }
      });
      playSfx('click');
    });
  });

  // Projects Filter Buttons
  const projectFilterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          setTimeout(() => (card.style.opacity = '1'), 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => (card.style.display = 'none'), 200);
        }
      });
      playSfx('click');
    });
  });
}

/* ==========================================================================
   7. LIVE INTERACTIVE DEMO SANDBOX (RAG & ATS SIMULATOR)
   ========================================================================== */
function initDemoSandbox() {
  // Tab Switcher
  const btnTabRag = document.getElementById('demo-tab-rag');
  const btnTabAts = document.getElementById('demo-tab-ats');
  const viewRag = document.getElementById('view-rag');
  const viewAts = document.getElementById('view-ats');

  if (btnTabRag && btnTabAts) {
    btnTabRag.addEventListener('click', () => {
      btnTabRag.classList.add('active');
      btnTabAts.classList.remove('active');
      viewRag.style.display = 'block';
      viewAts.style.display = 'none';
      playSfx('tab');
    });

    btnTabAts.addEventListener('click', () => {
      btnTabAts.classList.add('active');
      btnTabRag.classList.remove('active');
      viewAts.style.display = 'block';
      viewRag.style.display = 'none';
      playSfx('tab');
    });
  }

  // RAG Simulator Logic
  const btnRunRag = document.getElementById('btn-run-rag');
  const querySelect = document.getElementById('rag-query-select');
  const customInput = document.getElementById('rag-custom-input');
  const latencyBadge = document.getElementById('rag-latency');
  const resultsDisplay = document.getElementById('rag-results-display');

  const ragDatabase = {
    eeg: {
      source: 'EEG_Seizure_Detection_Project.pdf (Section 3.2)',
      score: '0.942',
      chunk: 'The hybrid deep learning architecture applies 2D Convolutional Neural Network (CNN) kernels across 19-channel EEG electrodes to extract spatial topologies, followed by Bidirectional Long Short-Term Memory (Bi-LSTM) layers to model temporal rhythm variations.',
      response: 'The EEG seizure detection pipeline processes multi-channel brainwave signals in two stages. First, a <strong>CNN extracts spatial topological features</strong> from electrode arrays. Then, a <strong>Bi-LSTM network analyzes temporal sequence transitions</strong> to detect abnormal epileptiform spikes and predict upcoming seizure events with high sensitivity.'
    },
    rag: {
      source: 'Enterprise_RAG_Architecture.docx (Doc Chunk #12)',
      score: '0.968',
      chunk: 'Indexed heterogeneous corporate files (PDF, XLSX, CSV, DOCX) into FAISS using sentence-transformers all-MiniLM-L6-v2 embeddings with 512-token chunking and 50-token overlap.',
      response: 'The Enterprise RAG Chatbot indexes documents into a <strong>FAISS vector store</strong> using the <strong>all-MiniLM-L6-v2</strong> sentence-transformer embedding model. Queries retrieve the top-k most semantically relevant chunks, which are injected into Google Gemini with strict prompt grounding to prevent hallucinations.'
    },
    ats: {
      source: 'AI_Resume_Analyzer_Doc.txt (Algorithm Module)',
      score: '0.915',
      chunk: 'Computes cosine similarity between tokenized resume text vectors and job qualification requirements, supplemented by rule-based heuristic extraction for key frameworks.',
      response: 'The AI Resume Analyzer measures candidate compatibility by tokenizing resumes, calculating <strong>cosine similarity against target job descriptions</strong>, checking hard skill taxonomies, and generating structured gap recommendations to improve interview conversion.'
    },
    stack: {
      source: 'Skills_Matrix_2026.json (Candidate Profile)',
      score: '0.985',
      chunk: 'Primary web stack: React.js for client interfaces, Python (Flask / FastAPI) and Node.js for backend endpoints, and normalized MySQL schemas for persistence.',
      response: 'Mohan builds modern full-stack web platforms using <strong>React</strong> for responsive, component-driven interfaces, <strong>Python / Node.js</strong> for RESTful API services, and <strong>MySQL</strong> for ACID-compliant relational data management.'
    }
  };

  if (btnRunRag) {
    btnRunRag.addEventListener('click', () => {
      playSfx('search');
      btnRunRag.disabled = true;
      btnRunRag.innerHTML = '<span>Searching Vector Space...</span>';

      const selectedKey = querySelect ? querySelect.value : 'eeg';
      const customQuery = customInput && customInput.value.trim();
      const data = ragDatabase[selectedKey] || ragDatabase.eeg;

      setTimeout(() => {
        const randLatency = Math.floor(Math.random() * 15 + 18);
        if (latencyBadge) latencyBadge.textContent = `Latency: ~${randLatency}ms (FAISS Hit)`;

        if (resultsDisplay) {
          resultsDisplay.innerHTML = `
            <div class="rag-chunk-card" style="animation: fadeIn 0.4s ease;">
              <div class="chunk-header">
                <span class="source-tag">📄 Source: ${data.source}</span>
                <span class="similarity-score">Similarity: ${data.score}</span>
              </div>
              <p class="chunk-text">"${customQuery ? 'Matched against user prompt: ' + customQuery + ' — ' + data.chunk : data.chunk}"</p>
            </div>

            <div class="ai-grounded-response" style="animation: fadeIn 0.6s ease;">
              <div class="ai-response-badge">
                <span class="ai-star">✨</span>
                <strong>Grounded Answer (Strict Retrieval Verified):</strong>
              </div>
              <p class="ai-text">${data.response}</p>
            </div>
          `;
        }

        btnRunRag.disabled = false;
        btnRunRag.innerHTML = '<span class="sparkle-icon">⚡</span><span>Execute Vector Search & Grounding</span>';
        playSfx('success');
      }, 450);
    });
  }

  // ATS Matcher Logic
  const btnRunAts = document.getElementById('btn-run-ats');
  const roleSelect = document.getElementById('ats-role-select');
  const scoreVal = document.getElementById('ats-score-val');
  const chipsContainer = document.getElementById('ats-matched-chips');
  const recBox = document.getElementById('ats-recommendation-box');

  const atsDatabase = {
    'ai-dev': {
      score: '96%',
      chips: ['✓ Python', '✓ RAG Architecture', '✓ LangChain', '✓ FAISS', '✓ CNN & Bi-LSTM', '✓ Vector Embeddings', '✓ Streamlit', '✓ Signal Preprocessing'],
      rec: 'Exceptional match! Demonstrates hands-on production experience in RAG systems, deep learning signal analysis, and LLM grounding.'
    },
    'fullstack': {
      score: '91%',
      chips: ['✓ React.js', '✓ Python', '✓ JavaScript (ES6+)', '✓ MySQL CRUD', '✓ REST APIs', '✓ HTML5/CSS3', '✓ Git & GitHub', '✓ Node.js'],
      rec: 'Strong full-stack capability with balanced frontend UI craftsmanship in React and scalable relational database handling in MySQL.'
    },
    'python-backend': {
      score: '94%',
      chips: ['✓ Python Advanced', '✓ REST Endpoints', '✓ MySQL Relational DB', '✓ OOP & Data Structures', '✓ API Architecture', '✓ SDLC Knowledge'],
      rec: 'High proficiency in backend Python logic, object-oriented concepts, and API integration with solid data engineering intern exposure.'
    }
  };

  if (btnRunAts) {
    btnRunAts.addEventListener('click', () => {
      playSfx('search');
      const selected = roleSelect ? roleSelect.value : 'ai-dev';
      const item = atsDatabase[selected];

      if (scoreVal) {
        scoreVal.textContent = '...';
      }

      setTimeout(() => {
        if (scoreVal) scoreVal.textContent = item.score;
        if (chipsContainer) {
          chipsContainer.innerHTML = item.chips.map(c => `<span class="chip chip-match">${c}</span>`).join('');
        }
        if (recBox) {
          recBox.innerHTML = `
            <div class="rec-title">💡 Actionable Recommendation:</div>
            <p class="rec-text">${item.rec}</p>
          `;
        }
        playSfx('success');
      }, 350);
    });
  }
}

/* ==========================================================================
   8. SYNTHESIZED FUTURISTIC WEB AUDIO FX (Zero external sound dependencies!)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioFX() {
  const toggleBtn = document.getElementById('sound-toggle');
  if (!toggleBtn) return;

  const soundOffIcon = toggleBtn.querySelector('.sound-off');
  const soundOnIcon = toggleBtn.querySelector('.sound-on');

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (soundOffIcon) soundOffIcon.style.display = 'none';
      if (soundOnIcon) soundOnIcon.style.display = 'block';
      playSfx('success');
    } else {
      if (soundOffIcon) soundOffIcon.style.display = 'block';
      if (soundOnIcon) soundOnIcon.style.display = 'none';
    }
  });
}

function playSfx(type) {
  if (!soundEnabled || !audioCtx) return;

  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'tab') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'search') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(640, now + 0.12);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch (e) {
    // Graceful fallback for audio permissions
  }
}

/* ==========================================================================
   9. CLIPBOARD COPY & CONTACT FORM HANDLER
   ========================================================================== */
function initClipboardAndContact() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
          playSfx('success');
        });
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Contact Form Mailto Generator
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      const mailtoLink = `mailto:mohankrishnajogi123@gmail.com?subject=${encodeURIComponent(
        `[Portfolio Opportunity] ${subject} - ${name}`
      )}&body=${encodeURIComponent(
        `Hi Mohan,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent via Portfolio Contact Form`
      )}`;

      window.location.href = mailtoLink;
      showToast('Opening default email client...');
      playSfx('success');
    });
  }
}

/* ==========================================================================
   10. MOBILE MENU & NAVBAR SCROLL BEHAVIOR
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-link');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      playSfx('click');
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
      });
    });
  }
}

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
