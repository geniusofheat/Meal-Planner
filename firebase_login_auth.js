// ================================================================
//  firebase_login_auth.js — Auth & Paywall System
// ================================================================

import { auth, db, onAuthStateChanged } from './firebase_config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
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
      if (snap.exists() && snap.data().username) displayName = snap.data().username;
      else displayName = user.email;
    } catch (e) {
      console.error('Error fetching user name:', e);
      displayName = user.email;
    }
  }

  navEmail.textContent     = `Welcome, ${displayName}`;
  signOutBtn.style.display = user ? 'inline-block' : 'none';
}

// ── Show post login options ────────────────────────────────────
export async function showPostLoginOptions(user) {
  const postLogin = document.getElementById('post-login-options');
  const msg       = document.getElementById('login-message');
  if (!postLogin || !msg) return;

  let displayName = 'Guest';
  if (user) {
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists() && snap.data().username) displayName = snap.data().username;
      else displayName = user.email;
    } catch (e) {
      displayName = user.email;
    }
  }

  msg.textContent         = user ? `You are signed in as ${displayName}.` : '';
  postLogin.style.display = user ? 'block' : 'none';
}

// ── Check Firestore for paid status ───────────────────────────
async function check_paid_status(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    cookbook_unlocked = snap.exists() && snap.data().paid === true;
  } catch (e) {
    cookbook_unlocked = false;
  }
}

// ── Unlock grocery menu for paid subscribers ──────────────────
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

// ── Sign In ────────────────────────────────────────────────────
export async function signIn(email, password, showError) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html';
  } catch (e) {
    if (showError) showError('Incorrect email or password.');
  }
}

// ── Sign Out ───────────────────────────────────────────────────
export async function signOutUser() {
  try {
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (e) {
    console.error(e);
  }
}
window.signOutUser = signOutUser;

// ── Create Account ─────────────────────────────────────────────
export async function createAccount(username, email, password, showError) {
  if (!username) { if (showError) showError('Enter a valid username.'); return; }
  if (password.length < 6) { if (showError) showError('Password must be at least 6 characters.'); return; }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      username: username,
      email:    email,
      paid:     false,
      created:  new Date().toISOString()
    });
    window.location.href = 'index.html';
  } catch (e) {
    if (showError) showError(e.message || 'Could not create account.');
  }
}

// ── Password Recovery ──────────────────────────────────────────
export async function sendRecoveryEmail(email, showError) {
  if (!email) { if (showError) showError('Enter a valid email.'); return; }
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password recovery email sent. Check your inbox.');
  } catch (e) {
    if (showError) showError(e.message);
  }
}

// ── Wire up all buttons on page load ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  function showSignInError(msg) {
    const el = document.getElementById('sign_in_error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function showCreateError(msg) {
    const el = document.getElementById('auth_error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  // ── SIGN IN ──────────────────────────────────────────────
  const signInBtn = document.getElementById('sign-in-btn');
  if (signInBtn) signInBtn.addEventListener('click', () => {
    const email    = document.getElementById('auth_email').value.trim();
    const password = document.getElementById('auth_password').value;
    signIn(email, password, showSignInError);
  });

  // ── CREATE ACCOUNT ────────────────────────────────────────
  const createBtn = document.getElementById('email-create-btn');
  if (createBtn) createBtn.addEventListener('click', () => {
    const username = document.getElementById('create_username').value.trim();
    const email    = document.getElementById('create_email').value.trim();
    const password = document.getElementById('create_password').value;
    createAccount(username, email, password, showCreateError);
  });

  // ── PASSWORD RECOVERY ────────────────────────────────────
  const recoverBtn = document.getElementById('password-recover-btn');
  if (recoverBtn) recoverBtn.addEventListener('click', () => {
    const email = document.getElementById('recover_email').value.trim();
    sendRecoveryEmail(email, showSignInError);
  });

  // ── SIGN OUT ──────────────────────────────────────────────
  const signOutBtn = document.getElementById('sign-out-btn');
  if (signOutBtn) signOutBtn.addEventListener('click', () => signOutUser());

  // ── CONTACT FORM ──────────────────────────────────────────
  const contactForm = document.getElementById('contact_form');
  if (contactForm) contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) { alert('You must be logged in to submit a contact form.'); return; }

    const title    = document.getElementById('contact_title')?.value.trim();
    const username = document.getElementById('contact_username')?.value.trim();
    const email    = document.getElementById('contact_email')?.value.trim();
    const message  = document.getElementById('contact_message')?.value.trim();

    if (!title || !username || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'contact_forms'), {
        uid: currentUser.uid,
        title, username, email, message,
        submitted: new Date().toISOString()
      });
      alert('Your message has been submitted!');
      contactForm.reset();
      prefillContactForm(currentUser);
    } catch (e) {
      console.error('Error submitting contact form:', e);
      alert('Failed to submit your message.');
    }
  });

});

// ── Prefill contact form ───────────────────────────────────────
async function prefillContactForm(user) {
  if (!user) return;
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    const usernameInput = document.getElementById('contact_username');
    const emailInput    = document.getElementById('contact_email');
    if (usernameInput) usernameInput.value = data.username || '';
    if (emailInput)    emailInput.value    = data.email    || '';
  } catch (e) {
    console.error('Error pre-filling contact form:', e);
  }
}

// ── Recipe paywall check ───────────────────────────────────────
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

function show_preview_banner() { /*... keep as before ...*/ }
window.show_paywall_modal = function() { /*... keep as before ...*/ };
window.close_paywall_modal = function() { /*... keep as before ...*/ };
