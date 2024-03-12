// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import 'bulma/css/bulma.min.css';
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';

import { debounce } from './utils';

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

// 1 - DEBOUNCE FUNCTION (UTILS)

// 2 - FUNCTION TO BE DEBOUNCED (INPUT EVENT HANDLER)
// The actual function to be called when the input event is triggered.
// It will be debounced by the `debounce` function.
// It calls the `fetchData` function with the value of the input field.
const onInput = evt => {
    fetchData(evt.target.value);
};

// 3 - EVENT LISTENER
// The listener is set to respond to 'input' events, i.e., when the user types into the input field.
// The `debounce` function is used here to wrap the `onInput` function, effectively debouncing it.
// This means `onInput` will only be called 500 milliseconds after the user stops typing, reducing the frequency of potentially expensive `fetchData` calls
// You could use this for other events, such as 'scroll' or 'resize', to limit the frequency of event handlers.
input.addEventListener('input', debounce(onInput, 500));
