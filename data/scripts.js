var next_level;
var current_level;
var game_data;
var audioElement = document.createElement('audio');
audioElement.setAttribute('src', "/sounds/music.mp3");
const actionButtons = document.getElementById('action-buttons');

document.addEventListener('DOMContentLoaded', function () { //making sure the page is loaded before generating buttons
    fetchGameData();
});

const imageButton = document.getElementById('image-button');

imageButton.addEventListener('click', function() {
    // Your logic to handle the button click goes here
    console.log('Image button clicked');
    // Add more actions as needed
});

function playerDamage(){
    const maxHit = 20;
    const minHit = 10;
    const randomNumber = Math.floor(Math.random() * (maxHit - minHit + 1)) + minHit;
    console.log(randomNumber); // Output: Random integer between 20 and 30
    shrinkBar(randomNumber);
}

function shrinkBar(damage) {
    var bar = document.getElementById('bar');
    var currentWidth = bar.offsetWidth;
    var newWidth = currentWidth - damage; // Adjust the amount you want the bar to shrink by
    bar.style.width = Math.max(newWidth, 0) + 'px'; // Ensure the width doesn't go below 0
}

function toggleBar() {
    const bar = document.getElementById('bar');
    if (bar) {
        bar.classList.toggle('hidden');
    }
}

function toggleImageButton() {
    const imgBut = document.getElementById('image-button');
    if (imgBut) {
        imgBut.classList.toggle('hidden');
    }
}

function resetBar() {
    const bar = document.getElementById('bar');
    if (bar) {
        bar.style.width = '100%';
    }
}

function nextLevel(cur_level){
    next_level = game_data.levels[cur_level - 1].next_level;
    console.log("Next Level will be: " + next_level);
}


function fetchGameData() {
    fetch('/data/game.json') //grabbing the json file
        .then(response => response.json())
        .then(data => {
            game_data = data; // Assign JSON data to the global variable
            generateButtons('main_menu');
            toggleBar();
            toggleImageButton();
        })
        .catch(error => console.error('Error fetching actions:', error));
}

function generateButtons(option) {
    let actions;
    switch (option) {
        case 'post_level':
            actions = game_data.post_level_options;
            break;
        case 'main_menu':
            actions = game_data.main_menu.options;
            break;
        default: // Assume option is a level number
            const level = game_data.levels.find(level => level.level_number === option);
            actions = level ? level.options : null;
    }

    if (actions) {
        const actionButtonsContainer = document.getElementById('action-buttons');
        actionButtonsContainer.innerHTML = ''; // Clear previous buttons

        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.text;
            button.classList.add('action-button');
            button.addEventListener('click', function () {
                handleAction(action.action);
            });
            actionButtonsContainer.appendChild(button);
        });
    } else {
        console.error('Options not found:', option);
    }
}

function handleAction(action) {
    switch (action) {
        case 'visit_shop':
            console.log('Visiting the shop');
            
            // Add your logic to handle visiting the shop
            break;
        case 'continue_fighting':
            console.log('Continuing fighting');
            nextLevel(next_level);
            // Add your logic to handle continuing fighting
            break;
        case 'run':
            console.log('Running (Quit)');
            location.reload();
            // generateButtons('main_menu');
            // resetBar();
            // toggleBar();
            // Add your logic to handle quitting the game
            break;
        case 'attack':
            console.log('Attacking the enemy');
            playerDamage();
            // Add your logic to handle attacking the enemy
            break;
        case 'use_items':
            console.log('Using items');
            nextLevel(current_level);

            // Add your logic to handle using items
            break;
        
        case 'play_game': //start game and go to level 1
            console.log('Playing game');
            current_level = game_data.main_menu.next_level;
            // Add your logic to handle using items
            generateButtons(1);
            actionButtons.style.display = 'block';
            toggleBar();
            toggleImageButton();
            audioElement.play();
            break;

        // Add more cases for other actions as needed
        default:
            console.warn('Unhandled action:', action);
    }
}