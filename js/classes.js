/*
 * Create a class for the game objtects
 */
class Entity {
    constructor() {
        this.sprites = [];      // Bank of possible sprites
        this.sprite = '';       // Image path
        this.x = 0;             // x-axis position
        this.y = 0;             // y-axis position
        this.xOffset = 100;     // x-axis offset, to center in box
        this.yOffset = 65;      // y-axis offset, to center in box
        this.imgWidth = 101;    // sprite image width
        this.imgHeight = 171;   // sprite image height
    }


// Sets the entity's dimensions based on game board dimensions

    setDimensions(xOffset, yOffset, imgWidth, imgHeight) {
        this.xOffset = xOffset;     // set x-axis offset
        this.yOffset = yOffset;     // set y-axis offset
        this.imgWidth = imgWidth;   // set image width
        this.imgHeight = imgHeight; // set image height
    }

// Draw the entity on the screen

    render() {
        // draw spirte on board
        ctx.drawImage(Resources.get(this.sprite), this.x * this.xOffset, this.y * this.yOffset, this.imgWidth, this.imgHeight);
    }


// Check if there is a collision with the player set to a boolean

  checkCollisions(playerOrEnenmy) {

// Checks if they are on the same y-axis position
    if (this.y === playerOrEnenmy.y) {

      // set parameters for proximity of enemy and player on the canvas
      if (this.x >= playerOrEnenmy.x - 0.5 && this.x <= playerOrEnenmy.x + 0.5) {
        return true; // Collision
      }
    }

// No collision occurs when on same x or y axis
    else {
      return false; // No collision
    }
  }

  /*********************************************************
   *  TODO Create a class with an array of award sprites
   *********************************************************/


  /*******************************************/
  // TODO Create a class for the life hearts
  /******************************************/


// create an array of player sprites

  setSpriteBank(bank) {
    this.sprites = bank;
  }
}
//  Enemy properties

  class Enemy extends Entity {
    constructor(x, y) {
      super();
      this.sprite = 'images/enemy-bug.png'; // Image path
      this.x = x; // x-axis position
      this.y = y * 1.15; // y-axis position w/ offset
      this.level = 1; // Current level
      this.pace = Math.floor(this.level + Math.random() * this.level); // Rate of movement
      this.obstacles = [];
    }


// Update the enemy's position using dt
  update(dt) {
// Check is the enemy is off the right side of the board
    if (this.x > 5) {
      this.reset();
    }
// Not off the right side of the board
    else {
      this.x = this.x + this.pace * dt; // Move to the right relative to pace and dt
    }
  }

// Set a random speed for enemy object
  changePace(max) {
    this.pace = 0.5 + Math.random() * max; // Change its pace
  }

// Set different pace when enemy loops back to 0 x-axis
  reset() {
    this.changePace(3.0);
    this.x = -(Math.floor(1 + Math.random() * 5)); // Reset on other side
  }

// set function to change enemy proprerties
  addObstacles(obstacles) {
    this.obstacles = obstacles;
  }

// Set random number of active enemy objects
  levelUp() {
    this.level++; // add enemies with each level

// Use value of random function to push additoinal enemies into play

   if (this.level % 2 === 0 && Math.floor(Math.random() * 5) === 3) {
      // Creates another enemy on the same line
      this.obstacles.push(new Enemy(-(Math.floor(1 + Math.random() * 5)), this.y / 1.15));
    }
  }
}

// Create class for player objtect and properties
  class Player extends Entity {
    constructor() {
      super(); // Call super class constructor
      this.sprite = 'images/char-horn-girl.png'; // Set sprite info
      this.x = 2; // Set x-axis placement
      this.y = 5 * 1.15; // Set y-axis placement
      this.moving = false; // Tracking movement in progress
      this.win = false; // Tracks win situation
      this.lives = 3; // Number of lives
      this.award = 5; // this will be used for future achievement section
      this.heart = 'images/heart.png'; // number of heart images will correspond to number of lives
    }

// Update player's position

    update() {
        // player stopped moving and is at a game level ending event
        if (!this.moving && !this.win) {
          this.checkSurvival(); // Check if in winning position
        }
      }

//  Draw the player on screen
    render() {
      super.render(); // Super class render method
      this.moving = false; // Ack that the move rendered
    }

 //Controls user input to move player
    handleInput(input) {
      // Handle different direction inputs
      switch (input) {
      case 'left':
        this.x = this.x > 0 ? this.x - 1 : this.x; // Move left one block until the edge of the board
        break;
      case 'up':
        this.y = this.y > 0 ? this.y - 1 * 1.15 : this.y; // Move up one block until the edge of the board
        break;
      case 'right':
        this.x = this.x < 4 ? this.x + 1 : this.x; // Move right one block until the edge of the board
        break;
      case 'down':
        this.y = this.y < 5 ? this.y + 1 * 1.15 : this.y; // Move down one block until the edge of the board
        break;
      default:
        break;
      }
      this.moving = true; // confirm entities moving
    }

// Reset the player to start position
    reset() {
      this.x = 2; // Start x-axis position
      this.y = 5 * 1.15; // Start y-axis position
      this.win = false; // Reset Survival data
    }


  // Checks the players position to see if they win
    checkSurvival() {
      this.y === 0 ? player.Survival() : ''; // If at water(top of the board) survival, otherwise, nothing
    


// Events when player hits the water on the board
    survival() {
      this.win = true; // boolean set
    }

// Removes player lives and updates the life meter
    loseLife() {
      // Only decrement when greater than zero
      if (this.lives > 0) {
        this.lives--; // decrement lives
        const lives = document.querySelectorAll('.lifebar img');
        lives[this.lives].classList.toggle('hide'); // change class to remove one life on screen
      }
    }


//Checks there are no more lives left
    livesEmpty() {
      return this.lives === 0 ? true : false;
    }


  // modal message input and player life reset
    gameOver() {
      this.lives = 0; // Reset life count
      const lives = document.querySelectorAll('.lifebar img'); // Grab the life meter

      lives.forEach((life) => {
        life.classList.remove('hide'); // refresh all life icons
      });
    }
  }
