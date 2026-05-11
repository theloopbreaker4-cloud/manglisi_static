// Manglisi.vip — Cottage Tati · front-end logic
(function () {
  'use strict';

  const STORAGE_KEY = 'manglisi-lang';
  const THEME_KEY = 'manglisi-theme';
  const SUPPORTED = ['ru', 'en', 'ka', 'uk', 'be', 'az', 'hy'];
  const DEFAULT_LANG = 'en';

  // ─── Theme (light/dark) ─────────────────────────────────────────
  function detectTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update theme-color meta for browser chrome (mobile)
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0e1a0c' : '#2d4a2a');
    localStorage.setItem(THEME_KEY, theme);
  }

  function bindThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    });
    // Respond to OS theme changes if user has not picked explicitly
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  // Apply theme ASAP (before DOMContentLoaded) to avoid flash
  applyTheme(detectTheme());

  function detectLang() {
    // 1. Explicit URL override (?lang=xx) wins
    const url = new URLSearchParams(location.search).get('lang');
    if (url && SUPPORTED.includes(url)) return url;
    // 2. User's prior choice
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    // 3. OS / browser locale — try navigator.languages first, then navigator.language
    const candidates = []
      .concat(Array.isArray(navigator.languages) ? navigator.languages : [])
      .concat(navigator.language ? [navigator.language] : []);
    for (const raw of candidates) {
      const code = String(raw || '').slice(0, 2).toLowerCase();
      if (SUPPORTED.includes(code)) return code;
    }
    // 4. Fallback
    return DEFAULT_LANG;
  }

  function getKey(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
  }

  function applyLang(lang) {
    if (!window.I18N || !window.I18N[lang]) lang = DEFAULT_LANG;
    const dict = window.I18N[lang];
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = getKey(dict, key);
      if (val != null) {
        if (typeof val === 'string' && val.indexOf('<br') !== -1) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        const val = getKey(dict, key);
        if (val != null) el.setAttribute(attr, val);
      });
    });
    document.querySelectorAll('.lang-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    updateLangTrigger(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function updateLangTrigger(lang) {
    const trigger = document.querySelector('.lang-trigger');
    if (!trigger) return;
    const flag = trigger.querySelector('.flag use');
    const code = trigger.querySelector('.lang-code');
    if (flag) {
      // Use in-document fragment ref (works with inlined sprite)
      flag.setAttribute('href', `#f-${lang}`);
      flag.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#f-${lang}`);
    }
    if (code) code.textContent = lang.toUpperCase();
  }

  function bindLangDropdown() {
    const trigger = document.querySelector('.lang-trigger');
    const menu = document.querySelector('.lang-menu');
    if (!trigger || !menu) return;

    function close() {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }
    function open() {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menu.hidden) open(); else close();
    });

    menu.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyLang(btn.dataset.lang);
        close();
      });
    });

    document.addEventListener('click', (e) => {
      if (!menu.hidden && !menu.contains(e.target) && !trigger.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) close();
    });
  }

  function bindMenuToggle() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  function bindLightbox() {
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    const lb = document.getElementById('lightbox');
    if (!items.length || !lb) return;
    const img = lb.querySelector('img');
    const close = lb.querySelector('.lb-close');
    const prev = lb.querySelector('.lb-prev');
    const next = lb.querySelector('.lb-next');
    let idx = 0;

    function open(i) {
      idx = i;
      img.src = items[idx].href;
      img.alt = items[idx].querySelector('img').alt;
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function shut() {
      lb.hidden = true;
      img.src = '';
      document.body.style.overflow = '';
    }
    function step(d) {
      idx = (idx + d + items.length) % items.length;
      img.src = items[idx].href;
      img.alt = items[idx].querySelector('img').alt;
    }

    items.forEach((a, i) => {
      a.addEventListener('click', (e) => { e.preventDefault(); open(i); });
    });
    close.addEventListener('click', shut);
    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) shut(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') shut();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  function bindReveal() {
    const els = document.querySelectorAll('.section, .feature, .perfect-card, .season-card, .blog-card, .howto-card, .gallery-item');
    els.forEach((el) => el.classList.add('reveal'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    els.forEach((el) => io.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(detectLang());
    bindLangDropdown();
    bindMenuToggle();
    bindLightbox();
    bindReveal();
    bindThemeToggle();
  });
})();
