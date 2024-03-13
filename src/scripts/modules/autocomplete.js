// -----------------------------------------------------------------------------
// DEPENDENCIES
// -----------------------------------------------------------------------------

import { debounce } from '../utils';

// -----------------------------------------------------------------------------
// AUTOCOMPLETE COMPONENT
// -----------------------------------------------------------------------------

export const createAutocomplete = ({
    // Destructure the arguments sent to the function by the config object
    // so that we can use them as variables in the function body.
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData,
}) => {
    // 1 - DOM ELEMENTS

    // The `root` parameter is an object with a `root` property that contains the root element for the autocomplete component.
    root.innerHTML = `
    <label class="label"><b>Search</b></label>
    <input class="input" type="text" placeholder="Type your search" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
    `;
    const acInput = root.querySelector('.input');
    const acDropdown = root.querySelector('.dropdown');
    const acResultsWrapper = root.querySelector('.results');

    // 2 - FUNCTION TO BE DEBOUNCED

    // Function to be called when the input event is triggered.
    // It will be debounced by the `debounce` function (utils.js).

    /**
     * Fetches API data based on the search term and populates the dropdown with the results.
     * @param {*} evt
     * @returns A list of results based on the search term
     */
    // The function to be called when the input event is triggered.
    // It will be debounced by the `debounce` function.

    const onInput = async evt => {
        // Call the `fetchData` function with the value of the input field.
        // we use await here to wait for the `fetchData` function to resolve before continuing.
        const items = await fetchData(evt.target.value);

        // If there are no results, close the dropdown and exit the function early.
        if (!items.length) {
            acDropdown.classList.remove('is-active');
            return; // Exit the function early if there are no results
        }

        // Clear the previous results
        acResultsWrapper.innerHTML = '';

        // Add the `is-active` class to the dropdown to show it.
        acDropdown.classList.add('is-active');

        // loop through the results and create a new `a` element for each one.
        for (let item of items) {
            // Create a new `a` element for each item.
            const acOption = document.createElement('a');
            // Add the `dropdown-item` class to the `a`.
            acOption.classList.add('dropdown-item');
            // Set the inner HTML of the `a` to the result of the `renderOption` function.
            acOption.innerHTML = renderOption(item);
            // Add an event listener to the `a` to handle the click event.
            acOption.addEventListener('click', () => {
                // Close the dropdown
                acDropdown.classList.remove('is-active');
                // Set the input value to the result title
                acInput.value = inputValue(item);
                // Call the `onOptionSelect` function with the selected result
                onOptionSelect(item);
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
        if (!root.contains(evt.target)) {
            acDropdown.classList.remove('is-active');
        }
    });
};
