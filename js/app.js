// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Each enemy requires different starting placement...will be set here.
    this.x = x;
    this.y = y;
    // if speed comes in at 0, assign default of 3
    if (speed)
        this.speed = speed;
    else
			this.speed = randomizer(3,5);
	;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // 101 is the width of each tile...this.speed is enemy's unique speed modifier
    this.x = (this.x > 600)? 0 : this.x+=(101* dt * this.speed);
    //this.x= (this.x > 400)? 0 : this.x+=(101*dt);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
//    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.drawImage(Resources.get(this.sprite), 0, 70, 101, 100, this.x, this.y, 101, 100);

}

// Player class
var Player = function() {
    //this.sprite = 'images/char-boy.png';
    this.sprite = 'images/unit1.png';
    // this call sets starting pos of player
    this.reset();
}

// Simply returns player to specified starting pt, default otherwise
Player.prototype.reset = function(newX, newY) {
    if (newX && newY) {
        if (!isNaN(newX) || !isNaN(newY)) {
            this.x = newX;
            this.y = newY;
        }
    }
    else {
        this.x = levels[currentLevel].startPt.x;
        this.y = levels[currentLevel].startPt.y;
    }

    this.counter = 0; // counter for animation frame
    this.xOff = 0;  // offset into spritesheet
    this.yOff = 0;
}

Player.prototype.update = function() {
    // Update player position based on last input
    this.counter++;
}

Player.prototype.render = function() {
//    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    var count = Math.floor(this.counter / 4);
    this.xOff = count%8 * 32;
    ctx.drawImage(Resources.get(this.sprite), this.xOff, this.yOff, 32, 32, this.x, this.y, 32, 32);

}

Player.prototype.handleInput = function(key) {

    // Note: assign a gate spot coord...then check every up input if player has reached gate
    // method: check after adjusting new offset if player has landed on 'special square'...
    // ex 'gate square', 'start square', 'item', 'boss'...stored in window.levelRules obj?
    // part of larger level obj that also has rowImages, level counter, winning condition

    // each movement switches row in player spritesheet
    // values 32, 69 rep offset to center character avatar within tile given sprite size
    // using levels object to dynamically check current level size...ex to get center of field:
    // Math.floor(levels[currentLevel].levelSize.rows / 2) + 32
    if (playerInBounds(key)) {

        switch (key) {
            case 'left':
                    //render one step left
                    /*if (this.y < 500 && this.y > 100) {
                        this.x = (this.x - 101 < 0)? 32 : this.x - 101;
                    }*/
                    if (playerInBounds(key)) {
                        this.x -= 101;
                    }
                    this.yOff = 32;
                    break;
            case 'up':
                    //render one step up
                    // Each lvl has a end pt, the only pt a player can traverse to in that row

                   /* if (this.x === 335 && this.y < 200) {
                        this.y = (this.y === 155)? this.y - 83 : 72;
                        // At this point you can initate a win condition, next lvl etc.
                        levelComplete = true;
                    }
                    else {
                        this.y = (this.y - 83 < 100)? 155 : this.y - 83;
                    }
                   */

                    if (playerInBounds(key)) {
                        this.y -= 83;
                    }
                    this.yOff = 0;

                    if(goalReached()) levelComplete = true;

                    break;
            case 'right':
                    //render one step right
                   /* if (this.y < 500 && this.y > 100) {
                        this.x = (this.x + 101 > levelSize.cols * 101)? levelSize.cols*101 - 69 : this.x + 101;
                    }*/

                    if(playerInBounds(key)) {
                        this.x += 101;
                    }
                    this.yOff = 96;
                    break;
            case 'down':
                    //render one step down
                    // Each lvl has a starting pt, the only pt a player can return to in that row
                    /*if (this.x === 335 && this.y > 404) {
                        this.y = (this.y === 487)? this.y + 83 : 570;
                    }
                    else {
                        this.y = (this.y + 83 > 500)? 487 : this.y + 83;
                    }*/

                    if(playerInBounds(key)) {
                        this.y += 83;
                    }
                    this.yOff = 64;
                    break;
            default:
                //Nothing to see here
        }
    }
    console.log("player position is now %s and %s", player.x, player.y);
}

