const repoList = document.querySelector('#repo-list');
const repoCount = document.querySelector('#repo-count');
const status = document.querySelector('#status');

function renderRepository(repository, index) {
  const item = document.createElement('li');
  item.className = 'repo-item';
  item.style.animationDelay = `${index * 70}ms`;

  const number = document.createElement('span');
  number.className = 'repo-number';
  number.textContent = String(index + 1).padStart(2, '0');

  const content = document.createElement('div');
  content.className = 'repo-content';

  const link = document.createElement('a');
  link.className = 'repo-link';
  link.href = repository.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = repository.name;

  const owner = document.createElement('span');
  owner.className = 'repo-owner';
  owner.textContent = ` / ${repository.owner}`;
  link.append(owner);

  const description = document.createElement('p');
  description.className = 'repo-description';
  description.textContent = repository.description;

  const meta = document.createElement('div');
  meta.className = 'repo-meta';

  if (repository.language) {
    const language = document.createElement('span');
    language.className = 'repo-language';
    language.textContent = repository.language;
    meta.append(language);
  }

  if (repository.starredAt) {
    const date = document.createElement('time');
    date.dateTime = repository.starredAt;
    date.textContent = `Starred ${new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(`${repository.starredAt}T00:00:00`))}`;
    meta.append(date);
  }

  content.append(link, description, meta);

  const star = document.createElement('span');
  star.className = 'repo-star';
  star.setAttribute('aria-hidden', 'true');
  star.textContent = '★';

  item.append(number, content, star);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch('./events.json');
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error('Repository data must be a JSON array');
    }

    repoList.replaceChildren(...repositories.map(renderRepository));
    repoCount.textContent = `${repositories.length} ${repositories.length === 1 ? 'repository' : 'repositories'}`;
    status.textContent = repositories.length ? '' : 'No starred repositories yet.';
  } catch (error) {
    console.error('Could not load starred repositories:', error);
    status.textContent = 'Could not load starred repositories. Please try again later.';
  }
}

loadRepositories();
