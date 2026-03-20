export function getPosterSrc(movie) {
  return movie.Poster !== "N/A" ? movie.Poster : "images/no-poster.png";
}

export function getIconClasses(isInWatchList) {
  const plusClass = isInWatchList ? "inactive" : "";
  const minusClass = isInWatchList ? "" : "inactive";
  return { plusClass, minusClass };
}

export function generateMovieHTML(movie, poster, plusClass, minusClass) {
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

export function renderMovieCard(movie) {
  const poster = getPosterSrc(movie);
  const watchList = getWatchList();
  const isInWatchList = checkIfAlreadyExists(watchList, movie.imdbID);
  const { plusClass, minusClass } = getIconClasses(isInWatchList);

  return generateMovieHTML(movie, poster, plusClass, minusClass);
}

export function addToWatchList(movie) {
  const movieList = getWatchList();
  const addedMovie = checkIfAlreadyExists(movieList, movie.imdbID);

  if (addedMovie) return;

  movieList.push(movie);
  localStorage.setItem("watchlist", JSON.stringify(movieList));
}

export function removeFromWatchList(movieId) {
  const movieList = getWatchList();

  const updatedList = movieList.filter((movie) => movie.imdbID !== movieId);

  localStorage.setItem("watchlist", JSON.stringify(updatedList));
}

export function checkIfAlreadyExists(movieList, movieId) {
  return movieList.some((movie) => {
    return movie.imdbID === movieId;
  });
}

export function changeIcon(movieContainer) {
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

export function getWatchList() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}
