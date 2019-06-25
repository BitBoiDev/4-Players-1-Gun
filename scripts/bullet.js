$.Bullet = function(data){
	this.merge(data);
};
$.Bullet.prototype = {
	update: function(index){
		this.position.x += this.speed.x * $.dt;
		this.position.y += this.speed.y * $.dt;
		
		for(var i = 0; i < $.players.length; i++){
			var player = $.players[i];
			if(player.isDead){
				continue;
			}
			if($.math.distance(this.position, player.position) <= 10){
				if(player.shield > 0){
					this.speed.x = -this.speed.x;
					this.speed.y = -this.speed.y;
					player.shieldFlash = 1;
				}else{
					player.applyDamage(this.damage);
					$.bullets.splice(index, 1);
				}
			}
		}
		
		for(var i = 0; i < $.tiles.length; i++){
			var tile = $.tiles[i];
			if($.math.distance(this.position, tile.position) <= 10){
				$.bullets.splice(index, 1);
			}
		}
	},
	
	render: function(ctx){
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.strokeStyle = "rgba(215, 255, 0, 1)";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(-this.speed.x, -this.speed.y);
		ctx.stroke();
		ctx.restore();
	}
};
