const menuButton = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const scrim = document.querySelector('.scrim');

function setMenu(open) {
  sidebar.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭目录' : '打开目录');
  scrim.hidden = !open;
  if (open) document.querySelector('#search-input').focus();
}

menuButton.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
scrim.addEventListener('click', () => { setMenu(false); menuButton.focus(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && sidebar.classList.contains('open')) {
    setMenu(false);
    menuButton.focus();
  }
});

const headings = [...document.querySelectorAll('.prose h2, .prose h3')];
const outline = document.querySelector('#outline');
const outlineLinks = new Map();
headings.forEach((heading, index) => {
  if (!heading.id) heading.id = `section-${index + 1}`;
  const link = document.createElement('a');
  link.href = `#${encodeURIComponent(heading.id)}`;
  link.textContent = heading.textContent;
  if (heading.tagName === 'H3') link.classList.add('nested');
  outline.append(link);
  outlineLinks.set(heading, link);
});
if (headings.length === 0) document.querySelector('.page-outline').hidden = true;
if (headings.length > 0 && 'IntersectionObserver' in window) {
  const visibleHeadings = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleHeadings.add(entry.target);
      else visibleHeadings.delete(entry.target);
    });
    const active = headings.find(heading => visibleHeadings.has(heading));
    if (active) outlineLinks.forEach((link, heading) => link.classList.toggle('active', heading === active));
  }, { rootMargin: '-100px 0px -45% 0px' });
  headings.forEach(heading => observer.observe(heading));
}

const searchInput = document.querySelector('#search-input');
const results = document.querySelector('#search-results');
const resultList = results.querySelector('ul');
const searchStatus = results.querySelector('.search-status');
let searchIndex;
let searchRequest = 0;

async function loadSearch() {
  if (!searchIndex) {
    searchIndex = fetch(document.body.dataset.searchUrl).then(response => {
      if (!response.ok) throw new Error('Search unavailable');
      return response.json();
    }).catch(error => {
      searchIndex = undefined;
      throw error;
    });
  }
  return searchIndex;
}

searchInput.addEventListener('input', async () => {
  const request = ++searchRequest;
  const query = searchInput.value.trim().toLocaleLowerCase();
  resultList.replaceChildren();
  results.hidden = !query;
  if (!query) return;
  searchStatus.textContent = '正在搜索…';
  try {
    const pages = await loadSearch();
    if (request !== searchRequest) return;
    const terms = query.split(/\s+/);
    const matches = pages.filter(page => terms.every(term => `${page.title} ${page.content}`.toLocaleLowerCase().includes(term)));
    matches.sort((first, second) => Number(second.title.toLocaleLowerCase().includes(query)) - Number(first.title.toLocaleLowerCase().includes(query)));
    searchStatus.textContent = matches.length ? `找到 ${matches.length} 个章节` : '没有找到相关内容，试试其他关键词。';
    matches.forEach(page => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      const snippet = document.createElement('small');
      const position = page.content.toLocaleLowerCase().indexOf(terms[0]);
      const start = Math.max(0, position - 18);
      snippet.textContent = `${start ? '…' : ''}${page.content.slice(start, start + 70)}…`;
      link.href = page.url;
      link.append(document.createTextNode(page.title), snippet);
      item.append(link);
      resultList.append(item);
    });
  } catch {
    if (request === searchRequest) searchStatus.textContent = '搜索暂时不可用，请使用下方章节目录。';
  }
});

document.addEventListener('keydown', event => {
  const editing = event.target instanceof HTMLElement && (event.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName));
  if (event.key === '/' && !editing && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    if (window.matchMedia('(max-width: 760px)').matches) setMenu(true);
    searchInput.focus();
  }
});
