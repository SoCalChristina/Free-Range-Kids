// Enemies our player must avoid
//var Enemy = function() { this is the code snippet provided in the starter file

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    // this.sprite = 'images/enemy-bug.png';

function Enemy(sprite, name, x, y, speed) {  // constructor function Enemy object
  this.sprite = sprite;
  this.name = name;
  this.x = x;
  this.y = y;
  this.speed = speed;
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks - make sure the game runs at the same speed on all browsers
Enemy.prototype.update = function(dt) {
  this.x += 1;
  if (this.x > 500) {
    this.x = -100;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player(sprite, name, x, y) {
  Player.sprite = sprite;
  Player.name = name;
  Player.x = x;
  Player.y = y;
}

Player.prototype.update = function(dt) {
    this.x += 1;
    if (this.x > 500) {
      this.x = 0;
    }
  };
// You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

 Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  Player.prototype.handleInput = function(dt) {
  switch (dt) {
    case "up":
    this.y -= 70;
    break;
    case "down":
    this.y += 70;
    break;
    case "left":
    this.x -= 70;
    break;
    case "right":
    this.x += 70;
    break;
  }
  };

// Now instantiate your Enemy objects.
var Enemy1 = new Enemy('images/enemy-bug.png', 'Fast', 'x', 'y', 'speed');
var Enemy2 = new Enemy('images/enemy-bug.png', 'Faster', 'x', 'y', 'speed');
var Enemy3 = new Enemy('images/enemy-bug.png', 'Fastest', 'x', 'y', 'speed');
//var Enemy4 = new Enemy('images/enemy-bug.png', 'Enemy4', 'x', 'y', 'speed'); I added two addtional Enemy objects that I may decide to use later
//var Enemy5 = new Enemy('images/enemy-bug.png', 'Enemy5', 'x', 'y', 'speed');

// Place all enemy objects in an array called allEnemies
// Place all enemy objects in an array called allEnemies
let allEnemies = [
  {Enemy: ["Enemy1", "Enemy2", "Enemy3"]} //I'm starting with 3 Enemies but can add more later if needed
  ];

// Place the player object in a variable called player
// Now instantiate your Player objects.
var player1 = new Player('images/char-antenna-boy.png', 'Antenna Boy', 'male', 'x', 'y');
var player2 = new Player('images/char-cat-girl.png', 'Cat Girl', 'female', 'x', 'y');
var player3 = new Player('images/char-horn-girl.png', 'Horn Girl', 'female', 'x', 'y');
var player4 = new Player('images/char-pink-girl.png', 'Pink Girl', 'female', 'x', 'y');
var player5 = new Player('images/char-princess-girl.png', 'Princess Girl', 'female', 'x', 'y');


// Place all player obhects in an array called allPlayers
let allPlayers = [{Player: ['Player1', 'Player2', 'Player3']}];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
