$.ParticleEmitter = function(data){
	this.particles = [];
	
	this.merge(data);
	
	this.init();
};
$.ParticleEmitter.prototype = {
	init: function(){
		var self = this;
		for(var i = 0; i < this.count; i++){
			var spawnRadius = Math.random() * this.spawnRadius;
			var spawnAngle = Math.random() * Math.PI * 2;
			var radius = $.math.random(this.minRadius, this.maxRadius);
			var angle = $.math.random(this.minAngle, this.maxAngle);
			var speed = $.math.random(this.minSpeed, this.maxSpeed);
			var lifetime = $.math.random(this.minLifetime, this.maxLifetime);
			var position = {
				x: this.position.x + Math.sin(spawnAngle) * spawnRadius,
				y: this.position.y + Math.cos(spawnAngle) * spawnRadius
			};
			this.particles.push(new $.Particle({
				parent: self,
				position: position,
				speed: {
					x: Math.sin(angle) * speed,
					y: Math.cos(angle) * speed
				},
				physics: self.physics,
				radius: radius,
				lifetime: lifetime,
				color: self.color
			}));
		}
	},

	update: function(index){
		for(var q = 0; q < this.particles.length; q++){
			this.particles[q].update(q);
			if(this.particles[q].lifetime <= 0){
				this.particles.splice(q, 1);
			}
		}
		if(this.particles.length <= 0){
			$.particleEmitters.splice(index, 1);
		}
	},
	
	render: function(ctx){
		for(var q = 0; q < this.particles.length; q++){
			this.particles[q].render(ctx);
		}
	}
};
