"use strict";
var app = app||{};
app.Box = function(){
	function Box(x,y,state){
		this.x = x;
		this.y = y;
		this.is_available = false;
		this.halo=app.IMAGES["halo"];
		this.contains = function(point){
			var _contains = point.x>this.x && point.x < this.x + (32*app.drawLib.width/1024) && point.y>this.y && point.y < this.y + (32*app.drawLib.height/512);
			console.log(_contains);
			return _contains;
		};
	};
	
	var p = Box.prototype;
	p.draw = function(){
		if(!is_available){return;}
		var img = this.img
		app.drawLib.drawImg(app.nestNotes.ctx, this.x*32,this.y*32,32,32,halo);
	};
	
	return Box;
}();