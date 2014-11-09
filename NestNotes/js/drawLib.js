"use strict"
var app = app || {};
// an object built to monopolize all draw functions
app.drawLib = {
	// clears the screen
	width: 1024,
	height: 512,
	clear: function(ctx,x,y,w,h){
		ctx.clearRect(x*this.width/1024,y*this.height/512,w*this.width/1024,h*this.height/512);
	},
	// draws rectangles
	rect: function(ctx,x,y,w,h,color){
		ctx.save();
		ctx.fillStyle = color;
		ctx.fillRect(x*this.width/1024,y*this.height/512,w*this.width/1024,h*this.height/512);
		ctx.restore();
	},
	// draws images
	drawImg: function(ctx,x,y,w,h,img){
		ctx.save();
		try{ctx.drawImage(img,x*this.width/1024,y*this.height/512,w*this.width/1024,h*this.height/512);}catch(e){};
		ctx.restore();
	},
	drawText: function(ctx, size, font, string, x, y, color){
		var scaledFont = (size*this.width/1024) + "pt " + font;
		ctx.font = scaledFont;
		var	textWidth = ctx.measureText(string).width;
		var scaledX = (x) * this.width / 1024 - (textWidth/2);
		var scaledY = y * this.height / 1024;
		ctx.fillStyle = color;
		ctx.fillText(string, scaledX, scaledY);
	},
	// draws background gradient
	backgroundGradient: function(ctx,width,height){
		ctx.save();
		var gradient = ctx.createLinearGradient(0,0,0,height);
		gradient.addColorStop(0,"yellow");
		gradient.addColorStop(0.85,"green");
		gradient.addColorStop(1.0,"#000");
		
		ctx.fillStyle = gradient;
		ctx.fillRect(0,0,width,height);
		ctx.restore();
	}
};