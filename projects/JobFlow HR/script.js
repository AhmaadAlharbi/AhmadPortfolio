"use strict";

const header = document.querySelector("#site-header");
const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 16);
}

function closeMenu() {
  menuToggle.classList.remove("active");
  primaryNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = !primaryNav.classList.contains("open");
  menuToggle.classList.toggle("active", isOpen);
  primaryNav.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("menu-open", isOpen);
});

document.addEventListener("click", (event) => {
  if (!primaryNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
});

function updateActiveNavigation() {
  const position = window.scrollY + 180;
  let activeId = "features";

  sections.forEach((section) => {
    if (position >= section.offsetTop) activeId = section.id;
  });

  const navMap = {
    home: "features",
    pipeline: "features",
    dashboard: "features",
    solutions: "solutions",
    resources: "resources",
    pricing: "pricing",
    contact: "contact"
  };
  const current = navMap[activeId] || activeId;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    setHeaderState();
    updateActiveNavigation();
    scrollTicking = false;
  });
}, { passive: true });

setHeaderState();
updateActiveNavigation();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -45px" });

document.querySelectorAll(".reveal").forEach((element) => {
  if (reduceMotion) element.classList.add("visible");
  else revealObserver.observe(element);
});

document.querySelectorAll(".ripple").forEach((button) => {
  button.addEventListener("click", (event) => {
    const dot = document.createElement("span");
    const rect = button.getBoundingClientRect();
    dot.className = "ripple-dot";
    dot.style.left = `${event.clientX - rect.left}px`;
    dot.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(dot);
    window.setTimeout(() => dot.remove(), 700);
  });
});

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion-item");
    const shouldOpen = !item.classList.contains("active");

    document.querySelectorAll(".accordion-item").forEach((accordionItem) => {
      accordionItem.classList.remove("active");
      accordionItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
    });

    if (shouldOpen) {
      item.classList.add("active");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.target);
    const duration = reduceMotion ? 0 : 1700;
    const startTime = performance.now();

    function updateCounter(now) {
      const progress = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      counter.textContent = Math.floor(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(updateCounter);
    }

    requestAnimationFrame(updateCounter);
    observer.unobserve(counter);
  });
}, { threshold: 0.55 });

counters.forEach((counter) => counterObserver.observe(counter));

const billingButtons = document.querySelectorAll("[data-billing]");
const priceValues = document.querySelectorAll(".price strong[data-monthly]");

billingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const period = button.dataset.billing;
    billingButtons.forEach((item) => item.classList.toggle("active", item === button));
    priceValues.forEach((price) => {
      price.animate([{ opacity: .25, transform: "translateY(5px)" }, { opacity: 1, transform: "none" }], { duration: 280 });
      price.textContent = price.dataset[period];
    });
  });
});

const dashboardView = document.querySelector("#dashboard-view");
document.querySelectorAll("[data-dashboard-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("[data-dashboard-tab]").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    dashboardView.classList.remove("is-switching");
    void dashboardView.offsetWidth;
    dashboardView.classList.add("is-switching");

    const title = dashboardView.querySelector(".dashboard-welcome h3");
    const labels = {
      overview: "Good morning, Olivia",
      jobs: "Your open positions",
      candidates: "Your candidate pipeline",
      interviews: "Today's interview schedule",
      analytics: "Hiring performance"
    };
    title.textContent = labels[tab.dataset.dashboardTab];
  });
});

const candidateCards = document.querySelectorAll(".candidate-card");
const kanbanColumns = document.querySelectorAll(".kanban-column");
let draggedCard = null;

candidateCards.forEach((card, index) => {
  card.setAttribute("draggable", "true");
  card.style.animationDelay = `${(index % 5) * 70}ms`;

  card.addEventListener("dragstart", () => {
    draggedCard = card;
    window.setTimeout(() => card.classList.add("dragging"), 0);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    kanbanColumns.forEach((column) => column.classList.remove("kanban-column--active"));
    draggedCard = null;
  });
});

kanbanColumns.forEach((column) => {
  column.addEventListener("dragover", (event) => {
    event.preventDefault();
    kanbanColumns.forEach((item) => item.classList.remove("kanban-column--active"));
    column.classList.add("kanban-column--active");
  });

  column.addEventListener("drop", (event) => {
    event.preventDefault();
    if (!draggedCard || column.contains(draggedCard)) return;
    const addButton = column.querySelector(".kanban-add");
    column.insertBefore(draggedCard, addButton);
    showToast("Candidate moved", `Moved to ${column.dataset.stage}`);
  });
});

const modal = document.querySelector("#demo-modal");
const modalDialog = modal.querySelector(".demo-modal__dialog");
let lastFocusedElement = null;

function openModal() {
  lastFocusedElement = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => modalDialog.querySelector("input").focus(), 100);
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll("[data-demo-button]").forEach((button) => button.addEventListener("click", openModal));
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  if (event.key !== "Tab" || !modal.classList.contains("open")) return;

  const focusable = [...modalDialog.querySelectorAll("button, input, select, a[href]")];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

let toastTimer;
function showToast(title, message) {
  const toast = document.querySelector("#toast");
  toast.querySelector("strong").textContent = title;
  toast.querySelector("small").textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

document.querySelector("#demo-form").addEventListener("submit", (event) => {
  event.preventDefault();
  closeModal();
  event.currentTarget.reset();
  showToast("Demo requested", "Our team will contact you shortly.");
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Subscription confirmed", "Hiring insights are on the way.");
});

document.querySelectorAll(".kanban-add").forEach((button) => {
  button.addEventListener("click", () => showToast("Candidate form ready", "Add candidate workflow opened."));
});

const dashboardSearch = document.querySelector(".dashboard-search input");
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    dashboardSearch.focus();
    document.querySelector("#dashboard").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
});

if (!reduceMotion) {
  const productWindows = document.querySelectorAll(".mini-dashboard, .kanban-window");
  window.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 1020) return;
    const x = (event.clientX / window.innerWidth - .5) * 2;
    const y = (event.clientY / window.innerHeight - .5) * 2;
    productWindows.forEach((windowElement, index) => {
      const strength = index === 0 ? 1.2 : .45;
      windowElement.style.setProperty("--tilt-x", `${-y * strength}deg`);
      windowElement.style.setProperty("--tilt-y", `${x * strength}deg`);
    });
  }, { passive: true });
}
