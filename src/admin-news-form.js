import { setupAdminLayout } from './admin-layout.js';
import { NEWS_CATEGORIES, NEWS_IMAGE_OPTIONS } from './news-data.js';
import { createNews, getAdminNewsById, updateNews } from './news-service.js';

async function init() {
  await setupAdminLayout();

  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');

  const titleInput = document.getElementById('news-title');
  const slugInput = document.getElementById('news-slug');
  const categoryInput = document.getElementById('news-category');
  const imageInput = document.getElementById('news-image');
  const summaryInput = document.getElementById('news-summary');
  const contentInput = document.getElementById('news-content');
  const statusInput = document.getElementById('news-status');
  const form = document.getElementById('news-form');
  const pageTitle = document.getElementById('news-form-title');
  let alertArea = null;

  function toSlug(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function fillSelect(select, options) {
    if (!select) return;
    select.innerHTML = options.map((option) => `<option value="${option.value}">${option.label}</option>`).join('');
  }

  function applyPost(post) {
    if (!post) return;
    if (titleInput) titleInput.value = post.title || '';
    if (slugInput) slugInput.value = post.slug || '';
    if (categoryInput) categoryInput.value = post.category || NEWS_CATEGORIES[0];
    if (imageInput) imageInput.value = post.image || NEWS_IMAGE_OPTIONS[0].value;
    if (summaryInput) summaryInput.value = post.summary || '';
    if (contentInput) contentInput.value = post.content || '';
    if (statusInput) statusInput.value = (post.status || '').toLowerCase() === 'published' ? 'Published' : 'Draft';
  }

  fillSelect(
    categoryInput,
    NEWS_CATEGORIES.map((item) => ({ value: item, label: item }))
  );
  fillSelect(imageInput, NEWS_IMAGE_OPTIONS);

  if (editId) {
    const post = await getAdminNewsById(editId);
    applyPost(post);
    if (pageTitle) pageTitle.textContent = 'Edit Post';
  }

  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      if (!slugInput.value || slugInput.dataset.autofill !== 'off') {
        slugInput.value = toSlug(titleInput.value);
        slugInput.dataset.autofill = 'on';
      }
    });

    slugInput.addEventListener('input', () => {
      slugInput.dataset.autofill = 'off';
    });
  }

  function collectPayload(status) {
    const title = titleInput?.value.trim() || '';
    const summary = summaryInput?.value.trim() || '';
    const content = contentInput?.value.trim() || '';
    const slug = toSlug(slugInput?.value || title);
    const imageOption = NEWS_IMAGE_OPTIONS.find((item) => item.value === imageInput?.value);

    return {
      title,
      slug,
      category: categoryInput?.value || 'Notice',
      image: imageInput?.value || NEWS_IMAGE_OPTIONS[0].value,
      imageLabel: imageOption?.label || 'School Image',
      summary,
      content,
      status,
      seoTitle: title,
      seoDescription: summary,
    };
  }

  function validate(payload) {
    const missing = [];
    if (!payload.title) missing.push('title');
    if (!payload.summary) missing.push('summary');
    if (!payload.content) missing.push('full content');
    if (!payload.slug) missing.push('URL slug');
    return missing;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getAlertArea() {
    if (alertArea) return alertArea;
    alertArea = document.createElement('div');
    alertArea.className = 'admin-alert-stack';
    form?.parentElement?.insertBefore(alertArea, form);
    return alertArea;
  }

  function showFormMessage(message, type = 'error') {
    const area = getAlertArea();
    area.innerHTML = `<div class="admin-alert ${type}" role="alert">
      <div>
        <strong>${type === 'success' ? 'Done' : 'Please check this'}</strong>
        <p>${escapeHtml(message)}</p>
      </div>
      <button type="button" aria-label="Dismiss message">Close</button>
    </div>`;
    area.querySelector('button')?.addEventListener('click', () => {
      area.innerHTML = '';
    });
  }

  form?.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-submit-mode]');
    if (!button) return;
    event.preventDefault();

    const mode = button.getAttribute('data-submit-mode') || 'draft';
    const apiStatus = mode === 'publish' ? 'published' : 'draft';
    const payload = collectPayload(apiStatus);
    const missing = validate(payload);
    if (missing.length) {
      showFormMessage(`Please enter ${missing.join(', ')}.`);
      return;
    }

    button.disabled = true;

    try {
      if (editId) {
        await updateNews(editId, payload);
      } else {
        await createNews(payload);
      }
      window.location.href = 'admin_news.html';
    } catch {
      showFormMessage('Failed to save. Please try again.');
      button.disabled = false;
    }
  });

  document.querySelector('[data-news-cancel]')?.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = 'admin_news.html';
  });
}

init();
