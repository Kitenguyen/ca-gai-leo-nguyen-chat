/* =============================================================================
 * utils.js — Hàm tiện ích dùng chung
 * =========================================================================== */
(function (global) {
  'use strict';

  var CFG = global.SADU_CONFIG || {};

  /* ---- DOM helpers ------------------------------------------------------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---- Định dạng tiền VN (Intl) ----------------------------------------- */
  var vndFormatter = new Intl.NumberFormat(CFG.LOCALE || 'vi-VN');
  function formatVND(amount) {
    return vndFormatter.format(Math.round(amount || 0)) + (CFG.CURRENCY_SUFFIX || 'đ');
  }

  /* ---- Validate SĐT Việt Nam -------------------------------------------- *
   * Chấp nhận: 10 số bắt đầu 0[3|5|7|8|9], hoặc +84 / 84 tương ứng.
   * TODO-CONFIG: xác nhận quy tắc cuối cùng nếu nghiệp vụ khác.
   * --------------------------------------------------------------------- */
  function normalizePhone(raw) {
    var p = String(raw || '').replace(/[\s.\-()]/g, '');
    if (p.indexOf('+84') === 0) p = '0' + p.slice(3);
    else if (p.indexOf('84') === 0 && p.length === 11) p = '0' + p.slice(2);
    return p;
  }
  function isValidVNPhone(raw) {
    var p = normalizePhone(raw);
    return /^0(3|5|7|8|9)\d{8}$/.test(p);
  }

  /* ---- Throttle (cho scroll) -------------------------------------------- */
  function throttle(fn, wait) {
    var last = 0, timer = null;
    return function () {
      var now = Date.now(), ctx = this, args = arguments;
      var remaining = wait - (now - last);
      if (remaining <= 0) {
        if (timer) { clearTimeout(timer); timer = null; }
        last = now; fn.apply(ctx, args);
      } else if (!timer) {
        timer = setTimeout(function () {
          last = Date.now(); timer = null; fn.apply(ctx, args);
        }, remaining);
      }
    };
  }

  function prefersReducedMotion() {
    return global.matchMedia &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---- Tracking wrapper (Tech Spec §18, §19) ---------------------------- *
   * Đẩy event vào dataLayer (GTM). Pixel/GA4 cấu hình qua GTM để dễ bảo trì.
   * Tên sự kiện thống nhất: view_page, scroll_depth, cta_click, open_form,
   * submit_form, submit_success, view_video, click_hotline.
   * --------------------------------------------------------------------- */
  global.dataLayer = global.dataLayer || [];
  function track(eventName, params) {
    try {
      global.dataLayer.push(Object.assign({ event: eventName }, params || {}));
      if (CFG.DEBUG) console.log('[track]', eventName, params || {});
    } catch (e) { /* no-op */ }
  }

  global.SADU = global.SADU || {};
  global.SADU.utils = {
    qs: qs, qsa: qsa,
    formatVND: formatVND,
    normalizePhone: normalizePhone,
    isValidVNPhone: isValidVNPhone,
    throttle: throttle,
    prefersReducedMotion: prefersReducedMotion,
    track: track,
  };
})(window);
