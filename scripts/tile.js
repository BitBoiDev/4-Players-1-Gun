$.Tile = function(data){
	this.bounds = {x: 0, y: 0, w: 20, h: 20};
	this.physics = {enableCollisions: true};
	
	this.merge(data);
	this.init();
};
$.Tile.prototype = {
	init: function(){
		$.definitions.tiles[this.type](this);
	},
	
	update: function(){
		
	},
	
	render: function(ctx){
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.fillStyle = "rgba(200, 200, 200, 1)";
		ctx.fillRect(-10, -10, 20, 20);
		ctx.restore();
	}
};
