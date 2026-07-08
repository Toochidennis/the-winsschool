
const header = document.querySelector('[data-site-header]');
const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');

function syncHeader() {
  header?.classList.toggle('has-scrolled', window.scrollY > 8);
}
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

if (navToggle && navPanel) {
  navToggle.addEventListener('click', () => {
    const isOpen = navPanel.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  });

  navPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navPanel.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });
}

document.querySelectorAll('.portal-toggle').forEach((button) => {
  button.addEventListener('click', (event) => {
    if (window.matchMedia('(max-width: 860px)').matches) {
      event.preventDefault();
      const parent = button.closest('.portal-menu');
      parent?.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(parent?.classList.contains('is-open')));
    }
  });
});

document.querySelectorAll('.reveal-password').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const input = targetId ? document.getElementById(targetId) : null;
    if (!input) return;
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    button.textContent = showing ? 'Show' : 'Hide';
    button.setAttribute('aria-pressed', String(!showing));
  });
});

const slides = [...document.querySelectorAll('.hero-slide')];
let currentSlide = 0;
let slideTimer;

function showSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
}
function startSlides() {
  clearInterval(slideTimer);
  if (slides.length > 1) slideTimer = setInterval(() => showSlide(currentSlide + 1), 7000);
}
showSlide(0);
startSlides();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
