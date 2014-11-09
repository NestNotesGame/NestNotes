// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};
app.HUD = function(){
	function HUD(){
	};
	var HUDObject = HUD.prototype;
	HUDObject.draw = function(){
		var img = this.img
		app.drawLib.rect(app.nestNotes.ctx, 0, 0,app.drawLib.WIDTH/3,app.drawLib.HEIGHT/2, "rgba(170,80,5,0.7)");
		app.drawLib.rect(app.nestNotes.ctx, 5, 5,app.drawLib.WIDTH/3 - 5,app.drawLib.HEIGHT/2 - 5, "rgba(255,80,5,0.7)");
	};
	
	return HUD;
}();