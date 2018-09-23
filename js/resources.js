
(function() {
  let resourceCache = {};
 // let loading = [];
  let readyCallbacks = [];
 
 /* load images */
    
  function load(urlOrArr) {
// Argument is an array
    if (urlOrArr instanceof Array) {
        
//Loop through and call private image loader
   urlOrArr.forEach((url) => { _load(url); });
   }
// Not array, should be a string
   else {
     _load(urlOrArr);
   }
  }

/*** load image  ***/
  function _load(url) {
// Already in the cache, therefore, previously loaded
     if (resourceCache[url]) {
       return resourceCache[url]; // Return cached image
      }
// Not previously loaded
      else {
        let img = new Image();   // load new image

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

  // use the cached images
    function get(url) {
      return resourceCache[url];  //Image source to use as reference
    }

//Determines if all of the images requested for loading have been loaded.

 function isReady() {
    let ready = true;   // Check response

 // Iterate through object
      for (const key in resourceCache) {

// No inherited property and not false
        if (resourceCache.hasOwnProperty(key) && !resourceCache[key]) {
          ready = false; //set boolean
        }
      }
        return ready;   // use result of boolean 
    }

//push images not previously stored in cache to the array 
    function onReady(func) {
        readyCallbacks.push(func);  // Place in array
    }

// global functions 
    win.Resources = {
        load,
        get,
        onReady,
        isReady
    };
})();

