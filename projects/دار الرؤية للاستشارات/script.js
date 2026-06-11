"use strict";

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const navLinks = document.querySelectorAll(".desktop-nav a, .mobile-menu a");

const setHeaderState = () => header.classList.toggle("scrolled", window.scrollY > 24);
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "فتح القائمة");
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "فتح القائمة" : "إغلاق القائمة");
  mobileMenu.classList.toggle("open", !isOpen);
  mobileMenu.setAttribute("aria-hidden", String(isOpen));
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.count);
    const duration = 1400;
    const startedAt = performance.now();

    const update = now => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString("ar-SA");
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

document.querySelectorAll(".faq-item button").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const wasOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach(faq => {
      faq.classList.remove("open");
      faq.querySelector("button").setAttribute("aria-expanded", "false");
    });

    if (!wasOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const testimonials = [...document.querySelectorAll(".testimonial")];
const slideNumber = document.querySelector(".slider-controls b");
let activeSlide = 0;
let slideTimer;

function showSlide(index) {
  activeSlide = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((slide, i) => slide.classList.toggle("active", i === activeSlide));
  slideNumber.textContent = String(activeSlide + 1).padStart(2, "0");
}

function resetSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(activeSlide + 1), 7000);
}

document.querySelector(".slider-next").addEventListener("click", () => {
  showSlide(activeSlide - 1);
  resetSlideTimer();
});
document.querySelector(".slider-prev").addEventListener("click", () => {
  showSlide(activeSlide + 1);
  resetSlideTimer();
});
resetSlideTimer();

const sections = [...document.querySelectorAll("main section[id]")];
const desktopLinks = [...document.querySelectorAll(".desktop-nav a")];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    desktopLinks.forEach(link => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const status = contactForm.querySelector(".form-status");

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    status.textContent = "يرجى إكمال الحقول المطلوبة.";
    status.style.color = "#a33b32";
    return;
  }

  status.textContent = "تم استلام طلبك، وسنتواصل معك قريباً.";
  status.style.color = "#237049";
  contactForm.reset();
});

document.querySelector(".newsletter").addEventListener("submit", event => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  if (input.checkValidity()) {
    input.value = "";
    input.placeholder = "تم الاشتراك بنجاح";
  } else {
    input.reportValidity();
  }
});

document.getElementById("year").textContent = new Date().getFullYear().toLocaleString("ar-SA", { useGrouping: false });
