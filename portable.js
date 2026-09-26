/* Portable portfolio behaviour — replaces the platform runtime.
   Everything here works from the files in this folder: no backend, no platform.

   Handles: the intro curtain, the one-minute tour (narration + work strip),
   the "Hear the story" project players, the image lightbox, the catalogue fan,
   the sound toggle, and a one-shot retry for any image that fails to load. */
(function () {
  var D = window.NM_DATA || { stops: [], stories: {} };
  var TOUR_KEY = "nm-tour-auto";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function clock(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

  /* ---------------------------------------------------------------- intro */
  function intro() {
    var el = $(".nm-intro");
    if (!el) return;
    var KEY = "nm-intro-seen-v2", TTL = 2592000000, MS = 1500, done = false;
    function finish() {
      if (done) return;
      done = true;
      if (el.parentNode) el.parentNode.removeChild(el);
      document.dispatchEvent(new CustomEvent("nm:intro:done"));
    }
    var seen = false;
    try { var raw = localStorage.getItem(KEY); seen = !!raw && Date.now() - Number(raw) < TTL; } catch (e) {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    var main = $("main");
    if (main) Array.prototype.forEach.call(main.children, function (c) { if (c !== el) c.setAttribute("inert", ""); });
    var t = setTimeout(finish, MS);
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, function () { clearTimeout(t); finish(); }, { passive: true, once: true });
    });
    var skip = $(".nm-intro-skip", el);
    if (skip) skip.addEventListener("click", function (e) { e.stopPropagation(); clearTimeout(t); finish(); });
  }

  /* ----------------------------------------------------------------- tour */
  function tour() {
    var stops = D.stops || [];
    if (!stops.length || !$("#top")) return;
    var TOTAL = stops.reduce(function (n, s) { return n + s.seconds; }, 0);
    var index = 0, left = stops[0].seconds, running = false, paused = false, ended = false, blocked = false;
    var timer = null;

    var bar = document.createElement("aside");
    bar.className = "nm-tour-bar";
    bar.id = "tour-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Recruiter tour");
    bar.hidden = true;
    bar.innerHTML =
      '<div class="nm-tour-track"><span></span></div>' +
      '<div class="nm-tour-main">' +
        '<p class="nm-tour-label"></p>' +
        '<p class="nm-tour-stop"></p>' +
        '<button class="nm-tour-sound" type="button" hidden>\u266a TAP FOR SOUND</button>' +
        '<div class="nm-tour-controls">' +
          '<button type="button" data-act="pause">\u23f8 Pause</button>' +
          '<button type="button" data-act="skip">Skip Project \u2192</button>' +
          '<button type="button" data-act="exit">Exit Tour</button>' +
        '</div>' +
      '</div>' +
      '<p class="nm-tour-caption"></p>' +
      '<button class="nm-tour-cc" type="button" aria-pressed="true">CC</button>' +
      '<div class="nm-tour-work" aria-label="Work shown in this part of the tour"></div>' +
      '<div class="nm-tour-jumps" aria-label="Skip to stop"></div>';

    var end = document.createElement("aside");
    end.className = "nm-tour-end";
    end.id = "tour-bar";
    end.hidden = true;
    end.innerHTML =
      '<p class="nm-ch-num">THE QUICK VERSION</p>' +
      '<h2 class="nm-tour-end-title">One creative, many disciplines \u2014 design, social, video, ' +
      'photography and AI, end to end. That\u2019s the short version of why I\u2019d fit your team.</h2>' +
      '<div class="nm-tour-end-ctas">' +
        '<a class="nm-btn nm-btn-solid" download href="assets/nikhil-munjampalli-cv.pdf">Download CV \u2193</a>' +
        '<a class="nm-btn nm-btn-outline" href="https://linkedin.com/in/nikhil-munjamalli-56632651" target="_blank" rel="noreferrer">View LinkedIn \u2192</a>' +
        '<a class="nm-btn nm-btn-outline" href="index.html#contact">Contact me \u2192</a>' +
        '<button class="nm-btn nm-btn-ghost" type="button" data-act="exit">Exit</button>' +
      '</div>';

    var audio = document.createElement("audio");
    audio.preload = "auto";

    document.body.appendChild(bar);
    document.body.appendChild(end);
    document.body.appendChild(audio);

    var track = $(".nm-tour-track span", bar);
    var label = $(".nm-tour-label", bar);
    var stopEl = $(".nm-tour-stop", bar);
    var capEl = $(".nm-tour-caption", bar);
    var workEl = $(".nm-tour-work", bar);
    var jumpsEl = $(".nm-tour-jumps", bar);
    var soundBtn = $(".nm-tour-sound", bar);
    var ccBtn = $(".nm-tour-cc", bar);
    var pauseBtn = $('[data-act="pause"]', bar);
    var showCaptions = true;

    stops.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = String(i + 1);
      b.setAttribute("aria-label", "Jump to " + s.id);
      b.addEventListener("click", function () { go(i); });
      jumpsEl.appendChild(b);
    });

    function paint() {
      var s = stops[index];
      var elapsed = TOTAL - left - stops.slice(0, index).reduce(function (n, x) { return n + x.seconds; }, 0);
      track.style.width = Math.min(100, Math.max(0, (elapsed / TOTAL) * 100)) + "%";
      label.textContent = "\u25c9 RECRUITER TOUR \u00b7 " + Math.max(0, Math.ceil(TOTAL - elapsed)) + "s remaining";
      stopEl.textContent = s.id + " \u00b7 " + (index + 1) + "/" + stops.length;
      capEl.textContent = s.caption;
      capEl.hidden = !showCaptions;
      pauseBtn.textContent = paused ? "\u25b6 Resume" : "\u23f8 Pause";
      $$("button", jumpsEl).forEach(function (b, i) { b.className = i === index ? "is-active" : ""; });
      workEl.innerHTML = "";
      (s.work || []).forEach(function (w) {
        var a = document.createElement("a");
        a.className = "nm-tour-work-item";
        a.href = w.href;
        if (/^https?:/.test(w.href)) { a.target = "_blank"; a.rel = "noreferrer"; }
        a.innerHTML = '<img alt="" loading="lazy" src="' + w.src + '"><span>' + w.label + "</span>";
        workEl.appendChild(a);
      });
    }

    function playSegment(i) {
      audio.src = "assets/audio/tour-" + (i + 1) + ".mp3";
      audio.currentTime = 0;
      audio.play().then(function () { blocked = false; soundBtn.hidden = true; })
                   .catch(function () { blocked = true; soundBtn.hidden = false; });
    }

    function seek(id) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: paused ? "auto" : "smooth", block: "start" });
    }

    function go(i) {
      index = i;
      left = stops[i].seconds;
      paused = false;
      playSegment(i);
      paint();
      seek(stops[i].id);
      tick();
    }

    function tick() {
      clearInterval(timer);
      if (!running || paused) return;
      timer = setInterval(function () {
        left -= 1;
        if (left <= 0) {
          if (index >= stops.length - 1) { finish(); return; }
          go(index + 1);
          return;
        }
        paint();
      }, 1000);
    }

    function start() {
      if (running && !ended) return;
      bar.hidden = false;
      end.hidden = true;
      ended = false;
      running = true;
      go(0);
    }

    function finish() {
      clearInterval(timer);
      audio.pause();
      running = false;
      paused = false;
      ended = true;
      bar.hidden = true;
      end.hidden = false;
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    function exit() {
      clearInterval(timer);
      audio.pause();
      running = false;
      paused = false;
      ended = false;
      bar.hidden = true;
      end.hidden = true;
      index = 0;
      left = stops[0].seconds;
    }

    pauseBtn.addEventListener("click", function () { paused = !paused; paint(); tick(); });
    $('[data-act="skip"]', bar).addEventListener("click", function () {
      if (index >= stops.length - 1) { finish(); return; }
      go(index + 1);
    });
    $('[data-act="exit"]', bar).addEventListener("click", exit);
    $('[data-act="exit"]', end).addEventListener("click", exit);
    ccBtn.addEventListener("click", function () {
      showCaptions = !showCaptions;
      ccBtn.setAttribute("aria-pressed", String(showCaptions));
      capEl.hidden = !showCaptions;
    });
    soundBtn.addEventListener("click", function () {
      audio.play().then(function () { blocked = false; soundBtn.hidden = true; }).catch(function () {});
    });
    ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, function () {
        if (blocked) audio.play().then(function () { blocked = false; soundBtn.hidden = true; }).catch(function () {});
      }, { passive: true });
    });

    window.addEventListener("nm:tour:start", function () { exit(); start(); });
    $$('[data-cursor="TOUR"]').forEach(function (b) { b.addEventListener("click", function () { exit(); start(); }); });

    // Auto-start once per session, after the intro curtain lifts.
    var auto = false;
    try {
      if (sessionStorage.getItem(TOUR_KEY) !== "1" &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        sessionStorage.setItem(TOUR_KEY, "1");
        auto = true;
      }
    } catch (e) {}
    if (auto) {
      var t2 = setTimeout(start, 2000);
      document.addEventListener("nm:intro:done", function () { clearTimeout(t2); setTimeout(start, 250); }, { once: true });
    }
  }

  /* ----------------------------------------------------- project stories */
  function projectAudio() {
    $$(".nm-pa").forEach(function (wrap) {
      var audio = $("audio", wrap);
      var btn = $(".nm-pa-btn", wrap);
      if (!audio || !btn) return;
      var time = $(".nm-pa-time", wrap), label = $(".nm-pa-label", wrap),
          glyph = $(".nm-pa-glyph", wrap), track = $(".nm-pa-track", wrap);
      var total = 0, playing = false;
      audio.addEventListener("loadedmetadata", function () { if (audio.duration) total = audio.duration; });
      audio.addEventListener("timeupdate", function () {
        if (time) time.textContent = clock(audio.currentTime) + " / " + clock(total);
        if (track) track.style.width = (total ? (audio.currentTime / total) * 100 : 0) + "%";
      });
      audio.addEventListener("ended", function () {
        playing = false;
        wrap.classList.remove("is-playing");
        if (glyph) glyph.textContent = "\u25b6";
        if (label) label.hidden = false;
        if (time) time.textContent = clock(total || 0);
        if (track) track.style.width = "0%";
      });
      btn.addEventListener("click", function () {
        if (playing) { audio.pause(); playing = false; wrap.classList.remove("is-playing");
          if (glyph) glyph.textContent = "\u25b6"; return; }
        audio.play().then(function () {
          playing = true;
          wrap.classList.add("is-playing");
          if (glyph) glyph.textContent = "\u275a\u275a";
          if (label) label.hidden = true;
        }).catch(function () {});
      });
    });
  }

  /* ------------------------------------------------------------- lightbox */
  function lightbox() {
    var el = document.createElement("div");
    el.className = "nm-lightbox";
    el.hidden = true;
    el.setAttribute("role", "presentation");
    el.innerHTML = '<button class="nm-modal-close" type="button" aria-label="Close preview">\u2715</button>' +
                   '<img class="nm-lightbox-img" alt="">';
    document.body.appendChild(el);
    var img = $("img", el);
    function close() { el.hidden = true; }
    el.addEventListener("click", close);
    img.addEventListener("click", function (e) { e.stopPropagation(); });
    $(".nm-modal-close", el).addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    $$('[data-cursor="VIEW"]').forEach(function (host) {
      var picture = $("img", host);
      if (!picture) return;
      host.addEventListener("click", function (e) {
        if (host.tagName === "A") return;          // let real links navigate
        e.preventDefault();
        img.src = picture.getAttribute("src");
        el.hidden = false;
      });
    });
  }

  /* --------------------------------------------------------- catalogue fan */
  function fan() {
    var pages = $$(".nm-cat-page");
    var prev = $(".nm-cat-prev"), next = $(".nm-cat-next");
    if (!pages.length) return;
    var i = 0;
    function show(n) {
      i = (n + pages.length) % pages.length;
      pages.forEach(function (p, k) { p.classList.toggle("is-front", k === i); });
      var counter = $(".nm-cat-count");
      if (counter) counter.textContent = (i + 1) + " / " + pages.length;
      pages[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    if (prev) prev.addEventListener("click", function () { show(i - 1); });
    if (next) next.addEventListener("click", function () { show(i + 1); });
    show(0);
  }

  /* --------------------------------------------------------- sound toggle */
  function sound() {
    var video = $(".nm-hero-video");
    var btn = $(".nm-icon-btn");
    if (!video || !btn) return;
    btn.addEventListener("click", function () {
      video.muted = !video.muted;
      btn.setAttribute("aria-label", video.muted ? "Sound on" : "Sound off");
      btn.textContent = video.muted ? "\u25c9" : "\u27f2";
    });
  }

  /* ------------------------- retry an image that fails (never re-requested) */
  document.addEventListener("error", function (e) {
    var el = e.target;
    if (el && el.tagName === "IMG" && !el.dataset.nmRetried) {
      el.dataset.nmRetried = "1";
      var s = el.getAttribute("src");
      if (s) { el.src = ""; setTimeout(function () { el.src = s; }, 0); }
    }
  }, true);

  function boot() { intro(); tour(); projectAudio(); lightbox(); fan(); sound(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
