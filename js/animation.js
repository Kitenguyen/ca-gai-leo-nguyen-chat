/* =============================================================================
 * animation.js — Scroll reveal + Header scroll state
 * Motion Spec: reveal một lần (§8), header trong suốt->trắng khi cuộn (§6).
 * Chỉ dùng IntersectionObserver + class toggle (vanilla, nhẹ).
 * =========================================================================== */
(function (global) {
  'use strict';

  var U = global.SADU && global.SADU.utils;

  /* ---- SCROLL REVEAL ----------------------------------------------------- */
  function initReveal() {
    var els = U.qsa('.reveal');
    if (!els.length) return;

    // Reduced motion: hiện ngay, bỏ animation (Motion §28)
    if (U.prefersReducedMotion() || !('IntersectionObserver' in global)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // reveal một lần, không lặp
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- HEADER SCROLL STATE (Motion §6) ----------------------------------- */
  function initHeader() {
    var header = U.qs('.header');
    if (!header) return;

    var onScroll = U.throttle(function () {
      // chuyển trạng thái khi đã rời khỏi đỉnh trang
      if (global.scrollY > 24) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }, 100);

    global.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // chạy lần đầu (trường hợp tải trang ở giữa)
  }

  /* ---- NUMBER COUNTER (Motion §16) — chạy MỘT LẦN khi xuất hiện ---------- *
   * Quy tắc: KHÔNG hiển thị số 0/placeholder. Bỏ qua counter ẩn (trong [hidden])
   * hoặc không có data-count > 0. Chỉ animate khi có số liệu thật.
   * --------------------------------------------------------------------- */
  function initCounters() {
    var els = U.qsa('[data-count]').filter(function (el) {
      if (el.closest('[hidden]')) return false;            // bỏ qua khi đang ẩn
      var t = parseInt(el.getAttribute('data-count'), 10);
      return !isNaN(t) && t > 0;                            // chỉ chạy với số > 0
    });
    if (!els.length) return;

    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (U.prefersReducedMotion()) { el.textContent = target.toLocaleString('vi-VN'); return; }
      var start = null, dur = 1200;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(target * eased).toLocaleString('vi-VN');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in global)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } // một lần
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- FLOATING CTA (Mobile only, CRO §14 / Motion §21) ------------------- */
  function initFloatingCTA() {
    var el = document.getElementById('floating-cta');
    if (!el) return;
    if (!global.matchMedia || global.matchMedia('(max-width:1023px)').matches) {
      el.classList.add('is-visible');
      return;
    }
    var hero = document.getElementById('hero');
    var shown = false;
    var onScroll = U.throttle(function () {
      if (!hero) return;
      var heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom < 0 && !shown) { el.classList.add('is-visible'); shown = true; }
    }, 120);
    global.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- EXIT INTENT POPUP (Motion §22 / CRO §13 / UI §25) ------------------ */
  function initExitPopup() {
    var popup  = document.getElementById('exit-popup');
    var close  = document.getElementById('exit-popup-close');
    if (!popup) return;
    var shown = false;
    function open() {
      if (shown) return; shown = true;
      popup.hidden = false;
      popup.classList.add('is-open');
      if (close) close.focus();
      U.track('exit_popup_shown', {});
    }
    function closePopup() {
      popup.classList.remove('is-open');
      setTimeout(function () { if (!popup.classList.contains('is-open')) popup.hidden = true; }, 280);
    }
    if (close) close.addEventListener('click', closePopup);
    popup.addEventListener('click', function (e) { if (e.target === popup) closePopup(); });
    /* Desktop only exit intent: mouse leaves viewport top */
    if (global.matchMedia && !global.matchMedia('(max-width:1023px)').matches) {
      document.addEventListener('mouseleave', function (e) {
        if (e.clientY < 10) open();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePopup();
    });
    popup.querySelector && popup.querySelectorAll('[data-cta]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closePopup();
        var target = document.getElementById('order-form');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---- BACK TO TOP (Motion §23) ----------------------------------------- */
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    var onScroll = U.throttle(function () {
      if (global.scrollY > 600) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    }, 150);
    global.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', function () {
      global.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  global.SADU = global.SADU || {};
  global.SADU.animation = {
    initReveal: initReveal, initHeader: initHeader, initCounters: initCounters,
    initFloatingCTA: initFloatingCTA, initExitPopup: initExitPopup, initBackToTop: initBackToTop,
  };
})(window);
