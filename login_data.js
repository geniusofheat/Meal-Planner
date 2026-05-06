// ================================================================
// login_data.js — Account Type Selection UI Only (UPGRADED)
// Auth handled by firebase_login_auth.js
// ================================================================


document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  const card = params.get('card');
  const plan = params.get('plan');

  const freeCard = document.getElementById('free_card');
  const fullCard = document.getElementById('full_card');

  // ── RESET STATE (hide everything first)
  if (freeCard) freeCard.classList.add('hidden');
  if (fullCard) fullCard.classList.add('hidden');

  // ── ROUTING LOGIC
  if (card === 'create-account') {
    if (plan === 'free') {
      if (freeCard) freeCard.classList.remove('hidden');
    } else if (plan === 'full') {
      if (fullCard) fullCard.classList.remove('hidden');
    } else {
      // fallback: default to free if plan missing/invalid
      if (freeCard) freeCard.classList.remove('hidden');
    }
  }
});


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