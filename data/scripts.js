var next_level;
var current_level;
var game_data;
var current_enemy_health;
var current_player_health;
var max_player_health;
var current_scene;
var current_health_potions;
var gold_amount;
var armor;
var player_min_dmg;
var player_max_dmg;
var player_lifesteal_unlocked;
var story_action;
var audioElement = document.createElement('audio');
var audioHit = document.createElement('audio');
var audioHit2 = document.createElement('audio');

audioElement.setAttribute('src', "/sounds/music.mp3");
const actionButtons = document.getElementById('action-buttons');

document.addEventListener('DOMContentLoaded', function () { //making sure the page is loaded before generating buttons
    fetchGameData();
});

function loadPlayerInfo(){
    max_player_health = current_player_health = game_data.player.player_start_health;
    armor = game_data.player.player_start_armor;
    current_health_potions = game_data.player.player_start_hp_pots;
    player_lifesteal_unlocked = game_data.player.player_lifesteal_unlocked;
    gold_amount = game_data.player.player_starting_gold;
    player_min_dmg = game_data.player.player_start_min_dmg;
    player_max_dmg = game_data.player.player_start_max_dmg;
}

function playerDamage(){
    const randomNumber = Math.floor(Math.random() * (player_max_dmg - player_min_dmg + 1)) + player_min_dmg;
    enemyHealthController(randomNumber);
}

function enemyDamage(){
    const maxHit = game_data.levels[current_level].enemy_max_dmg;
    const minHit = game_data.levels[current_level].enemy_min_dmg;
    const randomNumber = Math.floor(Math.random() * (maxHit - minHit + 1)) + minHit;
    if(current_enemy_health >0){ //stops enemy from attacking when killed
        playerHealthController(randomNumber);
    }
}

function updateEnemyHealth(){
    current_enemy_health = game_data.levels[current_level].enemy_health;
    resetBar();
}


function useHealthPot(){
    console.log("You currently have: " + current_health_potions +" potions")
    if(current_health_potions > 0){
        current_player_health += (max_player_health / 2);
        if (current_player_health > max_player_health){
            current_player_health = max_player_health;
        }
        current_health_potions -= 1;
        resetPlayerBar();
        updateH2Text();
    }
    else{
        console.log("You are out of potions mate")
        clearH1();
        updateH1Text();
        return;
    }
}

function purchaseFromShop(item){
    const h1Element = document.getElementById('h1');
    const h2Element = document.getElementById('h2');
    switch (item) {
        case 'purchase_hp':
            if (gold_amount >= game_data.shop.options[0].cost){
                current_health_potions += 1;
                console.log("Sucessfully purchased a potion");
                gold_amount -= game_data.shop.options[0].cost;
                h2Element.textContent = "You purchased a potion, You have " + gold_amount + " gold left"
            }
            else{
                h2Element.textContent = "You can't afford a potion, You have " + gold_amount + " gold left"
            }
            break;
        case 'increase_armor':
            if (gold_amount >= game_data.shop.options[1].cost){
                armor += 3;
                console.log("Sucessfully purchased armor, you have : " + armor);
                gold_amount -= game_data.shop.options[1].cost;
                h2Element.textContent = "You purchased armor, You have " + gold_amount + " gold left"
            }
            else{
                h2Element.textContent = "You can't afford armor, You have " + gold_amount + " gold left"
            }
            break;
        case 'increase_max_health':
            if (gold_amount >= game_data.shop.options[2].cost){
                max_player_health += 10;
                current_enemy_health = max_player_health;
                console.log("Sucessfully increased max health, you have : " + max_player_health);
                gold_amount -= game_data.shop.options[2].cost;
                h2Element.textContent = "You purchased max health, You have " + gold_amount + " gold left"
            }
            else{
                h2Element.textContent = "You can't afford this, You have " + gold_amount + " gold left"
            }
            break;
        case 'increase_dmg':
            if (gold_amount >= game_data.shop.options[3].cost){
                player_max_dmg += 5;
                player_min_dmg += 5;
                console.log("Sucessfully increased damage, you have : " + player_max_dmg);
                gold_amount -= game_data.shop.options[3].cost;
                h2Element.textContent = "You purchased more damage, You have " + gold_amount + " gold left"
            }
            else{
                h2Element.textContent = "You can't afford this, You have " + gold_amount + " gold left"
            }
            break;
        case 'unlock_lifesteal':
            if (gold_amount >= game_data.shop.options[4].cost){
                player_lifesteal_unlocked = true;
                console.log("Sucessfully unlocked lifesteal, you have : " + player_lifesteal_unlocked);
                gold_amount -= game_data.shop.options[4].cost;
                h2Element.textContent = "You unlocked lifesteal, You have " + gold_amount + " gold left"
            }
            else{
                h2Element.textContent = "You can't afford this, You have " + gold_amount + " gold left"
            }
            break;
    }

}

