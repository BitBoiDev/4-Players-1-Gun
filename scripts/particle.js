$.Particle = function(data){
	this.bounds = {x: 0, y: 0, w: 4, h: 4};
	
	this.color = "rgba(255, 255, 255, 1)";
	
	this.physics = {dynamic: false, enableCollisions: false, mass: 1, friction: 0};
	
	this.merge(data);
};
$.Particle.prototype = {
	update: function(index){
		//speed and tile collisions
		this.position.x += this.speed.x * $.dt;
		if(this.physics.enableCollisions){$.bounds.resolveCollisions(this, $.tiles, {x: this.speed.x, y: 0});}
		this.position.y += this.speed.y * $.dt;
		if(this.physics.enableCollisions){$.bounds.resolveCollisions(this, $.tiles, {x: 0, y: this.speed.y});}
		
		this.speed.x -= this.speed.x * this.physics.friction;
		this.speed.y -= this.speed.y * this.physics.friction;
		
		//gravity
		if(this.physics.dynamic){
			this.speed.y += this.physics.mass * $.dt;
			if(this.onGround){
				this.speed.x -= this.speed.x / 10;
			}
		}
		
		//timout
		if(this.lifetime > 0){
			this.lifetime -= $.dt;
			if(this.lifetime <= this.bounds.w){
				this.bounds.w -= this.bounds.w / 5;
				this.bounds.h -= this.bounds.h / 5;
				this.radius -= this.radius / 5;
			}
		}
	},
	
	render: function(ctx){
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.angle);
		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.restore();
	}
};
