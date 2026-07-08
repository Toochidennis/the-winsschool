import { setupAdminLayout } from './admin-layout.js';
import { getAdminNews } from './news-service.js';

async function init() {
  await setupAdminLayout();

  const totalNode = document.getElementById('admin-total-news');
  const publishedNode = document.getElementById('admin-published-news');
  const draftNode = document.getElementById('admin-draft-news');

  const all = await getAdminNews();
  const published = all.filter((item) => (item.status || '').toLowerCase() === 'published').length;
  const drafts = all.length - published;

  if (totalNode) totalNode.textContent = String(all.length);
  if (publishedNode) publishedNode.textContent = String(published);
  if (draftNode) draftNode.textContent = String(drafts);
}

init();
