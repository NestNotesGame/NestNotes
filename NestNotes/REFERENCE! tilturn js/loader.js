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
app.music_playing=true;
app.music_was_on = true;

// array of all usable keys
app.KEYBOARD = {"Z": 90, "P": 80, "W": 87, "A": 65,"S": 83, "D": 68, "KEY_LEFT": 37, "KEY_RIGHT": 39, "KEY_UP": 38, "KEY_DOWN": 40, "KEY_SPACE": 32, "KEY_ENTER": 13};
app.keydown = [];
app.lastkeydown = [];

// runs when all elements load to the page
window.onload = function() {
	
	app.player.drawLib = app.drawLib;
	app.tilturn.app = app;

	app.IMAGES = {
		ellie: "assets/player.png",
		dirt:  "assets/dirt.png",
		grass: "assets/grass.png",
		steel: "assets/steel.png",
		ins:   "assets/ins.png",
		ins2:  "assets/ins2.png"
	};	

	app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);
	app.queue.on("complete", function(){
		app.tilturn.init(app.player);
	});
	app.queue.loadManifest([
		{id: "ellie", src: "assets/player.png"},
		{id: "dirt", src: "assets/dirt.png"},
		{id: "grass", src: "assets/grass.png"},
		{id: "steel", src: "assets/steel.png"},
		{id: "ins", src: "assets/ins.png"},
		{id: "ins2", src: "assets/ins2.png"},
		{id: "oops", src: "assets/oops.wav"},
		{id: "menu", src: "assets/menu.wav"},
		{id: "good", src: "assets/good.wav"},
		{id: "music", src: "assets/ct2.mp3"}
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
	
	app.music = createjs.Sound.play("music",{loop:-1, volume: 0.7});
}
// saves the current highscore to localStorage
function saveHighscore() {
    if (!supportsLocalStorage()) { return false; }
	if(!localStorage["tilturn.highscore"]||localStorage["tilturn.highscore"]< app.tilturn.points){
		localStorage["tilturn.highscore"] = app.tilturn.points;
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
	if(!localStorage["tilturn.highscore"]){
		return 0;
    }
	return localStorage["tilturn.highscore"];
}

// pauses the game when out of browser
window.onblur = function(){
	if(app.music_playing == true){
		app.music_was_on = true;
	}
	app.pauseMusic();
	app.tilturn.pause = 1;
}

// ensures that music that was stopped due to leaving the screen returns on refocus of the page as opposed to on key-press
window.onfocus = function(){
	if(app.music_was_on == true){
		app.resumeMusic();
		app.music_playing = true;
	}
	app.music_was_on = false;
}

// toggles the state of the bg music (playing vs stopped)
app.resumeMusic = function(){
	app.music.resume();
};

app.pauseMusic = function(){
	app.music.pause();
};

app.toggleMusic = function(){
	app.music_playing=!app.music_playing;
	
	if(!app.music_playing){
		app.pauseMusic();
	}
	else {
		app.resumeMusic();
	}
};
