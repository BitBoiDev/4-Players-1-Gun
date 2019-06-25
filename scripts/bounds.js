$.bounds = {};

$.bounds.checkCollision = function(obj1, obj2){
	return (obj1.position.x + obj1.bounds.x + obj1.bounds.w / 2 > obj2.position.x + obj2.bounds.x - obj2.bounds.w / 2
		 && obj1.position.x + obj1.bounds.x - obj1.bounds.w / 2 < obj2.position.x + obj2.bounds.x + obj2.bounds.w / 2
		 && obj1.position.y + obj1.bounds.y + obj1.bounds.h / 2 > obj2.position.y + obj2.bounds.y - obj2.bounds.h / 2
		 && obj1.position.y + obj1.bounds.y - obj1.bounds.h / 2 < obj2.position.y + obj2.bounds.y + obj2.bounds.h / 2);
};

$.bounds.resolveCollision = function(obj1, obj2, speed){
	if(obj1.isCrouching && obj2.isPlatform){
		return;
	}
	if($.bounds.checkCollision(obj1, obj2) && obj1 != obj2){
		if(speed.y > 0 || (obj2.isPlatform && speed.y > 0 && !obj1.isCrouching && obj1.position.y + obj1.bounds.h / 2 < obj2.position.y - 10)){
			if(obj1.events && obj1.events.onCollideTop){
				obj1.events.onCollideTop();
			}
			obj1.speed.y = 0;
			obj1.position.y = obj2.position.y + obj2.bounds.y - obj2.bounds.h / 2 - obj1.bounds.y - obj1.bounds.h / 2;
			obj1.onGround = true;
		}
		if(speed.y < 0 && !obj2.isPlatform){
			obj1.speed.y = 0;
			obj1.position.y = obj2.position.y + obj2.bounds.y + obj2.bounds.h / 2 - obj1.bounds.y + obj1.bounds.h / 2;
			obj1.onGround = false;
		}
		if(speed.x > 0 && !obj2.isPlatform){
			obj1.speed.x = 0;
			obj1.position.x = obj2.position.x + obj2.bounds.x - obj2.bounds.w / 2 - obj1.bounds.x - obj1.bounds.w / 2;
		}
		if(speed.x < 0 && !obj2.isPlatform){
			obj1.speed.x = 0;
			obj1.position.x = obj2.position.x + obj2.bounds.x + obj2.bounds.w / 2 - obj1.bounds.x + obj1.bounds.w / 2;
		}
	}
};

$.bounds.resolveCollisions = function(obj, array, speed){
	for(var x = 0; x < array.length; x++){
		var target = array[x];
		$.bounds.resolveCollision(obj, target, speed);
	}
};
