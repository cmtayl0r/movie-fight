// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import 'bulma/css/bulma.min.css';
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';

// -----------------------------------------------------------------------------
// DOM Elements
// -----------------------------------------------------------------------------

const input = document.querySelector('input');

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const API_KEY = '5ff1336c';
const API_URL = `http://www.omdbapi.com/`;

// -----------------------------------------------------------------------------
// Fetch API Data
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
    console.log(response.data);
};

// -----------------------------------------------------------------------------
// Autocomplete
// -----------------------------------------------------------------------------

// Variable to hold the timeout ID for later reference, allowing us to cancel the timeout if needed
let timeoutId;

// Function to handle input event
// We are using a debounce technique to prevent the fetch from happening too often
const onInput = evt => {
    /* 
    Overview:
    1 - Check if there is an existing timeout ID
    2 - First time the user types, this will be undefined and skipped to set a new timeout
    3 - Set a new timeout to delay execution of the fetchData function
    4 - On every input event, the timeout ID will be cleared and a new timeout will be set
    5 - When the user stops typing, the fetchData function will be called with the current value of the input field
    */

    // Check if there is an existing timeout ID
    // First time this will be undefined and skipped to set a new timeout
    if (timeoutId) {
        // If a timeout is already scheduled, clear it to prevent multiple fetches
        // This will prevent the fetch from happening if the user is still typing
        clearTimeout(timeoutId);
    }

    // Set a new timeout to delay execution of the fetchData function
    // This helps in reducing the number of calls to fetchData while typing
    timeoutId = setTimeout(() => {
        // Call fetchData function with the current value of the input field
        // We are trying to fetch data only when the user has stopped typing
        fetchData(evt.target.value);
    }, 500);
};

// Input to search for movies
input.addEventListener('input', onInput);
