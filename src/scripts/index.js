// TODO: Create a refactoring branch
// TODO: Show no results found on autocomplete
// TODO: Add a loading spinner
// TODO: Add a placeholder image for movies with no poster
// TODO: Refactor the code to use a class-based approach, modules and MVC pattern (?)

// -----------------------------------------------------------------------------
// IMPORTS
// -----------------------------------------------------------------------------

//
import 'bulma/css/bulma.min.css';
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';

import { API_KEY, API_URL } from './config';
import { createAutocomplete } from './modules/autocomplete';
import { placeholder } from './config';

// Parcel
if (module.hot) {
    module.hot.accept;
}

// -----------------------------------------------------------------------------
// MOVIE DETAILS / SUMMARY
// -----------------------------------------------------------------------------

let leftMovie;
let rightMovie;

// Helper function to fetch the selected movie details
export const onMovieSelect = async (movie, summaryEl, side) => {
    const response = await axios.get(API_URL, {
        params: {
            apikey: API_KEY,
            i: movie.imdbID,
        },
    });

    // Create the movie details template and set it to the specified left or right summary element
    summaryEl.innerHTML = movieTemplate(response.data);

    // Set the movie details to the correct side
    if (side === 'left') {
        console.log('Left movie selected');
        leftMovie = response.data;
    } else {
        console.log('Right movie selected');
        rightMovie = response.data;
    }
    if (leftMovie && rightMovie) {
        console.log('Both movies have been selected');
        // If both movies have been selected, run the comparison
        runComparison();
    }
};

// Helper function to compare the selected movies
const runComparison = () => {
    console.log('Comparing movies...');
    // Get the left and right side stats
    // Get all the elements with the class `notification` inside the left and right summary elements
    const leftSideStats = document.querySelectorAll(
        '#left-summary .notification'
    );
    const rightSideStats = document.querySelectorAll(
        '#right-summary .notification'
    );

    // if both movies have been selecteda
    if (leftMovie && rightMovie) {
        // Compare the movie details and highlight the winning stats
        // Loop through the left side stats and compare them to the right side stats
        leftSideStats.forEach((leftStat, index) => {
            // Get the right side stat at the same index
            const rightStat = rightSideStats[index];
            // Parse the values to integers
            const leftValue = parseInt(leftStat.dataset.value);
            const rightValue = parseInt(rightStat.dataset.value);
            // If the right value is greater than the left value, add the `is-primary` class to the right stat
            // else, add the `is-primary` class to the left stat
            if (rightValue > leftValue) {
                leftStat.classList.remove('is-primary');
                leftStat.classList.add('is-warning');
            } else {
                rightStat.classList.remove('is-primary');
                rightStat.classList.add('is-warning');
            }
        });
    }
};

// Helper function to create the movie details template
const movieTemplate = movieDetail => {
    // Parse the movie details to the correct data types
    const dollars = parseInt(
        // Remove the dollar sign and commas from the Box Office value
        `${movieDetail.BoxOffice}`.replace(/\$/g, '').replace(/,/g, '')
    );
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(
        //
        `${movieDetail.imdbVotes}`.replace(/,/g, '').replace('N/A', '0')
    );
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        // Split the awards string into an array of words and reduce it to a single value
        // prev is the previous value, word is the current word
        const value = parseInt(word);
        // If the value is not a number, return the previous value
        if (isNaN(value)) {
            // If the value is not a number, return the previous value
            return prev;
        } else {
            // If the value is a number, add it to the previous value
            return prev + value;
        }
    }, 0); // Start the reduce with a previous value of 0

    // Return the movie details template
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
        <article data-value="${awards}" class="notification is-primary" >
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value="${dollars}" class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value="${metascore}" class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value="${imdbRating}" class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value="${imdbVotes}" class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};

// -----------------------------------------------------------------------------
// AUTOCOMPLETE INITIALIZATION
// -----------------------------------------------------------------------------

const autocompleteConfig = {
    // Unique config to send to the createAutocomplete function
    // Can be used for multiple autocomplete components
    renderOption(movie) {
        const imgSRC = movie.Poster === 'N/A' ? placeholder : movie.Poster;
        return `
            <img src="${imgSRC}" alt="${movie.Title} poster" />
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie) {
        // Set the input value to the selected movie title
        return movie.Title;
    },
    async fetchData(searchTerm) {
        // Fetch data from the API based on the search term with async/await
        try {
            const response = await axios.get(API_URL, {
                // params send a query string to the API with specific parameters
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
};

const init = function () {
    createAutocomplete({
        // make a copy of the `autocompleteConfig` object and add a new property
        ...autocompleteConfig, // Spread the `autocompleteConfig` object
        // Add a unique root property to the object
        root: document.querySelector('#left-autocomplete'),
        onOptionSelect(movie) {
            // Hide the tutorial when a movie is selected
            document.querySelector('.tutorial').classList.add('is-hidden');
            // Call the `onMovieSelect` function with the selected movie
            // Send the selected movie and the left summary element
            onMovieSelect(
                movie,
                document.querySelector('#left-summary'),
                'left'
            );
        },
    });
    createAutocomplete({
        // make a copy of the `autocompleteConfig` object and add a new property
        ...autocompleteConfig, // Spread the `autocompleteConfig` object
        // Add a unique root property to the object
        root: document.querySelector('#right-autocomplete'),
        onOptionSelect(movie) {
            // Hide the tutorial when a movie is selected
            document.querySelector('.tutorial').classList.add('is-hidden');
            // Call the `onMovieSelect` function with the selected movie
            // Send the selected movie and the right summary element
            onMovieSelect(
                movie,
                document.querySelector('#right-summary'),
                'right'
            );
        },
    });
};
document.addEventListener('DOMContentLoaded', init);
