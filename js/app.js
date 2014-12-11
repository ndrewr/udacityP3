// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Each enemy requires different starting placement...will be set here.
    this.x = x;
    this.y = y;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x > 600)? 0 : this.x+=(101*dt);
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
}

Player.prototype.update = function() {
    // Update player position based on last input
    this.counter++;
}

Player.prototype.render = function() {
//    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    var count = Math.floor(this.counter / 4);
    var xoff = count%8 * 32;
    ctx.drawImage(Resources.get(this.sprite), xoff, 0, 32, 32, this.x, this.y, 32, 32);

}

Player.prototype.handleInput = function(key) {

    switch (key) {
        case 'left':
                //render one step left
                this.x-=101;
                break;
        case 'up':
                //render one step up
                this.y-=83;
                break;
        case 'right':
                //render one step right
                this.x+=101;
                break;
        case 'down':
                //render one step down
                this.y+=83;
                break;
        default:
            //Nothing to see here
    }
    console.log("player position is now %s and %s", player.x, player.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
window.player = new Player();

window.allEnemies = [];
var startx = 0,
    starty = 213; //starty = 63;
for(var i=0; i < 3; i++) {
    window.allEnemies.push(new Enemy(startx, starty));
    starty+=83;
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
