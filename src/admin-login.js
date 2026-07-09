import { login } from './admin-auth.js';

const form = document.getElementById('admin-login-form');
const message = document.getElementById('admin-login-message');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const username = String(formData.get('username') || '');
    const password = String(formData.get('password') || '');

    if (message) message.textContent = 'Signing in…';

    const result = await login(username, password);
    if (!result.ok) {
      if (message) message.textContent = result.message;
      return;
    }

    if (message) message.textContent = '';
    window.location.href = 'admin_news.html';
  });
}
