// Requirements:
//   [x] Two pages - index.html and watchlist.html
//   [x] index.html = search page. Calls the OMDB API with the title searched for and
//      displays the search results
//   [x] Button to "add to watchlist" which saves that data to local storage
//   [x] watchlist.html loads and displays data from local storage

// To Do:
// [X] Add assets:
//       (*) image asset for header
//       (*) font family "Inter"
//       (*) plus, minus, magnifying glass, and movie reel icons.
//           - <i class="fa-solid fa-circle-plus"></i>
//           - <i class="fa-solid fa-circle-minus"></i>
//           - <i class="fa-solid fa-magnifying-glass"></i>
//           - <i class="fa-solid fa-film"></i>
// [X] Set up the search page's layout for the initial state
// [X] Set up the search page's layout for the populated state
//       (*) Access the OMDB API to fully render the populated state layout
//       (*) Use local storage to add/remove movies
// [X] Set up the search page's layout for the 'no data' state
// [X] Set up the empty watchlist page's layout
//       (*) Include a link that takes you back to the search page to start
//           adding movies
// [X] Set up the populated watchlist page's layout
//       (*) Access local storage to fully render the populated state of
//           the watchlist page
//       (*) Apply same logic for removing movies from list with local
//           storage

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

    fetch(`http://www.omdbapi.com/?apikey=de8ce1b1&s=${formattedSearchValue}`)
      .then((res) => res.json())
      .then(processSearchResults);
  });
}

function fetchMovieDetails(id) {
  fetch(`http://www.omdbapi.com/?apikey=de8ce1b1&i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      populatedState.innerHTML += renderMovieCard(data);
    });
}
