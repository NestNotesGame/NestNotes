// tilturn.js
// tilturn.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};
app.tilturn = {
	// CONSTANT properties
    WIDTH:  400, 
    HEIGHT: 400, 
    canvas: undefined,
    ctx: undefined,
    player: undefined,
    drawLib: undefined,
	dt: 1/60.0,
	app: app,
	tiles: [],
	level: 0,
	points: 0,
	changing: false,
	touch: false,
	mouseClick: false,
	lastTouchLocation: {x: 0, y: 0},
	// goes up to level 9 and then the game ends; sets up all tiles and saves the highscore
	setLevel: function(num){ 
		if(num == 1) {this.points = 0;}		
		app.player.moving = false;
		this.level = num;
		app.player.level = num;
		this.tiles = [];
		var list = [];
		list = list.concat(this.findAdjacentAvailableTiles({x:0,y:0}));
		this.tiles.push(new app.Tile(0,0,"claimed"));
		for (var i = 0; i < num*7; i++) { // creates the tiles
			var tile = new app.Tile(0,0,"empty");
			tile = this.generateTile(tile,list);
			if(tile){
				list = list.concat(this.findAdjacentAvailableTiles({x:tile.x,y:tile.y}));
				this.tiles.push(tile);
			}	
		}		
		setTimeout(function(){app.tilturn.changing=false;},100);
		
		this.player.x = 25;
		this.player.y = 25;
	},
	generateTile: function(tile, list) { // finds empty spots to put tiles and puts them there
		tile = list[getRandomInt(0, list.length-1)];
		if(list.length<1){return false;}
		
		if(tile){tile.state = "empty";} 
		if(!this.findTile({x:tile.x,y:tile.y}) && this.findAdjacentAvailableTiles({x:tile.x,y:tile.y})){return tile;}
		else {return this.generateTile(tile,list);}
	},
	moveDir: function(movementVector){
		if(movementVector.x < 0)     {return "LEFT";}
		else if(movementVector.x > 0){return "RIGHT";}
		else if(movementVector.y < 0){return "UP";}
		else if(movementVector.y > 0){return "DOWN";}
	},
	findTile: function(loc){ // finds an existing tile at the x,y coordinate by grid coordinates, not actual x,y
		for (var i = 0; i < this.tiles.length; i++) { 
			var tile = this.tiles[i];
			if(tile.x == loc.x && tile.y == loc.y) { return tile; }
		}
		return false;
	},
	findAdjacentAvailableTiles: function(loc) { // finds all available adjacent tiles to a tile at the x,y of loc
		var tile = new app.Tile(loc.x,loc.y,"empty");
		var available = [];
		
		if(tile.x>0&&!this.findTile({x: tile.x-1, y: tile.y})){ 
			available.push(new app.Tile(tile.x-1, tile.y, "empty"));
		}
		if(tile.x<7&&!this.findTile({x: tile.x+1, y: tile.y})){ 
			available.push(new app.Tile(tile.x+1, tile.y, "empty"));
		}
		if(tile.y>0&&!this.findTile({x: tile.x, y: tile.y-1})){ 
			available.push(new app.Tile(tile.x, tile.y-1, "empty"));
		}
		if(tile.y<7&&!this.findTile({x: tile.x, y: tile.y+1})){ 
			available.push(new app.Tile(tile.x, tile.y+1, "empty"));
		}
		return available;
	},
	// checks to see if you've completed a level
	checkWin: function(){ // checks if you win a level
		for (var i = 0; i < this.tiles.length; i++) { 
			var tile = this.tiles[i];
			if(tile.state != "claimed"){return false;}
		}
		createjs.Sound.play('good');
		if(this.level >= 9){this.level=1; saveHighscore(); this.pause=0; app.tilturn.player.reset(); alert("YOU WIN!!!"); this.title=1; this.setLevel(1); return true;} // if the game is over, jumps out of the function
		else {this.points+=this.level*5; this.setLevel(this.level+1);};
		return false;
	},
    // methods
	// initializes all values of the tilturn game
	init : function(player) {
		// declare properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		// set up player player
		this.player = player;
		this.player.init();
		this.tiles = [];
		this.setLevel(1); //this.tiles =  ;// [{state: "empty", x:0, y:0},{state: "empty", x:1, y:0},{state: "empty", x:0, y:1},{state: "empty", x:1, y:1}]
		
		var tileClaimed=this.findTile({x:(this.player.x-25)/50,y:(this.player.y-25)/50});
		if(tileClaimed){
			tileClaimed.state = "claimed";
			this.points+=1;
			createjs.Sound.play('good');
		}
		var image1 = new Image(); image1.src = app.IMAGES["ellie"];
		var image2 = new Image(); image2.src = app.IMAGES["ins"];
		var image3 = new Image(); image3.src = app.IMAGES["steel"];
		var image4 = new Image(); image4.src = app.IMAGES["ins2"]
		this.steelBg = image3;
		this.titleBg = image1;
		this.instructionsImg = image2;
		this.instructionsImg2 = image4;
		
		this.canvas.addEventListener("click", function(e){
			app.tilturn.mouseClick = true;
			var x;
			var y;
			if (e.pageX || e.pageY) { 
			  x = e.pageX;
			  y = e.pageY;
			}
			else { 
			  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
			  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
			} 
			x -= app.tilturn.canvas.offsetLeft;
			y -= app.tilturn.canvas.offsetTop;
			app.tilturn.lastTouchLocation = {x: x*400/app.drawLib.width, y: y*400/app.drawLib.height};
			console.log("Last Touch: " + app.tilturn.lastTouchLocation.x + ", " + app.tilturn.lastTouchLocation.y);
			
			if(app.tilturn.title==0&&app.tilturn.pause==0&&app.player.alive){
				app.tilturn.checkMouseClicks();
			}
			else if (app.tilturn.title==0&&app.tilturn.pause==0){
				app.tilturn.pause = 0; 
				app.tilturn.player.reset(); 
				app.tilturn.setLevel(1); 
			}
			else if(app.tilturn.pause>0){
				var resume = y<316 && y>280;
				var restart = y>315 && y<351;
				var quit = y>350 && y<385;
				if (resume) { /*resume*/ app.tilturn.pause = 1; }
				else if(restart) { /*restart*/ app.tilturn.pause = 2; }
				else if(quit) { /*quit*/ app.tilturn.pause = 3; }
				
				if(app.tilturn.pause == 1){
					app.tilturn.pause = 0; 
					app.tilturn.changing = true; 
					setTimeout(function(){app.tilturn.changing=false;},100);
				}
				else if(app.tilturn.pause == 2){
					app.tilturn.pause = 0; 
					app.tilturn.player.reset(); 
					app.tilturn.setLevel(1); 
				}
				else if(app.tilturn.pause == 3){
					app.tilturn.pause = 0; 
					app.tilturn.player.reset(); 
					app.tilturn.setLevel(1); 
					app.tilturn.title=1; 
					app.tilturn.changing = true; 
					setTimeout(function(){app.tilturn.changing=false;},100);
				}
			}
			else if (app.tilturn.instructions > 0){
				if (!app.tilturn.changing) { 
					app.tilturn.instructions = (app.tilturn.instructions==1)? 2: 0;  
					app.tilturn.changing = true; 
					setTimeout(function(){app.tilturn.changing=false;},100);
				}
			}
			else if(app.tilturn.title>0){
				var play = y>265 && y<311;
				var instructions = y>310 && y<365;
				if (play) { /*resume*/ app.tilturn.title = 1; }
				else if(instructions) { /*restart*/ app.tilturn.title = 2; }
				
				if(app.tilturn.title == 1 && play){
					app.tilturn.title = 0;
					app.tilturn.changing = true; 
					setTimeout(function(){app.tilturn.changing=false;},100);
				}
				else if(app.tilturn.title == 2 && instructions && !app.tilturn.changing){
					app.tilturn.instructions = 1;
					app.tilturn.changing = true; 
					setTimeout(function(){app.tilturn.changing=false;},100);
				}
			}
		});
		this.canvas.addEventListener("mousemove", function(e){
			var x;
			var y;
			if (e.pageX || e.pageY) { 
			  x = e.pageX;
			  y = e.pageY;
			}
			else { 
			  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
			  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
			} 
			x -= app.tilturn.canvas.offsetLeft;
			y -= app.tilturn.canvas.offsetTop;
			app.tilturn.lastTouchLocation = {x: x*400/app.drawLib.width, y: y*400/app.drawLib.height};
			console.log("Last Touch: " + app.tilturn.lastTouchLocation.x + ", " + app.tilturn.lastTouchLocation.y);
			
			if(app.tilturn.pause>0){
				var resume = y<316 && y>280;
				var restart = y>315 && y<351;
				var quit = y>350 && y<385;
				if (resume) { /*resume*/ app.tilturn.pause = 1; }
				else if(restart) { /*restart*/ app.tilturn.pause = 2; }
				else if(quit) { /*quit*/ app.tilturn.pause = 3; }
			}
			if(app.tilturn.title>0 && app.tilturn.instructions==0){
				var play = y>265 && y<311;
				var instructions = y>310 && y<365;
				if (play) { /*play*/ app.tilturn.title = 1; }
				else if(instructions) { /*instructions*/ app.tilturn.title = 2; }
			}
		});
		this.update();
	},
	pause: 0,
	title: 1,
	instructions: 0,
	setTitle: function(){
		title = 1;
		this.changing = true; 
		setTimeout(function(){app.tilturn.changing=false;},1000);
	},
	titleBg: undefined,
	getLowerValue: function(a,b){
		if (a>b) {
			return b;
		}
		else {
			return a;
		}
	},
	getUpperValue: function(a,b){
		if (a>b) {
			return a;
		}
		else {
			return b;
		}
	},
	// checks mouseClicks for actions for playing the game
	checkMouseClicks: function(){
		if(this.mouseClick){
			this.mouseClick = false;	
			
			var leftTile=this.findTile({x:(this.player.x-75)/50,y:(this.player.y-25)/50});
			var rightTile=this.findTile({x:(this.player.x+25)/50,y:(this.player.y-25)/50});
			var upTile=this.findTile({x:(this.player.x-25)/50, y:(this.player.y-75)/50});
			var downTile=this.findTile({x:(this.player.x-25)/50,y:(this.player.y+25)/50});
			var left2Tile=this.findTile({x:(this.player.x-125)/50,y:(this.player.y-25)/50});
			var right2Tile=this.findTile({x:(this.player.x+75)/50,y:(this.player.y-25)/50});
			var up2Tile=this.findTile({x:(this.player.x-25)/50,y:(this.player.y-125)/50});
			var down2Tile=this.findTile({x:(this.player.x-25)/50,y:(this.player.y+75)/50});
			
			//console.log("LEFT: "+leftTile.contains(this.lastTouchLocation)+"   RIGHT: " + rightTile.contains(this.lastTouchLocation)+"   UP: " + upTile.contains(this.lastTouchLocation)+"   DOWN: " + downTile.contains(this.lastTouchLocation));
			
			var mouse = this.lastTouchLocation;
			console.log("mouse: " + mouse.x + ", " + mouse.y);
			console.log("player: " + app.player.x + ", " + app.player.y);
			console.log("ydist: " + mouse.y-app.player.y);
			console.log("xdist: " + mouse.x-app.player.x);
			
			if(Math.abs(mouse.y-app.player.y)<25){
				if(mouse.x<app.player.x && app.player.x-mouse.x < 75){
					console.log("left tile!");
					if(leftTile){
						this.player.shiftLeft(10,1);
						if(leftTile.state == "claimed") { leftTile.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){leftTile.state = "claimed";}, 100);
					}
				}
				else if(mouse.x>app.player.x && app.player.x-mouse.x > -75){
					console.log("right tile!");
					if(rightTile){
						this.player.shiftRight(10,1);
						if(rightTile.state == "claimed") { rightTile.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){rightTile.state = "claimed";}, 100);
					}
				}
				else if(mouse.x<app.player.x && app.player.x-mouse.x < 125){
					console.log("left2 tile!");
					if(left2Tile){
						this.player.jump('l');
						if(left2Tile.state == "claimed") { left2Tile.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){left2Tile.state = "claimed";}, 100);
					}
				}
				else if(mouse.x>app.player.x && app.player.x-mouse.x > -125){
					console.log("right2 tile!");
					if(right2Tile){
						this.player.jump('r');
						if(right2Tile.state == "claimed") { right2Tile.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){right2Tile.state = "claimed";}, 100);
					}
				}					
			}
			else if(Math.abs(mouse.x-app.player.x)<25){
				if(mouse.y<app.player.y && app.player.y-mouse.y < 75){
					console.log("upper tile!");
					if(upTile){
						this.player.shiftUp(10,1);
						if(upTile.state == "claimed") { upTile.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){upTile.state = "claimed";}, 100);
					}
				}
				else if(mouse.y>app.player.y && app.player.y-mouse.y > -75){
					console.log("lower tile!");
					if(downTile){
						this.player.shiftDown(10,1);
						if(downTile.state == "claimed") { downTile.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){downTile.state = "claimed";}, 100);
					}
				}	
				else if(mouse.y<app.player.y && app.player.y-mouse.y < 125){
					console.log("upper2 tile!");
					if(up2Tile){
						this.player.jump('u');
						if(up2Tile.state == "claimed") { up2Tile.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){up2Tile.state = "claimed";}, 100);
					}
				}
				else if(mouse.y>app.player.y && app.player.y-mouse.y > -125){
					console.log("lower2 tile!");
					if(down2Tile){
						this.player.jump('d');
						if(down2Tile.state == "claimed") { down2Tile.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){down2Tile.state = "claimed";}, 100);
					}
				}				
			}
			else{ console.log("none");}
		}
		else { console.log("?");}
	},
	instructionsImg: undefined,
	instructionsImg2: undefined,
	redefineSize: function(){
		var _size = this.getUpperValue(800,document.body.clientWidth/4);
		if(document.body.clientWidth < 800) { _size = document.body.clientWidth/2; }
		this.canvas.width = (this.canvas.height = _size);
		this.WIDTH = this.canvas.width;
		this.HEIGHT = this.canvas.height;
		
		app.drawLib.width = this.WIDTH;
		app.drawLib.height = this.HEIGHT;
	},
	steelBg: undefined,
	update: function() { // updates the game
		requestAnimationFrame(this.update.bind(this));
		
		this.redefineSize();
		document.querySelector("#lives").innerHTML = "Lives: " + app.player.life;
		document.querySelector("#level").innerHTML = "Level: " + this.level;
		document.querySelector("#points").innerHTML = "Points: " + this.points;
		document.querySelector("#highscore").innerHTML = "Highscore: " + getHighscore();
		app.drawLib.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);		
		
		// if not in title mode, proceed with the game
		if(this.title==0) {
			// Movement!
			if(!this.player.moving && this.player.alive && this.pause == 0) {
				// move left		
				// this.mouseClick;
				// this.lastTouchLocation.x,.y
				if(this.app.keydown[this.app.KEYBOARD.KEY_LEFT]) {
					var tileClaimed=this.findTile({x:(this.player.x-75)/50,y:(this.player.y-25)/50});
					if(tileClaimed){
						this.player.shiftLeft(10,1);
						if(tileClaimed.state == "claimed") { tileClaimed.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){tileClaimed.state = "claimed";}, 100);
					}
				}
				// move right
				if(this.app.keydown[this.app.KEYBOARD.KEY_RIGHT]) {
					var tileClaimed=this.findTile({x:(this.player.x+25)/50,y:(this.player.y-25)/50});
					if(tileClaimed){
						this.player.shiftRight(10,1);
						if(tileClaimed.state == "claimed") { tileClaimed.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){tileClaimed.state = "claimed";}, 100);
					}
				}
				// move up
				if(this.app.keydown[this.app.KEYBOARD.KEY_UP]) {
					var tileClaimed=this.findTile({x:(this.player.x-25)/50, y:(this.player.y-75)/50});
					if(tileClaimed){
						this.player.shiftUp(10,1);
						if(tileClaimed.state == "claimed") { tileClaimed.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){tileClaimed.state = "claimed";}, 100);
					}
				}
				// move down
				if(this.app.keydown[this.app.KEYBOARD.KEY_DOWN]) {
					var tileClaimed=this.findTile({x:(this.player.x-25)/50,y:(this.player.y+25)/50});
					if(tileClaimed){
						this.player.shiftDown(10,1);
						if(tileClaimed.state == "claimed") { tileClaimed.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){tileClaimed.state = "claimed";}, 100);
					}
				}
				// jump up
				if(this.app.keydown[this.app.KEYBOARD.W]) {
					var tileClaimed=this.findTile({x:(this.player.x-25)/50,y:(this.player.y-125)/50});
					if(tileClaimed && !this.changing){
						this.player.jump("u");
						if(tileClaimed.state == "claimed") { tileClaimed.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){tileClaimed.state = "claimed";}, 100);
						this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
					}
				}
				// jump left
				if(this.app.keydown[this.app.KEYBOARD.A]) {
					var tileClaimed=this.findTile({x:(this.player.x-125)/50,y:(this.player.y-25)/50});
					if(tileClaimed && !this.changing){
						this.player.jump("l");
						if(tileClaimed.state == "claimed") { tileClaimed.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){tileClaimed.state = "claimed";}, 100);
						this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
					}
				}
				// jump down
				if(this.app.keydown[this.app.KEYBOARD.S]) {
					var tileClaimed=this.findTile({x:(this.player.x-25)/50,y:(this.player.y+75)/50});
					if(tileClaimed && !this.changing){
						this.player.jump("d");
						if(tileClaimed.state == "claimed") { tileClaimed.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){tileClaimed.state = "claimed";}, 100);
						this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
					}
				}
				// jump right
				if(this.app.keydown[this.app.KEYBOARD.D]) {
					var tileClaimed=this.findTile({x:(this.player.x+75)/50,y:(this.player.y-25)/50});
					if(tileClaimed && !this.changing){
						this.player.jump("r");
						if(tileClaimed.state == "claimed") { tileClaimed.red = true; app.player.loseHP(); this.points-=1;}else{this.points+=1; createjs.Sound.play('good');}
						setTimeout(function(){tileClaimed.state = "claimed";}, 100);
						this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
					}
				}
				
				// AVAILABLE ADJACENT TILES SET AVAILABLE
				var availableTile=this.findTile({x:(this.player.x-75)/50,y:(this.player.y-25)/50});
				if(availableTile){
					availableTile.is_available = true;
				}
				
				availableTile=this.findTile({x:(this.player.x+25)/50,y:(this.player.y-25)/50});
				if(availableTile){
					availableTile.is_available = true;
				}
				
				availableTile=this.findTile({x:(this.player.x-25)/50, y:(this.player.y-75)/50});
				if(availableTile){
					availableTile.is_available = true;
				}
				
				availableTile=this.findTile({x:(this.player.x-25)/50,y:(this.player.y+25)/50});
				if(availableTile){
					availableTile.is_available = true;
				}
				
				// AVAILABLE JUMP-TO TILES SET AVAILABLE
				availableTile=this.findTile({x:(this.player.x-25)/50,y:(this.player.y-125)/50});
				if(availableTile){
					availableTile.is_available = true;
				}
				
				availableTile=this.findTile({x:(this.player.x-125)/50,y:(this.player.y-25)/50});
				if(availableTile){
					availableTile.is_available = true;
				}
				
				availableTile=this.findTile({x:(this.player.x-25)/50,y:(this.player.y+75)/50});
				if(availableTile){
					availableTile.is_available = true;
				}
				
				availableTile=this.findTile({x:(this.player.x+75)/50,y:(this.player.y-25)/50});
				if(availableTile){
					availableTile.is_available = true;
				}
				
				// check if win
				if(this.checkWin()) { alert("you win"); this.title = 1;/*console.log("you win");*/ }
			}
			
			// draws background
			app.drawLib.backgroundGradient(this.ctx, this.WIDTH, this.HEIGHT);
			// draws all tiles
			if(app.tilturn.tiles){
				for (var i = 0; i < app.tilturn.tiles.length && app.tilturn.tiles; i++) { 
					var tile = app.tilturn.tiles[i];
					tile.draw();
				}
			}
			// draws the player
			this.player.draw(this.ctx);
				
			// On player death, this is the gamestate for losing
			if(!this.player.alive){
				this.ctx.globalAlpha = 0.5;
				app.drawLib.rect(this.ctx, 0, 0, 400, 400, "rgba(50,50,50,10)");
				this.ctx.globalAlpha = 1.0;
				app.drawLib.rect(this.ctx, 0, 60, 400, 100, "rgba(0,25,0,255)");
				
				saveHighscore();
				app.drawLib.drawText(this.ctx, 40, 'VT323', "YOU LOSE!", 200, 100+2, "rgba(80,80,80,255)");
				app.drawLib.drawText(this.ctx, 40, 'VT323', "YOU LOSE!", 200, 100, "rgba(250,50,50,10)");
				app.drawLib.drawText(this.ctx, 20, 'VT323', "Press Enter to Restart", 200, 140+1,"rgba(80,80,80,255)");
				app.drawLib.drawText(this.ctx, 20, 'VT323', "Press Enter to Restart", 200, 140,"rgba(150,50,50,10)");
				
				this.ctx.globalAlpha = 1.0;
				
				if(this.app.keydown[this.app.KEYBOARD.KEY_ENTER]) {
					app.player.reset();
					this.setLevel(1);
				}
			}
			
			// Paused mode
			if(this.pause != 0 && this.player.alive){
				this.ctx.globalAlpha = 0.5;
				app.drawLib.rect(this.ctx, 0, 0,  400, 400, "rgba(50,50,50,10)");
				
				this.ctx.globalAlpha = 1.0;
				app.drawLib.rect(this.ctx, 0, 60, 400, 130, "rgba(0,25,0,255)");
				
				app.drawLib.drawText(this.ctx, 40,'VT323', "PAUSED", 200, 100+2, "rgba(80,80,80,255)");
				app.drawLib.drawText(this.ctx, 40,'VT323', "PAUSED", 200, 100, "rgba(250,50,50,10)");
				
				var green = (this.pause==1)? 150: 50;
				app.drawLib.drawText(this.ctx, 18, 'VT323', "resume",200, 140+1, "rgba(80,80,80,255)");
				app.drawLib.drawText(this.ctx, 18, 'VT323', "resume",200, 140, "rgba(50,"+green+",50,10)");
				
				green = (this.pause==2)? 150: 50;
				app.drawLib.drawText(this.ctx, 18,'VT323', "restart", 200, 160+1, "rgba(80,80,80,255)");
				app.drawLib.drawText(this.ctx, 18,'VT323', "restart", 200, 160, "rgba(50,"+green+",50,10)");

				green = (this.pause==3)? 150: 50;
				app.drawLib.drawText(this.ctx, 18,'VT323', "quit", 200, 180+1, "rgba(80,80,80,255)");
				app.drawLib.drawText(this.ctx, 18,'VT323', "quit", 200, 180, "rgba(50,"+green+",50,10)");
				
				this.ctx.globalAlpha = 1.0;
				
				if(this.app.keydown[this.app.KEYBOARD.KEY_ENTER]) {
					if(this.pause == 1){this.pause = 0; this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);}
					else if(this.pause == 2){this.pause = 0; app.tilturn.player.reset(); this.setLevel(1); }
					else if(this.pause == 3){this.pause = 0; app.tilturn.player.reset(); this.setLevel(1); this.title=1; this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);}
					this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
				}
				
				if(!this.changing && this.app.keydown[this.app.KEYBOARD.KEY_UP]&& !this.app.lastkeydown[this.app.KEYBOARD.KEY_UP]) {
					this.pause = (this.pause==1)? 3: (this.pause==2)? 1: 2;
					this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
					createjs.Sound.play('menu');
				}
				
				if(!this.changing && this.app.keydown[this.app.KEYBOARD.KEY_DOWN]&& !this.app.lastkeydown[this.app.KEYBOARD.KEY_DOWN]) {
					this.pause = (this.pause==1)? 2: (this.pause==2)? 3: 1;
					this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
					createjs.Sound.play('menu');
				}
			}
		}
		// title screen and instructions page
		else {
			if(this.app.keydown[this.app.KEYBOARD.KEY_ENTER]&&this.instructions!=0 && !this.changing && this.app.keydown[this.app.KEYBOARD.KEY_ENTER]&& !this.app.lastkeydown[this.app.KEYBOARD.KEY_ENTER]) {
				this.instructions = (this.instructions==2)? 0: (this.instructions==1)? 2: 1;
				this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
			}
			
			if(this.app.keydown[this.app.KEYBOARD.KEY_ENTER]&&!this.instructions>0 && !this.changing && this.app.keydown[this.app.KEYBOARD.KEY_ENTER]&& !this.app.lastkeydown[this.app.KEYBOARD.KEY_ENTER]) {
				if(this.title == 1){ this.title = 0; }
				if(this.title == 2){ this.instructions = 1; }
				this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
			}
			
			this.ctx.save();
			this.ctx.globalAlpha = 0.5;
			this.ctx.fillStyle = "rgba(50,50,50,10)";
			this.ctx.fillRect(0, 0,  this.WIDTH, this.HEIGHT);
			this.ctx.restore();
			
			this.ctx.save();
			this.ctx.globalAlpha = 1.0;
			this.ctx.fillStyle = "rgba(0,25,0,255)";
			this.ctx.fillRect(0, 60,  this.WIDTH, 180);
			this.ctx.restore();
			
			if(!this.instructions>0){
				app.drawLib.drawImg(this.ctx, 0,0,400,400, this.steelBg);
				app.drawLib.drawImg(this.ctx, 100,180,200,200, this.titleBg);
				this.ctx.globalAlpha = 0.4;
				app.drawLib.rect(this.ctx, 0,360,this.WIDTH,this.HEIGHT, "#000000");
				this.ctx.globalAlpha = 1.0;
				app.drawLib.drawText(this.ctx, 12, 'VT323', "Move using arrow keys and Jump over spaces with WASD keys", 200, 379, "rgba(0,0,0,255)");
				app.drawLib.drawText(this.ctx, 12, 'VT323', "Move using arrow keys and Jump over spaces with WASD keys", 200, 378, "rgba(0,100,100,10)");
			}
			
			app.drawLib.drawText(this.ctx, 40, 'VT323', "Tilturn!", 200-1, 80-2, "rgba(0,0,0,255)");
			app.drawLib.drawText(this.ctx, 40, 'VT323', "Tilturn!", 200, 80, "rgba(50,150,150,10)");
			
			app.drawLib.drawText(this.ctx, 20, 'VT323', "by Forrest Shooster", 200-1, 110-2, "rgba(0,50,0,255)");
			app.drawLib.drawText(this.ctx, 20, 'VT323', "by Forrest Shooster", 200, 110, "rgba(0,100,100,10)");
			
			var green = (this.title==1)? 150: 50;
			app.drawLib.drawText(this.ctx, 18, 'VT323', "PLAY", 200, 140+2, "rgba(80,80,80,255)");
			app.drawLib.drawText(this.ctx, 18, 'VT323', "PLAY", 200, 140, "rgba(50,"+green+",50,10)");
			
			green = (this.title==2)? 150: 50;
			app.drawLib.drawText(this.ctx, 18, 'VT323', "INSTRUCTIONS?", 200, 160+2, "rgba(80,80,80,255)");
			app.drawLib.drawText(this.ctx, 18, 'VT323', "INSTRUCTIONS?", 200, 160, "rgba(50,"+green+",50,10)");
			
			this.ctx.globalAlpha = 1.0;
			if(this.instructions>0){
				app.drawLib.drawImg(this.ctx, 0, 0, 400, 400, (this.instructions==1)? this.instructionsImg: this.instructionsImg2);
			}
			if(!this.instructions && !this.changing && this.app.keydown[this.app.KEYBOARD.KEY_UP]&& !this.app.lastkeydown[this.app.KEYBOARD.KEY_UP]) {
				this.title = (this.title==1)? 2: 1;
				this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
				createjs.Sound.play('menu');
			}
			
			if(!this.instructions && !this.changing && this.app.keydown[this.app.KEYBOARD.KEY_DOWN]&& !this.app.lastkeydown[this.app.KEYBOARD.KEY_DOWN]) {
				this.title = (this.title==1)? 2: 1;
				this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
				createjs.Sound.play('menu');
			}
		}
		
		// shows that music can be toggled
		app.drawLib.drawText(this.ctx, 12, 'VT323', "Press 'z' to toggle sound if desktop", 200, 395, "rgba(0,0,0,255)");
		app.drawLib.drawText(this.ctx, 12, 'VT323', "Press 'z' to toggle sound if desktop", 200, 396, "rgba(0,100,100,10)");
		
		// toggle music on pressing 'z'
		if(!this.changing && this.app.keydown[this.app.KEYBOARD.Z]&& !this.app.lastkeydown[this.app.KEYBOARD.Z]) {
			app.toggleMusic();
			this.changing = true; 
			setTimeout(function(){app.tilturn.changing=false;},100);
		}
		
		// toggle pause on pressing 'p'
		if(!this.changing && this.app.keydown[this.app.KEYBOARD.P]&& !this.app.lastkeydown[this.app.KEYBOARD.P]) {
			app.tilturn.pause = (app.tilturn.pause>=1)? 0 : 1;
			this.changing = true; setTimeout(function(){app.tilturn.changing=false;},100);
		}
	}    
}; // end app.tilturn

// generates a random integer, rounded down
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}