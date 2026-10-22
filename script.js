// Sids Design Garage V2.5 – mobile navigation, filters, footer and copy button
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (toggle && navigation) {
  toggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
  }));
}
const filters = document.querySelectorAll('.filter[data-filter]');
const cards = document.querySelectorAll('.project-card[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => { card.hidden = selected !== 'all' && card.dataset.category !== selected; });
}));
const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
const copyButton = document.querySelector('#copy-address');
if (copyButton) copyButton.addEventListener('click', async () => {
  const previous = copyButton.textContent;
  try {
    await navigator.clipboard.writeText(window.location.href);
    copyButton.textContent = 'ADRESSE KOPIERT ✓';
  } catch {
    copyButton.textContent = 'KOPIEREN NICHT MÖGLICH';
  }
  setTimeout(() => { copyButton.textContent = previous; }, 2200);
});


// V2.5 – Galerie: Pfeile, Punkte, Tastatur und Touch-Swipe
(() => {
  const gallery = document.querySelector('#bmw-gallery');
  if (!gallery) return;
  const track = gallery.querySelector('.gallery-track');
  const dots = [...document.querySelectorAll('.gallery-dot')];
  const count = document.querySelector('#gallery-current');
  const slides = [...gallery.querySelectorAll('.gallery-slide')];
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    count.textContent = String(current + 1).padStart(2, '0');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
  }
  document.querySelector('#gallery-prev')?.addEventListener('click', () => show(current - 1));
  document.querySelector('#gallery-next')?.addEventListener('click', () => show(current + 1));
  dots.forEach(dot => dot.addEventListener('click', () => show(Number(dot.dataset.slide))));
  gallery.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault(); show(current + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let startX = null, startY = null;
  gallery.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
  }, {passive:true});
  gallery.addEventListener('touchend', e => {
    if (startX === null || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) show(current + (dx < 0 ? 1 : -1));
    startX = null; startY = null;
  }, {passive:true});
  show(0);
})();