function clearH1(){
    const h1Element = document.getElementById('h1');
    h1Element.textContent = "";
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
        case 'items':
            description = game_data.items.description;
            break;
        case 'death':
            description = game_data.death.description;
            break;
        case 'story':
            description = game_data.story.description;
            break;
        case 'story_actions':
            if(story_action === 'approach_figure'){
                description = game_data.story_actions.approach_figure.description;
            }
            else{
                description = game_data.story_actions.explore_forest.description;
            }
            break;
        case 'speak_figure':
            description = game_data.speak_figure.description;
            break;
        case 'how_to_play':
            description = game_data.how_to_play.description;
            break;
        case 'winner_chicken_dinner':
            description = game_data.winner_chicken_dinner.description;
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
            description = description + game_data.levels[current_level].gold_reward + ", you currently have " + gold_amount;
            break;
        case 'main_menu':
            description = game_data.main_menu.description2;
            break;
        case 'levels':
            description = game_data.levels[current_level].description2;
            break;
        case 'items':
            description = game_data.items.description2;
            break;
        case 'death':
            description = game_data.death.description2;
            break;
        case 'story':
            description = game_data.story.description2;
            break;
        case 'speak_figure':
            description = game_data.speak_figure.description2;
            break;
        case 'winner_chicken_dinner':
            description = game_data.winner_chicken_dinner.description2;
            break;
        case 'story_actions':
            if(story_action === 'approach_figure'){
                description = game_data.story_actions.approach_figure.description2;
            }
            else{
                description = game_data.story_actions.explore_forest.description2;
            }
            break;
        case 'how_to_play':
            description = game_data.how_to_play.description2;
            break;
        default:
            console.error('Unknown scene:', current_scene);
            return;
    }
    h2Element.textContent = description;
}


function enemyHealthController(damage) { 
    const bar = document.getElementById('bar');
    current_enemy_health = current_enemy_health - damage;
    audioHit.play();
    if(player_lifesteal_unlocked){
        const healAmount = damage * 0.15;
        current_player_health += Math.ceil(healAmount);
        console.log("You healed for: " + healAmount);
    }

    if(current_enemy_health <= 0) //making sure it doesn't go below 0 or it crashes
    {
        if(current_level === 13){
            toggleBar();
            toggleImageButton();
            console.log('winner_chicken_dinner');
            generateButtons('winner_chicken_dinner');
            updateH1Text();
            updateH2Text();
            return;
        }
        current_enemy_health = 0;
        gold_amount += game_data.levels[current_level].gold_reward;
        console.log("You have: " + gold_amount + " gold")
        console.log("Current level is : " + current_level)
        generateButtons('post_level_options');
        console.log("Currently in post_level_options")
        toggleHpImg();
        updateH1Text();
        updateH2Text();
        audioElement.pause();
        return;
    }
    const h1Element = document.getElementById('h1');
    h1Element.textContent = "Enemy's Current Health is: " + current_enemy_health + " You Dealt: " + damage + " Damage"
    h1Element.classList.add('flash-on-update');
    // Removing the class so that I can keep using flash effect
    setTimeout(function() {
        h1Element.classList.remove('flash-on-update');
    }, 1000);

    console.log("Current Health is: " + current_enemy_health + " damage dealt is: " + damage);
    const healthPercentage = (current_enemy_health / game_data.levels[current_level].enemy_health) * 100;
    console.log("The current percentage is: " + healthPercentage);
    bar.style.width = healthPercentage + '%';

}

function playerHealthController(damage) { 
    const bar = document.getElementById('player-bar');
    if (damage - armor <= 0){
        damage = 0;
    }
    else{
        damage = damage - armor;
    }
    current_player_health = current_player_health - damage;
    if(current_player_health <= 0) //making sure it doesn't go below 0 or it crashes
    {
        current_player_health = 0;
        generateButtons('death');
        actionButtons.style.display = 'flex'; //changing buttons to be centered since its only 1
        console.log("Currently in deathscreen")
        toggleHpImg();
        audioElement.pause();
        updateH1Text();
        updateH2Text();
        return;
    }
    const h2Element = document.getElementById('h2');
    h2Element.textContent = "Your Current Health is: " + current_player_health + " Enemy Dealth: " + damage + " Damage"
    h2Element.classList.add('flash-on-update');
    // Removing the class so that I can keep using flash effect
    setTimeout(function() {
        h2Element.classList.remove('flash-on-update');
    }, 1000);

    console.log("Current Health is: " + current_player_health + " damage dealth is: " + damage);
    const healthPercentage = (current_player_health / max_player_health) * 100;
    console.log("The current percentage is: " + healthPercentage);
    bar.style.width = healthPercentage + '%';
    audioHit2.play();
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
    const imgBut = document.getElementById('enemy-img');
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

function resetPlayerBar() {
    const bar = document.getElementById('player-bar');
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
    }, 1500);;
}

function toggleHpImg(){
    resetBar();
    toggleImageButton();
    toggleBar();
}

