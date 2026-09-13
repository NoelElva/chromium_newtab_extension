/* ---------- storage helper (falls back to memory if unavailable) ---------- */
const memoryStore = {};
const store = {
  get(key, fallback){
    try{
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    }catch(e){ return memoryStore[key] ?? fallback; }
  },
  set(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }
    catch(e){ memoryStore[key] = value; }
  }
};

/* ---------- clock ---------- */
function updateClock(){
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) + '  ' +
    now.toLocaleDateString([], {weekday:'short', month:'short', day:'numeric'});
}
updateClock();
setInterval(updateClock, 15000);

/* ---------- theme ---------- */
const themeBtn = document.getElementById('theme-toggle');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? 'Light theme' : 'Dark theme';
}
applyTheme(store.get('theme', 'dark'));
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  store.set('theme', next);
  applyTheme(next);
});

/* ---------- search engines ---------- */
const ENGINES = [
  { id:'google', name:'Google', url:'https://www.google.com/search?q=' },
  { id:'bing', name:'Bing', url:'https://www.bing.com/search?q=' },
  { id:'ddg', name:'DuckDuckGo', url:'https://duckduckgo.com/?q=' },
  { id:'brave', name:'Brave', url:'https://search.brave.com/search?q=' },
  { id:'wiki', name:'Wikipedia', url:'https://en.wikipedia.org/w/index.php?search=' },
  { id:'yt', name:'YouTube', url:'https://www.youtube.com/results?search_query=' }
];
let activeEngine = store.get('engine', 'google');

function renderEngines(){
  const el = document.getElementById('engines');
  el.innerHTML = '';
  ENGINES.forEach(eng => {
    const b = document.createElement('button');
    b.className = 'engine-tab' + (eng.id === activeEngine ? ' active' : '');
    b.textContent = eng.name;
    b.type = 'button';
    b.addEventListener('click', () => {
      activeEngine = eng.id;
      store.set('engine', eng.id);
      renderEngines();
      document.getElementById('search-input').focus();
    });
    el.appendChild(b);
  });
}
renderEngines();

document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('search-input');
  const q = input.value.trim();
  if(!q) return;

  const looksLikeUrl = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(:\d+)?([\/?#].*)?$/i.test(q) && !q.includes(' ');
  if(looksLikeUrl){
    window.location.href = q.startsWith('http') ? q : 'https://' + q;
    return;
  }
  const engine = ENGINES.find(e => e.id === activeEngine) || ENGINES[0];
  window.location.href = engine.url + encodeURIComponent(q);
});

/* ---------- shortcuts ---------- */
const ICON_COLORS = ['#3daee9', '#27ae60', '#e08a2e', '#c0392b', '#8e44ad', '#16a085'];
const DEFAULT_SHORTCUTS = [
  { name:'Gmail', url:'https://mail.google.com' },
  { name:'YouTube', url:'https://youtube.com' },
  { name:'GitHub', url:'https://github.com' },
  { name:'Calendar', url:'https://calendar.google.com' },
  { name:'Drive', url:'https://drive.google.com' },
  { name:'Amazon', url:'https://amazon.com' },
  { name:'Maps', url:'https://maps.google.com' }
];
let shortcuts = store.get('shortcuts', DEFAULT_SHORTCUTS);

function colorFor(idx){ return ICON_COLORS[idx % ICON_COLORS.length]; }
const GLOBE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9s1.3-6.5 3.8-9z"/></svg>';

