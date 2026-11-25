/* NHI Regulation Knowledge Base — Main JavaScript v2.0 */
(function () {
  'use strict';

  var CORRECT_PASSWORD = '0000';
  var STORAGE_KEY = 'nhi_kb_auth';

  /* ---- Password Gate ---- */
  function initPasswordGate() {
    var gate = document.getElementById('password-gate');
    if (!gate) return;
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      gate.classList.add('hidden');
      setTimeout(function () { gate.remove(); }, 500);
      return;
    }
    var input = document.getElementById('gate-password');
    var btn = document.getElementById('gate-submit');
    var content = document.getElementById('site-content');
    if (content) content.style.display = 'none';

    function tryLogin() {
      if (input.value === CORRECT_PASSWORD) {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        gate.classList.add('hidden');
        if (content) content.style.display = '';
        setTimeout(function () { gate.remove(); }, 500);
      } else {
        input.classList.add('error');
        input.value = '';
        input.placeholder = 'Incorrect — try again';
        setTimeout(function () {
          input.classList.remove('error');
          input.placeholder = 'Enter password';
        }, 1500);
      }
    }
    btn.addEventListener('click', tryLogin);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryLogin(); });
    input.focus();
  }

  /* ---- Mobile Navigation ---- */
  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav-main');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Scroll Animations ---- */
  function initScrollAnimations() {
    var items = document.querySelectorAll('.fade-in, .slide-in-left');
    if (!items.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Bar Chart Animation ---- */
  function initBarAnimations() {
    var bars = document.querySelectorAll('.bar-fill');
    if (!bars.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var w = entry.target.getAttribute('data-width');
          if (w) entry.target.style.width = w;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    bars.forEach(function (bar) { bar.style.width = '0%'; observer.observe(bar); });
  }

  /* ---- Active Nav Highlight ---- */
  function initActiveNav() {
    var path = window.location.pathname;
    document.querySelectorAll('.nav-main a, .sidebar-nav a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var resolved = new URL(href, window.location.href).pathname;
      if (resolved === path) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Table of Contents Scroll Spy ---- */
  function initTocScrollSpy() {
    var toc = document.querySelector('.toc');
    if (!toc) return;
    var headings = document.querySelectorAll('.article-body h2[id], .article-body h3[id]');
    if (!headings.length) return;
    var links = toc.querySelectorAll('a');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var active = toc.querySelector('a[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });
    headings.forEach(function (h) { observer.observe(h); });
  }

  /* ---- Simple Search Filter ---- */
  function initSearch() {
    var input = document.querySelector('.search-input');
    if (!input) return;
    var cards = document.querySelectorAll('[data-search]');
    if (!cards.length) return;
    input.addEventListener('input', function () {
      var q = input.value.toLowerCase().trim();
      cards.forEach(function (card) {
        var text = card.getAttribute('data-search').toLowerCase();
        card.style.display = (!q || text.indexOf(q) !== -1) ? '' : 'none';
      });
    });
  }

  /* ---- Donut Chart Animation ---- */
  function initDonutCharts() {
    var charts = document.querySelectorAll('.donut-chart');
    if (!charts.length) return;
    charts.forEach(function (chart) {
      var circles = chart.querySelectorAll('circle[data-value]');
      var total = 0;
      circles.forEach(function (c) { total += parseFloat(c.getAttribute('data-value')); });
      var circumference = 2 * Math.PI * 82.5;
      var offset = 0;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var runOffset = 0;
            circles.forEach(function (c) {
              var val = parseFloat(c.getAttribute('data-value'));
              var pct = val / total;
              var dash = pct * circumference;
              c.style.strokeDasharray = dash + ' ' + circumference;
              c.style.strokeDashoffset = -runOffset;
              runOffset += dash;
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(chart);
    });
  }

  /* ---- Counter Animation ---- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var duration = 1200;
          var start = Date.now();
          function tick() {
            var elapsed = Date.now() - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
          }
          tick();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { observer.observe(c); });
  }

  /* ---- Initialize ---- */
  document.addEventListener('DOMContentLoaded', function () {
    initPasswordGate();
    initNavToggle();
    initScrollAnimations();
    initBarAnimations();
    initActiveNav();
    initTocScrollSpy();
    initSearch();
    initDonutCharts();
    initCounters();
  });
})();
