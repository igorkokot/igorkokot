(() => {
  const portfolio = document.querySelector('#projects');
  const filters = document.querySelector('.portfolio-filters');
  if (!portfolio || !filters) return;

  const years = [...portfolio.querySelectorAll(':scope > .year-container')]
    .map(element => {
      const projects = [...element.querySelectorAll('.nag-wek')].map(label => {
        const card = label.closest('.div-block');
        const next = card.nextElementSibling;
        const image = next?.matches('.div-block') && !next.querySelector('.nag-wek') && next.querySelector('img, iframe') ? next : null;
        return { category: label.textContent.trim(), elements: [card.closest('.project-entry') || card, image].filter(Boolean) };
      });
      return { element, projects };
    }).filter(year => year.element.classList.contains('portfolio-year'));

  const labels = { Movie: 'Movies', Music: 'Music', Podcast: 'Podcast', Video: 'Video', Animation: 'Animation', 'Music Video': 'Music Video' };
  const categories = new Set(years.flatMap(year => year.projects.map(project => project.category)));
  const buttons = filters.querySelector('.portfolio-filter-buttons');
  const status = filters.querySelector('.portfolio-filter-status');

  function select(category) {
    let count = 0;
    years.forEach(year => {
      let visible = 0;
      year.projects.forEach(project => {
        const show = category === 'All' || project.category === category;
        project.elements.forEach(element => { element.hidden = !show; });
        if (show) visible++;
      });
      year.element.hidden = visible === 0 && !(category === 'All' && year.projects.length === 0);
      count += visible;
    });
    buttons.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.category === category));
    });
    status.textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
  }

  ['All', ...Object.keys(labels).filter(category => categories.has(category)), ...[...categories].filter(category => !labels[category])].forEach(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portfolio-filter';
    button.dataset.category = category;
    button.textContent = labels[category] || category;
    button.setAttribute('aria-controls', 'projects');
    button.addEventListener('click', () => select(category));
    buttons.append(button);
  });
  filters.hidden = false;
  select('All');
})();