function renderShortcuts(){
  const grid = document.getElementById('shortcut-grid');
  grid.innerHTML = '';
  shortcuts.forEach((s, idx) => {
    const a = document.createElement('a');
    a.className = 'shortcut';
    a.href = s.url;
    a.innerHTML = `
      <button class="remove" type="button" aria-label="Remove ${s.name}">&times;</button>
      <div class="fav" style="background:${colorFor(idx)}">${GLOBE_SVG}</div>
      <div class="label">${s.name}</div>
    `;
    a.querySelector('.remove').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      shortcuts.splice(idx, 1);
      store.set('shortcuts', shortcuts);
      renderShortcuts();
    });
    grid.appendChild(a);
  });

  const addTile = document.createElement('button');
  addTile.type = 'button';
  addTile.className = 'shortcut add';
  addTile.innerHTML = `<div class="fav">+</div><div class="label">Add</div>`;
  addTile.addEventListener('click', () => {
    const name = prompt('Site name (e.g. Notion)');
    if(!name) return;
    let url = prompt('URL (e.g. https://notion.so)');
    if(!url) return;
    if(!/^https?:\/\//i.test(url)) url = 'https://' + url;
    shortcuts.push({ name, url });
    store.set('shortcuts', shortcuts);
    renderShortcuts();
  });
  grid.appendChild(addTile);
}
renderShortcuts();

/* ---------- news ---------- */
/*
  News is fetched directly from NewsAPI. This works from inside the
  extension (unlike a normal webpage) because manifest.json declares
  host_permissions for newsapi.org, which exempts the extension from
  CORS for that domain. The key itself lives in config.js, loaded
  before this file - edit that file to set your key.
*/

const TOPICS = ['Top', 'Tech', 'Business', 'Sports'];
let activeTopic = store.get('newsTopic', 'Top');

const SAMPLE_NEWS = {
  Top: [
    { title:'Sample headline: markets steady ahead of key data release', source:'Wire service' },
    { title:'Sample headline: city council approves new transit line', source:'Local desk' }
  ],
  Tech: [
    { title:'Sample headline: new chip promises faster on-device AI', source:'Tech desk' },
    { title:'Sample headline: browser makers align on a privacy standard', source:'Tech desk' }
  ],
  Business: [
    { title:'Sample headline: retailer reports stronger quarterly sales', source:'Markets' },
    { title:'Sample headline: startup raises funding for logistics platform', source:'Markets' }
  ],
  Sports: [
    { title:'Sample headline: home side wins in final minutes', source:'Sports desk' },
    { title:'Sample headline: league announces revised season schedule', source:'Sports desk' }
  ]
};

function renderTopics(){
  const el = document.getElementById('news-topics');
  el.innerHTML = '';
  TOPICS.forEach(t => {
    const b = document.createElement('button');
    b.className = 'topic-pill' + (t === activeTopic ? ' active' : '');
    b.textContent = t;
    b.type = 'button';
    b.addEventListener('click', () => {
      activeTopic = t;
      store.set('newsTopic', t);
      renderTopics();
      loadNews();
    });
    el.appendChild(b);
  });
}

async function loadNews(){
  const list = document.getElementById('news-list');
  list.innerHTML = '<div class="news-empty">Loading&hellip;</div>';

  if(typeof NEWS_API_KEY === 'string' && NEWS_API_KEY && NEWS_API_KEY !== 'PUT-YOUR-NEWSAPI-KEY-HERE'){
    try{
      const CATEGORY_MAP = { top:'general', tech:'technology', business:'business', sports:'sports' };
      const category = CATEGORY_MAP[activeTopic.toLowerCase()] || 'general';
      const url = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(category)}&language=en&pageSize=6&apiKey=${NEWS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if(data.articles && data.articles.length){
        list.innerHTML = '';
        data.articles.forEach(a => {
          const item = document.createElement('div');
          item.className = 'news-item';
          item.innerHTML = `<a href="${a.url}" target="_blank" rel="noopener">${a.title}</a><div class="news-meta">${a.source?.name || ''}</div>`;
          list.appendChild(item);
        });
        return;
      }
    }catch(e){ /* request failed - fall through to sample data */ }
  }

  const items = SAMPLE_NEWS[activeTopic] || [];
  list.innerHTML = '';
  items.forEach(a => {
    const item = document.createElement('div');
    item.className = 'news-item';
    item.innerHTML = `<a href="#">${a.title}</a><div class="news-meta">${a.source}</div>`;
    list.appendChild(item);
  });
  const note = document.createElement('div');
  note.className = 'news-empty';
  note.style.marginTop = '10px';
  note.innerHTML = 'Showing sample headlines. Add your key in <code>config.js</code> to go live.';
  list.appendChild(note);
}

renderTopics();
loadNews();
