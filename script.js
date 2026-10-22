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
