/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var Engine = (function(global) {
	var doc = global.document,
			win = global.window,
			canvas = doc.createElement('canvas'),
			ctx = canvas.getContext('2d'),
			lastTime,
			gameRunning = true; // ID var to start and stop animation loop

	// create game start/explanation screen
	var startScreen = doc.createElement('div');
	startScreen.id = 'startScreen';
	doc.getElementById('container').appendChild(startScreen);

	// Dialog box
	var startButton = doc.createElement('button');
	startButton.onclick = kickoff;
	startButton.textContent = 'BEGIN!';
	startButton.className = 'textureGray';
	doc.getElementById('startScreen').appendChild(startButton);

	// Canvas screen config
	canvas.width = 707;
	canvas.height = 606;
	doc.getElementById('mainscreen').appendChild(canvas);

	// Prompt box
	var promptBox = doc.createElement('div');
	promptBox.id = 'prompt';
	promptBox.className = 'textureGray';
	promptBox.innerHTML = '<p>...but you can try again!</p><button id="restart">Lets go!</button>';
	doc.getElementById('mainscreen').appendChild(promptBox);

	// Restart button...continue
	doc.getElementById('restart').onclick = restart;

	// Rebegin button...start from the beginning
	var rebeginButton = doc.createElement('button');
	rebeginButton.id = 'rebegin';
	rebeginButton.onclick = rebegin;
	rebeginButton.textContent = 'reBEGIN!';
	rebeginButton.className = 'textureGray';
	doc.getElementById('mainscreen').appendChild(rebeginButton);

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
			if(app.getCurrentLevelnum() === 5) { // game currently has 6 levels
				gameWin();
			}
			else {
				app.increaseLevel();
				app.setLevelComplete(false);
				init();
			}
		}
		else {
			if(gameRunning) win.requestAnimationFrame(main);
		}
	}

	/* This function sets everything in motion upon start button click
	 */
	function kickoff() {
		new Audio('../sounds/startup1.ogg').play(); // play game start sound effect
		document.getElementById('startScreen').style.opacity = '0';
		setTimeout(
			function() {
				doc.getElementById('player').volume-=0.8;
				document.getElementById('startScreen').style.display = 'none';
			}, 3000); // wind 'soundtrack' will be deafened with game start
		init();
	}

	/* This function handles transition into game restart
	 */
	function restart() {
		// delay just a sec to allow sound effect and css animation
		new Audio('../sounds/dun3.mp3').play();
		setTimeout(init, 1000);
	}

	/* Start the game over from the beginning
	 */
	function rebegin() {
		new Audio('../sounds/startup1.ogg').play(); // play game start sound effect
		setTimeout(
			function() {
				app.setCurrentLevel();
				app.setLevelComplete(false);
				doc.getElementById('rebegin').style.display = 'none';
				doc.getElementById('player').play();
				init()
			}, 3000);
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

	/* Update all onscreen object positions and check collisions
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
		app.getEnemies().forEach(function(enemyline) {
			enemyline.forEach(function(enemy) {
				var enemyNose = enemy.x + 91; // 91 represents visible length of enemy sprite
				if ((enemyNose >= app.getPlayer().x && enemy.x <= app.getPlayer().x + 32) &&
						(enemy.y === app.getPlayer().y - 25)) {
					 // Play sound; call Game Over state
					new Audio('../sounds/chomp.mp3').play();
					gameOver();
				}
			});
		});
	}

	/* Display prompt offering restart
	 */
	function gameOver() {
		gameRunning = false;
		doc.getElementById('prompt').style.display = 'inherit';
	}

	/* Play sounds and present player with victory message
	 */
	function gameWin() {
		new Audio('../sounds/gong.ogg').play();
		doc.getElementById('player').pause();
		var btn = doc.getElementById('rebegin').style.display = 'inherit';
		setTimeout(function() {
			var btn = doc.getElementById('rebegin');
			btn.style.top='350px';
		}, 4500);
	}

	/* This is called by the update function  and loops through all of the
	 * objects within your allEnemies array as defined in app.js and calls
	 * their update() methods. It will then call the update function for your
	 * player object. These update methods should focus purely on updating
	 * the data/properties related to  the object. Do your drawing in your
	 * render methods.
	 */
	function updateEntities(dt) {
		app.getEnemies().forEach(function(enemyline) {
			enemyline.forEach(function(enemy) {
				enemy.update(dt);
			});
		});
		app.getPlayer().update();
	}

	/* This function initially draws the "game level", it will then call
	 * the renderEntities function.
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
			flashText('Forward!'); // flash a Ready message to player first 2 secs of level
		}
		else if(app.isLevelComplete()) {
			flashText('Maktub!');
		}
		else if(!gameRunning) {
			flashText('Game Over!');
		}
	}

	/* This function is called by the render function and is called on each game
	 * tick. It's purpose is to then call the render functions you have defined
	 * on your enemy and player entities within app.js
	 */
	function renderEntities() {
		// Loop through all of the objects within the allEnemies array(s) calling render on each
		app.getEnemies().forEach(function(enemyline) {
			enemyline.forEach(function(enemy) {
				enemy.render();
			});
		});

		app.getPlayer().render();

		// draw the goal object, ie The Ancestor...but if last level draw the Knight
		if(app.isLevelComplete())	{
			ctx.drawImage(Resources.get('images/unit3.png'), 0, 64, 32, 32, app.getCurrentLevel().exitPt.x, app.getCurrentLevel().exitPt.y, 32, 32);
		}
		else {
			ctx.drawImage(Resources.get('images/unit4.png'), 0, 64, 32, 32, app.getCurrentLevel().exitPt.x, app.getCurrentLevel().exitPt.y, 32, 32);
		}
	}

	/* This function is a good place to handle game reset states -
	 * reset hero and enemy placements. It's called by the init() method.
	 */
	function reset() {
		gameRunning = true; // Get the game running again from Game Over state
		app.getPlayer().reset(app.getCurrentLevel().startPt.x, app.getCurrentLevel().startPt.y);
		app.resetEnemies(); // kick off new enemy placements
		doc.getElementById('prompt').style.display = 'none'; // Hide Restart Prompt
	}

	/* This function displays centered game text to the player
	 * Takes two args: text to display; # secs to persist, no second arg means text doesnt timeout
	 */
	function flashText(displayText, duration) {
		ctx.save();
		// add glow to text
		ctx.shadowColor = 'yellow';
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 30;
		ctx.fillStyle = 'rgb(50, 50, 50)';
		ctx.font = '64px Ewert';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'center';
		if(app.isLevelComplete()) {
			ctx.fillText('Maktub!', 350, 300);
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
			'images/rock.png',
			'images/stone-block.png',
			'images/water-block.png',
			'images/grass-block.png',
			'images/dirt-block.png',
			'images/plain-block.png',
			'images/wood-block.png',
			'images/wall-block.png',
			'images/enemy-bug.png',
			'images/unit1.png',
			'images/unit4.png',
			'images/unit3.png',
	]);

	// changed the kickoff init() call from here to a button press so i can control game start
	//Resources.onReady(init);

	/* Assign the canvas' context object to the global variable (the window
	 * object when run in a browser) so that developer's can use it more easily
	 * from within their app.js files.
	 */
	global.ctx = ctx;
})(this);
