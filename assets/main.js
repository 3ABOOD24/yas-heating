/*!
 * YAS Heating Solutions — site interactions
 * Plain, dependency-free JavaScript. No build step required.
 */
(function () {
  "use strict";

  var doc = document;

  /* ---------------------------------------------------------------
   * 1. Mobile navigation
   *    The desktop <nav> already holds the real links, so we clone
   *    it into a slide-down panel instead of hand-maintaining a
   *    second copy of the menu on every page.
   * ------------------------------------------------------------- */
  function initMobileNav() {
    var header = doc.querySelector("header");
    var toggle = header && header.querySelector('button[aria-controls="mobile-nav"]');
    var sourceNav = header && header.querySelector('nav[aria-label="Primary navigation"]');
    var langLink = header && header.querySelector('a[hrefLang], a[hreflang]');
    var ctaLink = header && header.querySelector('a[href*="wa.me"]');
    if (!header || !toggle || !sourceNav) return;

    var panel = doc.createElement("div");
    panel.id = "mobile-nav";
    panel.className = "mobile-nav";
    panel.setAttribute("aria-hidden", "true");

    var nav = doc.createElement("nav");
    nav.className = "mobile-nav__links";
    nav.setAttribute("aria-label", "Mobile navigation");
    var links = sourceNav.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      var a = doc.createElement("a");
      a.href = links[i].getAttribute("href");
      a.textContent = links[i].textContent;
      if (links[i].hasAttribute("aria-current")) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    }
    panel.appendChild(nav);

    var actions = doc.createElement("div");
    actions.className = "mobile-nav__actions";
    if (langLink) actions.appendChild(langLink.cloneNode(true));
    if (ctaLink) actions.appendChild(ctaLink.cloneNode(true));
    panel.appendChild(actions);

    header.appendChild(panel);

    function closeMenu() {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
      doc.body.classList.remove("nav-open");
    }
    function openMenu() {
      panel.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      doc.body.classList.add("nav-open");
    }

    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    panel.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    var mq = window.matchMedia("(min-width: 1024px)");
    function handleViewportChange() {
      if (mq.matches) closeMenu();
    }
    if (mq.addEventListener) mq.addEventListener("change", handleViewportChange);
    else if (mq.addListener) mq.addListener(handleViewportChange);
  }

  /* ---------------------------------------------------------------
   * 2. Contact form → WhatsApp
   *    Static hosting has no backend, so the enquiry form composes
   *    a WhatsApp message from the fields and hands it to wa.me.
   * ------------------------------------------------------------- */
  function initContactForm() {
    var form = doc.querySelector("main form");
    if (!form) return;

    var phoneNumber = "201040442447"; // shared WhatsApp business number, no leading +
    var status = doc.createElement("p");
    status.className = "form-status";
    status.setAttribute("role", "status");
    form.appendChild(status);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: if the hidden "company" field got filled in, silently drop it.
      var honeypot = form.querySelector('input[name="company"]');
      if (honeypot && honeypot.value) return;

      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var phone = (form.querySelector('[name="phone"]') || {}).value || "";
      var service = (form.querySelector('[name="service"]') || {}).value || "";
      var message = (form.querySelector('[name="message"]') || {}).value || "";

      var nameField = form.querySelector('[name="name"]');
      var phoneField = form.querySelector('[name="phone"]');
      var missing = [];
      if (nameField && !name.trim()) missing.push(nameField);
      if (phoneField && !phone.trim()) missing.push(phoneField);
      if (missing.length) {
        missing[0].focus();
        status.textContent = form.dir === "rtl"
          ? "من فضلك أدخل اسمك ورقم هاتفك."
          : "Please add your name and phone number.";
        status.classList.add("is-error");
        return;
      }

      var lines = [];
      var isRtl = form.dir === "rtl" || doc.documentElement.dir === "rtl";
      lines.push((isRtl ? "طلب تواصل جديد من الموقع" : "New website enquiry"));
      lines.push((isRtl ? "الاسم" : "Name") + ": " + name);
      lines.push((isRtl ? "الهاتف" : "Phone") + ": " + phone);
      if (service) lines.push((isRtl ? "الخدمة" : "Service") + ": " + service);
      if (message) lines.push((isRtl ? "الرسالة" : "Message") + ": " + message);

      var url = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(lines.join("\n"));
      status.classList.remove("is-error");
      status.textContent = isRtl ? "جارٍ فتح واتساب…" : "Opening WhatsApp…";
      window.open(url, "_blank", "noopener");
      form.reset();
    });
  }

  /* ---------------------------------------------------------------
   * 3. Sticky header shading once the page scrolls
   * ------------------------------------------------------------- */
  function initHeaderScroll() {
    var header = doc.querySelector("header");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
   * 4. Graceful fallback if an image ever fails to load
   * ------------------------------------------------------------- */
  function initImageFallback() {
    var imgs = doc.querySelectorAll("img[src]");
    imgs.forEach(function (img) {
      img.addEventListener("error", function () {
        img.closest("figure, .img-fallback-parent");
        img.classList.add("img-broken");
      }, { once: true });
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  function ready() {
    initMobileNav();
    initContactForm();
    initHeaderScroll();
    initImageFallback();
  }
})();
