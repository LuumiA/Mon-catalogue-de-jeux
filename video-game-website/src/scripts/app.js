// @ts-nocheck
// Fichier JavaScript principal pour interagir avec l'API rawg.io

const apiKey = "YOUR_API_KEY"; // Remplacez par votre clé API
const apiUrl = "https://api.rawg.io/api/games";

async function fetchGames() {
  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des jeux");
    }
    const data = await response.json();
    displayGames(data.results);
  } catch (error) {
    console.error(error);
  }
}

function displayGames(games) {
  const gamesContainer = document.getElementById("games-container");
  gamesContainer.innerHTML = ""; // Effacer le contenu précédent

  games.forEach((game) => {
    const gameElement = document.createElement("div");
    gameElement.classList.add("game");
    gameElement.innerHTML = `
            <h3>${game.name}</h3>
            <img src="${game.background_image}" alt="${game.name}">
            <p>Rating: ${game.rating}</p>
        `;
    gamesContainer.appendChild(gameElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchGames();
});
