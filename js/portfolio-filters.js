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
        return { services: (card.querySelector('.project-description')?.dataset.services || '').split(' ').filter(Boolean), elements: [card.closest('.project-entry') || card, image].filter(Boolean) };
      });
      return { element, projects };
    }).filter(year => year.element.classList.contains('portfolio-year'));

  const labels = {"sound-on-set":"Sound on set","audio-postproduction":"Audio postproduction","music":"Music composition","production":"Production","sound-design":"Sound design","voiceover-postproduction":"Voiceover postproduction","mixing":"Mixing","mastering":"Mastering","video-editing":"Video editing","artwork":"Artwork","visualizer":"Music visualizers","animation":"Animation","music-video":"Music videos","marketing":"Marketing"};
  const polishLabels = {"All":"Wszystkie","sound-on-set":"Dźwięk na planie","audio-postproduction":"Postprodukcja dźwięku","music":"Komponowanie muzyki","production":"Produkcja","sound-design":"Projektowanie dźwięku","voiceover-postproduction":"Postprodukcja nagrań lektorskich","mixing":"Miks","mastering":"Mastering","video-editing":"Montaż wideo","artwork":"Oprawa graficzna","visualizer":"Wizualizacje muzyczne","animation":"Animacja","music-video":"Teledyski","marketing":"Marketing"};
  const categories = new Set(years.flatMap(year => year.projects.flatMap(project => project.services)));
  const buttons = filters.querySelector('.portfolio-filter-buttons');
  const status = filters.querySelector('.portfolio-filter-status');

  function select(category) {
    let count = 0;
    years.forEach(year => {
      let visible = 0;
      year.projects.forEach(project => {
        const show = category === 'All' || project.services.includes(category);
        project.elements.forEach(element => { element.hidden = !show; });
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

  ['All', ...Object.keys(labels).filter(category => categories.has(category)), ...[...categories].filter(category => !labels[category])].forEach(category => {
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
