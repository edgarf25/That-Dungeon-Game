var next_level;
var current_level;
var game_data;
var current_enemy_health;
var current_player_health;
var max_player_health;
var current_scene
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
    const maxHit = 50;
    const minHit = 10;
    const randomNumber = Math.floor(Math.random() * (maxHit - minHit + 1)) + minHit;
    enemyHealthController(randomNumber);
}

function enemyDamage(){
    const maxHit = game_data.levels[current_level].enemy_max_dmg;
    const minHit = game_data.levels[current_level].enemy_min_dmg;
    const randomNumber = Math.floor(Math.random() * (maxHit - minHit + 1)) + minHit;
    if(current_enemy_health >0){
        playerHealthController(randomNumber);
    }
}

function updateEnemyHealth(){
    current_enemy_health = game_data.levels[current_level].enemy_health;
    resetBar();
}

function updateH1Text(){
    const h1Element = document.getElementById('h1');
    let description;

    switch (current_scene) {
        case 'post_level_options':
            description = game_data.post_level_options.description;
            break;
        case 'main_menu':
            description = game_data.main_menu.description;
            break;
        case 'levels':
            description = game_data.levels[current_level].description;
            break;
        default:
            console.error('Unknown scene:', current_scene);
            return;
    }

    h1Element.textContent = description;
}


function updateH2Text(){
    const h2Element = document.getElementById('h2');
    let description;

    switch (current_scene) {
        case 'post_level_options':
            description = game_data.post_level_options.description2;
            break;
        case 'main_menu':
            description = game_data.main_menu.description2;
            break;
        case 'levels':
            description = game_data.levels[current_level].description2;
            break;
        default:
            console.error('Unknown scene:', current_scene);
            return;
    }
    h2Element.textContent = description;
}


function enemyHealthController(damage) { 
    const bar = document.getElementById('bar');
    const currentWidth = bar.offsetWidth;
    current_enemy_health = current_enemy_health - damage;
    if(current_enemy_health <= 0) //making sure it doesn't go below 0 or it crashes
    {
        current_enemy_health = 0;
        generateButtons('post_level_options');
        console.log("Currently in post_level_options")
        toggleHpImg();
        audioElement.pause();
        updateH1Text();
        updateH2Text();
        return;
    }
    const h2Element = document.getElementById('h2');
    h2Element.textContent = "Enemy's Current Health is: " + current_enemy_health + " You Dealth: " + damage + " Damage"
    console.log("Current Health is: " + current_enemy_health + " damage dealth is: " + damage);
    const healthPercentage = (current_enemy_health / game_data.levels[current_level].enemy_health) * 100;
    console.log("The current percentage is: " + healthPercentage);
    const newWidth = (currentWidth * healthPercentage) / 100;
    bar.style.width = newWidth + 'px';
}

function playerHealthController(damage) { 
    const bar = document.getElementById('player-bar');
    const currentWidth = bar.offsetWidth;
    current_player_health = current_player_health - damage;
    if(current_player_health <= 0) //making sure it doesn't go below 0 or it crashes
    {
        current_player_health = 0;
        generateButtons('post_level_options');
        console.log("Currently in post_level_options")
        toggleHpImg();
        audioElement.pause();
        updateH1Text();
        updateH2Text();
        return;
    }
    const h2Element = document.getElementById('h2');
    h2Element.textContent = "Your Current Health is: " + current_player_health + " Enemy Dealth: " + damage + " Damage"
    console.log("Current Health is: " + current_player_health + " damage dealth is: " + damage);
    const healthPercentage = (current_player_health / max_player_health) * 100;
    console.log("The current percentage is: " + healthPercentage);
    const newWidth = (currentWidth * healthPercentage) / 100;
    bar.style.width = newWidth + 'px';
}

function toggleBar() {
    const bar = document.getElementById('bar');
    const player_bar = document.getElementById('player-bar');
    const player_tx = document.getElementById('player-hp-tx');
    if (bar) {
        bar.classList.toggle('hidden');
    }
    if (player_bar){
        player_bar.classList.toggle('hidden');
        player_tx.classList.toggle('hidden'); //also hides player txt
    }
}

function toggleImageButton() { //hide/unhides the image
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
    next_level = game_data.levels[cur_level].next_level;
    current_level = next_level;
    console.log("Next Level will be: " + next_level);
}

function enableAllButtons() {
    const buttons = document.querySelectorAll('.action-button');
    buttons.forEach(button => {
        button.disabled = false;
    });
}

// Function to disable the button
function disableAllButtons() {
    const buttons = document.querySelectorAll('.action-button');
    buttons.forEach(button => {
        button.disabled = true;
    });

    setTimeout(function() { //Disabling the buttons for x amount of time
        enableAllButtons();
    }, 5000);;
}

function toggleHpImg(){
    toggleImageButton();
    toggleBar();
}


function fetchGameData() {
    fetch('/data/game.json') //grabbing the json file
        .then(response => response.json())
        .then(data => {
            game_data = data; // Assign JSON data to the global variable
            generateButtons('main_menu');
            console.log("Currently in main_menu")
            toggleHpImg();
            updateH1Text();
            updateH2Text();
        })
        .catch(error => console.error('Error fetching actions:', error));
}

function generateButtons(option) {
    let actions;
    switch (option) {
        case 'post_level_options':
            actions = game_data.post_level_options.options;
            current_scene = 'post_level_options';
            break;
        case 'main_menu':
            actions = game_data.main_menu.options;
            current_scene = 'main_menu';
            break;
        default: // Assume option is a level number
            const level = game_data.levels.find(level => level.level_number === option);
            actions = level ? level.options : null;
            current_scene = 'levels';
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
            nextLevel(current_level);
            generateButtons(current_level);
            toggleHpImg();
            updateEnemyHealth();
            console.log("The current level is: " + current_level);
            updateH1Text();
            updateH2Text();
            // Add your logic to handle continuing fighting
            break;
        case 'run':
            console.log('Running (Quit)');
            location.reload();
            break;
        case 'attack':
            console.log('Attacking the enemy');
            playerDamage();
            setTimeout(enemyDamage, 5000)
            disableAllButtons();
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
            generateButtons(current_level);
            actionButtons.style.display = 'block'; //changing buttons to be side to side
            toggleBar();
            toggleImageButton();
            audioElement.play();
            current_enemy_health = game_data.levels[current_level].enemy_health; //setting it to max health to start
            max_player_health = current_player_health = game_data.main_menu.player_health;
            updateH1Text();
            updateH2Text();
            break;
        default:
            console.warn('Unhandled action:', action);
    }
}