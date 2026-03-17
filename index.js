// Requirements:
//   [x] Two pages - index.html and watchlist.html
//   [x] index.html = search page. Calls the OMDB API with the title searched for and
//      displays the search results
//   [] Button to "add to watchlist" which saves that data to local storage
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
// [] Set up the search page's layout for the populated state
//       (*) Access the OMDB API to fully render the populated state layout
//       () Use local storage to add/remove movies
// [] Set up the search page's layout for the 'no data' state
// [] Set up the empty watchlist page's layout
// [] Set up the populated watchlist page's layout
//       () Access local storage to fully render the populated state of the watchlist
//          page
//       () Apply same logic for removing movies from list with local storage

// Stretch Goals:
// [] Add styling for dark mode version of the site

console.log("script loaded");

const watchListLink = document.querySelector("a");
const initialState = document.querySelector(".initial-state");
const populatedState = document.querySelector(".populated-state");
const noDataState = document.querySelector(".no-data-state");
const searchValue = document.getElementById("search");
const searchBtn = document.querySelector(".search-btn");

watchListLink.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("clicked!");
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

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

      const duplicateMovies = new Set();
      const moviesArray = data.Search;
      const uniqueMoviesArray = moviesArray.filter((movie) => {
        if (duplicateMovies.has(movie.imdbID)) {
          return false;
        }

        duplicateMovies.add(movie.imdbID);
        return true;
      });
      uniqueMoviesArray.forEach((movie) => {
        fetchMovieDetails(movie.imdbID);
      });
    });
});

function fetchMovieDetails(id) {
  fetch(`http://www.omdbapi.com/?apikey=de8ce1b1&i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      const poster =
        data.Poster !== "N/A" ? data.Poster : "images/no-poster.png";

      const html = `
        <div class="movie-container">
          <img
            class="movie-poster"
            src="${poster}"
            onerror="this.src='images/no-poster.webp'"
          />
          <div class="movie-details">
            <div class="movie-heading">
              <h2 class="movie-title">${data.Title}</h2>
              <div class="icon-container">
                <i class="fa-solid fa-star"></i>
                <p class="rating">${data.imdbRating}</p>
              </div>
            </div>
            <div class="movie-subtext">
              <p class="runtime">${data.Runtime}</p>
              <p class="genre">${data.Genre}</p>
              <div class="icon-container">
                <i class="fa-solid fa-circle-plus"></i>
                <i class="fa-solid fa-circle-minus inactive"></i>
                <p>Watchlist</p>
              </div>
            </div>
            <p class="description">${data.Plot}</p>
          </div>
        </div>`;
      populatedState.innerHTML += html;
    });
}
