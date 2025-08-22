// Global manga data structure
const MANGAS = {
  manga1: {
    title: "Manga One",
    cover: "assets/manga1/cover.png",
    chapters: {
      ch1: {
        title: "Chapter 1",
        thumb: "assets/manga1/ch1/thumb.png",
        pages: [
          "assets/manga1/ch1/1.png",
          "assets/manga1/ch1/2.png"
        ]
      },
      ch2: {
        title: "Chapter 2",
        thumb: "assets/manga1/ch2/thumb.png",
        pages: [
          "assets/manga1/ch2/1.png",
          "assets/manga1/ch2/2.png"
        ]
      }
    }
  },
  manga2: {
    title: "Manga Two",
    cover: "assets/manga2/cover.png",
    chapters: {
      ch1: {
        title: "Chapter 1",
        thumb: "assets/manga2/ch1/thumb.png",
        pages: [
          "assets/manga2/ch1/1.png",
          "assets/manga2/ch1/2.png"
        ]
      }
    }
  }
};

// Render list of mangas on index.html
function renderMangaList() {
  const container = document.getElementById("manga-list");
  container.innerHTML = "";

  Object.entries(MANGAS).forEach(([id, manga]) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${manga.cover}" alt="${manga.title} cover"/>
      <h2>${manga.title}</h2>
    `;
    div.onclick = () => {
      window.location.href = `chapters.html?manga=${id}`;
    };
    container.appendChild(div);
  });
}

// Render chapters for a manga on chapters.html
function renderChapterList(mangaId) {
  const manga = MANGAS[mangaId];
  const container = document.getElementById("chapter-list");
  const titleEl = document.getElementById("manga-title");
  container.innerHTML = "";
  titleEl.textContent = manga.title;

  Object.entries(manga.chapters).forEach(([chId, ch]) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${ch.thumb}" alt="${ch.title} thumbnail"/>
      <h3>${ch.title}</h3>
    `;
    div.onclick = () => {
      window.location.href = `viewer.html?manga=${mangaId}&chapter=${chId}`;
    };
    container.appendChild(div);
  });
}

// Render viewer on viewer.html
function renderViewer(mangaId, chapterId) {
  const manga = MANGAS[mangaId];
  const chapter = manga.chapters[chapterId];
  const pages = chapter.pages;
  let currentPage = 0;

  const imgEl = document.getElementById("manga-page");
  const titleEl = document.getElementById("viewer-title");
  const backLink = document.getElementById("back-link");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");

  titleEl.textContent = `${manga.title} — ${chapter.title}`;
  backLink.href = `chapters.html?manga=${mangaId}`;

  function updatePage() {
    imgEl.src = pages[currentPage];
  }

  prevBtn.onclick = () => {
    if (currentPage > 0) {
      currentPage--;
      updatePage();
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < pages.length - 1) {
      currentPage++;
      updatePage();
    }
  };

  updatePage();
}
// Load chapters when inside chapters.html
async function loadChapters() {
  const urlParams = new URLSearchParams(window.location.search);
  const mangaFolder = urlParams.get("manga"); // e.g. "manga1"

  if (!mangaFolder) {
    document.body.innerHTML = "<p>Error: No manga selected.</p>";
    return;
  }

  try {
    const response = await fetch(`assets/${mangaFolder}/info.json`);
    const data = await response.json();

    // Fill header
    document.getElementById("manga-title").textContent = data.title;
    document.getElementById("manga-author").textContent = `Author: ${data.author}`;
    document.getElementById("manga-description").textContent = data.description;

    // List chapters
    const chaptersList = document.getElementById("chapters-list");
    data.chapters.forEach(ch => {
      const chapterCard = document.createElement("div");
      chapterCard.classList.add("chapter-card");

      chapterCard.innerHTML = `
        <img src="assets/${mangaFolder}/${ch.thumb}" alt="${ch.title}">
        <h3>${ch.title}</h3>
        <button onclick="openViewer('${mangaFolder}', '${ch.id}')">Read</button>
      `;

      chaptersList.appendChild(chapterCard);
    });

  } catch (error) {
    console.error("Error loading chapters:", error);
  }
}

// Open a chapter in viewer
function openViewer(mangaFolder, chapterId) {
  window.location.href = `viewer.html?manga=${mangaFolder}&chapter=${chapterId}`;
}

// Auto-run if on chapters.html
if (window.location.pathname.endsWith("chapters.html")) {
  document.addEventListener("DOMContentLoaded", loadChapters);
}
