$.util = {};

Object.prototype.merge = function(data){
	for(var x in data){
		if(typeof this[x] === "object"){
			this.merge(data[x]);
		}else{
			this[x] = data[x];
		}
	}
};
Array.prototype.getObjectByValue = function(name, value){
	for(var i = 0; i < this.length; i++){
		if(typeof this[i] === "object" && this[i][name] === value){
			return this[i];
		}
	}
};
Object.prototype.inRect = function(rect){
	return (this.x > rect.x && this.x < rect.x + rect.w && this.y > rect.y && this.y < rect.y + rect.h);
};

$.util.createImpactEffect = function(position, scale, angle){
	$.particleEmitters.push(new $.ParticleEmitter({
		position: position,
		spawnRadius: 0,
		minAngle: angle + Math.PI / 2,
		maxAngle: angle + Math.PI / 1.5,
		minSpeed: 2,
		maxSpeed: 4,
		minRadius: 6,
		maxRadius: 12,
		minLifetime: 10,
		maxLifetime: 20,
		count: 5 * scale,
		color: "rgba(255, 255, 255, 1)"
	}));
	$.particleEmitters.push(new $.ParticleEmitter({
		position: position,
		spawnRadius: 0,
		minAngle: angle - Math.PI / 2,
		maxAngle: angle - Math.PI / 1.5,
		minSpeed: 2,
		maxSpeed: 4,
		minRadius: 6,
		maxRadius: 12,
		minLifetime: 10,
		maxLifetime: 20,
		count: 5 * scale,
		color: "rgba(255, 255, 255, 1)"
	}));
};
