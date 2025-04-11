// @ts-nocheck
// Fichier JavaScript principal pour interagir avec l'API rawg.io

const apiKey = "7de6744618464acb9afade269a9b8898";
const apiUrl = "https://api.rawg.io/api/games";

let nextPageUrl = null;
let allGames = []; // Variable globale pour stocker tous les jeux

async function fetchGames(url = `${apiUrl}?key=${apiKey}`) {
  const gamesContainer = document.getElementById("games");
  gamesContainer.classList.add("game-list"); // Assure que la classe est bien appliquée

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des jeux");
    }
    const data = await response.json();

    // Ajoute les nouveaux jeux à la liste globale
    allGames = [...allGames, ...data.results];

    // Affiche les nouveaux jeux sans effacer les anciens
    data.results.forEach((game) => {
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

    // Met à jour l'URL de la page suivante
    nextPageUrl = data.next;
  } catch (error) {
    console.error("Erreur lors du chargement des jeux :", error);
  }
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
    fetchGames(nextPageUrl);
  } else {
    document.getElementById("loadMore").disabled = true; // Désactive le bouton
    document.getElementById("loadMore").textContent =
      "Tous les jeux sont chargés";
  }
});

const loadGame = document
  .getElementById("loadGames")
  .addEventListener("click", () => fetchGames());

document.addEventListener("DOMContentLoaded", () => {
  fetchGames();
});

// Fonction pour rechercher des jeux
document.getElementById("search").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase(); // Récupère la valeur entrée en minuscule
  const filteredGames = allGames.filter((game) =>
    game.name.toLowerCase().includes(query)
  ); // Filtre les jeux par nom
  displayGames(filteredGames); // Affiche les jeux filtrés
});
