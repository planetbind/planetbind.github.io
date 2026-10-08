// Planetbind — small progressive enhancements. The site works fully without JavaScript.
(function () {
  "use strict";
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) root.classList.add("js");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // Header hairline once the page scrolls.
    var header = document.querySelector(".site-header");
    if (header) {
      var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Fade sections in as they enter the viewport.
    if (root.classList.contains("js")) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    }

    // Footer year.
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    // Starfield. Static under Reduce Motion; paused while the tab is hidden.
    var canvas = document.querySelector(".sky canvas");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var stars = [];
    var w = 0, h = 0, dpr = 1, raf = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(220, Math.round((w * h) / 7000));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.1 + 0.25,
          a: Math.random() * 0.6 + 0.2,
          s: Math.random() * 0.8 + 0.2,
          p: Math.random() * Math.PI * 2,
          v: Math.random() * 0.04 + 0.01
        });
      }
      draw(0);
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        var tw = reduceMotion ? 1 : 0.65 + 0.35 * Math.sin(t * 0.001 * st.s + st.p);
        if (!reduceMotion) { st.y -= st.v; if (st.y < -2) { st.y = h + 2; st.x = Math.random() * w; } }
        ctx.globalAlpha = st.a * tw;
        ctx.fillStyle = i % 9 === 0 ? "#b9ecff" : "#ffffff";
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop(t) { draw(t); raf = requestAnimationFrame(loop); }
    function start() { if (!reduceMotion && !raf) raf = requestAnimationFrame(loop); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
    resize();
    start();
  });
})();
