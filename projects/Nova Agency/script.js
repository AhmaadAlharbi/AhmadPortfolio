"use strict";

const header = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];

function closeMenu() {
  siteNav.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const open = siteNav.classList.toggle("open");
  menuToggle.classList.toggle("active", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", open);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const selector = link.getAttribute("href");
    if (!selector || selector === "#") return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  });
});

function updatePageState() {
  header.classList.toggle("scrolled", window.scrollY > 25);
  const position = window.scrollY + 170;
  let activeId = "home";
  sections.forEach((section) => {
    if (position >= section.offsetTop) activeId = section.id;
  });
  navLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${activeId}`));
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  requestAnimationFrame(() => {
    updatePageState();
    ticking = false;
  });
  ticking = true;
}, { passive: true });
updatePageState();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: "0px 0px -45px" });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.target);
    const started = performance.now();
    function count(now) {
      const progress = Math.min((now - started) / 1500, 1);
      counter.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(count);
    }
    requestAnimationFrame(count);
    observer.unobserve(counter);
  });
}, { threshold: 0.55 });
document.querySelectorAll(".counter").forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const current = trigger.closest(".accordion-item");
    const shouldOpen = !current.classList.contains("active");
    document.querySelectorAll(".accordion-item").forEach((item) => {
      item.classList.remove("active");
      item.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
    });
    if (shouldOpen) {
      current.classList.add("active");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

document.querySelectorAll(".ripple-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    button.querySelector(".ripple")?.remove();
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    Object.assign(ripple.style, { width: `${size}px`, height: `${size}px`, left: `${event.clientX - rect.left}px`, top: `${event.clientY - rect.top}px` });
    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

const slides = [...document.querySelectorAll(".testimonial-slide")];
const dots = [...document.querySelectorAll(".slider-dots button")];
let activeSlide = 0;
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === activeSlide));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === activeSlide));
}
document.querySelector(".slider-prev").addEventListener("click", () => showSlide(activeSlide - 1));
document.querySelector(".slider-next").addEventListener("click", () => showSlide(activeSlide + 1));
dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));

const cursor = document.querySelector(".cursor-dot");
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.style.opacity = "1";
  });
  document.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("mouseenter", () => cursor.classList.add("active"));
    item.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });
}

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button[type='submit']");
  const label = button.innerHTML;
  button.disabled = true;
  button.textContent = "Sending...";
  setTimeout(() => {
    contactForm.reset();
    button.disabled = false;
    button.innerHTML = label;
    formStatus.textContent = "Thanks. Your idea is in our hands.";
    setTimeout(() => { formStatus.textContent = ""; }, 5000);
  }, 850);
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
window.addEventListener("resize", () => { if (window.innerWidth > 800) closeMenu(); });
