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
//    13: 'enter'// enter or return
  };

  player.handleInput(allowedKeys[e.keyCode]);

// The 'Enter' key is pressed and the modal is visible
  if (e.keyCode === 13 && !gameModal.style.display === hidden) {
        hideModal();    // Remove the modal
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


  lives.forEach((life) => {

    life.src = `./${heart.sprite}`;
  });
}

/********************************************/
//TODO create the acheivement awards function
/*******************************************/

/*************************************/
//            Modal controls        //
/************************************/
const gameModal = document.getElementById('game-modal'); // DOM: Modal
const closeModal = document.getElementById('closeGame');  // DOM: Close button in modal
const gameBtn = document.getElementById('game-button');// DOM: Button in modal for either next or again

gameModal.classList.add("show", "hide");

 // Moves the modal out of view
const hideModal = () => {
    if(gameModal.style.display == 'show') { // if gameModal displayed,
      gameModal.style.display = 'none';   // change display style to none
  };
}

const viewModal = () => {
      if(gameModal.style.display == 'none') {
          gameModal.style.display = 'show';
       };
     }

//element.classList.toggle("classToRemove", false);
//Add a class: element.classList.toggle("classToAdd", true);

//closeModal.addEventListener.click(closeModal (hideModal())); // Hide modal on close button click
//modalBtn.addEventListener.click(hideModal());  // Hide modal on continue button click

//window.onclick = hideModal;
/**
 * Dynamically updates the modal and brings it into view
 */
const showModal = () => {
    const modalTitle = document.querySelector('.modal-title');      // DOM: Modal title
    const modalMessage = document.querySelector('.modal-message');  // DOM: Modal message
    const modalLevel = document.querySelector('.modal-level');      // DOM: Current level value in modal message

    // Not a GameOver
    if (!player.livesEmpty()) {
        modalTitle.innerHTML = 'Great Job Free Ranger!';                                  // Change title
        modalLevel.innerHTML = String(allEnemies[0].level);                         // Change level
        modalMessage.innerHTML = `You played outside ${modalLevel.outerHTML} time(s) without your parents!`;    // Change message with level element
        gameBtn.innerHTML = 'Keep Playing';                           // Change button
    }
    // Gameover
    else {
        modalTitle.innerHTML = 'Game Over';                                       // Change title
        modalLevel.innerHTML = String(allEnemies[0].level);                             // Change level
        modalMessage.innerHTML = `You completed ${modalLevel.outerHTML} level(s).`;  // Change message with level element
        gameBtn.innerHTML = 'Try Again';                                         // Change button
    }
      viewModal();
    }

// Get the modal close button, and when the user clicks on it, execute myFunction

gameBtn.onclick = function() {
  hideModal()
};
