/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// array of all usable keys
app.KEYBOARD = {"Z": 90, "PAUSE": 80, "W": 87, "A": 65,"S": 83, "D": 68, "LEFT": 37, "RIGHT": 39, "UP": 38, "DOWN": 40, "SPACE": 32, "ENTER": 13};
app.keydown = [];
app.lastkeydown = [];

// runs when all elements load to the page
window.onload = function() {
	
	app.player.drawLib = app.drawLib;
	app.nestNotes.app = app;

	app.IMAGES = {
		treeL: "assets/treeBirdL.png",
		treeR: "assets/treeBirdR.png",
		treeLS: "assets/treeBirdLSing.png",
		treeRS: "assets/treeBirdRSing.png",
		tree: "assets/tree.png",
		playerL: "assets/playerL.png",
		playerR: "assets/playerR.png",
		playerM: "assets/playerM.png",
		playerI1: "assets/playerI1.png",
		playerI2: "assets/playerI2.png",
		bg: "assets/bg.png",
		halo: "assets/halo.png",
		smoky: "assets/smoky.png"
	};	

	app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);
	app.queue.on("complete", function(){
		app.nestNotes.init(app.player);
	});
	app.queue.loadManifest([
		{id: "playerL", src: "assets/playerL.png"},
		{id: "playerR", src: "assets/playerR.png"},
		{id: "playerM", src: "assets/playerM.png"},
		{id: "playerI1", src: "assets/playerI1.png"},
		{id: "playerI2", src: "assets/playerI2.png"},
		{id: "bg", src: "assets/bg.png"},
		{id: "treeL", src: "assets/treeBirdL.png"},
		{id: "treeR", src: "assets/treeBirdR.png"},
		{id: "treeLS", src: "assets/treeBirdLSing.png"},
		{id: "treeRS", src: "assets/treeBirdRSing.png"},
		{id: "tree", src: "assets/tree.png"},
		{id: "halo", src: "assets/halo.png"},
		{id: "smoky", src: "assets/smoky.png"},
		{id: "bgm", src: "assets/bgm.mp3"}
	]);	
	
	// setting up for keyboard input
	window.addEventListener("keydown",function(e){
		app.lastkeydown[e.keyCode] = app.keydown[e.keyCode]||false;
		app.keydown[e.keyCode] = true;
		e.preventDefault();
	});
	window.addEventListener("keyup",function(e){
		app.lastkeydown[e.keyCode] = app.keydown[e.keyCode]||false;
		app.keydown[e.keyCode] = false;
		e.preventDefault();
	});
	
	// app.music = createjs.Sound.play("music",{loop:-1, volume: 0.7});
}
// saves the current highscore to localStorage
function saveHighscore() {
    if (!supportsLocalStorage()) { return false; }
	if(!localStorage["nestNotes.highscore"]||localStorage["nestNotes.highscore"]< app.nestNotes.points){
		localStorage["nestNotes.highscore"] = app.nestNotes.points;
    }
	return true;
}

// checks to make sure the browser supports localStorage 
function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

// returns the current highscore
function getHighscore() {
    if (!supportsLocalStorage()) { return 0; }
	if(!localStorage["nestNotes.highscore"]){
		return 0;
    }
	return localStorage["nestNotes.highscore"];
}