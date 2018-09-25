// starter code provided by udacity
//tutorial sources https://zoom.us/recording/play/aulotDlzKFegQFIJTaTzKgWvNkVsYtlwO454vL1UPE1Cm6lOUBQCtfVurPOIAGAS?startTime=1529542978000
//https://www.w3schools.com/howto/howto_css_modals.asp

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [
  new Enemy(-(Math.floor(1 + Math.random() * 5)), 1),
  new Enemy(-(Math.floor(1 + Math.random() * 5)), 2),
  new Enemy(-(Math.floor(1 + Math.random() * 5)), 3)
];

// Place the player object in a variable called player
const player = new Player();

// Pass the list of enemies for changing speed and number
allEnemies.forEach((enemy, index, arr) => {
  enemy.addObstacles(arr);
});

// List of possible player sprites
const playerSprites = {
  boy: 'images/char-boy.png',
  catGirl: 'images/char-cat-girl.png',
  hornGirl: 'images/char-horn-girl.png',
  pinkGirl: 'images/char-pink-girl.png',
  princess: 'images/char-princess-girl.png'
};

player.setSpriteBank(playerSprites);

/*******************************/
// controller key assignments
/******************************/

//This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {

  // Allowed keys
  const allowedKeys = {
    37: 'left', // Left arrow
    38: 'up', // Up arrow
    39: 'right', // Right arrow
    40: 'down', // Down arrow
//  13: 'enter'// enter or return
  };

  player.handleInput(allowedKeys[e.keyCode]);

// modal visible when enter key/return key pressed
  if (e.keyCode === 13 && !gameModal.style.display === none) {
    hideModal();    // Remove the modal function
  }
});

/***************************/
/*    Game Panel Functions */
/**************************/
const panel = document.querySelector('.panel');
const level = document.querySelector('.level');
// Set the heart images on the lives panel
function setLives() {
  const lives = document.querySelectorAll('.lifebar img');
//lives will be set to 3
  lives.forEach((life) => {
//player will have 3 hearts on score panel at start of game
    life.src = `./${heart.sprite}`;
  });
}

/********************************************/
//TODO create the acheivement awards function
/*******************************************/


/*************************************/
//            Modal controls        //
/************************************/
// source https://www.w3schools.com/howto/howto_css_modals.asp
const gameModal = document.getElementById('game-modal'); // DOM: Modal
const gameBtn = document.getElementById('game-button');// DOM: Button in modal for either next or again
const closeBtn = document.getElementById('close-game');// DOM: Span close icon


const hideModal = () => {
  gameModal.classList.remove('show');
  gameModal.style.property = "initial"; //initial is display/none
  gameModal.classList.add("hide");
}


 //Dynamically updates the modal message and displays modal
const showModal = () => {
  const modalTitle = document.querySelector('.modal-title');      // DOM: Modal title
  const modalMessage = document.querySelector('.modal-message');  // DOM: Modal message
  const modalLevel = document.querySelector('.modal-level');      // DOM: Current level value in modal message
//check for keep trying or play agan message when player is out of lives
  if (!player.livesEmpty()) {
    modalTitle.innerHTML = 'Great Job Free Ranger!';     // Change title
    modalLevel.innerHTML = String(allEnemies[0].level);   // Change level output
    modalMessage.innerHTML = `You played outside ${modalLevel.outerHTML} time(s) without your parents!`;   // Change message with level element
    gameBtn.innerHTML = 'Keep Playing';     // Change button message

// modal message input and player life reset
} else {
    modalTitle.innerHTML = 'Game Over';
    modalLevel.innerHTML = String(allEnemies[0].level);
    modalMessage.innerHTML = `You completed ${modalLevel.outerHTML} level(s).`;
    gameBtn.innerHTML = 'Try Again';
  }
    gameModal.classList.remove('hide');
    gameModal.classList.add('show');
};


const  displayModal = () => {
  gameModal.style.property="initial";
  gameModal.classList.remove('hide');
  gameModal.classList.add('show');
};


window.onload = function() {
  hideModal();
};

//https://www.w3schools.com/jsref/met_element_addeventlistener.asp
gameBtn.addEventListener("click", hideModal());
