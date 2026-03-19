// Requirements:
//   [x] Two pages - index.html and watchlist.html
//   [x] index.html = search page. Calls the OMDB API with the title searched for and
//      displays the search results
//   [x] Button to "add to watchlist" which saves that data to local storage
//   [] watchlist.html loads and displays data from local storage

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
// [] Set up the empty watchlist page's layout
//       () Include a link that takes you back to the search page to start adding
//          movies
// [] Set up the populated watchlist page's layout
//       () Access local storage to fully render the populated state of the watchlist
//          page
//       () Apply same logic for removing movies from list with local storage

// Stretch Goals:
// [] Add styling for dark mode version of the site

const watchListLink = document.querySelector("a");
const initialState = document.querySelector(".initial-state");
const populatedState = document.querySelector(".populated-state");
const noDataState = document.querySelector(".no-data-state");
const searchValue = document.getElementById("search");
const searchBtn = document.querySelector(".search-btn");

// Event Listeners
watchListLink.addEventListener("click", (e) => {
  console.log("clicked!");
});

populatedState.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-circle-plus")) {
    const movieContainer = e.target.closest(".movie-container");

    const movieToBeAdded = {
      poster: movieContainer.querySelector(".movie-poster").src,
      title: movieContainer.querySelector(".movie-title").textContent,
      rating: movieContainer.querySelector(".rating").textContent,
      runtime: movieContainer.querySelector(".runtime").textContent,
      genre: movieContainer.querySelector(".genre").textContent,
      description: movieContainer.querySelector(".description").textContent,
      id: movieContainer.dataset.id,
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
    .then((data) => {
      if (data.Response === "False") {
        noDataState.style.display = "flex";
        return console.log(data.Error);
      }

      const seenIds = [];
      const moviesArray = data.Search;
      const uniqueMoviesArray = moviesArray.filter((movie) => {
        if (checkIfAlreadyExists(seenIds, movie.imdbID)) {
          return false;
        }

        seenIds.push({ id: movie.imdbID });
        return true;
      });

      uniqueMoviesArray.forEach((movie) => {
        fetchMovieDetails(movie.imdbID);
      });
    });
});

// Movie Rendering Functions
function fetchMovieDetails(id) {
  fetch(`http://www.omdbapi.com/?apikey=de8ce1b1&i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      populatedState.innerHTML += renderMovieCard(data);
    });
}

function renderMovieCard(movie) {
  const poster = movie.Poster !== "N/A" ? movie.Poster : "images/no-poster.png";

  const watchList = getWatchList();
  const isInWatchList = checkIfAlreadyExists(watchList, movie.imdbID);

  const plusClass = isInWatchList ? "inactive" : "";
  const minusClass = isInWatchList ? "" : "inactive";

  const html = `
        <div class="movie-container" data-id="${movie.imdbID}">
          <img
            class="movie-poster"
            src="${poster}"
            onerror="this.src='images/no-poster.webp'"
          />
          <div class="movie-details">
            <div class="movie-heading">
              <h2 class="movie-title">${movie.Title}</h2>
              <div class="icon-container">
                <i class="fa-solid fa-star"></i>
                <p class="rating">${movie.imdbRating}</p>
              </div>
            </div>
            <div class="movie-subtext">
              <p class="runtime">${movie.Runtime}</p>
              <p class="genre">${movie.Genre}</p>
              <div class="icon-container">
                <i class="fa-solid fa-circle-plus ${plusClass}"></i>
                <i class="fa-solid fa-circle-minus ${minusClass}"></i>
                <p>Watchlist</p>
              </div>
            </div>
            <p class="description">${movie.Plot}</p>
          </div>
        </div>
        `;
  return html;
}

// Local Storage Altering Functions
function addToWatchList(movie) {
  const movieList = getWatchList();
  const addedMovie = checkIfAlreadyExists(movieList, movie.id);

  if (addedMovie) return;

  movieList.push(movie);
  localStorage.setItem("watchlist", JSON.stringify(movieList));
}

function removeFromWatchList(movieId) {
  const movieList = getWatchList();

  const updatedList = movieList.filter((movie) => movie.id !== movieId);

  localStorage.setItem("watchlist", JSON.stringify(updatedList));
}

// Utility Functions
function checkIfAlreadyExists(movieList, movieId) {
  return movieList.some((movie) => {
    return movie.id === movieId;
  });
}

function changeIcon(movieContainer) {
  const plusIcon = movieContainer.querySelector(".fa-circle-plus");
  const minusIcon = movieContainer.querySelector(".fa-circle-minus");

  //Plus to minus
  if (!plusIcon.classList.contains("inactive")) {
    plusIcon.classList.add("inactive");
    minusIcon.classList.remove("inactive");
  } else {
    //Minus to plus
    minusIcon.classList.add("inactive");
    plusIcon.classList.remove("inactive");
  }
}

function getWatchList() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}
