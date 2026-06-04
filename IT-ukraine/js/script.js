/**
 * Винаходи українців у IT — головний скрипт
 * GitHub Pages ready
 */

(function () {
  'use strict';

  /* Перевірка: чи завантажився style.css */
  (function checkCssLoaded() {
    function isCssReady() {
      var i;
      var sheet;
      var href;
      for (i = 0; i < document.styleSheets.length; i++) {
        sheet = document.styleSheets[i];
        href = sheet.href || '';
        if (href.indexOf('style.css') === -1) continue;
        try {
          if (sheet.cssRules && sheet.cssRules.length > 0) return true;
        } catch (err) {
          return true;
        }
      }
      return false;
    }

    function mark() {
      document.documentElement.classList.add('css-ready');
    }

    if (isCssReady()) {
      mark();
      return;
    }

    window.addEventListener('load', function () {
      if (isCssReady()) {
        mark();
      } else {
        console.error(
          '[IT України] style.css не завантажився. Запустіть сервер з папки site:\n' +
            'cd site && python3 -m http.server 8080\n' +
            'Потім відкрийте http://localhost:8080'
        );
      }
    });
  })();

  const STORAGE_KEY = 'ukrainian-it-theme';
  const header = document.querySelector('.site-header');
  const themeToggle = document.querySelector('.theme-toggle');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  /* ---------- Theme (dark / light) ---------- */
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ---------- Sticky header shadow ---------- */
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });

    document.addEventListener('click', function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.querySelector('i').className = 'fa-solid fa-bars';
      }
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- Active nav link for current page ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Підстановка, якщо зовнішнє зображення не завантажилось ---------- */
  document.querySelectorAll('img[referrerpolicy]').forEach(function (img) {
    img.addEventListener('error', function () {
      if (this.dataset.fallbackUsed) return;
      this.dataset.fallbackUsed = '1';
      this.style.objectFit = 'cover';
      this.alt = (this.alt || 'Зображення') + ' (тимчасова заглушка)';
      this.src =
        'data:image/svg+xml,' +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">' +
            '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" style="stop-color:#0d1b3e"/>' +
            '<stop offset="100%" style="stop-color:#2d5a9e"/>' +
            '</linearGradient></defs>' +
            '<rect fill="url(#g)" width="800" height="500"/>' +
            '<text x="400" y="255" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="22">Зображення недоступне</text>' +
            '</svg>'
        );
    });
  });

  /* ---------- Smooth anchor scroll (same page) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
