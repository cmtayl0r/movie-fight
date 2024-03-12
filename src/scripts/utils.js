// -----------------------------------------------------------------------------
// DEBOUNCE FUNCTION
// -----------------------------------------------------------------------------

// Define a debounce function to limit how frequently a given function can be called.
// It takes two parameters: `func`, the function to debounce, and `delay`
// 'delay' is the amount of time to wait before calling the function.
export const debounce = (func, delay = 1000) => {
    // Variable to hold a reference to the setTimeout call.
    // This is used to clear the timeout if the function is called again before the delay.
    let timeoutId;

    // This returned function is the actual debounced function that will be executed.
    // This function will be called in place of the original function.
    // It passes any arguments it receives to the original function using the spread operator.
    return (...args) => {
        // If there's an existing timeout, clear it.
        // This prevents the function from being called too early.
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // Set a new timeout to call the passed function (`func`) after the specified delay.
        // The function is called with `apply` to allow passing the original arguments (`args`) to it.
        timeoutId = setTimeout(() => {
            func.apply(null, args); // Call the original function with the original arguments
        }, delay);
    };
};
