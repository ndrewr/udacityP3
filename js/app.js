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
        this.speed = 3;
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    //this.sprite = 'images/char-boy.png';
    this.sprite = 'images/unit1.png';

    // Set player initial
//    this.x = 303; //this.x = 200;
//    this.y = 570;//this.y = 404;
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
//        this.x = 303;
//        this.y = 570;
        this.x = 335;
        this.y = 570;
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
    switch (key) {
        case 'left':
                //render one step left
                if (this.y < 500 && this.y > 100) {
                    this.x = (this.x - 101 < 0)? 32 : this.x - 101;
                }
                this.yOff = 32;
                break;
        case 'up':
                //render one step up
                // Each lvl has a end pt, the only pt a player can traverse to in that row
                if (this.x === 335 && this.y < 200) {
                    this.y = (this.y === 155)? this.y - 83 : 72;
                    // At this point you can initate a win condition, next lvl etc.
                    levelComplete = true;
                }
                else {
                    this.y = (this.y - 83 < 100)? 155 : this.y - 83;
                }
                this.yOff = 0;
                break;
        case 'right':
                //render one step right
                if (this.y < 500 && this.y > 100) {
                    this.x = (this.x + 101 > 707)? 638 : this.x + 101;
                }
                this.yOff = 96;
                break;
        case 'down':
                //render one step down
                // Each lvl has a starting pt, the only pt a player can return to in that row
                if (this.x === 335 && this.y > 404) {
                    this.y = (this.y === 487)? this.y + 83 : 570;
                }
                else {
                    this.y = (this.y + 83 > 500)? 487 : this.y + 83;
                }
                this.yOff = 64;
                break;
        default:
            //Nothing to see here
    }
    console.log("player position is now %s and %s", player.x, player.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
//(function(global) {
    window.player = new Player();

    window.allEnemies = [];
    var startx = 0,
        starty = 213; //starty = 63;
    for(var i=0; i < 4; i++) {
        var xval = startx - randomizer(),
            speedy = randomizer(3,5);
        window.allEnemies.push(new Enemy(xval, starty, speedy));

        console.log("This enemy will be at %s and %s with speed %s", xval, starty, speedy);

        starty+=83;
    }

//})(this);

// Level object
var Level = function(num, size, levelTiles, start, exit) {
    this.levelNum = num;
    this.levelSize = size;
    this.levelLayout = levelTiles;
    this.startPt = start;
    this.exitPt = exit;
}

// Test level builder, may move to seperate file
window.levels = [];
//window.currentLevel = 0;
window.levelComplete = false;
levels.push(new Level(0,
                      {rows:7, cols:7},
                     ['images/stone-block.png',
                     'images/stone-block.png',
                     'images/stone-block.png',
                     'images/stone-block.png',
                     'images/stone-block.png',
                     'images/stone-block.png',
                     'images/stone-block.png'],
                      {x:335, y:570},
                      {x:335, y:72}
                     ));
levels.push(new Level(1,
                      {rows:7, cols:7},
                     [
                        ['images/water-block.png','images/water-block.png','images/water-block.png','images/stone-block.png', 'images/water-block.png', 'images/water-block.png','images/water-block.png'],
                        'images/stone-block.png',
                        'images/stone-block.png',
                        'images/stone-block.png',
                        'images/stone-block.png',
                        'images/stone-block.png',
                        'images/grass-block.png'],
                      {x:234, y:570},
                      {x:335, y:72}
                     ));

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
