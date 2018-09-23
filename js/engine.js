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
 * Provide by Udacity, https://github.com/udacity/frontend-nanodegree-arcade-game
 * code sources Rodrick Bloomfield, https://zoom.us/recording/play/aulotDlzKFegQFIJTaTzKgWvNkVsYtlwO454vL1UPE1Cm6lOUBQCtfVurPOIAGAS?startTime=1529542978000
 */
const Engine = ((global) => {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  const doc = global.document; // global document access
  const win = global.window; // global window access
  const canvas = doc.createElement('canvas'); // Canvas element
  const ctx = canvas.getContext('2d'); // Context for adding canvas content
  const panel = document.createElement('panel'); // Panel element
  const footer = document.createElement('footer'); // Footer element
//  const div = document.getElementById(div)
  let lastTime; // Holds previouse iteration time for calculating dt
  let xOffset; // entity x-axis respnsive offset  responsive
  let yOffset; // entity y-aixs responsive offset
  let imgWidth; // to calculate repsonsive image width
  let imgHeight; // to calculate repsonsive image height
//set canvas to document body

  setDimensions(); // Set and add canvas to the DOM
  doc.body.appendChild(canvas);
/*
  const gameCanvas =document.getElementById('gameCanvas');
  canvas.appendChild(gameCanvas);

*/
  // source for resizing:  zoom.us/recording/play/aulotDlzKFegQFIJTaTzKgWvNkVsYtlwO454vL1UPE1Cm6lOUBQCtfVurPOIAGAS?startTime=1529542978000
 // Sets all dimensions for proper rendering on all devices
  function setDimensions() {
    /*\ Check out the screen state  ----------*/
    const isSmallWindow = window.innerWidth < 500; // Board will overflow on x-axis
    const isShortWindow = window.innerHeight < 600; // Board will overflow on y-axis
    const isLandscape = window.innerHeight < window.innerWidth; // Screen is in landscape mode


    /****************************/
    /*  Set canvas dimensions   */
    /****************************/

    // Set canvas width
    canvas.width = isLandscape // Is the screen in landscape
      ? isSmallWindow // Landscape: Is in x-axis overflow
        ? window.innerWidth * 0.8 : 500 // 80% of window width or default
      : isSmallWindow // No landscape: Is in x-axis overflow
        ? window.innerWidth * 0.95 : 500; // 95% of window width or default

// Set canvas // Id

    canvas.id = "gameCanvas";
    canvas.style.margin = "auto";

// Set canvas height. y-axis overflow ? 95% window height : default
    canvas.height = isShortWindow ? window.innerHeight * 0.95 : 600;
    // make sure the score board panel width = canvas width
    var panel = document.getElementById('panel');
    panel.style.width = `${canvas.width}px`; // Set game stats panel size
// make sure game instructions footer width = canvas width
var footer = document.getElementById('footer');
footer.style.width = `${canvas.width}px`; // Set game instructions footer size
/*******************************************/
/* Calculate offsets to for image position */
/*******************************************/

    // Calculate x-axis offset. x-axis overflow ? 1/5 window width :  default
    xOffset = isSmallWindow ? canvas.width / 5 : 100;

    // Calculate y-axis offset. y-axis overflow ? 1/7 window height : default
    yOffset = isShortWindow ? canvas.height / 7 : 85;

/****************************************************/
/* Calculate image sizes to handle smaller screens  */
/****************************************************/
    // Calculate image width
    imgWidth = isLandscape // Is the screen in landscape
      ? isSmallWindow // x-axis overflow
        ? xOffset : 100 // x-axis offset or default
          : xOffset; // No landscape: x-axis offset

    // Calcualte image height. In landscape and x-axis overflow ? x1.9 of y-axis offset : default
    imgHeight = isLandscape && isShortWindow ? yOffset * 1.9 : 161;

    // Adjust all enemies for new board size
    allEnemies.forEach((enemy) => {
      // If x-axis overflow or landscape ? set new dimensions : default
      isSmallWindow || isLandscape ? enemy.setDimensions(imgWidth * 0.99, imgHeight * 0.38, imgWidth, imgHeight) : '';
    });

    // Adjust player dimensions for new board for landscape
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
    let now = Date.now(); // Current time
    let dt = (now - lastTime) / 1000.0; // Change in time(Δt), time reference for animations
    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt); // Call update with time delta
    render(); // Call render
    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
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
    reset(); // reset all assets
    lastTime = Date.now(); // Set initial value for first time delta
    main(); // Call entry point
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
    updateEntities(dt); // Handle any updates
    checkCollisions(); // Check for any collisions
    checkSurvival(); // Check for a survival
    checkGameOver(); // Check if the game is over
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
    // array of immages to display canvas
    const rowImages = [
            'images/grass-block.png', // Top row is water
            'images/stone-block.png', // Row 1 of 3 of stone
            'images/stone-block.png', // Row 2 of 3 of stone
            'images/stone-block.png', // Row 3 of 3 of stone
            'images/grass-block.png', // Row 1 of 2 of grass
            'images/grass-block.png' // Row 2 of 2 of grass
        ];
    const numRows = 6; // # of rows for level
    const numCols = 5; // # of cols for level
    let row, col; // Trackers

    // Before drawing, clear existing canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear existing canvas

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
    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    renderEntities();
  }

  /**
   * Draw enemies and player to screen
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    allEnemies.forEach((enemy) => {
      enemy.render();
    });

    player.render(); // Render the player
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

   //Check for player/enemy collision

  function checkCollisions() {
    allEnemies.forEach((enemy) => {
      if (enemy.checkCollisions(player) || player.checkCollisions(enemy)) {
        reset();
        player.loseLife();
      }
    });
  }


// Check for player survival

  function checkSurvival() {
    if (player.win) {
      showModal(); // Show the survival modal
      viewModal();
      reset(); // Reset all

      //TODO add function to award achievements
      // achievement.awarded();

      // Increase all enemies level
      allEnemies.forEach((enemy) => {
        enemy.levelUp();
      });

      level.innerHTML = allEnemies[0].level; // Update the level in stats panel
    }
  }


   // Checks if the game is over and resets everything no more lives

  function checkGameOver() {
    // Is the user out of lives
    if (player.livesEmpty()) {
      showModal(); // Show the gameOver modal
      viewModal();
      player.gameOver(); // Game Over for the player
      reset(); // Reset all entities
      allEnemies = allEnemies.slice(0, 3); // reset inital number of enemies to 3

      allEnemies.forEach((enemy) => {
        enemy.level = 1; // Reset enemy levels
      });

      level.innerHTML = allEnemies[0].level; // Reset level number of stats panel
    }
  }

  // Load the used images
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

  Resources.onReady(init); // Start game when all images load
  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx; // Global acces to canvas context

  /*
   * EventListener: Handle canvas fitting to new window size
   */
  window.onresize = () => {
    const isSmallWindow = window.innerWidth < 500; // Board will overflow on x-axis
    const isShortWindow = window.innerHeight < 600; // Board will overflow on y-axis
    isSmallWindow || isShortWindow ? setDimensions() : ''; // Either one change board dimensions
    panel.style.width = `${canvas.width}px`; // Match stats panel width with canvas
    footer.style.width = `${canvas.width}px`; // Match footer width with canvas width
  };

})(this);
