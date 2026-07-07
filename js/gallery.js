/* =============================================================================
 * gallery.js - Gallery Lightbox (UI §12 / DS §18 / Motion §13) + Video (UI §13)
 * Vanilla, khong thu vien. Ban phim: Esc dong, <-/-> chuyen anh.
 * =============================================================================*/
(function (global) {
  'use strict';
  var U = global.SADU && global.SADU.utils;

  function initLightbox() {
    var grid = document.getElementById('gallery-grid');
    var lb = document.getElementById('lightbox');
    if (!grid || !lb || !U) return;

    var items = U.qsa('.gallery__item', grid);
    var stage = document.getElementById('lb-stage');
    var caption = document.getElementById('lb-caption');
    var btnClose = document.getElementById('lb-close');
    var btnPrev = document.getElementById('lb-prev');
    var btnNext = document.getElementById('lb-next');
    var current = 0;
    var lastFocus = null;

    function render() {
      var it = items[current];
      var cap = it ? it.getAttribute('data-caption') : '';
      var src = it ? it.getAttribute('data-src') : '';

      if (caption) caption.textContent = cap || '';
      if (stage) {
        stage.setAttribute('aria-label', cap ? ('Anh: ' + cap) : 'Anh');
        stage.innerHTML = '';
        if (src) {
          var img = document.createElement('img');
          img.className = 'asset-media asset-media--contain';
          img.src = src;
          img.alt = cap || 'Anh thu vien SADU';
          stage.appendChild(img);
        }
      }
    }

    function open(i) {
      current = i;
      lastFocus = document.activeElement;
      render();
      lb.classList.add('is-open');
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      if (btnClose) btnClose.focus();
      U.track('open_lightbox', { index: i });
    }

    function close() {
      lb.classList.remove('is-open');
      lb.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function go(delta) {
      current = (current + delta + items.length) % items.length;
      render();
    }

    items.forEach(function (it, i) {
      it.addEventListener('click', function () { open(i); });
    });
    if (btnClose) btnClose.addEventListener('click', close);
    if (btnPrev) btnPrev.addEventListener('click', function () { go(-1); });
    if (btnNext) btnNext.addEventListener('click', function () { go(1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    });
  }

  function initVideo() {
    if (!U) return;

    function buildYoutubeSrc(frame) {
      var videoId = frame.getAttribute('data-youtube-id');
      if (!videoId) return '';

      var start = parseInt(frame.getAttribute('data-youtube-start') || '0', 10);
      var params = [
        'autoplay=1',
        'rel=0',
        'modestbranding=1',
        'playsinline=1'
      ];

      if (!isNaN(start) && start > 0) params.push('start=' + start);
      if (global.location && /^https?:$/i.test(global.location.protocol) && global.location.origin) {
        params.push('origin=' + encodeURIComponent(global.location.origin));
      }

      return 'https://www.youtube.com/embed/' + encodeURIComponent(videoId) + '?' + params.join('&');
    }

    function renderFileProtocolNotice(frame) {
      if (frame.querySelector('.video__notice')) return;

      var watchUrl = frame.getAttribute('data-youtube-url') || '';
      frame.innerHTML = '';

      var box = document.createElement('div');
      box.className = 'video__notice';

      var title = document.createElement('strong');
      title.className = 'video__notice-title';
      title.textContent = 'YouTube khong phat truc tiep khi mo file HTML bang file://';
      box.appendChild(title);

      var body = document.createElement('p');
      body.className = 'video__notice-body';
      body.textContent = 'Hay mo landing page bang localhost hoac domain that de xem truc tiep trong trang.';
      box.appendChild(body);

      var actions = document.createElement('div');
      actions.className = 'video__notice-actions';

      if (watchUrl) {
        var link = document.createElement('a');
        link.className = 'btn btn--secondary';
        link.href = watchUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Mo tren YouTube';
        actions.appendChild(link);
      }

      box.appendChild(actions);
      frame.appendChild(box);
    }

    U.qsa('.video__frame').forEach(function (frame) {
      var btn = U.qs('.video__play', frame);
      if (!btn) return;

      btn.addEventListener('click', function () {
        var src = frame.getAttribute('data-src');
        var youtubeId = frame.getAttribute('data-youtube-id');
        U.track('view_video', { id: frame.id || '' });
        if (youtubeId) {
          if (global.location && global.location.protocol === 'file:') {
            renderFileProtocolNotice(frame);
            return;
          }

          var iframe = U.qs('.video__el', frame);
          if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.className = 'video__el';
            iframe.title = frame.getAttribute('aria-label') || 'YouTube video';
            iframe.loading = 'lazy';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            frame.appendChild(iframe);
          }

          iframe.src = buildYoutubeSrc(frame);
          frame.classList.add('is-playing');
          return;
        }

        if (!src) return;

        var v = document.createElement('video');
        v.className = 'video__el';
        v.src = src;
        v.controls = true;
        v.playsInline = true;
        v.preload = 'metadata';
        frame.appendChild(v);
        frame.classList.add('is-playing');
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      });
    });
  }

  global.SADU = global.SADU || {};
  global.SADU.gallery = {
    init: function () {
      initLightbox();
      initVideo();
    }
  };
})(window);
