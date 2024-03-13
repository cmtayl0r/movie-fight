// TODO: Create a refactoring branch
// TODO: Show no results found on autocomplete
// TODO: Add a loading spinner
// TODO: Add a placeholder image for movies with no poster
// TODO: Refactor the code to use a class-based approach, modules and MVC pattern

// -----------------------------------------------------------------------------
// IMPORTS
// -----------------------------------------------------------------------------

//
import 'bulma/css/bulma.min.css';
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';

import { API_KEY, API_URL } from './config';
import { createAutocomplete } from './modules/autocomplete';

// Parcel
if (module.hot) {
    module.hot.accept;
}

// -----------------------------------------------------------------------------
// AXIOS FETCH API
// -----------------------------------------------------------------------------

// Async function to fetch data from the API
// export const fetchData = async

// -----------------------------------------------------------------------------
// MOVIE DETAILS
// -----------------------------------------------------------------------------

// Helper function to fetch the selected movie details
export const onMovieSelect = async movie => {
    const response = await axios.get(API_URL, {
        params: {
            apikey: API_KEY,
            i: movie.imdbID,
        },
    });

    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

// Helper function to create the movie details template
const movieTemplate = movieDetail => {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" alt="${movieDetail.Title} poster" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h2>${movieDetail.Title} (${movieDetail.Year})</h2>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------

const init = function () {
    createAutocomplete({
        // configuration object
        // Unique config to send to the createAutocomplete function
        root: document.querySelector('.autocomplete'),
        renderOption(movie) {
            const imgSRC = movie.Poster === 'N/A' ? placeholder : movie.Poster;
            return `
                <img src="${imgSRC}" alt="${movie.Title} poster" />
                ${movie.Title} (${movie.Year})
            `;
        },
        onOptionSelect(movie) {
            // Call the `onMovieSelect` function with the selected movie
            onMovieSelect(movie);
        },
        inputValue(movie) {
            // Set the input value to the selected movie title
            return movie.Title;
        },
        async fetchData(searchTerm) {
            // Fetch data from the API based on the search term
            try {
                const response = await axios.get(API_URL, {
                    params: {
                        apikey: API_KEY,
                        s: searchTerm,
                    },
                });

                // FIXME: display no results found if this error occurs
                // If there's an error, return an empty array
                // This error occurs with this API when a search term is partially entered, problem of the API
                if (response.data.Error) {
                    return [];
                }

                return response.data.Search; // Return the `Search` array from the response data
            } catch (error) {
                console.error('Error fetching data:', error.message);
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });
};
document.addEventListener('DOMContentLoaded', init);
