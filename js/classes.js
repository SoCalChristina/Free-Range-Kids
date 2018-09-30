/* Classes.js*/
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

    /**
     * Sets the entity's dimensions based on game board dimensions
     */
    setDimensions(xOffset, yOffset, imgWidth, imgHeight) {
        this.xOffset = xOffset;     // set x-axis offset
        this.yOffset = yOffset;     // set y-axis offset
        this.imgWidth = imgWidth;   // set image width
        this.imgHeight = imgHeight; // set image height
    }

    /**
     * Draw the entity on the screen
     */
    render() {
        // draw spirte on board
        ctx.drawImage(Resources.get(this.sprite), this.x * this.xOffset, this.y * this.yOffset, this.imgWidth, this.imgHeight);
    }

    /*
    * check collisions
    */
    checkCollisions(playerOrEnenmy) {

        // are player and enemy on the same y-axis position
        if (this.y === playerOrEnenmy.y) {

            // Checks if enemy and player share a relatively similar positon
            if (this.x >= playerOrEnenmy.x - 0.5 && this.x <= playerOrEnenmy.x + 0.5) {
                return true;    // Collision
            }
        }

        else {
            return false;       // No collision
        }
    }
  }

//  Enemy properties

class Enemy extends Entity {
    /**
     * @constructor
     * new Enemy
     * @param {Number} x Initial horizontal-axis position
     * @param {Number} y Initial vertical-axis position(1-3)
     */
    constructor(x, y) {
        super();
        this.sprite = 'images/enemy-bug.png';           // Image path
        this.x = x;                                     // x-axis position
        this.y = y * 1.15;                              // y-axis position w/ offset
        this.level = 1;                                 // Current level
        this.pace = Math.floor(this.level + Math.random() * this.level);  // Rate of movement
        this.nest = [];
    }

    /**
     * Update enemies position
     * @param {Number} dt Used for consistent animation
     */
    update(dt) {
        // Check is the enemy is off the right side of the board
        if (this.x > 5) {
            this.reset();
        }
        // Not off the right side of the board
        else {
            this.x = this.x + this.pace * dt;  // Move to the right relative to pace and dt
        }
    }

    /**
     * Change the rate of enemy travel
     */
    changePace(max) {
        this.pace = 0.5 + Math.random() * max;  // Change its pace
    }

    /**
     * Start the enemy's cylce over at a diffent pace
     */
    reset() {
        this.changePace(3.0);
        this.x = -(Math.floor(1 + Math.random() * 5));  // Reset on other side
    }

    /**
     * Sets the pool of enemies for manipulation on leveling up
     * @param {Array} nest Pool of enemies
     */
    addNest(nest) {
        this.nest = nest;
    }

    /**
     * Changes level and enemy count
     */
    levelUp() {
        this.level++;   // add enemies with each level

        // Randomizing the event of adding another enemy
        if (this.level % 2 === 0 && Math.floor(Math.random() * 5) === 3) {
            this.nest.push(new Enemy(-(Math.floor(1 + Math.random() * 5)), this.y / 1.15)); // Creates another enemy on the same line
        }
    }
}

/*
* Player Class
 */
class Player extends Entity {
    constructor() {
        super();                                // Call super class constructor
        this.sprite = 'images/char-boy.png';    // Set sprite info
        this.x = 2;                             // Set x-axis placement
        this.y = 5 * 1.15;                      // Set y-axis placement
        this.moving = false;                    // Tracking movement in progress
        this.win = false;                       // Tracks win situation
        this.lives = 3;                         // Number of lives
    }

    /**
     * Update player's position
     */
    update() {
        // Not in the middle of rendering a move and stop loops on winning moves
        if (!this.moving && !this.win) {
            this.checkVictory();    // Check if in winning position
        }
    }

    /**
     * Draw the player on screen
     */
    render() {
        super.render();         // Super class render method
        this.moving = false;    // Ack that the move rendered
    }

    /*
     * Controls user input to move player
     * @param {String} input Direction of change
     */
    handleInput(input) {
        // Handle different direction inputs
        switch (input) {
            case 'left':
                this.x = this.x > 0 ? this.x - 1 : this.x;          // Move left one block until the edge of the board
                break;
            case 'up':
                this.y = this.y > 0 ? this.y - 1 * 1.15 : this.y;   // Move up one block until the edge of the board
                break;
            case 'right':
                this.x = this.x < 4 ? this.x + 1 : this.x;          // Move right one block until the edge of the board
                break;
            case 'down':
                this.y = this.y < 5 ? this.y + 1 * 1.15 : this.y;   // Move down one block until the edge of the board
                break;
            default:
                break;
        }
        this.moving = true; // Ack that a move is in progress until re-rendered
    }

    /**
     * Reset the player to start position
     */
    reset() {
        this.x = 2;         // Start x-axis position
        this.y = 5 * 1.15;  // Start y-axis position
        this.win = false;   // Reset victory tracker
    }

    /**
     * Checks the players position to see if they win
     */
    checkVictory() {
        this.y === 0 ? player.victory() : '';   // If at water(top of the board) victory, otherwise, nothing
    }

    /**
     * Events when player hits the water on the board
     */
    victory() {
        this.win = true;    // Ack victory
    }

    /**
     * Removes player lives and updates the life meter
     */
    loseLife() {
        // Only decrement when greater than zero
        if (this.lives > 0) {
            this.lives--;                                               // decrement lives
            const lives = document.querySelectorAll('.lifebar img');    // Get the life meter
            lives[this.lives].classList.toggle('hide');                 // Remove one life on screen
        }
    }

    /**
     * Checks there are no more lives left
     */
    livesEmpty() {
        return this.lives === 0 ? true : false;
    }

    /**
     * Handles message and player life reset
     */
    gameOver() {
        this.lives = 3;                                             // Reset life count
        const lives = document.querySelectorAll('.lifebar img');    // Grab the life meter

        lives.forEach((life) => {
            life.classList.remove('hide');                          // Show all life icons
        });
    }
}
