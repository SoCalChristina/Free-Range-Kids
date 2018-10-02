
/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

/*
 * starter code Provided by Udacity, https://github.com/udacity/frontend-nanodegree-arcade-game
 * code sources https://zoom.us/recording/play/aulotDlzKFegQFIJTaTzKgWvNkVsYtlwO454vL1UPE1Cm6lOUBQCtfVurPOIAGAS?startTime=1529542978000
 *
 * starter code Provided by Udacity, https://github.com/udacity/frontend-nanodegree-arcade-game
 * code sources https://zoom.us/recording/play/aulotDlzKFegQFIJTaTzKgWvNkVsYtlwO454vL1UPE1Cm6lOUBQCtfVurPOIAGAS?startTime=1529542978000
*/

const Engine = ((global) => {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    const doc = global.document;
    const win = global.window;
    const canvas = doc.createElement('canvas');
    const ctx = canvas.getContext('2d');        // add canvas content
    let lastTime;                               // time input used for dt
    let xOffset;                                // x-axis offset for responsive asset placement
    let yOffset;                                // y-aixs offset for responsive asset placement
    let imgWidth;                               // Used for repsonsive image width
    let imgHeight;                              // Used for repsonsive image height


    setDimensions();
    doc.body.appendChild(canvas);

    /**
     * Sets all dimensions to render on multiple screen sizes
     */
    function setDimensions() {
        /*----------  Check out the screen state  ----------*/
        const isSmallWindow = window.innerWidth < 505;              // Board will overflow on x-axis
        const isShortWindow = window.innerHeight < 606;             // Board will overflow on y-axis
        const isLandscape = window.innerHeight < window.innerWidth; // Screen is in landscape mode


      /**
      * Set Canvas Sizes by Screen Sizes
      */
        // Set canvas width
        canvas.width = isLandscape                  // Is the screen in landscape
            ? isSmallWindow                         // Landscape: Is in x-axis overflow
                ? window.innerWidth * 0.8 : 505     // 80% of window width or default
            : isSmallWindow                         // No landscape: Is in x-axis overflow
                ? window.innerWidth * 0.95 : 505;   // 95% of window width or default

        // Set canvas height. y-axis overflow ? 98% window height : default
        canvas.height = isShortWindow ? window.innerHeight * 0.98 : 606;
        panel.style.width = `${canvas.width}px`;    // Set game stats panel size
        footer.style.width = `${canvas.width}px`;

        // Calculate window width for x and y axis
        xOffset = isSmallWindow ? canvas.width / 5 : 101;

        // Calculate window height for x and y axis
        yOffset = isShortWindow ? canvas.height / 7 : 83;


        // calculate sprite/img ratios for small screens

        // Calculate image width
        imgWidth = isLandscape  // Is the screen in landscape
            ? isSmallWindow     // x-axis overflow
                ? xOffset : 101 // x-axis offset or default
            : xOffset;          // No landscape: x-axis offset

        // calculate landscape sprite/img height
        imgHeight = isLandscape && isShortWindow ? yOffset * 1.9 : 171;


      //adjust sprite sizes in ratio to board size
        allEnemies.forEach((enemy) => {

            isSmallWindow || isLandscape ? enemy.setDimensions(imgWidth * 0.99, imgHeight * 0.38, imgWidth, imgHeight) : '';
        });

        // Adjust player ratio for board size
        isLandscape ? player.setDimensions(imgWidth * 1.02, imgHeight * 0.42, imgWidth * 0.9, imgHeight) : player.setDimensions(imgWidth * 0.99, imgHeight * 0.38, imgWidth, imgHeight);
    }

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        let now = Date.now();
        let dt = (now - lastTime) / 1000.0;
        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        lastTime = now; // To determine time delta at next iteration of function
        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = Date.now();
        main();
    }
    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
      function update(dt) {
        updateEntities(dt); // udpate data
        checkCollisions();  // Check for collisions
        checkSurvival();     // Check if player crossed the road
        checkGameOver();    // Check if the game is over
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach((enemy) => {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
/* TODO add row of stars on the top row for player to collect */
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        const rowImages = [
            'images/grass-block.png',   // Top row is grass
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ];
        const numRows = 6;  // # of rows for level
        const numCols = 5;  // # of cols for level
        let row, col;       // reference

        // Before drawing, clear existing canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);   // Clear existing canvas
        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                 ctx.drawImage(Resources.get(rowImages[row]), col * xOffset, row * yOffset, imgWidth, imgHeight);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach((enemy) => {
            enemy.render();
        });

        player.render();    // Render the player
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        allEnemies.forEach((enemy) => {
            enemy.reset();
        });
        player.reset();
    }

    /*
     *Check for player/enemy collision
     */
    function checkCollisions() {
        allEnemies.forEach((enemy) => {
            if (enemy.checkCollisions(player) || player.checkCollisions(enemy)) {
                reset();
                player.loseLife();
            }
        });
    }

    /*
     * Check for player survival
     */
    function checkSurvival() {
        if (player.win) {
            showModal();    // Show the survival modal
            reset();        // Reset all
            // Increase all enemies level
            allEnemies.forEach((enemy) => {
                enemy.levelUp();
            });

            level.innerHTML = allEnemies[0].level;  // Update the level in stats panel
        }
    }

    /*
     * Checks if the game is over and resets everything no more lives
     */
    function checkGameOver() {
        // Is the user out of lives
        if (player.livesEmpty()) {
            showModal();                            // Show the gameOver modal
            player.gameOver();                      // Game Over for the player
            reset();                                // Reset all entities
            allEnemies = allEnemies.slice(0, 3);    // Reset number of enemies to original start

            allEnemies.forEach((enemy) => {
                enemy.level = 1;                    // Reset enemy levels
            });

            level.innerHTML = allEnemies[0].level;  // Reset stats panel
        }
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/sun.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/gem-blue.png',
        'images/gem-green.png',
        'images/gem-orange.png',
        'images/star.png',
        'images/key.png',
        'images/heart.png'
    ]);

    Resources.onReady(init);    // Start game when all images load
    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;           // Global acces to canvas context

    /*
     * EventListener: Handle canvas fitting to new window size
     */
    window.onresize = () => {
        const isSmallWindow = window.innerWidth < 500;              // Board will overflow on x-axis
        const isShortWindow = window.innerHeight < 650;             // Board will overflow on y-axis
        isSmallWindow || isShortWindow ? setDimensions() : '';      // Either one change board dimensions
        panel.style.width = `${canvas.width}px`;
          footer.style.width = `${canvas.width}px`;                  // Match stats panel width with canvas
    };

})(this);
