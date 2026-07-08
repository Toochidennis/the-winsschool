import { getCurrentAdmin, logout, requireAdmin } from './admin-auth.js';

export async function setupAdminLayout() {
  const admin = await requireAdmin();
  if (!admin) return null;

  const label = document.querySelector('[data-admin-name]');
  if (label) label.textContent = admin.name || admin.username || 'Admin';

  const path = window.location.pathname.replace(/\.html$/, '');
  document.querySelectorAll('.admin-nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if ((path.includes('admin_news_form') && href.includes('admin_news_form'))
      || (path.includes('admin_news') && href.includes('admin_news') && !path.includes('admin_news_form'))) {
      link.classList.add('is-active');
    }
  });

  document.querySelectorAll('[data-admin-logout]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      await logout();
      window.location.href = 'admin_login';
    });
  });

  return admin;
}

export async function getAdminForUi() {
  return await getCurrentAdmin();
}
