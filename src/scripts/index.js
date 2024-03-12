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

const input = document.querySelector('input');

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
    const response = await axios.get(`${API_URL}`, {
        params: {
            apikey: API_KEY,
            i: 'tt3896198',
            s: searchTerm,
        },
    });

    return response.data.Search; // Return the `Search` array from the response data
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

    // loop through the `movies` array and create a new `div` for each movie.
    for (let movie of movies) {
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title} poster" />
            <h5>${movie.Title}</h5>
        `;
        document.querySelector('#target').appendChild(div);
    }
};

// 3 - EVENT LISTENER
// The listener is set to respond to 'input' events, i.e., when the user types into the input field.
// The `debounce` function is used here to wrap the `onInput` function, effectively debouncing it.
// This means `onInput` will only be called 500 milliseconds after the user stops typing, reducing the frequency of potentially expensive `fetchData` calls
// You could use this for other events, such as 'scroll' or 'resize', to limit the frequency of event handlers.
input.addEventListener('input', debounce(onInput, 500));
