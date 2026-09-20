(() => {
  const polish = document.documentElement.lang === 'pl';
  const portfolio = document.querySelector('#projects');
  const filters = document.querySelector('.portfolio-filters');
  if (!portfolio || !filters) return;

  const years = [...portfolio.querySelectorAll(':scope > .year-container')]
    .map(element => {
      const projects = [...element.querySelectorAll('.nag-wek')].map(label => {
        const card = label.closest('.div-block');
        const next = card.nextElementSibling;
        const image = next?.matches('.div-block') && !next.querySelector('.nag-wek') && next.querySelector('img, iframe') ? next : null;
        const entry = card.closest('.project-entry') || card;
        const separator = document.createElement('div');
        separator.className = 'project-separator';
        separator.setAttribute('aria-hidden', 'true');
        separator.textContent = '♦';
        entry.before(separator);
        return { category: label.dataset.category || label.textContent.trim(), elements: [entry, image].filter(Boolean), separator };
      });
      return { element, projects };
    }).filter(year => year.element.classList.contains('portfolio-year'));

  const labels = { Movie: 'Movies', Music: 'Music', Podcast: 'Podcast', Video: 'Video', Animation: 'Animation', 'Music Video': 'Music Video' };
  const polishLabels = { All: 'Wszystkie', Movie: 'Filmy', Music: 'Muzyka', Podcast: 'Podcasty', Video: 'Wideo', Animation: 'Animacja', 'Music Video': 'Teledyski' };
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
        project.separator.hidden = !show || visible === 0;
        if (show) visible++;
      });
      year.element.hidden = visible === 0 && !(category === 'All' && year.projects.length === 0);
      count += visible;
    });
    buttons.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.category === category));
    });
    const noun = polish ? (count === 1 ? 'projekt' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'projekty' : 'projektów') : (count === 1 ? 'project' : 'projects');
    status.textContent = `${count} ${noun}`;
  }

  ['All', ...[...categories].sort((a, b) => ((polish ? polishLabels[a] : labels[a]) || a).localeCompare((polish ? polishLabels[b] : labels[b]) || b, polish ? 'pl' : 'en'))].forEach(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portfolio-filter';
    button.dataset.category = category;
    button.textContent = (polish ? polishLabels[category] : labels[category]) || category;
    button.setAttribute('aria-controls', 'projects');
    button.addEventListener('click', () => select(category));
    buttons.append(button);
  });
  filters.hidden = false;
  select('All');
})();
