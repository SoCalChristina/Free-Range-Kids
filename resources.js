/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 * Provide by Udacity, https://github.com/udacity/frontend-nanodegree-arcade-game
 * Refactored by Rodrick Bloomfield
 */
(function() {
    let resourceCache = {};
    // let loading = [];
    let readyCallbacks = [];

    /*
     * function to load images
     */
    function load(urlOrArr) {
        // Argument is an array
        if (urlOrArr instanceof Array) {

            // Loop through and call private image loader
            urlOrArr.forEach((url) => { _load(url); });
        }
        // Not array, should be a string
        else {
            _load(urlOrArr);
        }
    }

    /**
     * Private image loader function
     * @param {String} url Path to image to load
     */
    function _load(url) {
        // Already in the cache, therefore, previously loaded
        if (resourceCache[url]) {
            return resourceCache[url];      // Return cached image
        }
        // Not previously loaded
        else {
            let img = new Image();          // Instance of an image

            // Once image has loaded
            img.onload = () => {
                resourceCache[url] = img;   // Place it in cache

                // Check if images are loaded and cached properly
                if (isReady()) {
                    // Call all of the onReady() callbacks defined
                    readyCallbacks.forEach((func) => { func(); });
                }
            };

            resourceCache[url] = false; // Set initial value, changed onload(async)
            img.src = url;              // Set the img src attr to url
        }
    }

    /**
     * Grabs references to images that are known to be cached. Similar to beginning of load(), no check(efficient).
     *Image source to use as reference
     */
    function get(url) {
        return resourceCache[url];
    }

    /**
     * Determines if all of the images requested for loading have been loaded.
     */
    function isReady() {
        let ready = true;   // Check response

        // Iterate through object
        for (const key in resourceCache) {

            // No inherited property and not false(line 54-initial value before load).
            if (resourceCache.hasOwnProperty(key) && !resourceCache[key]) {
                ready = false;
            }
        }
        return ready;   // Return check boolean
    }

    /*
     * Add a function to callback stack.
     * They are called when all requested images are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);  // Place in array
    }

    // Global resource object, make functions publicly accessible.
    window.Resources = {
        load,
        get,
        onReady,
        isReady
    };
})();
