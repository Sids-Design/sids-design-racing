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
const projects = document.querySelectorAll('.portfolio-item[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  projects.forEach(project => { project.hidden = selected !== 'all' && project.dataset.category !== selected; });
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


// V2.6: unabhängige, per Touch und Tastatur steuerbare Projektgalerien
for (const gallery of document.querySelectorAll('[data-gallery]')) {
  const stage = gallery.querySelector('.gallery-stage');
  const track = gallery.querySelector('.gallery-track');
  const slides = [...gallery.querySelectorAll('.gallery-slide')];
  const count = gallery.querySelector('.gallery-count');
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
  }
  gallery.querySelector('[data-prev]')?.addEventListener('click', () => show(current - 1));
  gallery.querySelector('[data-next]')?.addEventListener('click', () => show(current + 1));
  stage.addEventListener('keydown', e => { if (['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); show(current + (e.key === 'ArrowRight' ? 1 : -1)); } });
  let startX = null, startY = null;
  stage.addEventListener('touchstart', e => { if (e.touches.length === 1) { startX = e.touches[0].clientX; startY = e.touches[0].clientY; } }, {passive:true});
  stage.addEventListener('touchend', e => {
    if (startX === null || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  }, {passive:true});
  show(0);
}

// V3.0: Teams als auswählbare Fahrzeugkacheln
document.querySelectorAll('.vehicle-button').forEach(button => {
  button.addEventListener('click', () => {
    const panel = button.closest('.portfolio-item').querySelector('.vehicle-panel');
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
    if (!expanded && button.closest('.rock-project')) {
      button.closest('.rock-project').querySelectorAll('.vehicle-button').forEach(other => {
        if (other !== button) { other.setAttribute('aria-expanded', 'false'); other.closest('.vehicle-select').nextElementSibling.hidden = true; }
      });
    }
  });
});

// V3.1: Zuerst das originale Teamlogo, danach Fahrzeugauswahl.
document.querySelectorAll('.team-open').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.portfolio-item');
    const selection = card.querySelector('.rock-vehicles') || card.querySelector('.vehicle-select');
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    selection.hidden = expanded;
    if (expanded) {
      card.querySelectorAll('.vehicle-button').forEach(vehicleButton => vehicleButton.setAttribute('aria-expanded', 'false'));
      card.querySelectorAll('.vehicle-panel').forEach(panel => { panel.hidden = true; });
    }
  });
});
