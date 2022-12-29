
const searchBtn = document.getElementById("search-btn")
const input = document.getElementById("input")
const mainIndex = document.getElementById("main-index")
const moviesArray = []
const moviesWatchList = []

mainIndex.innerHTML = `<div class="main-placeholder">
                                <img src="images/background-icon.png">
                                <p>Start exploring</p>
                            </div>`

searchBtn.addEventListener("click", displayMovies)

function addMovieToWatchList(event) {
    const movie = event.target.parentElement.parentElement.parentElement.parentElement
    const movieID = movie.getAttribute("id")

    if (localStorage.getItem("movies") === null) {
        for (let i = 0; i < moviesArray.length; i++) {
            if (moviesArray[i].imdbID === movieID) {
                moviesWatchList.push(moviesArray[i])
            }
        }

        localStorage.setItem("movies", JSON.stringify(moviesWatchList))
    } 

    currentSavedMovies = JSON.parse(localStorage.getItem("movies"))
    for (let i = 0; i < moviesArray.length; i++) {
        if (moviesArray[i].imdbID === movieID) {
            const newCurrentSavedMovies = currentSavedMovies.map(el => el.imdbID)
            if (newCurrentSavedMovies.indexOf(movieID) === -1) {
                currentSavedMovies.push(moviesArray[i])
            }
        }
    }

    localStorage.setItem("movies", JSON.stringify(currentSavedMovies))
}

function displayMovies() {
    mainIndex.innerHTML = ""
    fetch(`http://www.omdbapi.com/?apikey=455c65d7&s=${input.value}`)
        .then(response => response.json())
        .then(data => {
            const searchMoviesArray = data.Search
            for (let i = 0; i < searchMoviesArray.length; i++) {
                fetch(`http://www.omdbapi.com/?apikey=455c65d7&i=${searchMoviesArray[i].imdbID}`)
                    .then(response => response.json())
                    .then(data => {
                        const movieInfo = data
                        moviesArray.push({
                            imdbID: searchMoviesArray[i].imdbID,
                            Poster: searchMoviesArray[i].Poster,
                            Title: movieInfo.Title,
                            Value: movieInfo.Ratings[0].Value,
                            Runtime: movieInfo.Runtime,
                            Genre: movieInfo.Genre,
                            Plot: movieInfo.Plot
                        })
                        mainIndex.innerHTML += `<div class="movie-container" id="${searchMoviesArray[i].imdbID}">
                                                    <img src="${searchMoviesArray[i].Poster}" class="movie-image">
                                                    <div class="movie-info">
                                                        <div class="movie-info-title">
                                                            <h3>${movieInfo.Title}</h3>
                                                            <img src="images/star-icon.png">
                                                            <p>${movieInfo.Ratings[0].Value}</p>
                                                        </div>
                                                        <div class="movie-info-details">
                                                            <p class="movie-info-details-duration">${movieInfo.Runtime}</p>
                                                            <p class="movie-info-details-category">${movieInfo.Genre}</p>
                                                            <div id="add-btn" onClick="addMovieToWatchList(event)">
                                                                <img src="images/plus-icon.png">
                                                                <p>Watchlist</p>
                                                            </div>
                                                        </div>
                                                        <p class="movie-info-description">${movieInfo.Plot}</p>
                                                    </div>
                                                </div>`
                    })
            }
        })
}