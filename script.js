/*
 * CONTENT CONFIG
 * Drop real photos into assets/photography/<category>/ and list the
 * filenames below. Until real files exist, placeholder tiles are shown.
 */
const HERO_IMAGES = [
  { src: 'assets/hero/TEA07205-web.jpg', alt: 'Jotham Tay photography highlight 1' },
  { src: 'assets/hero/TEA08113-web.jpg', alt: 'Jotham Tay photography highlight 2' },
  { src: 'assets/hero/TEA08785-web.jpg', alt: 'Jotham Tay photography highlight 3' },
];

const PHOTO_GALLERIES = {
  Music: [
    { src: 'assets/photography/music/TEA00385.jpg', alt: 'Music photography 1' },
    { src: 'assets/photography/music/TEA07125.jpg', alt: 'Music photography 2' },
    { src: 'assets/photography/music/TEA08272.jpg', alt: 'Music photography 3' },
    { src: 'assets/photography/music/TEA09257.jpg', alt: 'Music photography 4' },
  ],
  Nightlife: [
    { src: 'assets/photography/nightlife/TEA08582.jpg', alt: 'Nightlife photography 1' },
    { src: 'assets/photography/nightlife/TEA08820.jpg', alt: 'Nightlife photography 2' },
    { src: 'assets/photography/nightlife/TEA08938.jpg', alt: 'Nightlife photography 3' },
  ],
  Events: [
    { src: 'assets/photography/events/TEA00572.jpg', alt: 'Events photography 1' },
    { src: 'assets/photography/events/TEA01723.jpg', alt: 'Events photography 2' },
    { src: 'assets/photography/events/TEA02120.jpg', alt: 'Events photography 3' },
  ],
  Portraits: [
    { src: 'assets/photography/portraits/TEA00111.jpg', alt: 'Portrait photography 1' },
    { src: 'assets/photography/portraits/TEA07316.jpg', alt: 'Portrait photography 2' },
    { src: 'assets/photography/portraits/TEA09617.jpg', alt: 'Portrait photography 3' },
  ],
};

// Add real YouTube video IDs here, e.g. { id: 'dQw4w9WgXcQ', title: 'Track Name' }
const VIDEOS = [
  { id: '3_mW13aBfjk', title: 'Regina — Track 1' },
  { id: 'HIAi5KAu6PQ', title: 'Regina — Track 2' },
  { id: 'ymH0EX30CpI', title: 'Regina — Track 3' },
  { id: 'WZ4U-43Kv_Q', title: 'Regina — Track 4' },
];

function placeholderTile(label) {
  const div = document.createElement('div');
  div.className = 'slide-placeholder';
  div.textContent = label;
  return div;
}

function buildSlide(item, fallbackLabel) {
  const slide = document.createElement('div');
  slide.className = 'slide';

  if (item.src) {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt || fallbackLabel;
    img.loading = 'lazy';
    img.onerror = () => {
      img.remove();
      slide.appendChild(placeholderTile(fallbackLabel));
    };
    slide.appendChild(img);
  } else {
    slide.appendChild(placeholderTile(fallbackLabel));
  }

  return slide;
}

function buildArrow(direction, onClick) {
  const btn = document.createElement('button');
  btn.className = `carousel-arrow ${direction}`;
  btn.setAttribute('aria-label', direction === 'prev' ? 'Previous slide' : 'Next slide');
  const path = direction === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7';
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
  btn.addEventListener('click', onClick);
  return btn;
}

function initCarousel(root, items, labelPrefix, interval) {
  const track = root.querySelector('.carousel-track');
  const dotsWrap = root.querySelector('.carousel-dots');
  let index = 0;

  items.forEach((item, i) => {
    track.appendChild(buildSlide(item, `${labelPrefix} ${i + 1}`));

    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.dot');

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + items.length) % items.length;
    render();
    restartTimer();
  }

  let timer;
  function restartTimer() {
    if (!interval || items.length < 2) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), interval);
  }

  if (items.length > 1) {
    root.appendChild(buildArrow('prev', () => goTo(index - 1)));
    root.appendChild(buildArrow('next', () => goTo(index + 1)));
  }

  render();
  restartTimer();
}

function buildGalleries() {
  document.querySelectorAll('[data-gallery]').forEach((group) => {
    const name = group.dataset.gallery;
    const items = PHOTO_GALLERIES[name] || [];

    const title = document.createElement('h3');
    title.className = 'gallery-title';
    title.textContent = name;
    group.appendChild(title);

    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    carousel.innerHTML = '<div class="carousel-track"></div><div class="carousel-dots"></div>';
    group.appendChild(carousel);

    initCarousel(carousel, items, name, 4500);
  });
}

function buildHero() {
  const el = document.querySelector('.hero-carousel');
  initCarousel(el, HERO_IMAGES, 'Photo', Number(el.dataset.interval) || 5000);
}

function buildThumb(slide, video) {
  const btn = document.createElement('button');
  btn.className = 'video-thumb';
  btn.innerHTML = `
    <span class="play-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
    </span>
    <span class="video-thumb-title">${video.title}</span>
  `;
  btn.addEventListener('click', () => {
    if (!video.id) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1`;
    iframe.title = video.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    slide.replaceChildren(iframe);
  });
  return btn;
}

function buildVideoCarousel() {
  const root = document.querySelector('[data-video-carousel]');
  const track = root.querySelector('.video-track');
  const dotsWrap = root.querySelector('.carousel-dots');
  let index = 0;

  VIDEOS.forEach((video, i) => {
    const slide = document.createElement('div');
    slide.className = 'video-slide';
    slide.appendChild(buildThumb(slide, video));
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Go to video ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.dot');
  const slides = track.querySelectorAll('.video-slide');

  function stopPlayback() {
    slides.forEach((slide, i) => {
      if (slide.querySelector('iframe')) {
        slide.replaceChildren(buildThumb(slide, VIDEOS[i]));
      }
    });
  }

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    stopPlayback();
    index = (i + VIDEOS.length) % VIDEOS.length;
    render();
  }

  if (VIDEOS.length > 1) {
    root.appendChild(buildArrow('prev', () => goTo(index - 1)));
    root.appendChild(buildArrow('next', () => goTo(index + 1)));
  }

  render();
}

function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

function initScrollEffects() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

document.getElementById('year').textContent = new Date().getFullYear();

buildHero();
buildGalleries();
buildVideoCarousel();
initNav();
initScrollEffects();
