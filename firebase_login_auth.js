// ================================================================
// cookbook_auth.js — Core Auth + Firestore Logic ONLY
// ================================================================

import { auth, db, onAuthStateChanged } from './firebase_config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-login-auth.js";
import { doc, getDoc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── State ──────────────────────────────────────────────────────
let currentUser       = null;
let cookbook_unlocked = false;
let preview_used      = false;

// ── Update nav bar ─────────────────────────────────────────────
export async function updateNavBar(user) {
  const navEmail   = document.getElementById('nav-user-email');
  const signOutBtn = document.getElementById('sign-out-btn');
  if (!navEmail || !signOutBtn) return;

  let displayName = 'Guest';

  if (user) {
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists() && snap.data().name) displayName = snap.data().name;
      else displayName = user.email;
    } catch (e) {
      displayName = user.email;
    }
  }

  navEmail.textContent     = `Welcome, ${displayName}`;
  signOutBtn.style.display = user ? 'inline-block' : 'none';
}

// ── Post-login UI ──────────────────────────────────────────────
export async function showPostLoginOptions(user) {
  const postLogin = document.getElementById('post-login-options');
  const msg       = document.getElementById('login-message');
  if (!postLogin || !msg) return;

  let displayName = 'Guest';

  if (user) {
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists() && snap.data().name) displayName = snap.data().name;
      else displayName = user.email;
    } catch (e) {
      displayName = user.email;
    }
  }

  msg.textContent         = user ? `You are signed in as ${displayName}.` : '';
  postLogin.style.display = user ? 'block' : 'none';
}

// ── Paid status check ──────────────────────────────────────────
async function check_paid_status(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    cookbook_unlocked = snap.exists() && snap.data().paid === true;
  } catch {
    cookbook_unlocked = false;
  }
}

// ── Unlock feature ─────────────────────────────────────────────
function unlockGroceryMenu() {
  if (!cookbook_unlocked) return;
  const overlay = document.getElementById('groceryMenuPaywall');
  if (overlay) overlay.classList.add('hidden');
}

// ── Auth state listener ────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  await updateNavBar(user);

  if (user) {
    await check_paid_status(user.uid);
    unlockGroceryMenu();
    await showPostLoginOptions(user);
    prefillContactForm(user);
  }
});

// ── AUTH FUNCTIONS (exported for login.js) ─────────────────────
export async function emailSignIn(email, password, showError) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html';
  } catch {
    if (showError) showError('Incorrect email or password.');
  }
}

export async function createAccount(name, email, password, showError) {
  if (!name) {
    if (showError) showError('Enter a valid name.');
    return;
  }

  if (password.length < 6) {
    if (showError) showError('Password must be at least 6 characters.');
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, 'users', cred.user.uid), {
      name:    name,
      email:   email,
      paid:    false,
      created: new Date().toISOString()
    });

    window.location.href = 'index.html';

  } catch (e) {
    if (showError) showError(e.message || 'Could not create account.');
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (e) {
    console.error(e);
  }
}

export async function sendRecoveryEmail(email, showError) {
  if (!email) {
    if (showError) showError('Enter a valid email.');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password recovery email sent.');
  } catch (e) {
    if (showError) showError(e.message);
  }
}

// ── Contact form submit (kept here — needs db access) ──────────
export async function submitContactForm(data) {
  if (!currentUser) throw new Error('Not authenticated');

  return await addDoc(collection(db, 'contact_forms'), {
    uid: currentUser.uid,
    ...data,
    submitted: new Date().toISOString()
  });
}

// ── Prefill contact form ───────────────────────────────────────
async function prefillContactForm(user) {
  if (!user) return;

  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (!snap.exists()) return;

    const data = snap.data();

    const usernameInput = document.getElementById('contact_username');
    const emailInput    = document.getElementById('contact_email');

    if (usernameInput) usernameInput.value = data.name || '';
    if (emailInput)    emailInput.value    = data.email || '';

  } catch (e) {
    console.error(e);
  }
}

// ── Paywall logic ─────────────────────────────────────────────
window.check_and_open_recipe = function(recipe, icon, cat_name) {
  if (cookbook_unlocked) {
    open_recipe_modal(recipe, icon, cat_name);
    return;
  }

  if (!preview_used) {
    preview_used = true;
    open_recipe_modal(recipe, icon, cat_name);
    setTimeout(show_preview_banner, 600);
    return;
  }

  show_paywall_modal();
};

function show_preview_banner() { /* unchanged */ }
window.show_paywall_modal = function() { /* unchanged */ };
window.close_paywall_modal = function() { /* unchanged */ };