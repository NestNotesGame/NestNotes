// player.js
// Dependencies: 
// Description: singleton object that is a module of app
// properties of the player and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};
// the 'player' object literal is now a property of our 'app' global variable
app.player = {
	color: "yellow",
	init: function(){
		this.image = new Image(); this.image.src = app.IMAGES['ellie'];
	},
	x: 25,
	y: 25,
	width: 50,
	height: 50,
	speed: 50,
	moving: false,
	proportion: 1.0,
	level: 1,
	image: undefined,
	alive: true,
	life: 10,
	reset: function(){ // resets stats for a new game
		this.life = 10;
		this.alive = true;
		this.level = 1;
		this.x = 25;
		this.y = 25;
	},
	loseHP: function(){ // damage is dealt to the player
		var sfx = new Audio('assets/oops.wav');
		sfx.play();
		this.life-=1;
		if(this.life<=0){this.alive = false; setTimeout(function(){/*alert("You are dead!");*/this.alive = false; /*<---how the player dies*/}, 200);}
	},
	direction: undefined,
	draw: function(ctx) { // draws the player using the drawLib
		var hW = this.width/2;
		var hH = this.height/2;
		
		if(!this.image) {
			this.drawLib.rect(ctx,this.x-hW,this.y-hH,this.width,this.height,this.color);
		}
		else if(this.image) {
			this.drawLib.drawImg(ctx,this.x-(hW*this.proportion),this.y-(hH*this.proportion),this.width*this.proportion,this.height*this.proportion,this.image);
		}
	},
	// moveLeft: function(dt) { this.x -= this.speed * dt; },
	// moveRight: function(dt) { this.x += this.speed * dt; },
	// moveUp: function(dt) { this.y -= this.speed * dt; },
	// moveDown: function(dt) { this.y += this.speed * dt; },
	
	// movement functions, they move you
	moveLeft: function(dt) { this.x -= this.speed * dt; },
	moveRight: function(dt) { this.x += this.speed * dt; },
	moveUp: function(dt) { this.y -= this.speed * dt; },
	moveDown: function(dt) { this.y += this.speed * dt; },
	
	// a double move
	jump: function(direction){
		(direction=="l")? this.shiftLeft(10,2): (direction=="r")? this.shiftRight(10,2): (direction=="d")? this.shiftDown(10,2): (direction=="u")? this.shiftUp(10,2): 0;
		this.expandShrink();
	},
	
	// this grows and shrinks the player image to emulate jumping
	expandShrink: function(x){
		x = typeof x !== 'undefined' ? x : 0;
		this.proportion=-(x*x)+(2*x)+1;
		if(x>=2){ this.proportion=1.0; return; }
		requestAnimationFrame(this.expandShrink.bind(this, x+0.15));
	},
	
	// moves one square in some direction
	shiftLeft: function(reps,speed)  {if(reps <= 0||this.level != app.tilturn.level) { this.level = app.tilturn.level; this.moving = false; return; }else{ this.moving = true; this.x -= 5*speed; reps -= 1;	requestAnimationFrame(this.shiftLeft.bind(this, reps, speed));}},
	shiftRight: function(reps,speed) {if(reps <= 0||this.level != app.tilturn.level) { this.level = app.tilturn.level; this.moving = false; return; }else{ this.moving = true; this.x += 5*speed; reps -= 1;	requestAnimationFrame(this.shiftRight.bind(this, reps, speed));}},
	shiftUp: function(reps,speed)    {if(reps <= 0||this.level != app.tilturn.level) { this.level = app.tilturn.level; this.moving = false; return; }else{ this.moving = true; this.y -= 5*speed; reps -= 1;	requestAnimationFrame(this.shiftUp.bind(this, reps, speed));}},
	shiftDown: function(reps,speed)  {if(reps <= 0||this.level != app.tilturn.level) { this.level = app.tilturn.level; this.moving = false; return; }else{ this.moving = true; this.y += 5*speed; reps -= 1;	requestAnimationFrame(this.shiftDown.bind(this, reps, speed));}}
}; // end app.player