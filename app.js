// @ts-nocheck
// Fichier JavaScript principal pour interagir avec l'API rawg.io

const apiKey = "7de6744618464acb9afade269a9b8898";
const apiUrl = "https://api.rawg.io/api/games";

let nextPageUrl = null;

async function fetchGames(url = `${apiUrl}?key=${apiKey}`) {
  const gamesContainer = document.getElementById("games");
  gamesContainer.innerHTML = "<p>Chargement...</p>";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des jeux");
    }
    const data = await response.json();
    displayGames(data.results);
    nextPageUrl = data.next; // Stocke l'URL de la page suivante
  } catch (error) {
    gamesContainer.innerHTML = "<p>Erreur lors du chargement des jeux.</p>";
    console.error(error);
  }
}

function displayGames(games) {
  const gamesContainer = document.getElementById("games");
  gamesContainer.classList.add("game-list");
  gamesContainer.innerHTML = "";

  games.forEach((game) => {
    const gameElement = document.createElement("div");
    gameElement.classList.add("game-item");
    gameElement.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}">
      <h3>${game.name}</h3>
      <p>Note : ${game.rating}</p>
      <p>Date de sortie : ${game.released}</p>
      <button>Voir plus</button>
    `;

    // Ajouter un événement pour ouvrir la modale
    gameElement.addEventListener("click", () => openModal(game));

    gamesContainer.appendChild(gameElement);
  });
}

// Fonction pour afficher la modale avec les détails du jeu
function openModal(game) {
  const modal = document.getElementById("gameModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalDescription = document.getElementById("modalDescription");
  const modalGenres = document.getElementById("modalGenres");
  const modalPlatforms = document.getElementById("modalPlatforms");

  // Remplir les informations de la modale
  modalTitle.textContent = game.name;
  modalImage.src = game.background_image;
  modalDescription.textContent =
    game.description || "Aucune description disponible.";
  modalGenres.textContent = `Genres : ${game.genres
    .map((genre) => genre.name)
    .join(", ")}`;
  modalPlatforms.textContent = `Plateformes : ${game.platforms
    .map((platform) => platform.platform.name)
    .join(", ")}`;

  // Afficher la modale
  modal.style.display = "block";
}

// Fermer la modale
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("gameModal").style.display = "none";
});

// Fermer la modale en cliquant en dehors du contenu
window.addEventListener("click", (event) => {
  const modal = document.getElementById("gameModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

document.getElementById("loadMore").addEventListener("click", () => {
  if (nextPageUrl) {
    fetchGames(nextPageUrl); // Charge la page suivante
  }
});

const loadGame = document
  .getElementById("loadGames")
  .addEventListener("click", () => fetchGames());

document.addEventListener("DOMContentLoaded", () => {
  fetchGames();
});
