/* =============================================================================
 * app.js — Entry point
 * Khởi tạo các module sau khi DOM sẵn sàng.
 * =========================================================================== */
(function (global) {
  'use strict';

  function init() {
    var S = global.SADU || {};
    var U = S.utils;

    // Chrome + reveal (Sprint 1)
    if (S.animation) {
      S.animation.initHeader();
      S.animation.initReveal();
      S.animation.initCounters();
      S.animation.initFloatingCTA();
      S.animation.initExitPopup();
      S.animation.initBackToTop();
    }

    // Sprint 3/4 modules (hiện là stub — an toàn khi gọi)
    if (S.gallery) S.gallery.init();
    if (S.form) S.form.init();

    // Đồng bộ giá trị config vào DOM (hotline, links...) — TODO-CONFIG values
    syncConfigToDOM();

    // FAQ Accordion (UI §21 / DS §21: mở một lần, animation mượt)
    var faqList = document.getElementById('faq-list');
    if (faqList) {
      faqList.addEventListener('click', function (e) {
        var btn = e.target.closest('.faq__trigger');
        if (!btn) return;
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        // đóng tất cả
        faqList.querySelectorAll('.faq__trigger').forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
          var body = document.getElementById(b.getAttribute('aria-controls'));
          if (body) body.classList.remove('is-open');
        });
        // mở mục đang click (nếu chưa mở)
        if (!expanded) {
          btn.setAttribute('aria-expanded', 'true');
          var body = document.getElementById(btn.getAttribute('aria-controls'));
          if (body) body.classList.add('is-open');
        }
      });
    }
    if (U) {
      U.track('view_page', { page: 'landing_ca_gai_leo_sadu' });

      U.qsa('[data-hotline]').forEach(function (el) {
        el.addEventListener('click', function () { U.track('click_hotline'); });
      });
      U.qsa('[data-cta]').forEach(function (el) {
        el.addEventListener('click', function () {
          U.track('cta_click', { label: el.getAttribute('data-cta') });
        });
      });
    }
  }

  function syncConfigToDOM() {
    var CFG = global.SADU_CONFIG || {};
    var U = global.SADU && global.SADU.utils;
    if (!U) return;

    U.qsa('[data-bind="hotline"]').forEach(function (el) {
      el.textContent = CFG.HOTLINE || '';
    });
    U.qsa('[data-bind="hotline-href"]').forEach(function (el) {
      el.setAttribute('href', CFG.HOTLINE_HREF || '#');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
