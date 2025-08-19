console.log("✅ theme.js loaded");
// ==========================
// Theme Toggle (Light / Dark / Auto)
// ==========================
const DARK_KEY = 'manga-dark-mode-setting';
const BUTTON_TEXT = {
  dark: '🌙 Dark Mode',
  light: '☀️ Light Mode',
  system: 'Auto (System Appearance)'
};

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getUserMode() {
  return localStorage.getItem(DARK_KEY) || 'system';
}

function applyMode(mode) {
  document.body.classList.remove('dark-mode', 'light-mode');
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (mode === 'light') {
    document.body.classList.add('light-mode');
  } else if (mode === 'system') {
    if (systemPrefersDark()) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }
  const toggleBtn = document.getElementById('mode-toggle');
  if (toggleBtn) toggleBtn.textContent = BUTTON_TEXT[mode];
}

function setUserMode(mode) {
  localStorage.setItem(DARK_KEY, mode);
  applyMode(mode);
}

function initMode() {
  applyMode(getUserMode());
  const toggleBtn = document.getElementById('mode-toggle');
  if (!toggleBtn) retur
