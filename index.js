// Stretch Goals:
// [] Add styling for dark mode version of the site

import {
  renderMovieCard,
  addToWatchList,
  removeFromWatchList,
  checkIfAlreadyExists,
  changeIcon,
} from "./shared.js";

const watchListLink = document.querySelector("a");
const initialState = document.querySelector(".initial-state");
const populatedState = document.querySelector(".populated-state");
const noDataState = document.querySelector(".no-data-state");
const searchValue = document.getElementById("search");
const searchBtn = document.querySelector(".search-btn");

populatedState.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-circle-plus")) {
    const movieContainer = e.target.closest(".movie-container");

    const movieToBeAdded = {
      Poster: movieContainer.querySelector(".movie-poster").src,
      Title: movieContainer.querySelector(".movie-title").textContent,
      imdbRating: movieContainer.querySelector(".rating").textContent,
      Runtime: movieContainer.querySelector(".runtime").textContent,
      Genre: movieContainer.querySelector(".genre").textContent,
      Plot: movieContainer.querySelector(".description").textContent,
      imdbID: movieContainer.dataset.id,
    };

    changeIcon(movieContainer);
    addToWatchList(movieToBeAdded);
  }

  if (e.target.classList.contains("fa-circle-minus")) {
    const movieContainer = e.target.closest(".movie-container");

    changeIcon(movieContainer);
    removeFromWatchList(movieContainer.dataset.id);
  }
});

function processSearchResults(data) {
  if (data.Response === "False") {
    noDataState.style.display = "flex";
    console.log(data.Error);
    return;
  }

  const seenIds = [];
  const moviesArray = data.Search;
  const uniqueMoviesArray = moviesArray.filter((movie) => {
    if (checkIfAlreadyExists(seenIds, movie.imdbID)) {
      return false;
    }
    seenIds.push({ imdbID: movie.imdbID });
    return true;
  });

  uniqueMoviesArray.forEach((movie) => {
    fetchMovieDetails(movie.imdbID);
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", (e) => {
    noDataState.style.display = "none";
    populatedState.innerHTML = "";

    if (searchValue.value) {
      initialState.style.display = "none";
    } else {
      initialState.style.display = "flex";
      return;
    }

    const formattedSearchValue = searchValue.value.split(" ").join("+");

    fetch(`https://www.omdbapi.com/?apikey=de8ce1b1&s=${formattedSearchValue}`)
      .then((res) => res.json())
      .then(processSearchResults);
  });
}

function fetchMovieDetails(id) {
  fetch(`https://www.omdbapi.com/?apikey=de8ce1b1&i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      populatedState.innerHTML += renderMovieCard(data);
    });
}
