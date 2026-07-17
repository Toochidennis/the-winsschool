import { setupAdminLayout } from './admin-layout.js';
import {
  deleteNews,
  getAdminNews,
  publishNews,
  unpublishNews
} from './news-service.js';

let allNews = [];

async function init() {
  await setupAdminLayout();
  allNews = await getAdminNews();
  renderTable();
}

const searchInput = document.getElementById('admin-news-search');
const statusFilter = document.getElementById('admin-news-status');
const tableBody = document.getElementById('admin-news-table-body');
const adminContent = document.querySelector('.admin-content');
let alertArea = null;
let confirmDialog = null;

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatUpdated(value) {
  if (!value) return 'Not saved';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not saved';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getFilteredNews() {
  const query = (searchInput?.value || '').trim().toLowerCase();
  const selectedStatus = statusFilter?.value || 'all';

  return allNews.filter((item) => {
    const matchesQuery = !query
      || item.title.toLowerCase().includes(query)
      || item.summary.toLowerCase().includes(query)
      || item.category.toLowerCase().includes(query);
    const status = (item.status || '').toLowerCase();
    const normalizedStatus = status === 'published' ? 'Published' : (status === 'draft' ? 'Draft' : status);
    const matchesStatus = selectedStatus === 'all' || normalizedStatus === selectedStatus || status === selectedStatus.toLowerCase();
    return matchesQuery && matchesStatus;
  });
}

function rowMarkup(item) {
  const status = (item.status || '').toLowerCase();
  const isPublished = status === 'published';
  const displayStatus = isPublished ? 'Published' : 'Draft';

  const toggleAction = isPublished
    ? `<button class="admin-link-button" data-action="unpublish" data-id="${item.id}">Unpublish</button>`
    : `<button class="admin-link-button" data-action="publish" data-id="${item.id}">Publish</button>`;

  return `<tr>
    <td>
      <div class="admin-post-cell">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.summary || item.slug)}</span>
      </div>
    </td>
    <td>${escapeHtml(item.category)}</td>
    <td><span class="status-pill status-${displayStatus.toLowerCase()}">${displayStatus}</span></td>
    <td>${escapeHtml(formatUpdated(item.updatedAt))}</td>
    <td>
      <div class="admin-table-actions">
        <a class="admin-link-button" href="admin_news_form.html?id=${encodeURIComponent(item.id)}">Edit</a>
        <a class="admin-link-button" href="news_detail.html?slug=${encodeURIComponent(item.slug)}&preview=1" target="_blank" rel="noreferrer">View</a>
        ${toggleAction}
        <button class="admin-link-button danger" data-action="delete" data-id="${item.id}">Delete</button>
      </div>
    </td>
  </tr>`;
}

function renderTable() {
  if (!tableBody) return;
  const rows = getFilteredNews();
  if (!rows.length) {
    tableBody.innerHTML = '<tr><td colspan="5"><div class="admin-empty-state"><strong>No posts found.</strong><span>Try another search or create a new post.</span></div></td></tr>';
    return;
  }
  tableBody.innerHTML = rows.map(rowMarkup).join('');
}

function getAlertArea() {
  if (alertArea) return alertArea;
  alertArea = document.createElement('div');
  alertArea.className = 'admin-alert-stack';
  const toolbar = document.querySelector('.admin-toolbar');
  adminContent?.insertBefore(alertArea, toolbar || adminContent.firstElementChild?.nextSibling || null);
  return alertArea;
}

function showAdminMessage(message, type = 'success') {
  const area = getAlertArea();
  area.innerHTML = `<div class="admin-alert ${type}" role="alert">
    <div>
      <strong>${type === 'error' ? 'Please check this' : 'Done'}</strong>
      <p>${escapeHtml(message)}</p>
    </div>
    <button type="button" aria-label="Dismiss message">Close</button>
  </div>`;
  area.querySelector('button')?.addEventListener('click', () => {
    area.innerHTML = '';
  });
}

function getConfirmDialog() {
  if (confirmDialog) return confirmDialog;
  confirmDialog = document.createElement('div');
  confirmDialog.className = 'admin-modal-backdrop';
  confirmDialog.hidden = true;
  confirmDialog.innerHTML = `<section class="admin-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
    <h2 id="confirm-title">Delete this post?</h2>
    <p data-confirm-message>This will permanently remove this news post.</p>
    <div class="admin-confirm-actions">
      <button class="btn btn-outline" type="button" data-confirm-cancel>Cancel</button>
      <button class="btn btn-danger" type="button" data-confirm-ok>Delete post</button>
    </div>
  </section>`;
  document.body.appendChild(confirmDialog);
  return confirmDialog;
}

function confirmDelete(title) {
  const dialog = getConfirmDialog();
  const message = dialog.querySelector('[data-confirm-message]');
  if (message) message.textContent = `This will permanently remove "${title || 'this post'}" from the news list.`;
  dialog.hidden = false;
  return new Promise((resolve) => {
    const cleanup = (result) => {
      dialog.hidden = true;
      dialog.querySelector('[data-confirm-ok]')?.removeEventListener('click', onConfirm);
      dialog.querySelector('[data-confirm-cancel]')?.removeEventListener('click', onCancel);
      resolve(result);
    };
    const onConfirm = () => cleanup(true);
    const onCancel = () => cleanup(false);
    dialog.querySelector('[data-confirm-ok]')?.addEventListener('click', onConfirm);
    dialog.querySelector('[data-confirm-cancel]')?.addEventListener('click', onCancel);
  });
}

async function handleTableAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.getAttribute('data-action');
  const id = button.getAttribute('data-id');
  if (!id) return;

  button.disabled = true;

  try {
    const post = allNews.find((item) => item.id === id);
    if (action === 'publish') {
      await publishNews(id);
      showAdminMessage(`"${post?.title || 'The post'}" has been published.`);
    }
    if (action === 'unpublish') {
      await unpublishNews(id);
      showAdminMessage(`"${post?.title || 'The post'}" has been moved back to draft.`);
    }
    if (action === 'delete') {
      const post = allNews.find((item) => item.id === id);
      const confirmed = await confirmDelete(post?.title);
      if (!confirmed) return;
      await deleteNews(id);
      showAdminMessage(`"${post?.title || 'The post'}" has been deleted.`);
    }

    allNews = await getAdminNews();
    renderTable();
  } catch {
    showAdminMessage('The action could not be completed. Please try again.', 'error');
  } finally {
    button.disabled = false;
  }
}

[searchInput, statusFilter].forEach((field) => {
  field?.addEventListener('input', renderTable);
  field?.addEventListener('change', renderTable);
});

tableBody?.addEventListener('click', handleTableAction);
init();