// Level object
var Level = function(num, size, levelTiles, start, exit) {
    this.levelNum = num;
    this.levelSize = size;
    this.levelLayout = levelTiles;
    this.startPt = start;
    this.exitPt = exit;
}

Level.prototype.goalReached = function(playerX, playerY) {
    return playerX === this.exitPt.x && playerY === this.exitPt.y;
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// instantiate player cuz after levels obj defined
window.allEnemies = [];

// how about an object to specify scale of game world tiles in px
window.gameWorld = {
		playerXoff: 32,
		playerYoff: 69,
		tileHeight: 83,
		tileWidth: 101,
		setTileHeight: function(newHeight) { this.tileHeight = newHeight },
		setTileWidth: function(newWidth) { this.tileWidth = newWidth }
};

// Test level builder, may move to seperate file
window.levels = [];
window.currentLevel = 0;
window.levelComplete = false;

levels.push(new Level(0,
                      {rows:6, cols:7},
                      [['images/water-block.png','images/water-block.png','images/water-block.png','images/stone-block.png', 'images/water-block.png', 'images/water-block.png','images/water-block.png'],
                     'images/stone-block.png',
                     'images/stone-block.png',
                     'images/stone-block.png',
                     'images/stone-block.png',
                       ['images/water-block.png','images/water-block.png','images/water-block.png','images/stone-block.png', 'images/water-block.png', 'images/water-block.png','images/water-block.png'],],
                      {x:335, y:487},
                      {x:335, y:72}
                     ));
levels.push(new Level(1,
                      {rows:6, cols:7},
                     [
                        ['images/water-block.png','images/water-block.png','images/water-block.png','images/stone-block.png', 'images/water-block.png', 'images/water-block.png','images/water-block.png'],
                        'images/stone-block.png',
                        'images/stone-block.png',
                        'images/stone-block.png',
                        'images/stone-block.png',
                        'images/stone-block.png',
    ['images/water-block.png','images/water-block.png', 'images/grass-block.png', 'images/water-block.png', 'images/water-block.png', 'images/water-block.png','images/water-block.png'],],
                      {x:234, y:487},
                      {x:335, y:72}
                     ));
levels.push(new Level(2,
                      {rows:6, cols:7},
                      [
    ['images/water-block.png','images/water-block.png','images/water-block.png','images/stone-block.png', 'images/water-block.png', 'images/water-block.png','images/water-block.png'],
    'images/stone-block.png',
    'images/stone-block.png',
    'images/stone-block.png',
    'images/stone-block.png',
    'images/stone-block.png',
    ['images/water-block.png','images/water-block.png', 'images/grass-block.png', 'images/grass-block.png', 'images/grass-block.png', 'images/water-block.png','images/water-block.png'],],
                      {x:335, y:487},
                      {x:335, y:72}
                     ));


window.player = new Player(); //Player object references levels objects so must be instantiated last


/****** Helper functions *******/
// simply check player's position when called and compare to currentLevel's goal coordinates
function goalReached() {

		return player.x === levels[currentLevel].exitPt.x && player.y === levels[currentLevel].exitPt.y;
}

function playerInBounds(key) {
    switch (key) {
        case 'left':
            return player.x - 101 > 0;

        case 'right':
            return player.x + 101 < levels[currentLevel].levelSize.cols * 101;

        case 'up':

            return player.y - 83 > 0;

        case 'down':

            return player.y + 83 < levels[currentLevel].levelSize.rows * 83;

        default:
    }
}

// creates new randomly generated enemy array
function resetEnemies() {
	console.log("Generating new enemy layout...");
	allEnemies = [];
	var starty = 130; //starty = 63;
	for(var i=0; i < 4; i++) {
		// enemy objects take 3 args: their x and y start vals and a speed modifier
		window.allEnemies.push(new Enemy(-randomizer(), starty));
		starty+=83; // will draw next enemy one line down
	}
}

// Overloaded to allow two range args or default to 1000 to calc enemy stagger
function randomizer(min, max) {
    if(!min) return Math.floor(Math.random() * 1000);;
    return Math.floor(Math.random() * (max - min + 1)) + min; // from MDN docs
}

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
