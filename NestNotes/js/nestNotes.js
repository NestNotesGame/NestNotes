// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};
app.nestNotes = {
	// CONSTANT properties
    WIDTH:  1024, 
    HEIGHT: 512, 
    canvas: undefined,
    ctx: undefined,
    player: undefined,
    drawLib: undefined,
	dt: 1/60.0,
	app: app,
	tiles: [],
	touch: false,
	mouseClick: false,
	lastTouchLocation: {x: 0, y: 0},
	
	// initializes all values of the nestNotes game
	init : function(player) {
		// declare properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		// set up player player
		this.player = player;
		this.player.init();
		var image1 = new Image(); image1.src = app.IMAGES["ellie"];
		// createjs.Sound.play('good');
		this.canvas.addEventListener("click", function(e){
			app.nestNotes.mouseClick = true;
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
			x -= app.nestNotes.canvas.offsetLeft;
			y -= app.nestNotes.canvas.offsetTop;
			app.nestNotes.lastTouchLocation = {x: x*1024/app.drawLib.width, y: y*512/app.drawLib.height};
			console.log("Last Touch: " + app.nestNotes.lastTouchLocation.x + ", " + app.nestNotes.lastTouchLocation.y);
			
			if(app.nestNotes.title==0&&app.nestNotes.pause==0){
				app.nestNotes.checkMouseClicks();
			}
			else if (app.nestNotes.title==0&&app.nestNotes.pause==0){
				app.nestNotes.pause = 0; 
				// app.nestNotes.player.reset(); 
			}
			else if(app.nestNotes.pause>0){
				var resume = 0;
				var restart = 0;
				var quit = 0;
				if (resume) { /*resume*/ app.nestNotes.pause = 1; }
				else if(restart) { /*restart*/ app.nestNotes.pause = 2; }
				else if(quit) { /*quit*/ app.nestNotes.pause = 3; }
				
				if(app.nestNotes.pause == 1){
					app.nestNotes.pause = 0; 
					//app.nestNotes.changing = true; 
					//setTimeout(function(){app.nestNotes.changing=false;},100);
				}
				else if(app.nestNotes.pause == 2){
					app.nestNotes.pause = 0; 
					//app.nestNotes.player.reset(); 
				}
				else if(app.nestNotes.pause == 3){
					app.nestNotes.pause = 0; 
					//app.nestNotes.player.reset(); 
					app.nestNotes.title=1; 
					//setTimeout(function(){app.nestNotes.changing=false;},100);
				}
			}
			else if (app.nestNotes.instructions > 0){
				if (!app.nestNotes.changing) { 
					app.nestNotes.instructions = (app.nestNotes.instructions==1)? 0 : 1;  
					//app.nestNotes.changing = true; 					//setTimeout(function(){app.nestNotes.changing=false;},100);
				}
			}
			else if(app.nestNotes.title>0){
			}
		});
		this.canvas.addEventListener("mousemove", function(e){
			/*
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
			x -= app.nestNotes.canvas.offsetLeft;
			y -= app.nestNotes.canvas.offsetTop;
			app.nestNotes.lastTouchLocation = {x: x*400/app.drawLib.width, y: y*400/app.drawLib.height};
			console.log("Last Touch: " + app.nestNotes.lastTouchLocation.x + ", " + app.nestNotes.lastTouchLocation.y);
			
			if(app.nestNotes.pause>0){
				var resume = y<316 && y>280;
				var restart = y>315 && y<351;
				var quit = y>350 && y<385;
				if (resume) { /*resume*//* app.nestNotes.pause = 1; }
				else if(restart) { /*restart*//* app.nestNotes.pause = 2; }
				else if(quit) { /*quit*//* app.nestNotes.pause = 3; }
			}
			if(app.nestNotes.title>0 && app.nestNotes.instructions==0){
				var play = y>265 && y<311;
				var instructions = y>310 && y<365;
				if (play) { /*play*//* app.nestNotes.title = 1; }
				else if(instructions) { /*instructions*//* app.nestNotes.title = 2; }
			}*/
		});
		this.update();
	},
	pause: 0,
	title: 0,
	instructions: 0,
	setTitle: function(){
		title = 1;
		this.changing = true; 
		setTimeout(function(){app.nestNotes.changing=false;},1000);
	},
	bg: undefined,
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
		}
		else { console.log("?");}
	},
	redefineSize: function(){
		var _size = this.getUpperValue(1024,document.body.clientWidth/4);
		if(document.body.clientWidth < 1024) { _size = document.body.clientWidth/2; }
		this.canvas.width = (this.canvas.height = _size/2);
		this.WIDTH = this.canvas.width;
		this.HEIGHT = this.canvas.height;
		
		app.drawLib.width = this.WIDTH;
		app.drawLib.height = this.HEIGHT;
	},
	update: function() { // updates the game
		requestAnimationFrame(this.update.bind(this));
		this.redefineSize();
		app.drawLib.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);		
		
		// if not in title mode, proceed with the game
		if(this.title==0) {
			// draws background
			app.drawLib.drawImg(this.ctx, 0, 0, this.WIDTH, this.HEIGHT, app.IMAGES["bg"]);
			// draws all tiles
			if(app.nestNotes.tiles){
				for (var i = 0; i < app.nestNotes.tiles.length && app.nestNotes.tiles; i++) { 
					var tile = app.nestNotes.tiles[i];
					tile.draw();
				}
			}
			// draws the player
			this.player.draw(this.ctx);
			
			// Paused mode
			if(this.pause != 0){
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
			}
		}
		// title screen and instructions page
		else {
			if(this.app.keydown[this.app.KEYBOARD.ENTER]&&this.instructions!=0 && !this.changing && !this.app.lastkeydown[this.app.KEYBOARD.ENTER]) {
				this.instructions = (this.instructions==1)? 0: 0;
				this.changing = true; setTimeout(function(){app.nestNotes.changing=false;},100);
			}
			
			if(this.app.keydown[this.app.KEYBOARD.ENTER]&&!this.instructions>0 && !this.changing && this.app.keydown[this.app.KEYBOARD.ENTER]&& !this.app.lastkeydown[this.app.KEYBOARD.ENTER]) {
				if(this.title == 1){ this.title = 0; }
				if(this.title == 2){ this.instructions = 1; }
				this.changing = true; setTimeout(function(){app.nestNotes.changing=false;},100);
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
			
			app.drawLib.drawText(this.ctx, 40, 'VT323', "Nest Notes!", 200-1, 80-2, "rgba(0,0,0,255)");
			app.drawLib.drawText(this.ctx, 40, 'VT323', "Nest Notes!", 200, 80, "rgba(50,150,150,10)");
			
			app.drawLib.drawText(this.ctx, 20, 'VT323', "by A JS Project", 200-1, 110-2, "rgba(0,50,0,255)");
			app.drawLib.drawText(this.ctx, 20, 'VT323', "by A JS Project", 200, 110, "rgba(0,100,100,10)");
			
			var green = (this.title==1)? 150: 50;
			app.drawLib.drawText(this.ctx, 18, 'VT323', "PLAY", 200, 140+2, "rgba(80,80,80,255)");
			app.drawLib.drawText(this.ctx, 18, 'VT323', "PLAY", 200, 140, "rgba(50,"+green+",50,10)");
			
			green = (this.title==2)? 150: 50;
			app.drawLib.drawText(this.ctx, 18, 'VT323', "INSTRUCTIONS?", 200, 160+2, "rgba(80,80,80,255)");
			app.drawLib.drawText(this.ctx, 18, 'VT323', "INSTRUCTIONS?", 200, 160, "rgba(50,"+green+",50,10)");
			
			this.ctx.globalAlpha = 1.0;
			if(!this.instructions && !this.changing && this.app.keydown[this.app.KEYBOARD.UP]&& !this.app.lastkeydown[this.app.KEYBOARD.UP]) {
				this.title = (this.title==1)? 2: 1;
				this.changing = true; setTimeout(function(){app.nestNotes.changing=false;},100);
				createjs.Sound.play('menu');
			}
			
			if(!this.instructions && !this.changing && this.app.keydown[this.app.KEYBOARD.DOWN]&& !this.app.lastkeydown[this.app.KEYBOARD.DOWN]) {
				this.title = (this.title==1)? 2: 1;
				this.changing = true; setTimeout(function(){app.nestNotes.changing=false;},100);
				createjs.Sound.play('menu');
			}
		}
	}    
}; // end app.nestNotes

// generates a random integer, rounded down
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}