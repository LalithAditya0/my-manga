/* ====================
 *  Data Source
 *  - Edit this CHAPTERS array to add your chapters and page image URLs
 *  - Thumbnails are optional; if missing, first page is used
 * ==================== */
const CHAPTERS = [
  {
    id: 1,
    title: "Chapter 1 — Dawn",
    pages: [
      "/assets/ch1/1.png",
      "/assets/ch1/2.png",
      "/assets/ch1/3.png",
      "/assets/ch1/4.png",
      "/assets/ch1/5.png",
    ],
    thumb: "/assets/ch1/thumb.png",
  },
  {
    id: 2,
    title: "Chapter 2 — Echoes",
    pages: [
      "/assets/ch2/1.png",
      "/assets/ch2/2.png",
      "/assets/ch2/3.png",
      "/assets/ch2/4.png",
      "/assets/ch2/5.png",
    ],
    thumb: "/assets/ch2/thumb.png",
  },
];

/* =========
 * Utilities
 * ========= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const qs = new URLSearchParams(location.search);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const storage = {
  get theme() { return localStorage.getItem("theme") || "dark"; },
  set theme(v) { localStorage.setItem("theme", v); },
  setProgress(chId, pageIdx) { localStorage.setItem(`progress:${chId}`, String(pageIdx)); },
  getProgress(chId) { const v = localStorage.getItem(`progress:${chId}`); return v ? parseInt(v, 10) : 0; },
};

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "dark");
}

function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next); storage.theme = next;
}

function initThemeButton() {
  const btn = document.getElementById("modeToggle");
  if (!btn) return;
  applyTheme(storage.theme);
  btn.addEventListener("click", toggleTheme);
}

/* ===============
 * Index Rendering
 * =============== */
function initIndex() {
  initThemeButton();
  const grid = document.getElementById("chapterGrid");
  const tpl = document.getElementById("chapterCardTpl");
  if (!grid || !tpl) return;

  grid.innerHTML = "";
  CHAPTERS.forEach((ch) => {
    const node = tpl.content.cloneNode(true);
    const a = node.querySelector("a.chapter-card");
    const img = node.querySelector("img.thumb");
    const title = node.querySelector(".chapter-title");
    const pages = node.querySelector(".chapter-pages");

    title.textContent = ch.title;
    pages.textContent = ch.pages.length;
    const thumb = ch.thumb || ch.pages[0];
    img.src = thumb; img.alt = `${ch.title} thumbnail`;

    a.href = `viewer.html?chapter=${ch.id}`;

    grid.appendChild(node);
  });
}

/* =================
 * Viewer Rendering
 * ================= */
function getChapterById(id) { return CHAPTERS.find((c) => c.id === id); }

function preload(src) { if (!src) return; const img = new Image(); img.src = src; }

function initViewer() {
  initThemeButton();

  const chId = parseInt(qs.get("chapter"), 10) || CHAPTERS[0]?.id || 1;
  const chapter = getChapterById(chId);
  if (!chapter) {
    location.replace("index.html");
    return;
  }

  const total = chapter.pages.length;
  // Use saved progress, unless URL explicitly sets a page
  let page = clamp(parseInt(qs.get("page"), 10) || storage.getProgress(chId) || 1, 1, total);

  const img = document.getElementById("pageImg");
  const counter = document.getElementById("pageCounter");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const altNav = document.getElementById("altNav");
  const prevChapter = document.getElementById("prevChapter");
  const nextChapter = document.getElementById("nextChapter");
  const titleEl = document.getElementById("viewerTitle");

  titleEl.textContent = chapter.title;

  function updateUI() {
    const src = chapter.pages[page - 1];
    img.src = src;
    img.alt = `${chapter.title} — Page ${page}`;
    counter.textContent = `Page ${page} of ${total}`;

    // Save progress
    storage.setProgress(chId, page);

    // Preload neighbors
    preload(chapter.pages[page]); // next
    preload(chapter.pages[page - 2]); // prev

    // Boundary logic for chapter switching
    const atFirst = page === 1;
    const atLast = page === total;
