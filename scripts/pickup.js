$.Pickup = function(data){
	this.merge(data);
};
$.Pickup.prototype = {
	update: function(i){
		for(var z = 0; z < $.players.length; z++){
			var player = $.players[z];
			if(player.hasItem){
				continue;
			}
			var distance = $.math.distance(this.position, player.position);
			if(distance <= 30 && !player.isDead){
				this.position.x += (player.position.x - this.position.x) / 3;
				this.position.y += (player.position.y - this.position.y) / 3;
				if(distance <= 5){
					if(this.type === 'gun' && !player.gun.enabled){
						player.gun.enabled = true;
						$.audio.playSound('pickup.gun');
					}else if(this.type === 'shield' && player.shield <= 0){
						player.shield = 600;
						$.audio.playSound('pickup.shield');
					}
					$.pickups.splice(i, 1);
				}
			}
		}
		
		if(this.type === 'gun'){
			$.particleEmitters.push(new $.ParticleEmitter({
				position: {x: this.position.x, y: this.position.y + Math.cos($.ct / 200) * 5},
				spawnRadius: 10,
				minAngle: 0,
				maxAngle: Math.PI * 2,
				minSpeed: -0.1,
				maxSpeed: -0.2,
				minRadius: 4,
				maxRadius: 6,
				minLifetime: 30,
				maxLifetime: 60,
				count: 1,
				color: "rgba(5, 5, 5, 1)",
				physics: {
					friction: 0.1
				}
			}));
		}
	},
	
	render: function(ctx){
		ctx.save();
		ctx.translate(this.position.x, this.position.y + Math.cos($.ct / 200) * 5);
		ctx.scale(Math.sin($.ct / 200), 1);
		if(this.type === 'gun'){
			ctx.fillStyle = "rgba(255, 255, 255, 1)";
			ctx.fillRect(-5, -2, 10, 4);
			ctx.fillRect(2, 2, 3, 4);
		}else if(this.type === 'shield'){
			ctx.strokeStyle = "rgba(5, 5, 5, 1)";
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(0, -8);
			ctx.lineTo(-8, -8);
			ctx.lineTo(-8, 4);
			ctx.lineTo(0, 8);
			ctx.lineTo(8, 4);
			ctx.lineTo(8, -8);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
			ctx.fillStyle = "rgba(75, 75, 75, 1)";
			ctx.beginPath();
			ctx.moveTo(0, -8);
			ctx.lineTo(8, -8);
			ctx.lineTo(8, 4);
			ctx.lineTo(0, 8);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = "rgba(125, 125, 125, 1)";
			ctx.beginPath();
			ctx.moveTo(0, -8);
			ctx.lineTo(-8, -8);
			ctx.lineTo(-8, 4);
			ctx.lineTo(0, 8);
			ctx.closePath();
			ctx.fill();
		}
		ctx.restore();
	}
};
