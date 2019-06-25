$.Sound = function(data){
	this.volume = 1;
	this.size = 10;
	
	this.variations = [];
	
	this.merge(data);
	
	this.start();
};
$.Sound.prototype = {
	start: function(){
		for(var v = 0; v < this.files.length; v++){
			this.variations[v] = [];
			for(var z = 0; z < this.size; z++){
				this.variations[v].push(new Audio(this.files[v]));
			}
		}
	},
	
	play: function(volume, single){
		var pool = this.variations[Math.floor(Math.random() * this.variations.length)];
		this.volume = volume;
		
		if(single){
			pool[0].volume = this.volume;
			pool[0].play();
			return;
		}
		
		for(var z = 0; z < pool.length; z++){
			var audio = pool[z];
			if(audio.ended || audio.currentTime === 0){
				if(volume != undefined){
					audio.volume = this.volume;
				}
				audio.play();
				return;
			}
		}
	},
	
	pause: function(){
		for(var z = 0; z < this.variations.length; z++){
			for(var g = 0; g < this.variations[z].length; g++){
				this.variations[z][g].pause();
			}
		}
	}
};
