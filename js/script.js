// Load manga list for index.html
async function loadMangaList() {
  const container = document.getElementById("manga-list");
  container.innerHTML = "";

  try {
    // Example: list of manga folders (could be hardcoded or generated dynamically)
    const mangas = ["manga1", "manga2"];

    for (const folder of mangas) {
      const response = await fetch(`assets/${folder}/info.json`);
      const data = await response.json();

      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <img src="assets/${folder}/cover.png" alt="${data.title} cover"/>
        <h2>${data.title}</h2>
      `;
      div.onclick = () => {
        window.location.href = `chapters.html?manga=${folder}`;
      };
      container.appendChild(div);
    }
  } catch (error) {
    console.error("Error loading manga list:", error);
  }
}

// Load chapters when inside chapters.html
async function loadChapters() {
  const urlParams = new URLSearchParams(window.location.search);
  const mangaFolder = urlParams.get("manga");

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

// Load viewer with continuous + adaptive layout
async function loadViewer() {
  const urlParams = new URLSearchParams(window.location.search);
  const mangaFolder = urlParams.get("manga");
  const chapterId = urlParams.get("chapter");

  if (!mangaFolder || !chapterId) {
    document.body.innerHTML = "<p>Error: Missing manga or chapter info.</p>";
    return;
  }

  try {
    const response = await fetch(`assets/${mangaFolder}/info.json`);
    const data = await response.json();

    document.getElementById("viewer-title").textContent = `${data.title} - ${chapterId}`;
    document.getElementById("back-to-chapters").href = `chapters.html?manga=${mangaFolder}`;

    const chapter = data.chapters.find(ch => ch.id === chapterId);
    if (!chapter) {
      document.body.innerHTML = "<p>Error: Chapter not found.</p>";
      return;
    }

    const totalPages = chapter.pages;
    const pageContainer = document.getElementById("page-container");

    // Detect layout mode
    function applyLayout() {
      if (window.innerWidth >= 900) {
        pageContainer.classList.add("double-page");
      } else {
        pageContainer.classList.remove("double-page");
      }
    }

    window.addEventListener("resize", applyLayout);

    // Render all pages continuously
    pageContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const img = document.createElement("img");
      img.src = `assets/${mangaFolder}/${chapterId}/${i}.png`;
      img.alt = `Page ${i}`;
      img.classList.add("manga-page");
      pageContainer.appendChild(img);
    }

    applyLayout();

  } catch (error) {
    console.error("Error loading viewer:", error);
  }
}

// Auto-run depending on page
if (window.location.pathname.endsWith("index.html")) {
  document.addEventListener("DOMContentLoaded", loadMangaList);
}
if (window.location.pathname.endsWith("chapters.html")) {
  document.addEventListener("DOMContentLoaded", loadChapters);
}
if (window.location.pathname.endsWith("viewer.html")) {
  document.addEventListener("DOMContentLoaded", loadViewer);
}
