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

import { debounce } from './utils';

// -----------------------------------------------------------------------------
// DOM ELEMENTS
// -----------------------------------------------------------------------------

// Autocomplete
const acRoot = document.querySelector('.autocomplete');
acRoot.innerHTML = `
<label class="label"><b>Search for a movie</b></label>
<input class="input" type="text" placeholder="Search for a movie" />
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
</div>
`;
const acInput = document.querySelector('.input');
const acDropdown = document.querySelector('.dropdown');
const acResultsWrapper = document.querySelector('.results');
const placeholder = `https://via.placeholder.com/170x250?text=🎬`;

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const API_KEY = '5ff1336c';
const API_URL = `http://www.omdbapi.com/`;

// -----------------------------------------------------------------------------
// AXIOS FETCH API
// -----------------------------------------------------------------------------

// Async function to fetch data from the API
const fetchData = async searchTerm => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                apikey: API_KEY,
                i: 'tt3896198',
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
};

// -----------------------------------------------------------------------------
// AUTOCOMPLETE INPUT
// -----------------------------------------------------------------------------

// 1 - DEBOUNCE FUNCTION (utils.js)

// 2 - FUNCTION TO BE DEBOUNCED (INPUT EVENT HANDLER)

/**
 * Fetches API data based on the search term and populates the dropdown with the results.
 * @param {*} evt
 * @returns A list of movies based on the search term
 */
// The function to be called when the input event is triggered.
// It will be debounced by the `debounce` function.

const onInput = async evt => {
    // Call the `fetchData` function with the value of the input field.
    // we use await here to wait for the `fetchData` function to resolve before continuing.
    const movies = await fetchData(evt.target.value);

    // If there are no results, close the dropdown and exit the function early.
    if (!movies.length) {
        acDropdown.classList.remove('is-active');
        return; // Exit the function early if there are no results
    }

    // Clear the previous results
    acResultsWrapper.innerHTML = '';

    // Add the `is-active` class to the dropdown to show it.
    acDropdown.classList.add('is-active');

    // loop through the `movies` array and create a new `a` for each movie.
    for (let movie of movies) {
        const acOption = document.createElement('a');
        const imgSRC = movie.Poster === 'N/A' ? placeholder : movie.Poster;
        acOption.classList.add('dropdown-item');
        acOption.innerHTML = `
            <img src="${imgSRC}" alt="${movie.Title} poster" />
            ${movie.Title}
        `;
        acOption.addEventListener('click', () => {
            acDropdown.classList.remove('is-active'); // Close the dropdown
            acInput.value = movie.Title; // Set the input value to the movie title
            onMovieSelect(movie); // Call the `onMovieSelect` function with the selected movie
        });
        acResultsWrapper.appendChild(acOption);
    }
};

// 3 - EVENT LISTENERS
// The listener is set to respond to 'input' events, i.e., when the user types into the input field.
// The `debounce` function is used here to wrap the `onInput` function, effectively debouncing it.
// This means `onInput` will only be called 500 milliseconds after the user stops typing, reducing the frequency of potentially expensive `fetchData` calls
acInput.addEventListener('input', debounce(onInput, 500));

// Close the dropdown if the user clicks outside of it
document.addEventListener('click', evt => {
    // if the clicked element is not inside the autocomplete root, close the dropdown
    if (!acRoot.contains(evt.target)) {
        acDropdown.classList.remove('is-active');
    }
});

// Helper function to fetch the selected movie details
const onMovieSelect = async movie => {
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
                    <h2>${movieDetail.Title}</h2>
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
