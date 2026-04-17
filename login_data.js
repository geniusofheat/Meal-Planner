const toggle = document.getElementById("show-password-toggle");
const password = document.getElementById("auth_password");

toggle.addEventListener("change", () => {
  password.type = toggle.checked ? "text" : "password";
});// ================================================================
// login.js — Handles Login / Create Account / Recovery UI
// ================================================================

import {
  emailSignIn,
  createAccount,
  sendRecoveryEmail
} from './cookbook_auth.js';

document.addEventListener('DOMContentLoaded', () => {

  function showError(msg) {
    const el = document.getElementById('auth_error');
    if (el) {
      el.textContent = msg;
      el.style.display = 'block';
    }
  }

  // ── SIGN IN ─────────────────────────────────────────────
  const signInBtn = document.getElementById('sign-in-btn');
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      const email    = document.getElementById('auth_email')?.value.trim();
      const password = document.getElementById('auth_password')?.value;
      emailSignIn(email, password, showError);
    });
  }

  // ── CREATE ACCOUNT ──────────────────────────────────────
  const createBtn = document.getElementById('email-create-btn');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const name     = document.getElementById('create_username')?.value.trim();
      const email    = document.getElementById('create_email')?.value.trim();
      const password = document.getElementById('create_password')?.value;
      createAccount(name, email, password, showError);
    });
  }

  // ── PASSWORD RECOVERY ───────────────────────────────────
  const recoverBtn = document.getElementById('account-recovery-btn');
  if (recoverBtn) {
    recoverBtn.addEventListener('click', () => {
      const email = document.getElementById('recover_email')?.value.trim();
      sendRecoveryEmail(email, showError);
    });
  }

});