document.addEventListener('DOMContentLoaded', function () {
    generateButtons('main_menu');
});

function generateButtons(option) {
    fetch('/data/game.json')
        .then(response => response.json())
        .then(data => {
            let actions;
            switch (option) {
                case 'post_level':
                    actions = data.post_level_options;
                    break;
                case 'main_menu':
                    actions = data.main_menu.options;
                    break;
                default: // Assume option is a level number
                    const level = data.levels.find(level => level.level_number === option);
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
        })
        .catch(error => console.error('Error fetching actions:', error));
}

function handleAction(action) {
    switch (action) {
        case 'visit_shop':
            console.log('Visiting the shop');
            // Add your logic to handle visiting the shop
            break;
        case 'continue_fighting':
            console.log('Continuing fighting');
            // Add your logic to handle continuing fighting
            break;
        case 'run':
            console.log('Running (Quit)');
            // Add your logic to handle quitting the game
            break;
        case 'attack':
            console.log('Attacking the enemy');
            // Add your logic to handle attacking the enemy
            break;
        case 'use_items':
            console.log('Using items');
            // Add your logic to handle using items
            break;
        
        case 'play_game': //start game and go to lv1
            console.log('Playing game');
            // Add your logic to handle using items
            generateButtons(1);
            break;

        // Add more cases for other actions as needed
        default:
            console.warn('Unhandled action:', action);
    }
}