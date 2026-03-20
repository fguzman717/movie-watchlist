import {
  renderMovieCard,
  removeFromWatchList,
  getWatchList,
} from "./shared.js";

const initialState = document.querySelector(".initial-state");
const populatedState = document.querySelector(".populated-state");

populatedState.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-circle-minus")) {
    const movieContainer = e.target.closest(".movie-container");
    removeFromWatchList(movieContainer.dataset.id);
    renderWatchList();
  }
});

function updateDisplayStates(movieList) {
  if (movieList.length) {
    initialState.style.display = "none";
  } else {
    initialState.style.display = "flex";
  }
}

function renderMovieList(movieList) {
  populatedState.innerHTML = "";
  movieList.forEach((movie) => {
    populatedState.innerHTML += renderMovieCard(movie);
  });
}

function renderWatchList() {
  const movieList = getWatchList();
  updateDisplayStates(movieList);
  renderMovieList(movieList);
}

renderWatchList();
