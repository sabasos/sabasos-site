// Theme toggle
const root = document.documentElement;
const saved = localStorage.getItem('sabas-theme');
if (saved) root.setAttribute('data-theme', saved);

document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('sabas-theme', next);
  });
});

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Active nav link — highlight current page
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('page-active');
  }
});

// Active nav link tracking (in-page sections)
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');
if (sections.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => sectionObserver.observe(s));
}

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Bench bar animation
const benchObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.bench-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
    benchObserver.unobserve(e.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.bench-wrap').forEach(el => benchObserver.observe(el));

// Hero flash card carousel
const cards = document.querySelectorAll('.hero-card');
const dots  = document.querySelectorAll('.flash-dot');
let current = 0, timer, swapTimer;

// Sequential crossfade: the outgoing card must finish fading out before the
// incoming one starts fading in, otherwise both are semi-transparent at once
// and their text visibly overlaps (matches --hero-card-fade-ms in style.css).
const FADE_MS = 260;

function showCard(idx) {
  if (idx === current) return;
  clearTimeout(swapTimer);
  const outgoing = cards[current];
  outgoing.classList.remove('active');
  dots[current].classList.remove('active');
  dots[idx].classList.add('active');
  swapTimer = setTimeout(() => {
    current = idx;
    cards[current].classList.add('active');
  }, FADE_MS);
}

function next() { showCard((current + 1) % cards.length); }

if (cards.length) {
  timer = setInterval(next, 2500);
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    clearInterval(timer);
    showCard(i);
    timer = setInterval(next, 2500);
  }));
}
