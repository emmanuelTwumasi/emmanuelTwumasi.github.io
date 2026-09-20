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
  // 9. Print / Save CV Action
  // =========================================================================
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
  const modalHighlights = document.getElementById('modalHighlights');
  const modalTags = document.getElementById('modalTags');
  const modalGithubLink = document.getElementById('modalGithubLink');

  function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data || !projectModal) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    
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
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // Initialize
  initTheme();
  handleTypewriter();

})();
