(() => {
  const navbar = document.querySelector('.navbar');
  const updateHeight = () => document.documentElement.style.setProperty('--nav-height', `${navbar.getBoundingClientRect().height}px`);
  new ResizeObserver(updateHeight).observe(navbar);
  updateHeight();

  navbar.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    event.stopPropagation(); // Avoid a second scroll from the Webflow document handler.
    const menu = navbar.querySelector('.w-nav-button');
    if (menu?.classList.contains('w--open')) menu.click();
    const top = target.id === 'top' ? 0 : window.scrollY + target.getBoundingClientRect().top - navbar.getBoundingClientRect().height;
    const hash = link.getAttribute('href');
    if (location.hash !== hash) history.pushState(null, '', hash);
    window.scrollTo({ top: Math.max(0, top), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
})();

// Track the section at the reading position independently of Webflow's hash state.
(() => {
  const navbar = document.querySelector('.navbar');
  const links = [...navbar.querySelectorAll('.w-nav-link')];
  const portfolio = document.querySelector('#portfolio');
  const contact = document.querySelector('#contact');
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const line = navbar.getBoundingClientRect().height + 2;
    const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const active = contact.getBoundingClientRect().top <= Math.max(line, window.innerHeight * 0.65) || atBottom ? '#contact' : portfolio.getBoundingClientRect().top <= line ? '#portfolio' : '#top';
    links.forEach(link => {
      const selected = link.getAttribute('href') === active;
      link.classList.toggle('is-section-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  new ResizeObserver(schedule).observe(document.querySelector('#projects'));
  update();
})();

// Keep the selected section when switching languages.
document.querySelector('.language-switch')?.addEventListener('click', function () {
  const section = location.hash || document.querySelector('.w-nav-link.is-section-active')?.getAttribute('href');
  this.href = this.getAttribute('href').split('#')[0] + (section || '');
});
