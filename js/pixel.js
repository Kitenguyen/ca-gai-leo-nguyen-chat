/* =============================================================================
 * pixel.js - Meta Pixel wrapper and auto-triggers
 * All Meta Pixel events must go through window.SADUPixel.
 * =========================================================================== */
(function (global, document) {
  'use strict';

  var fired = {
    pageView: false,
    viewContent: false,
    initiateCheckout: false,
    scroll50: false
  };

  function canTrack() {
    return typeof global.fbq === 'function';
  }

  function track(eventName, params) {
    if (!canTrack()) return false;
    try {
      if (params) {
        global.fbq('track', eventName, params);
      } else {
        global.fbq('track', eventName);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  function trackCustom(eventName, params) {
    if (!canTrack()) return false;
    try {
      if (params) {
        global.fbq('trackCustom', eventName, params);
      } else {
        global.fbq('trackCustom', eventName);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  function toNumber(value) {
    var number = Number(value);
    return isNaN(number) ? 0 : number;
  }

  function addListener(elements, eventName, handler) {
    var i;
    for (i = 0; i < elements.length; i += 1) {
      elements[i].addEventListener(eventName, handler);
    }
  }

  function pageView() {
    if (fired.pageView) return false;
    fired.pageView = true;
    return track('PageView');
  }

  function viewContent() {
    if (fired.viewContent) return false;
    fired.viewContent = true;
    return track('ViewContent', {
      content_name: 'Tra Ca Gai Leo SADU',
      content_type: 'product'
    });
  }

  function initiateCheckout() {
    if (fired.initiateCheckout) return false;
    fired.initiateCheckout = true;
    return track('InitiateCheckout', {
      content_name: 'Tra Ca Gai Leo SADU',
      currency: 'VND'
    });
  }

  function purchase(value) {
    return track('Purchase', {
      value: toNumber(value),
      currency: 'VND'
    });
  }

  function lead() {
    return track('Lead');
  }

  function contact() {
    return track('Contact');
  }

  function scroll50() {
    if (fired.scroll50) return false;
    fired.scroll50 = true;
    return trackCustom('Scroll50');
  }

  function bindOrderButtons() {
    addListener(document.querySelectorAll('[data-order-button]'), 'click', function () {
      initiateCheckout();
    });
  }

  function bindTelephoneLinks() {
    addListener(document.querySelectorAll('a[href^="tel:"]'), 'click', function () {
      contact();
    });
  }

  function bindScrollDepth() {
    function handleScroll() {
      var doc = document.documentElement;
      var body = document.body;
      var scrollTop = global.pageYOffset || doc.scrollTop || body.scrollTop || 0;
      var viewport = global.innerHeight || doc.clientHeight || 0;
      var fullHeight = Math.max(
        body.scrollHeight, doc.scrollHeight,
        body.offsetHeight, doc.offsetHeight,
        body.clientHeight, doc.clientHeight
      );
      var maxScroll = fullHeight - viewport;

      if (maxScroll <= 0) return;
      if ((scrollTop / maxScroll) >= 0.5) {
        scroll50();
        global.removeEventListener('scroll', handleScroll);
      }
    }

    global.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  function initAutoTracking() {
    pageView();
    viewContent();
    bindOrderButtons();
    bindTelephoneLinks();
    bindScrollDepth();
  }

  global.SADUPixel = {
    pageView: pageView,
    viewContent: viewContent,
    initiateCheckout: initiateCheckout,
    purchase: purchase,
    lead: lead,
    contact: contact,
    scroll50: scroll50
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoTracking);
  } else {
    initAutoTracking();
  }
})(window, document);
