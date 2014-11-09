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
		this.l = new Image(); 
		this.l.src = app.IMAGES['playerL'];
		this.m = new Image();  
		this.m.src = app.IMAGES['playerM'];
		this.r = new Image(); 
		this.r.src = app.IMAGES['playerR'];
		this.i1 = new Image(); 
		this.i1.src = app.IMAGES['playerI1'];
		this.i2 = new Image(); 
		this.i2.src = app.IMAGES['playerI2'];
	},
	x: 0,
	y: 0,
	width: 128,
	height: 128,
	
	state: undefined,
	image: undefined,
	alive: true,
	life: 3,
	i1: undefined,
	i2: undefined,
	m : undefined,
	l : undefined,
	r : undefined,
	reset: function(){ // resets stats for a new game
		//
	},
	//loseHP: function(){ // damage is dealt to the player
	//	//var sfx = new Audio('assets/oops.wav');
	//	//sfx.play();
	//	//this.life-=1;
	//	//if(this.life<=0){this.alive = false; setTimeout(function(){/*alert("You are dead!");*/this.alive = false; /*<---how the player dies*/}, 200);}
	//},
	draw: function(ctx) { // draws the player using the drawLib
		app.player.x = 1024/2;
		app.player.y = 512/3 * 2;
		this.width = this.drawLib.width / 1024 * 256;
		this.height = this.drawLib.height / 512 * 256;
		var hW = this.drawLib.width / 1024 * 256/2;
		var hH = this.drawLib.height / 512 * 256/2;
		
		this.image = (this.state=="left")? this.l:(this.state=="right")? this.r:(this.state=="mid")? this.m:(this.state=="idle1")? this.i1:this.i2;
		if(this.state == "idle1" || this.state == "idle2"){
			this.state = (this.state=="idle1")? "idle2": "idle1";
		}
		if(!this.image) {
			this.drawLib.rect(ctx,this.x-hW,this.y-hH,this.width,this.height,this.color);
		}
		else if(this.image) {
			this.drawLib.drawImg(ctx,this.x-hW,this.y-hH,this.width,this.height,this.image);
		}
	}
}; // end app.player