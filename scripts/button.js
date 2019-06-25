$.Button = function(data){
	this.isFocused = false;
	this.wasFocused = false;
	this.isDown = false;
	this.wasDown = false;
	this.focusOpacity = 0;
	
	this.merge(data);
};
$.Button.prototype = {
	update: function(){
		this.bounds = {
			x: $.screen.w * this.position.x + this.offset.x,
			y: $.screen.h * this.position.y + this.offset.y,
			w: this.width,
			h: this.height
		};
		
		if($.cursor.inRect(this.bounds)){
			this.isFocused = true;
			if(!this.wasFocused){
				this.wasFocused = true;
				$.audio.playSound('button.focused');
			}
		}else{
			this.isFocused = false;
			this.wasFocused = false;
		}
		if($.mouse[0]){
			if(this.isFocused){
				this.isDown = true;
				if(!this.wasDown){
					this.wasDown = true;
					$.audio.playSound('button.down');
				}
			}else{
				this.isDown = false;
				this.wasDown = false;
			}
		}else{
			if(this.wasDown){
				this.isDown = false;
				this.wasDown = false;
				$.audio.playSound('button.up');
				if(this.events.onClick){
					this.events.onClick();
				}
			}
		}
		if(this.isFocused){
			this.focusOpacity += (1 - this.focusOpacity) / 5;
		}else{
			this.focusOpacity -= this.focusOpacity / 5;
		}
	},
	
	render: function(ctx){
		this.bounds = {
			x: $.screen.w * this.position.x + this.offset.x,
			y: $.screen.h * this.position.y + this.offset.y,
			w: this.width,
			h: this.height
		};
	
		ctx.save();
		ctx.translate(this.bounds.x, this.bounds.y);
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.lineWidth = 3;
		ctx.strokeRect(0, 0, this.width, this.height);
		ctx.strokeStyle = "rgba(255, 255, 255, 1)";
		ctx.lineWidth = 2;
		ctx.strokeRect(0, 0, this.width, this.height);
		ctx.fillStyle = "rgba(20, 20, 20, 1)";
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.fillStyle = "rgba(0, 60, 250, " + this.focusOpacity / 2 + ")";
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.fillStyle = "rgba(255, 255, 255, 1)";
		$.drawText({
			ctx: $.ctx,
			x: this.width / 2,
			y: this.height / 2,
			hAlign: "center",
			vAlign: "center",
			scale: 2,
			text: this.text
		});
		ctx.fill();
		ctx.restore();
	}
};
