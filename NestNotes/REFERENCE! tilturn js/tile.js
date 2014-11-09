"use strict";
var app = app||{};
app.Tile = function(){
	function Tile(x,y,state){
		this.state = state;
		this.x = x;
		this.y = y;
		this.has_hover = false;
		this.is_available = false;
		this.dirt =  new Image(); this.dirt.src = app.IMAGES["dirt"];
		this.grass = new Image(); this.grass.src = app.IMAGES["grass"];
		this.steel = new Image(); this.steel.src = app.IMAGES["steel"];
		this.contains = function(point){
			var _contains = point.x>this.x && point.x < this.x + (50*app.drawLib.width/400) && point.y>this.y && point.y < this.y + (50*app.drawLib.height/400);
			console.log(_contains);
			return _contains;
		};
	};
	
	var p = Tile.prototype;
	p.draw = function(){
		var img = (this.state == "claimed")? ((this.red)? this.dirt: this.grass): this.steel;
		app.drawLib.drawImg(app.tilturn.ctx, this.x*50,this.y*50,50,50,img);
		var glow = 0.0;
		if(this.has_hover){
			glow+=0.2;
		}
		if(this.is_available){
			glow+=0.1;
		}
		if(glow>0){
			app.drawLib.rect(app.tilturn.ctx,this.x*50,this.y*50,50,50, "rgba(255,255,0,"+glow+")");
		}
		
		this.has_hover = false;
		this.is_available = false;
	};
	
	return Tile;
}();