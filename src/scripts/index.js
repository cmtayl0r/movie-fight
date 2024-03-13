// TODO: Show no results found on autocomplete

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
// The actual function to be called when the input event is triggered.
// It will be debounced by the `debounce` function.
const onInput = async evt => {
    // Call the `fetchData` function with the value of the input field.
    // we use await here to wait for the `fetchData` function to resolve before continuing.
    const movies = await fetchData(evt.target.value);

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
        acResultsWrapper.appendChild(acOption);
    }
};

// 3 - EVENT LISTENERS
// The listener is set to respond to 'input' events, i.e., when the user types into the input field.
// The `debounce` function is used here to wrap the `onInput` function, effectively debouncing it.
// This means `onInput` will only be called 500 milliseconds after the user stops typing, reducing the frequency of potentially expensive `fetchData` calls
// You could use this for other events, such as 'scroll' or 'resize', to limit the frequency of event handlers.
acInput.addEventListener('input', debounce(onInput, 500));

// Close the dropdown if the user clicks outside of it
document.addEventListener('click', evt => {
    // if the clicked element is not inside the autocomplete root, close the dropdown
    if (!acRoot.contains(evt.target)) {
        acDropdown.classList.remove('is-active');
    }
});
