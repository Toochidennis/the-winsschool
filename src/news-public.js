import { getAdminNews, getNewsBySlug, getPublicNews } from './news-service.js';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cardMarkup(post) {
  return `<article class="news-card reveal is-visible">
    <img class="news-card-image" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy" />
    <span class="news-pill">${escapeHtml(post.category)}</span>
    <h3>${escapeHtml(post.title)}</h3>
    <p>${escapeHtml(post.summary)}</p>
    <a href="news_detail?slug=${encodeURIComponent(post.slug)}">Read More <span aria-hidden="true">→</span></a>
  </article>`;
}

async function renderHomeNews() {
  const target = document.getElementById('home-news-grid');
  if (!target) return;

  const posts = (await getPublicNews()).slice(0, 3);
  if (!posts.length) {
    target.innerHTML = '<p class="center-note">No published news yet.</p>';
    return;
  }

  target.innerHTML = posts.map(cardMarkup).join('');
}

async function renderNewsListing() {
  const target = document.getElementById('news-list-grid');
  if (!target) return;

  const posts = await getPublicNews();
  const perPage = 6;
  const totalPages = Math.ceil(posts.length / perPage) || 1;

  function getPageFromHash() {
    const match = window.location.hash.match(/page=(\d+)/);
    const num = match ? parseInt(match[1], 10) : 1;
    return num >= 1 && num <= totalPages ? num : 1;
  }

  let currentPage = getPageFromHash();

  async function renderPage(page) {
    currentPage = Math.max(1, Math.min(page, totalPages));
    const start = (currentPage - 1) * perPage;
    const pagePosts = posts.slice(start, start + perPage);

    if (!pagePosts.length) {
      target.innerHTML = '<p class="center-note">No published news available right now.</p>';
      const container = document.getElementById('news-pagination');
      if (container) container.innerHTML = '';
      return;
    }

    target.innerHTML = pagePosts.map(cardMarkup).join('');
    window.location.hash = `page=${currentPage}`;
    renderPaginationControls();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderPaginationControls() {
    const container = document.getElementById('news-pagination');
    if (!container || totalPages <= 1) {
      if (container) container.innerHTML = '';
      return;
    }

    let html = '<nav class="pagination" aria-label="News pagination">';
    html += `<button class="pagination-btn pagination-prev" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">← Prev</button>`;
    html += '<span class="pagination-pages">';
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pagination-num${i === currentPage ? ' is-active' : ''}" data-page="${i}" aria-label="Page ${i}" aria-current="${i === currentPage ? 'page' : 'false'}">${i}</button>`;
    }
    html += '</span>';
    html += `<button class="pagination-btn pagination-next" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">Next →</button>`;
    html += '</nav>';

    container.innerHTML = html;

    container.querySelectorAll('.pagination-btn, .pagination-num').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page, 10);
        if (p >= 1 && p <= totalPages) renderPage(p);
      });
    });
  }

  renderPage(currentPage);
}

function detailMarkup(post) {
  const paragraphs = String(post.content || '')
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p>${escapeHtml(part)}</p>`)
    .join('');

  return `<article class="news-article">
    <header class="news-article-hero">
      <a class="news-back-link" href="news">← Back to News</a>
      <span class="news-pill">${escapeHtml(post.category)}</span>
      <h1>${escapeHtml(post.title)}</h1>
      <p>${escapeHtml(post.summary)}</p>
    </header>

    <figure class="news-article-figure">
      <img class="news-detail-image" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="eager" />
    </figure>

    <div class="news-article-layout">
      <div class="news-article-body">
        ${paragraphs || `<p>${escapeHtml(post.content)}</p>`}
      </div>
      <aside class="news-article-side">
        <h2>Need more information?</h2>
        <p>Contact the school office for admissions, visits, and general enquiries.</p>
        <a class="btn btn-secondary" href="contactus">Contact Us</a>
        <a class="btn btn-outline" href="enroll_now">Admissions</a>
      </aside>
    </div>
  </article>`;
}

async function renderRelated(slug) {
  const target = document.getElementById('related-news-grid');
  if (!target) return;

  const items = (await getPublicNews()).filter((item) => item.slug !== slug).slice(0, 3);
  if (!items.length) {
    target.innerHTML = '<p class="center-note">No related news available.</p>';
    return;
  }

  target.innerHTML = items.map(cardMarkup).join('');
}

function updateMeta(post) {
  document.title = `${post.title} | The Wins School`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', post.summary);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (ogTitle) ogTitle.setAttribute('content', `${post.title} | The Wins School`);
  if (ogDescription) ogDescription.setAttribute('content', post.summary);
  if (twitterTitle) twitterTitle.setAttribute('content', `${post.title} | The Wins School`);
  if (twitterDescription) twitterDescription.setAttribute('content', post.summary);
}

async function renderNewsDetail() {
  const target = document.getElementById('news-detail-content');
  if (!target) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug') || '';

  let post = await getNewsBySlug(slug);

  if (!post && params.get('preview') === '1') {
    const adminPosts = await getAdminNews();
    post = adminPosts.find((item) => item.slug === slug) || null;
  }

  if (!post) {
    target.innerHTML = '<article class="news-detail-card"><h1>News not found</h1><p class="lead">The requested news item is unavailable.</p><a class="btn btn-secondary" href="news">Back to News</a></article>';
    return;
  }

  updateMeta(post);
  target.innerHTML = detailMarkup(post);
  renderRelated(post.slug);
}

renderHomeNews();
renderNewsListing();
renderNewsDetail();