function changeBackground(){
    switch(current_scene){
        case 'shop':
            document.body.style.backgroundImage = game_data.shop.background_img;
            console.log("changed the background");
            break;
        case 'post_level_options':
            document.body.style.backgroundImage = game_data.post_level_options.background_img;
            console.log("changed the background");
            break;
        case 'story':
            document.body.style.backgroundImage = game_data.story.background_img;
            console.log("changed the background");
            break;
        case 'levels':
            document.body.style.backgroundImage = game_data.post_level_options.background_img;
            console.log("changed the background");
    }
    
}

function changeImage() {
    const image = document.getElementById('enemy-img');
    if(game_data.levels[current_level].enemy_img != null && game_data.levels[current_level].enemy_img != ""){
        image.src = game_data.levels[current_level].enemy_img;   
    }
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
            changeBackground();
            break;
        case 'main_menu':
            actions = game_data.main_menu.options;
            current_scene = 'main_menu';
            break;
        case 'items':
            actions = game_data.items.options;
            current_scene = 'items';
            break;
        case 'shop':
            actions = game_data.shop.options;
            current_scene = 'shop';
            changeBackground();
            break;
        case 'death':
            actions = game_data.death.options;
            current_scene = 'death';
            break;
        case 'story':
            actions = game_data.story.options;
            current_scene = 'story';
            changeBackground();
            break;
        case 'speak_figure':
            actions = game_data.speak_figure.options;
            current_scene = 'speak_figure';
            break;
        case 'how_to_play':
            actions = game_data.how_to_play.options;
            current_scene = 'how_to_play';
            break;
        case 'winner_chicken_dinner':
            actions = game_data.winner_chicken_dinner.options;
            current_scene = 'winner_chicken_dinner';
            break;
        case 'story_actions':
            if(story_action === 'approach_figure'){
                actions = game_data.story_actions.approach_figure.options;
            }
            else{
                actions = game_data.story_actions.explore_forest.options;
            }
            current_scene = 'story_actions';
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
            generateButtons('shop');
            
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
            changeImage()
            // Add your logic to handle continuing fighting
            break;
        case 'run':
            console.log('Running (Quit)');
            location.reload();
            break;
        case 'attack':
            console.log('Attacking the enemy');
            playerDamage();
            setTimeout(enemyDamage, 1500);
            disableAllButtons();
            // Add your logic to handle attacking the enemy
            break;
        case 'use_items':
            console.log('Using items');
            generateButtons('items');
            break;
        case 'health_potion':
            console.log('Using health pot');
            useHealthPot();
            break;
        case 'go_back_battle':
            console.log('Go Back To Battle');
            generateButtons(current_level);
            break;
        case 'purchase_hp':
            console.log('Bought a Health Pot');
            purchaseFromShop('purchase_hp');
            break;
        case 'increase_armor':
            console.log('Bought armor');
            purchaseFromShop('increase_armor');
            break;
        case 'increase_max_health':
            console.log('Bought more health');
            purchaseFromShop('increase_max_health');
            break;
        case 'increase_dmg':
            console.log('Bought more damage');
            purchaseFromShop('increase_dmg');
            break;
        case 'unlock_lifesteal':
            console.log('Unlocked Lifesteal');
            purchaseFromShop('unlock_lifesteal');
            break;
        case 'approach_figure':
            console.log('approach_figure');
            story_action = 'approach_figure';
            generateButtons('story_actions');
            updateH1Text();
            updateH2Text();
            break;
        case 'go_back_post_level':
            console.log('Returning to Post');
            generateButtons('post_level_options');
            break;
        case 'explore_forest':
            console.log('Exploting Forest');
            story_action = 'explore_forest';
            generateButtons('story_actions');
            updateH1Text();
            updateH2Text();
            break;
        case 'how_to_play':
            generateButtons('how_to_play');
            updateH1Text();
            updateH2Text();
            break;
        case 'speak_to_figure':
            console.log("speaking with figure");
            generateButtons('speak_figure');
            updateH1Text();
            updateH2Text();
            break;
        case 'enter_cave':
            console.log("Let the games begin");
            generateButtons(current_level);
            console.log("the current level is: " + current_level);
            console.log("the current scene is: " + current_scene);
            toggleBar();
            toggleImageButton();
            updateH1Text();
            updateH2Text();
            changeBackground();
            break;
        case 'winner_chicken_dinner':
            console.log('winner_chicken_dinner');
            generateButtons('winner_chicken_dinner');
            updateH1Text();
            updateH2Text();
            break;
        case 'play_game': //start game and go to level 1
            console.log('Playing game');
            current_level = game_data.main_menu.next_level;
            generateButtons('story');
            actionButtons.style.display = 'block'; //changing buttons to be side to side
            audioHit.setAttribute('src', game_data.main_menu.hit_audio);
            audioHit2.setAttribute('src', game_data.main_menu.hit_audio2);
            //audioElement.play();
            current_enemy_health = game_data.levels[current_level].enemy_health; //setting it to max health to start
            loadPlayerInfo()
            updateH1Text();
            updateH2Text();
            changeImage()
            break;
        default:
            console.warn('Unhandled action:', action);
    }
}