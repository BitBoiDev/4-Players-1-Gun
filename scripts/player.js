$.Player = function(data){
	var self = this;

	this.speed = {x: 0, y: 0};
	this.bounds = {x: 0, y: 0, w: 18, h: 30};
	this.angle = 0;
	
	this.arms = 0;
	this.legs = 0;
	this.color = "rgba(255, 255, 255, 1)";
	this.direction = 1;
	this.type = 0;
	this.life = 1;
	this.movementSpeed = 3;
	this.jumpHeight = 13;
	this.isMoving = false;
	this.isCrouching = false;
	this.crouch = 0;
	this.stepTimer = 0;
	this.time = Math.random();
	this.atkTimer = 0;
	this.shield = 0;
	this.shieldFlash = 0;
	this.shieldRadius = 0;
	this.hasItem = false;
	this.isDead = false;
	this.gun = {
		fireRate: 10,
		damage: 0.4,
		enabled: false
	};
	
	this.events = {
		onCollideTop: function(){
			if(self.speed.y > 3){
				$.audio.playSound('player.step');
			}
			if(self.speed.y > 15){
				$.util.createImpactEffect({x: self.position.x, y: self.position.y + 10}, self.speed.y / 30, 0);
			}
		}
	};
	
	this.merge(data);
	
	this.init();
};
$.Player.prototype = {
	init: function(){
		this.color = $.colors[this.type];
	},	
	
	update: function(index){
		this.time += $.dt;
		
		if(!$.isReady && $.state === 'play'){
			this.position.x += ($.startPosition.x - this.position.x) / 5;
			this.position.y += ($.startPosition.y - this.position.y) / 5;
			this.speed.x = 0;
			this.speed.y = 0;
			this.onGround = false;
		}else if($.state === 'start'){
			this.speed.x = 0;
			this.speed.y = 0;
			this.onGround = false;
		}
		
		this.position.x += this.speed.x * $.dt;
		if(!this.isDead){
			$.bounds.resolveCollisions(this, $.tiles, {x: this.speed.x, y: 0});
		}
		this.position.y += this.speed.y * $.dt;
		if(!this.isDead){
			$.bounds.resolveCollisions(this, $.tiles, {x: 0, y: this.speed.y});
		}
		
		this.speed.y += 1;
		
		if(this.isDead){
			this.angle += this.speed.x / 100;
			this.legs = Math.sin(this.time * this.direction * 0.1);
			this.arms = -Math.PI / 4 - Math.sin(this.time * this.direction * 0.1);
			return;
		}
		
		//Movement
		var controls = $.controls[this.type];
		
		if(!this.isCrouching){
			if($.keys[controls.left]){
				if(this.speed.x > -this.movementSpeed){
					this.speed.x -= 0.2;
				}
				this.direction = -1;
				this.isMoving = true;
			}else if($.keys[controls.right]){
				if(this.speed.x < this.movementSpeed){
					this.speed.x += 0.2;
				}
				this.direction = 1;
				this.isMoving = true;
			}else{
				this.isMoving = false;
			}
		}
		
		if(this.onGround && (!this.isMoving)){
			this.speed.x -= this.speed.x / 4;
		}
		
		if($.keys[controls.up]){
			if(this.onGround){
				this.speed.y = -this.jumpHeight;
				this.onGround = false;
				$.audio.playSound('player.jump');
			}
		}
		
		if($.keys[controls.down]){
			this.isCrouching = true;
			this.isMoving = false;
			this.crouch += (6 - this.crouch) / 4;
		}else{
			this.isCrouching = false;
			this.crouch -= this.crouch / 4;
		}
		
		if(this.isMoving){
			this.legs = Math.sin(this.time * this.direction * 0.3);
			this.arms = -Math.PI / 4 - Math.sin(this.time * this.direction * 0.3);
		}else{
			this.legs = 0;
			this.arms = -Math.PI / 6 + Math.sin(this.time * 0.05) / 2;
		}
		
		if(!this.onGround){
			this.legs = -Math.PI / 8;
			this.arms = (-Math.PI / 2) - (this.speed.y / 10);
		}
		
		//Shooting
		if(this.atkTimer <= 0){
			if($.keys[controls.attack] && this.gun.enabled){
				this.atkTimer = 60 / this.gun.fireRate;
				$.audio.playSound('player.shoot');
				$.bullets.push(new $.Bullet({
					position: {x: this.position.x + (this.direction * 16), y: this.position.y + this.crouch},
					speed: {x: this.direction * 10, y: 0},
					damage: this.gun.damage
				}));
			}
		}else{
			this.atkTimer -= $.dt;
		}
		
		//Shields
		if(this.shield > 0){
			this.shield -= $.dt;
			this.shieldRadius += (1 - this.shieldRadius) / 10;
			if(this.shield < 10){
				this.shieldRadius -= this.shieldRadius / 10;
			}
		}else{
			this.shield = 0;
		}
		
		//Stuff
		if(this.gun.enabled || this.shield > 0){
			this.hasItem = true;
		}else{
			this.hasItem = false;
		}
		
		//Death
		if(this.life <= 0){
			if(this.gun.enabled){
				$.pickups.push(new $.Pickup({
					position: {x: this.position.x, y: this.position.y},
					type: 'gun'
				}));
			}else if(this.shield > 0){
				$.pickups.push(new $.Pickup({
					position: {x: this.position.x, y: this.position.y},
					type: 'shield'
				}));
			}
			$.audio.playSound('player.die');
			$.particleEmitters.push(new $.ParticleEmitter({
				position: this.position,
				spawnRadius: 0,
				minAngle: 0,
				maxAngle: Math.PI * 2,
				minSpeed: 1,
				maxSpeed: 2,
				minRadius: 6,
				maxRadius: 12,
				minLifetime: 10,
				maxLifetime: 20,
				count: 20,
				color: this.color,
				physics: {
					mass: 1,
					dynamic: true
				}
			}));
			this.isDead = true;
			this.gun.enabled = false;
			this.shield = 0;
			this.speed.y = -10;
			this.speed.x = -this.direction * 4;
		}
	},
	
	render: function(ctx){
		ctx.save();
		ctx.translate(this.position.x, this.position.y + this.crouch);
		ctx.rotate(this.angle);
		ctx.scale(-this.direction, 1);
		//Arms
		var angle = this.arms;
		if(this.gun.enabled){
			angle = -Math.PI / 2;
		}
		ctx.beginPath();
		ctx.moveTo(-7, 3);
		ctx.lineTo(-7 + Math.sin(angle) * 8, 3 + Math.cos(angle) * 8);
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.lineWidth = 8;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(-7, 3);
		ctx.lineTo(-7 + Math.sin(angle) * 6, 3 + Math.cos(angle) * 6);
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 4;
		ctx.stroke();
		if(this.gun.enabled){
			ctx.save();
			ctx.translate(-16, 3);
			ctx.fillStyle = "rgba(5, 5, 5, 1)";
			ctx.fillRect(-5, -5, 10, 4);
			ctx.fillRect(2, -1, 3, 4);
			ctx.restore();
		}
		//Legs
		ctx.save();
		ctx.translate(0, -this.crouch);
		ctx.beginPath();
		ctx.moveTo(-4, 8);
		ctx.lineTo(-4 + Math.sin(this.legs) * 8, 8 + Math.cos(this.legs) * 8);
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.lineWidth = 8;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(-4, 8);
		ctx.lineTo(-4 + Math.sin(this.legs) * 6, 8 + Math.cos(this.legs) * 6);
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 4;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(4, 8);
		ctx.lineTo(4 + Math.sin(-this.legs) * 8, 8 + Math.cos(-this.legs) * 8);
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.lineWidth = 8;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(4, 8);
		ctx.lineTo(4 + Math.sin(-this.legs) * 6, 8 + Math.cos(-this.legs) * 6);
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 4;
		ctx.stroke();
		ctx.restore();
		//Body
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.lineWidth = 2;
		ctx.fillRect(-8, -8, 16, 16);
		ctx.strokeRect(-8, -8, 16, 16);
		//Da otha arm
		ctx.beginPath();
		ctx.moveTo(6 + Math.sin(-this.arms) * 1, 3 + Math.cos(-this.arms) * 1);
		ctx.lineTo(6 + Math.sin(-this.arms) * 8, 3 + Math.cos(-this.arms) * 8);
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.lineWidth = 8;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(6, 3);
		ctx.lineTo(6 + Math.sin(-this.arms) * 6, 3 + Math.cos(-this.arms) * 6);
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 4;
		ctx.stroke();
		//Cute lil face
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.beginPath();
		ctx.arc(-4, 0, 2, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(2, 0, 2, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.scale(this.direction, 1);
		//Shield
		if(this.shield > 0){
			var angle = this.time / 10;
			var radius = (20 + Math.sin($.ct / 300)) * this.shieldRadius;
			ctx.fillStyle = "rgba(0, 60, 255, 0.7)";
			ctx.beginPath();
			ctx.arc(0, 0, radius, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.fillStyle = "rgba(0, 120, 255, 0.4)";
			ctx.beginPath();
			ctx.arc(0, 0, radius / 2, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.arc(0, 0, radius, angle, angle - Math.PI / 4, true);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.arc(0, 0, radius, angle + Math.PI, angle + Math.PI - Math.PI / 4, true);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = "rgba(255, 255, 255, " + (this.shieldFlash) + ")";
			ctx.beginPath();
			ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
			ctx.fill();
			this.shieldFlash -= this.shieldFlash / 10;
		}
		ctx.restore();
	},
	
	applyDamage: function(amount){
		this.life -= amount;
		$.audio.playSound('player.hurt');
	},
	
	reset: function(){
		this.life = 1;
		this.gun.enabled = false;
		this.shield = 0;
		this.isDead = false;
		this.angle = 0;
	}
};
