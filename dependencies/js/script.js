/* =========================================================
   Aquafiltrec — script.js
   Lightweight enhancements (no dependencies):
   - Mobile nav toggle (matches .site-header, .nav, .nav-toggle)
   - Close menu on link click / outside click / Esc
   - Scroll spy (highlights nav links when sections are in view)
   - Smooth scroll offset for sticky header
   ========================================================= */

(() => {
  "use strict";

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Mobile nav ----------
  const header = qs(".site-header");
  const navToggle = qs(".nav-toggle");
  const nav = qs(".nav");

  const setExpanded = (btn, expanded) => {
    if (!btn) return;
    btn.setAttribute("aria-expanded", String(expanded));
  };

  const openNav = () => {
    if (!header || !nav) return;
    header.classList.add("is-open");
    setExpanded(navToggle, true);
  };

  const closeNav = () => {
    if (!header || !nav) return;
    header.classList.remove("is-open");
    setExpanded(navToggle, false);
  };

  const toggleNav = () => {
    if (!header) return;
    header.classList.contains("is-open") ? closeNav() : openNav();
  };

  if (navToggle) {
    // Best practice for toggle buttons: aria-controls + aria-expanded
    if (nav && !nav.id) nav.id = "site-nav";
    navToggle.setAttribute("aria-controls", nav ? nav.id : "site-nav");
    navToggle.setAttribute("aria-expanded", "false");

    navToggle.addEventListener("click", (e) => {
      e.preventDefault();
      toggleNav();
    });
  }

  // Close when clicking a nav link (mobile)
  qsa(".nav a").forEach((a) => {
    a.addEventListener("click", () => closeNav());
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!header || !header.classList.contains("is-open")) return;
    const clickedInsideHeader = header.contains(e.target);
    if (!clickedInsideHeader) closeNav();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // ---------- Smooth scroll with sticky offset ----------
  const getHeaderOffset = () => {
    const h = qs(".site-header");
    return h ? Math.ceil(h.getBoundingClientRect().height) + 8 : 0;
  };

  const scrollToId = (id) => {
    const el = qs(id);
    if (!el) return;

    const y = window.scrollY + el.getBoundingClientRect().top - getHeaderOffset();
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = qs(href);
      if (!target) return;

      e.preventDefault();
      scrollToId(href);
      history.pushState(null, "", href);
    });
  });

  // ---------- Scroll spy (optional but nice) ----------
  // Highlights .nav a whose hash matches the visible <section id="...">
  const navLinks = qsa('.nav a[href^="#"]');
  const linkById = new Map(
    navLinks
      .map((a) => [a.getAttribute("href"), a])
      .filter(([href]) => href && href.startsWith("#"))
  );

  const sections = qsa("section[id], main [id]").filter((el) => el.id);

  const setActiveLink = (hash) => {
    navLinks.forEach((a) => a.classList.remove("is-active"));
    const link = linkById.get(hash);
    if (link) link.classList.add("is-active");
  };

  if ("IntersectionObserver" in window && sections.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        setActiveLink(`#${visible.target.id}`);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: `-${getHeaderOffset()}px 0px -55% 0px`,
      }
    );

    sections.forEach((s) => obs.observe(s));
  }

  // ---------- Current year helper (optional) ----------
  // Put <span data-year></span> in footer if you want.
  qsa("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
