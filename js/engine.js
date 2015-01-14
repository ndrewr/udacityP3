/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        gameRunning = true; // ID var to start and stop animation loop

    canvas.width = 707;
    canvas.height = 606;
    doc.getElementById('mainscreen').appendChild(canvas);

    // Prompt box
    var promptBox = doc.createElement('div');
    promptBox.id = 'prompt';
    promptBox.innerHTML = '<p>...but you can try again!</p><button id="restart">Lets go!</button>';
    doc.getElementById('mainscreen').appendChild(promptBox);

    // Restart button
    doc.getElementById('restart').onclick = init;

    // Dialog box
    //doc.getElementById('mainscreen').appendChild(doc.createElement('h3'));

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        if(app.isLevelComplete()) {
						if(app.getCurrentLevelnum() === 2) {
								console.log("The game is done. Well done.");
						}
						else {
								app.increaseLevel();
								console.log("Congrats! Proceeding to level %s", app.getCurrentLevelnum());
								//levelComplete = false;
								app.setLevelComplete(false);
								init();
						}
        }
        else {
            if(gameRunning) win.requestAnimationFrame(main);
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
				startTime = lastTime;
        main();
    }

    /* This function is called by main (our game loop) and itself calls a ll
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }
    
    /* cut the number of collision checks
     * by directly checking corresponding enemy in array index same sto the players current pos
	   * Note: player y and enemy y is off by 9 px...
		 */
    function checkCollisions() {
        app.getEnemies().forEach(function(enemy, index) {
            var enemyNose = enemy.x + 91; // 91 represents visible length of enemy sprite
            if ((enemyNose >= app.getPlayer().x && enemy.x <= app.getPlayer().x + 32) && (enemy.y === app.getPlayer().y - 25))
						{
               // Call Game Over state
               console.log("The End. Enemy %s was at %s and %s", index, enemy.x, enemy.y);
               gameOver();
           	}
        });
    }

    function gameOver() {
        //doc.getElementsByTagName('h3')[0].innerHTML = "Your busy day is at an end.";
        // Display prompt offering restart
        gameRunning = false;
        doc.getElementById('prompt').style.display = 'inherit';
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
				app.getEnemies().forEach(function(enemy) {
            enemy.update(dt);
        });
        app.getPlayer().update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
			var rowImages = app.getCurrentLevel().levelLayout,
					numRows = app.getCurrentLevel().levelSize.rows,
					numCols = app.getCurrentLevel().levelSize.cols,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                var tile = (rowImages[row].constructor === Array)? rowImages[row][col] : rowImages[row];

                ctx.drawImage(Resources.get(tile), col * 101, row * 83);
            }
        }

        renderEntities();
				// use game clock to display contextual messages to player
				if(gameRunning && (lastTime - startTime < 2000)) {
					flashText("Forward!"); // flash a "Ready" message to player
				}
				else if(app.isLevelComplete()) {
					flashText("Maktub!");
				}
				else if(!gameRunning) {
					flashText("Game Over!");
				}

    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        app.getEnemies().forEach(function(enemy) {
            enemy.render();
        });

        app.getPlayer().render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        gameRunning = true;
				app.getPlayer().reset(app.getCurrentLevel().startPt.x, app.getCurrentLevel().startPt.y);
				app.resetEnemies(); // kick off new enemy placements

        doc.getElementById('prompt').style.display = 'none';
        //init();
    }

		/* This function displays centered game text to the player
		 * Takes two args: text to display; # secs to persist, no second arg means text doesnt timeout
		 */
		function flashText(displayText, duration) {
			//console.log("displaying text");

					ctx.save();
					ctx.shadowColor = "yellow";
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = 30;

					ctx.fillStyle = "rgb(50, 50, 50)";
					ctx.font = "64px Ewert";
					ctx.textAlign = "center";
					ctx.textBaseline = "center";
					if(app.isLevelComplete()) {
						ctx.fillText("Maktub!", 350, 300);
					}
					else {
						ctx.fillText(displayText, 350, 300);
					}
					ctx.restore();
		}

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        // new grapics
        'images/unit1.png',
        'images/automapping-terrain.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
