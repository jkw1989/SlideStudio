/**
 * Creates a debounced version of a function that delays execution
 * until the specified delay has passed without being called again.
 *
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} The debounced function with a cancel method
 */
export function debounce(func, delay) {
    let timeoutId = null;
    let lastArgs = null;
    let lastThis = null;

    function debounced(...args) {
        lastArgs = args;
        lastThis = this;

        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(lastThis, lastArgs);
            timeoutId = null;
        }, delay);
    }

    debounced.cancel = function () {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    debounced.flush = function () {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            func.apply(lastThis, lastArgs);
            timeoutId = null;
        }
    };

    return debounced;
}

/**
 * Creates a throttled version of a function that can only be called
 * at most once every specified delay milliseconds.
 *
 * @param {Function} func - The function to throttle
 * @param {number} delay - The minimum delay in milliseconds between calls
 * @returns {Function} The throttled function with a cancel method
 */
export function throttle(func, delay) {
    let lastCallTime = 0;
    let timeoutId = null;
    let lastArgs = null;
    let lastThis = null;

    function throttled(...args) {
        lastArgs = args;
        lastThis = this;

        const now = Date.now();
        const timeSinceLastCall = now - lastCallTime;

        if (timeSinceLastCall >= delay) {
            func.apply(lastThis, lastArgs);
            lastCallTime = now;
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        } else if (timeoutId === null) {
            const remainingDelay = delay - timeSinceLastCall;
            timeoutId = setTimeout(() => {
                func.apply(lastThis, lastArgs);
                lastCallTime = Date.now();
                timeoutId = null;
            }, remainingDelay);
        }
    }

    throttled.cancel = function () {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        lastCallTime = 0;
    };

    return throttled;
}
