$.AudioSystem = function(data){
	this.sounds = {};
	this.volume = 1;

	this.merge(data);
};
$.AudioSystem.prototype = {
	loadSound: function(data){
		this.sounds[data.name] = new $.Sound(data);
	},
	
	playSound: function(name, volume){
		if(this.sounds[name] === undefined){
			console.error("There's no sound called " + name + "!");
			return;
		}
		this.sounds[name].play(volume);
	}
};
