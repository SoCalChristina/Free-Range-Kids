
/* app.js */
// Now instantiate your objects.

/**************************/
/* instantiate objects    */
/*************************/
// Place all enemy objects in an array called allEnemies
let allEnemies = [
    new Enemy(-(Math.floor(1 + Math.random() * 5)), 1),
    new Enemy(-(Math.floor(1 + Math.random() * 5)), 2),
    new Enemy(-(Math.floor(1 + Math.random() * 5)), 3)
];

// Place the player object in a variable called player
const player = new Player();

// access the enemy var to change number rendered and travel speed
allEnemies.forEach((enemy, index, arr) => {
    enemy.addNest(arr);
});

/******************************/
/* Key Handler Section      */
/***************************/
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {

    // Allowed keys
    const allowedKeys = {
        37: 'left',     // Left arrow
        38: 'up',       // Up arrow
        39: 'right',    // Right arrow
        40: 'down',     // Down arrow
    };

    player.handleInput(allowedKeys[e.keyCode]); // Passed an allowed key value to control player movements

    // The 'Enter' key is pressed and the modal is visible
    if (e.keyCode === 13 && !modal.classList.contains('out')) {
        hideModal();    // Remove the modal
    }
});

/********************************/
/* Player Game life Display    */
/*****************************/
const panel = document.querySelector('.panel');     // DOM: Game data panel
const level = document.querySelector('.level');     // DOM: Level indicator
// code source for canvas https://www.w3schools.com/tags/ref_canvas.asp
panel.style.margin = "auto";

// Display player life hearts on score board panel
function setLives() {
    const lives = document.querySelectorAll('.lifebar img');

    lives.forEach((life) => {
        life.src = `./${player.sprite}`;
    });
}
/* TODO create acheivement section
function displayAchievements() {
    const awards = document.querySelectorAll('.achievement-vault img');

    awards.forEach((achivement) => {
        achievement.src = `./${award.sprite}`;//./before ${achievement.sprite}
    });
}
*/

/*********************/
/* Footer section   */
/*********************/
const footer = document.querySelector('.footer');
// code source for canvas https://www.w3schools.com/tags/ref_canvas.asp
footer.style.position = "absolute";
footer.style.top = "750px";
footer.style.margin = "auto";

/*********************/
/*  Modal Section   */
/*******************/
// source: https://www.w3schools.com/bootstrap/bootstrap_modal.asp
const modal = document.querySelector('.modal'); // DOM: Modal
const modalCloseBtn = document.querySelector('.modal-btn-close'); // DOM: Close button in modal
const modalContBtn = document.querySelector('.modal-btn-cont'); // DOM: Button in modal for either next or again

/** Make Model disapear **/
const hideModal = () => {
    modal.classList.add('out');
};

/** Check Modal Data Input **/
const showModal = () => {
    const modalTitle = document.querySelector('.modal-title'); // DOM: Modal title
    const modalMessage = document.querySelector('.modal-message'); // DOM: Modal message
    const modalLevel = document.querySelector('.modal-level'); // DOM: Current level value in modal message

    // Player completed level - game continues
    if (!player.livesEmpty()) {
        modalTitle.innerHTML = 'Range On!'; // Change title
        modalLevel.innerHTML = String(allEnemies[0].level); // Change level
        modalMessage.innerHTML = `You survived ${modalLevel.outerHTML} walk(s) alone.`; // Change message with level element
        modalContBtn.innerHTML = 'Keep Exploring'; // Change button
    }
    // Gameover
    else {
        modalTitle.innerHTML = 'Game Over'; // Change title
        modalLevel.innerHTML = String(allEnemies[0].level); // Change level
        modalMessage.innerHTML = `You survived ${modalLevel.outerHTML} free range expeditions.`; // Change message with level element
        modalContBtn.innerHTML = 'Play agian'; // Change button
    }
    modal.classList.remove('out'); // Put modal into view
};

modalCloseBtn.addEventListener('click', hideModal); // Hide modal on close button click
modalContBtn.addEventListener('click', hideModal); // Hide modal on continue button click
