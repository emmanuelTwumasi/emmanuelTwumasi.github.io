/**
 * demonOS Developer Portfolio Client Script
 * Target: Emmanuel Twumasi
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Theme Toggle & Persistence
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  function initTheme() {
    const savedTheme = localStorage.getItem('demon_theme');
    if (savedTheme) {
      htmlEl.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlEl.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }

  function toggleTheme() {
    const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', nextTheme);
    localStorage.setItem('demon_theme', nextTheme);
    showToast(`Theme switched to ${nextTheme} mode`, 'success');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // =========================================================================
  // 2. Typewriter Effect
  // =========================================================================
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'Autonomous Agent Systems',
    'Full-Stack Web Architecture',
    'Distributed Cloud Backends',
    'Self-Healing Test Gauntlets'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function handleTypewriter() {
    if (!typewriterEl) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 1800; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // Pause before typing new phrase
    }

    setTimeout(handleTypewriter, typeSpeed);
  }

  // =========================================================================
  // 3. Mobile Navigation Drawer
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close on nav-link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 4. Project Category Filtering
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // =========================================================================
  // 5. Copy Email Utilities
  // =========================================================================
  const emailToCopy = 'protwumasi@gmail.com';

  function copyEmailToClipboard() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        showToast(`Copied ${emailToCopy} to clipboard!`, 'success');
      }).catch(() => {
        fallbackCopy(emailToCopy);
      });
    } else {
      fallbackCopy(emailToCopy);
    }
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`, 'success');
    } catch (err) {
      showToast('Could not copy email automatically.', 'error');
    }
    document.body.removeChild(tempInput);
  }

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyEmailQuickBtn = document.getElementById('copyEmailQuickBtn');
  if (copyEmailBtn) copyEmailBtn.addEventListener('click', copyEmailToClipboard);
  if (copyEmailQuickBtn) copyEmailQuickBtn.addEventListener('click', copyEmailToClipboard);

  // =========================================================================
  // 6. Contact Form Validation & Submission
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear errors
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal || nameVal.length < 2) {
        nameError.textContent = 'Please enter your name (at least 2 characters).';
        isValid = false;
      }

      if (!emailVal || !validateEmail(emailVal)) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!messageVal || messageVal.length < 8) {
        messageError.textContent = 'Please enter a message (at least 8 characters).';
        isValid = false;
      }

      if (isValid) {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending message...</span>';

        const subjectLine = subjectVal
          ? `[Portfolio Contact] ${subjectVal} - from ${nameVal}`
          : `[Portfolio Contact] New message from ${nameVal}`;

        const payload = {
          name: nameVal,
          email: emailVal,
          _subject: subjectLine,
          _replyto: emailVal,
          message: messageVal,
          _captcha: "false"
        };

        fetch('https://formsubmit.co/ajax/protwumasi@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network error or endpoint unavailable');
        })
        .then(() => {
          showToast('Message sent! It will be delivered directly to protwumasi@gmail.com.', 'success');
          contactForm.reset();
        })
        .catch(() => {
          // Fallback to mailto if fetch is blocked or user is offline
          const mailtoSubject = encodeURIComponent(subjectLine);
          const mailtoBody = encodeURIComponent(`From: ${nameVal} (${emailVal})\n\n${messageVal}`);
          window.location.href = `mailto:protwumasi@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
          showToast('Opening your email client to send message to protwumasi@gmail.com', 'success');
          contactForm.reset();
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        });
      }
    });
  }

  // =========================================================================
  // 7. Toast Notification Dispatcher
  // =========================================================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconSvg = type === 'success'
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    toast.innerHTML = `<span class="toast-icon-wrapper">${iconSvg}</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // =========================================================================
  // 8. Active Nav Link on Scroll (Intersection Observer)
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(sec => observer.observe(sec));
  }

  // =========================================================================
  // =========================================================================
  // 9. Scroll Progress Indicator & Print / Save CV Action
  // =========================================================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${progress}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  const printCvBtn = document.getElementById('printCvBtn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // =========================================================================
  // 10. Project Architecture Modal
  // =========================================================================
  const projectDetails = {
    demonos: {
      category: 'Autonomous AI Framework',
      title: 'demonOS Autonomous Agent Framework',
      description: 'A finite-state autonomous agent operating framework inspired by Danny Postma\'s AgentOS. Built to empower coding assistants with a closed-loop execution contract: intake, rigorous spec generation, 2-gate human approval, deterministic test verification, and automated git delivery.',
      diagram: `<svg class="architecture-diagram-svg" viewBox="0 0 520 64" width="100%" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="14" width="84" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="44" y="36" fill="var(--text-primary)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Task Intake</text><line x1="86" y1="32" x2="104" y2="32" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="3 3"/><polygon points="104,29 110,32 104,35" fill="var(--accent)"/><rect x="110" y="14" width="84" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="152" y="36" fill="var(--text-primary)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Spec Engine</text><line x1="194" y1="32" x2="212" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="212,29 218,32 212,35" fill="var(--accent)"/><rect x="218" y="14" width="84" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" stroke-width="1.5"/><text x="260" y="36" fill="var(--accent)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Gate 1 Appr.</text><line x1="302" y1="32" x2="320" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="320,29 326,32 320,35" fill="var(--accent)"/><rect x="326" y="14" width="88" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="370" y="36" fill="var(--text-primary)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Self-Healing</text><line x1="414" y1="32" x2="432" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="432,29 438,32 432,35" fill="var(--accent)"/><rect x="438" y="14" width="80" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="478" y="36" fill="var(--success)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Gate 2 & Git</text></svg>`,
      highlights: [
        'Deterministic 5-stage lifecycle state machine (SPEC_DRAFTING -> APPROVAL -> IN_PROGRESS -> IN_REVIEW -> DONE)',
        'Autonomous self-healing verification gauntlet with automatic log triage up to 3 repair iterations',
        'Structured human inbox notification protocol with strict interruption boundaries',
        'Zero external runtime dependencies for core agent state transitions and task management'
      ],
      tags: ['Python', 'Autonomous Agents', 'CLI State Machine', 'Self-Healing Loops', 'Deterministic CI'],
      github: 'https://github.com/emmanuelTwumasi/demonOS'
    },
    banking: {
      category: 'Financial Engineering',
      title: 'Secure Banking Transaction Ledger',
      description: 'A high-concurrency, double-entry banking ledger engineered with strict transactional isolation (ACID guarantees), idempotency keys, and tamper-resistant transaction audit logs.',
      diagram: `<svg class="architecture-diagram-svg" viewBox="0 0 520 64" width="100%" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="14" width="88" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="46" y="36" fill="var(--text-primary)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">REST Client</text><line x1="90" y1="32" x2="108" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="108,29 114,32 108,35" fill="var(--accent)"/><rect x="114" y="14" width="90" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="159" y="36" fill="var(--text-primary)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Auth & RBAC</text><line x1="204" y1="32" x2="222" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="222,29 228,32 222,35" fill="var(--accent)"/><rect x="228" y="14" width="96" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" stroke-width="1.5"/><text x="276" y="36" fill="var(--accent)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">ACID Isolation</text><line x1="324" y1="32" x2="342" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="342,29 348,32 342,35" fill="var(--accent)"/><rect x="348" y="14" width="84" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="390" y="36" fill="var(--text-primary)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Audit Core</text><line x1="432" y1="32" x2="450" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="450,29 456,32 450,35" fill="var(--accent)"/><rect x="456" y="14" width="62" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="487" y="36" fill="var(--success)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Postgres</text></svg>`,
      highlights: [
        'Double-entry bookkeeping ledger ensuring total balance zero-sum integrity',
        'Optimistic locking to prevent concurrent balance overdrafts and race conditions',
        'Cryptographic token authentication and role-based access control (RBAC)',
        'Comprehensive audit log archiving for every financial transfer'
      ],
      tags: ['Java', 'Spring Boot', 'PostgreSQL', 'ACID Transactions', 'Docker', 'REST API'],
      github: 'https://github.com/emmanuelTwumasi/banking_application'
    },
    protwum: {
      category: 'Frontend & Systems',
      title: 'ProTwum Personal Ecosystem',
      description: 'Modern, high-performance personal web platform engineered with zero runtime framework overhead, achieving sub-50ms paint times and accessible, keyboard-first navigation.',
      diagram: `<svg class="architecture-diagram-svg" viewBox="0 0 520 64" width="100%" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="14" width="105" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="56" y="36" fill="var(--text-primary)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Semantic HTML5</text><line x1="109" y1="32" x2="137" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="137,29 143,32 137,35" fill="var(--accent)"/><rect x="143" y="14" width="105" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="195" y="36" fill="var(--text-primary)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">CSS Variables</text><line x1="248" y1="32" x2="276" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="276,29 282,32 276,35" fill="var(--accent)"/><rect x="282" y="14" width="105" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" stroke-width="1.5"/><text x="334" y="36" fill="var(--accent)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">0ms Framework</text><line x1="387" y1="32" x2="415" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="415,29 421,32 415,35" fill="var(--accent)"/><rect x="421" y="14" width="95" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="468" y="36" fill="var(--success)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">&lt;50ms Paint</text></svg>`,
      highlights: [
        'Zero framework runtime footprint for sub-50ms First Contentful Paint (FCP)',
        'WCAG 2.1 AA accessible semantic HTML structure and ARIA attributes',
        'Precision CSS custom properties architecture supporting dark and light themes without flash',
        'Structured JSON-LD schema integration for rich search engine indexing'
      ],
      tags: ['JavaScript', 'CSS Architecture', 'Accessible UI', 'Semantic HTML5', 'Performance Optimization'],
      github: 'https://github.com/emmanuelTwumasi/protwum'
    },
    android1: {
      category: 'Mobile Systems',
      title: 'Android Native Client Engine',
      description: 'Native mobile application engineered using modern Android SDK guidelines, clean MVVM component separation, and resilient offline-first Room database synchronization.',
      diagram: `<svg class="architecture-diagram-svg" viewBox="0 0 520 64" width="100%" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="14" width="105" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="56" y="36" fill="var(--text-primary)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">UI Activities</text><line x1="109" y1="32" x2="137" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="137,29 143,32 137,35" fill="var(--accent)"/><rect x="143" y="14" width="105" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="195" y="36" fill="var(--text-primary)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">ViewModel State</text><line x1="248" y1="32" x2="276" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="276,29 282,32 276,35" fill="var(--accent)"/><rect x="282" y="14" width="105" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" stroke-width="1.5"/><text x="334" y="36" fill="var(--accent)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Repository Sync</text><line x1="387" y1="32" x2="415" y2="32" stroke="var(--accent)" stroke-width="1.5"/><polygon points="415,29 421,32 415,35" fill="var(--accent)"/><rect x="421" y="14" width="95" height="36" rx="6" fill="var(--bg-secondary)" stroke="var(--card-border)" stroke-width="1.5"/><text x="468" y="36" fill="var(--success)" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">Room SQLite</text></svg>`,
      highlights: [
        'Modern MVVM pattern with separation between UI controllers, ViewModels, and repositories',
        'Offline-first persistence layer powered by Room / SQLite with transactional updates',
        'Efficient background threading using asynchronous workers for network requests',
        'Adaptive material design layouts optimized across phone and tablet aspect ratios'
      ],
      tags: ['Java / Kotlin', 'Android SDK', 'MVVM Pattern', 'Room / SQLite', 'Material Design'],
      github: 'https://github.com/emmanuelTwumasi/Android1'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCloseBtnFooter = document.getElementById('modalCloseBtnFooter');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalDiagram = document.getElementById('modalDiagram');
  const modalHighlights = document.getElementById('modalHighlights');
  const modalTags = document.getElementById('modalTags');
  const modalGithubLink = document.getElementById('modalGithubLink');

  function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data || !projectModal) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    
    // Render architecture diagram
    if (modalDiagram) {
      modalDiagram.innerHTML = data.diagram || '';
    }

    // Render highlights
    modalHighlights.innerHTML = '';
    data.highlights.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      modalHighlights.appendChild(li);
    });

    // Render tags
    modalTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tech-pill';
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    modalGithubLink.setAttribute('href', data.github);

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeModalBtn) closeModalBtn.focus();
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-project-id');
      openProjectModal(id);
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeProjectModal);
  if (modalCloseBtnFooter) modalCloseBtnFooter.addEventListener('click', closeProjectModal);

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('open')) {
        closeProjectModal();
      }
      if (cmdPalette && cmdPalette.classList.contains('open')) {
        closeCmdPalette();
      }
    }
  });

  // =========================================================================
  // 11. Command Palette (Cmd+K / Ctrl+K)
  // =========================================================================
  const cmdPalette = document.getElementById('cmdPalette');
  const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
  const closeCmdPaletteBtn = document.getElementById('closeCmdPaletteBtn');
  const cmdPaletteInput = document.getElementById('cmdPaletteInput');
  const cmdPaletteResults = document.getElementById('cmdPaletteResults');

  const commandItems = [
    {
      id: 'nav-hero',
      title: 'Back to Top / Hero',
      category: 'Navigation',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
      action: () => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-about',
      title: 'About Emmanuel',
      category: 'Navigation',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
      action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-skills',
      title: 'Technical Skills Matrix',
      category: 'Navigation',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
      action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-projects',
      title: 'Featured Projects',
      category: 'Navigation',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
      action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-experience',
      title: 'Experience & Milestones',
      category: 'Navigation',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
      action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'nav-contact',
      title: 'Contact Form & Message',
      category: 'Navigation',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      id: 'proj-demonos',
      title: 'demonOS Framework Architecture',
      category: 'Architecture',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
      action: () => openProjectModal('demonos')
    },
    {
      id: 'proj-banking',
      title: 'Banking Ledger Architecture',
      category: 'Architecture',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`,
      action: () => openProjectModal('banking')
    },
    {
      id: 'proj-protwum',
      title: 'ProTwum Architecture',
      category: 'Architecture',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
      action: () => openProjectModal('protwum')
    },
    {
      id: 'proj-android1',
      title: 'Android Client Architecture',
      category: 'Architecture',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
      action: () => openProjectModal('android1')
    },
    {
      id: 'act-theme',
      title: 'Toggle Dark / Light Theme',
      category: 'Actions',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>`,
      action: () => toggleTheme()
    },
    {
      id: 'act-print',
      title: 'Print / Save Resume as PDF',
      category: 'Actions',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`,
      action: () => window.print()
    },
    {
      id: 'act-copy-email',
      title: 'Copy Email (protwumasi@gmail.com)',
      category: 'Actions',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      action: () => copyEmailToClipboard()
    },
    {
      id: 'act-github',
      title: 'Open GitHub Profile',
      category: 'Actions',
      icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
      action: () => window.open('https://github.com/emmanuelTwumasi', '_blank')
    }
  ];

  let selectedCmdIndex = 0;
  let filteredCommands = [...commandItems];

  function renderCommandResults() {
    if (!cmdPaletteResults) return;
    cmdPaletteResults.innerHTML = '';

    if (filteredCommands.length === 0) {
      cmdPaletteResults.innerHTML = `<div class="cmd-empty-msg">No commands matching "${cmdPaletteInput.value}"</div>`;
      return;
    }

    filteredCommands.forEach((cmd, idx) => {
      const el = document.createElement('div');
      el.className = `cmd-item ${idx === selectedCmdIndex ? 'selected' : ''}`;
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', idx === selectedCmdIndex ? 'true' : 'false');
      el.innerHTML = `
        <div class="cmd-item-left">
          <span class="cmd-item-icon">${cmd.icon}</span>
          <span class="cmd-item-title">${cmd.title}</span>
        </div>
        <span class="cmd-item-category">${cmd.category}</span>
      `;
      el.addEventListener('click', () => {
        executeCommand(cmd);
      });
      cmdPaletteResults.appendChild(el);
    });

    const selectedEl = cmdPaletteResults.children[selectedCmdIndex];
    if (selectedEl && selectedEl.scrollIntoView) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  function executeCommand(cmd) {
    closeCmdPalette();
    setTimeout(() => {
      cmd.action();
    }, 100);
  }

  function openCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.add('open');
    cmdPalette.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (cmdPaletteInput) {
      cmdPaletteInput.value = '';
      filteredCommands = [...commandItems];
      selectedCmdIndex = 0;
      renderCommandResults();
      cmdPaletteInput.focus();
    }
  }

  function closeCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove('open');
    cmdPalette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (cmdPaletteBtn) {
    cmdPaletteBtn.addEventListener('click', openCmdPalette);
  }

  if (closeCmdPaletteBtn) {
    closeCmdPaletteBtn.addEventListener('click', closeCmdPalette);
  }

  if (cmdPalette) {
    cmdPalette.addEventListener('click', (e) => {
      if (e.target === cmdPalette) {
        closeCmdPalette();
      }
    });
  }

  if (cmdPaletteInput) {
    cmdPaletteInput.addEventListener('input', () => {
      const q = cmdPaletteInput.value.toLowerCase().trim();
      if (!q) {
        filteredCommands = [...commandItems];
      } else {
        filteredCommands = commandItems.filter(cmd =>
          cmd.title.toLowerCase().includes(q) ||
          cmd.category.toLowerCase().includes(q)
        );
      }
      selectedCmdIndex = 0;
      renderCommandResults();
    });

    cmdPaletteInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedCmdIndex = (selectedCmdIndex + 1) % Math.max(1, filteredCommands.length);
        renderCommandResults();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedCmdIndex = (selectedCmdIndex - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length);
        renderCommandResults();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedCmdIndex]) {
          executeCommand(filteredCommands[selectedCmdIndex]);
        }
      }
    });
  }

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K, T for Theme)
  document.addEventListener('keydown', (e) => {
    // Cmd+K / Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains('open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
      return;
    }

    // Quick single-key shortcuts when not typing in an input
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag !== 'input' && activeTag !== 'textarea') {
      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleTheme();
      }
    }
  });

  // Initialize
  initTheme();
  handleTypewriter();

})();
