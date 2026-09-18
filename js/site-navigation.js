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
