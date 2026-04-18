// ================================================================
// login_data.js — UI Flow (Free / Full Selection + Auth Integration)
// FULL JAVASCRIPT FILE
// ================================================================

import {
  emailSignIn,
  createAccount,
  sendRecoveryEmail
} from './firebase_login_auth.js';

// ── State ──────────────────────────────────────────────────────
let selectedAccountType = null;

// ── Account Type Buttons ───────────────────────────────────────
// UPDATED: added selection highlight + reliable username focus

window.freeAccount = function () {
  selectedAccountType = 'free';

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
  selectedAccountType = 'full';

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

// ── DOM READY ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  function showError(msg) {
    const el = document.getElementById('auth_error');
    if (el) {
      el.textContent = msg;
      el.style.display = 'block';
    }
  }

  // ── SIGN IN ────────────────────────────────────────────────
  const signInBtn = document.getElementById('sign-in-btn');
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      const email    = document.getElementById('auth_email')?.value.trim();
      const password = document.getElementById('auth_password')?.value;
      emailSignIn(email, password, showError);
    });
  }

  // ── CREATE ACCOUNT ──────────────────────────────────────────
  const createBtn = document.getElementById('email-create-btn');
  if (createBtn) {
    createBtn.addEventListener('click', async () => {

      const name     = document.getElementById('create_username')?.value.trim();
      const email    = document.getElementById('create_email')?.value.trim();
      const password = document.getElementById('create_password')?.value;

      await createAccount(name, email, password, showError);

      // ── WELCOME SCREEN REPLACEMENT ─────────────────────────
      const card = document.getElementById('create-account');

      if (card) {
        card.innerHTML = `
          <div style="padding:20px;">
            <h2>Welcome, ${name}</h2>

            <p>
              You have successfully signed up for the
              ${selectedAccountType === 'full'
                ? 'Full Version subscription.'
                : 'Free Meal Planner subscription.'
              }
            </p>

            <p>
              ${selectedAccountType === 'free'
                ? 'You now have access to the Grocery Checklist tool.'
                : 'You now have access to all Meal Planner tools.'
              }
            </p>

            <a href="index.html">
              <button class="blue-btn">Go to Free Tools</button>
            </a>
          </div>
        `;
      }
    });
  }

  // ── PASSWORD RECOVERY ──────────────────────────────────────
  const recoverBtn = document.getElementById('account-recovery-btn');
  if (recoverBtn) {
    recoverBtn.addEventListener('click', () => {
      const email = document.getElementById('recover_email')?.value.trim();
      sendRecoveryEmail(email, showError);
    });
  }

});