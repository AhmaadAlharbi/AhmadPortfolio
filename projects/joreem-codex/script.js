"use strict";

const header = document.getElementById("siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const navLinks = document.querySelectorAll(".desktop-nav a");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("load", () => {
  window.setTimeout(() => document.querySelector(".page-loader").classList.add("loaded"), 350);
});

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 30);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

function setMenu(open) {
  menuToggle.classList.toggle("open", open);
  mobileMenu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
  mobileMenu.setAttribute("aria-hidden", String(!open));
}

menuToggle.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("open")));
mobileLinks.forEach(link => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") setMenu(false);
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -30px" });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });
sections.forEach(section => activeObserver.observe(section));

const counterSection = document.querySelector(".stats");
let countersStarted = false;

function animateCounter(element) {
  const target = Number(element.dataset.count);
  const duration = 1700;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = Math.round(target * eased).toLocaleString("ar-EG");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    document.querySelectorAll("[data-count]").forEach(animateCounter);
    counterObserver.disconnect();
  }
}, { threshold: 0.35 });
counterObserver.observe(counterSection);

document.querySelectorAll(".ripple").forEach(button => {
  button.addEventListener("click", event => {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const wave = document.createElement("span");
    wave.className = "ripple-wave";
    wave.style.width = wave.style.height = `${size}px`;
    wave.style.left = `${event.clientX - rect.left - size / 2}px`;
    wave.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(wave);
    wave.addEventListener("animationend", () => wave.remove());
  });
});

const collectionTiles = document.querySelectorAll(".collection-tile");
collectionTiles.forEach(tile => {
  tile.addEventListener("mouseenter", () => {
    collectionTiles.forEach(item => item.classList.remove("active"));
    tile.classList.add("active");
  });
});

const slides = [...document.querySelectorAll(".testimonial-slide")];
const currentSlideLabel = document.getElementById("slideCurrent");
let slideIndex = 0;

function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, itemIndex) => slide.classList.toggle("active", itemIndex === slideIndex));
  currentSlideLabel.textContent = String(slideIndex + 1).padStart(2, "0");
}

document.querySelector(".slider-next").addEventListener("click", () => showSlide(slideIndex + 1));
document.querySelector(".slider-prev").addEventListener("click", () => showSlide(slideIndex - 1));

if (!prefersReducedMotion) {
  const parallaxElements = document.querySelectorAll("[data-parallax]");
  let mouseX = 0;
  let mouseY = 0;
  let frameRequested = false;

  function renderParallax() {
    parallaxElements.forEach(element => {
      const strength = Number(element.dataset.parallax);
      element.style.translate = `${mouseX * strength}px ${mouseY * strength}px`;
    });
    frameRequested = false;
  }

  document.querySelector(".hero").addEventListener("mousemove", event => {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(renderParallax);
    }
  });

  const glow = document.querySelector(".cursor-glow");
  document.addEventListener("pointermove", event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const status = contactForm.querySelector(".form-status");
  const button = contactForm.querySelector("button");
  button.disabled = true;
  button.querySelector("span").textContent = "جارٍ الإرسال...";
  window.setTimeout(() => {
    status.textContent = "تم استلام طلبك، سنتواصل معك قريباً.";
    button.querySelector("span").textContent = "تم الإرسال";
    contactForm.reset();
    window.setTimeout(() => {
      button.disabled = false;
      button.querySelector("span").textContent = "إرسال الطلب";
    }, 2200);
  }, 700);
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
