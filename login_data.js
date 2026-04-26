// ================================================================
// login_data.js — Account Type Selection UI Only
// Auth button wiring is handled by firebase_login_auth.js
// ================================================================

// ── Account Type Buttons ───────────────────────────────────────
window.freeAccount = function () {
  const freeBtn = document.getElementById('free-account');
  const fullBtn = document.getElementById('full-version');
  if (freeBtn) freeBtn.classList.add('selected');
  if (fullBtn) fullBtn.classList.remove('selected');

  setTimeout(() => {
    const el = document.getElementById('create_username');
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, 100);
};

window.fullVersion = function () {
  const freeBtn = document.getElementById('free-account');
  const fullBtn = document.getElementById('full-version');
  if (fullBtn) fullBtn.classList.add('selected');
  if (freeBtn) freeBtn.classList.remove('selected');

  setTimeout(() => {
    const el = document.getElementById('create_username');
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, 100);
};

// ── Show/Hide Password Toggle ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('show-password-toggle');
  if (toggle) {
    toggle.addEventListener('change', () => {
      const pwd = document.getElementById('auth_password');
      if (pwd) pwd.type = toggle.checked ? 'text' : 'password';
    });
  }
});
