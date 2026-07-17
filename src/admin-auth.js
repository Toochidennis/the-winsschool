/**
 * The Wins School — Admin Auth
 *
 * Admin login requires the PHP API.
 */

import { clearCsrfToken } from './csrf.js';

// -------------------------------------------------------
// API mode detection
// -------------------------------------------------------
let apiAvailable = null;

async function isApiAvailable() {
  if (apiAvailable !== null) return apiAvailable;
  try {
    const res = await fetch('api/admin-me.php', { credentials: 'include' });
    // 200 or 401 both mean the PHP backend exists
    apiAvailable = res.ok || res.status === 401;
  } catch {
    apiAvailable = false;
  }
  return apiAvailable;
}

// -------------------------------------------------------
// Login
// -------------------------------------------------------
export async function login(username, password) {
  if (await isApiAvailable()) {
    try {
      const res = await fetch('api/admin-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { ok: true, session: { user: data.admin } };
      }
      return { ok: false, message: data.message || 'Invalid credentials.' };
    } catch {
      return { ok: false, message: 'Network error. Please try again.' };
    }
  }

  return { ok: false, message: 'Admin login requires the PHP server.' };
}

// -------------------------------------------------------
// Logout
// -------------------------------------------------------
export async function logout() {
  clearCsrfToken();

  if (await isApiAvailable()) {
    try {
      await fetch('api/admin-logout.php', { method: 'POST', credentials: 'include' });
    } catch { /* ok */ }
  }
}

// -------------------------------------------------------
// Get current admin
// -------------------------------------------------------
export async function getCurrentAdmin() {
  if (await isApiAvailable()) {
    try {
      const res = await fetch('api/admin-me.php', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        return data.admin || null;
      }
    } catch { /* fall through */ }
    return null;
  }

  return null;
}

// -------------------------------------------------------
// Require admin (redirects if not logged in)
// -------------------------------------------------------
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    window.location.href = 'admin_login.html';
    return null;
  }
  return admin;
}
