/*=================================================================================================================
Init main
=================================================================================================================*/
$.init = function(){
	$.isReady = false;
	$.isPaused = false;
	
	$.state = 'title';
	
	/*- Body -*/
	$.body = document.getElementById("game");
	
	/*- Canvases -*/
	$.bgCanvas = document.getElementById("bgCanvas");
	$.canvas = document.getElementById("canvas");
	$.fgCanvas = document.getElementById("fgCanvas");
	
	$.bgCtx = $.bgCanvas.getContext("2d");
	$.ctx = $.canvas.getContext("2d");
	$.fgCtx = $.fgCanvas.getContext("2d");
	
	$.resizeDisplay();
	
	/*- Time -*/
	$.lt = Date.now();
	$.ct = 0;
	$.dt = 0;
	
	/*- Input -*/
	$.cursor = {x: 0, y: 0};
	$.mouse = {};
	$.keys = {};
	
	/*- Game things -*/
	$.players = [];
	$.tiles = [];
	$.particleEmitters = [];
	$.pickups = [];
	$.buttons = [];
	$.bullets = [];
	
	$.clients = [false, false, false, false];
	$.startPosition = {x: 0, y: 0};
	
	/*- Boombox -*/
	$.audio = new $.AudioSystem({});
	for(var z = 0; z <  $.definitions.sounds.length; z++){
		var sound = $.definitions.sounds[z];
		$.audio.loadSound(sound);
	}
	
	/*- Fanshy menu transition thingys -*/
	$.transition = 0;
	$.fade = 0;
	$.countdown = 0;
	$.winTimer = 0;
	
	$.selectedLevel = 0;
	$.levelNames = ['platform panic', 'maze',  'maze2', 'guns for all', 'towers', 'arena'];
	
	/*- Controls for me and da bois -*/
	$.controls = [
		{
			up: 87,
			down: 83,
			left: 65,
			right: 68,
			attack: 67,
			special: 16
		},
		{
			up: 104,
			down: 101,
			left: 100,
			right: 102,
			attack: 96,
			special: 99
		},
		{
			up: 84,
			down: 71,
			left: 70,
			right: 72,
			attack: 32,
			special: 78
		},
		{
			up: 73,
			down: 75,
			left: 74,
			right: 76,
			attack: 59,
			special: 77
		}
	];
	
	/*- Colors for da bois -*/
	$.colors = [
		"rgba(40, 140, 60, 1)",
		"rgba(0, 90, 255, 1)",
		"rgba(220, 35, 40, 1)",
		"rgba(160, 50, 200, 1)"
	];
	
	/*- Events -*/
	$.events = {
		onWindowResize: function(){
			$.resizeDisplay();
		},
		onWindowBlur: function(){
			$.paused = true;
		},
		onWindowFocus: function(){
			$.paused = false;
		},
		onMouseMove: function(event){
			$.cursor = {
				x: event.pageX - $.screen.x,
				y: event.pageY - $.screen.y
			};
		},
		onMouseDown: function(event){
			$.mouse[event.button] = true;
			$.mouse.pressed = true;
		},
		onMouseUp: function(event){
			$.mouse[event.button] = false;
			$.mouse.pressed = false;
		},
		onKeyDown: function(event){
			$.keys[event.keyCode] = true;
			$.keys.pressed = true;
			//console.log(event.keyCode);
		},
		onKeyUp: function(event){
			$.keys[event.keyCode] = false;
			$.keys.pressed = false;
		}
	};
	
	window.addEventListener('load', $.events.onWindowLoad);
	window.addEventListener('resize', $.events.onWindowResize);
	window.addEventListener('blur', $.events.onWindowBlur);
	window.addEventListener('focus', $.events.onWindowFocus);
	window.addEventListener('mousemove', $.events.onMouseMove);
	window.addEventListener('mousedown', $.events.onMouseDown);
	window.addEventListener('mouseup', $.events.onMouseUp);
	window.addEventListener('keydown', $.events.onKeyDown);
	window.addEventListener('keyup', $.events.onKeyUp);
	
	/*- Initial render -*/
	$.renderBackground();
	$.renderForeground();
	
	$.body.style.opacity = 1;
	
	/*- Other things -*/
	$.setState($.state);
};
/*=================================================================================================================
Update
=================================================================================================================*/
$.update = function(){
	var now = Date.now();
	$.ct = now;
	$.dt = ($.ct - $.lt) / (1000 / 60);
	$.lt = now;
	
	for(var i = 0; i < $.buttons.length; i++){
		$.buttons[i].update(i);
	}
	for(var i = 0; i < $.tiles.length; i++){
		$.tiles[i].update(i);
	}
	for(var i = 0; i < $.particleEmitters.length; i++){
		$.particleEmitters[i].update(i);
	}
	for(var i = 0; i < $.pickups.length; i++){
		$.pickups[i].update(i);
	}
	for(var i = 0; i < $.bullets.length; i++){
		$.bullets[i].update(i);
	}
	
	$.livePlayers = 0;
	for(var i = 0; i < $.players.length; i++){
		$.players[i].update(i);
		if(!$.players[i].isDead){
			$.winColor = $.players[i].color;
			$.livePlayers++;
		}
	}
	
	if($.countdown > 0){
		$.countdown -= $.dt * 0.03;
		$.isReady = false;
	}else{
		$.isReady = true;
	}
	
	if($.state != 'play'){
		$.audio.sounds['game.music'].pause();
	}
};
/*=================================================================================================================
Render
=================================================================================================================*/
$.render = function(){
	$.ctx.clearRect(0, 0, $.screen.w, $.screen.h);
	$.ctx.strokeStyle = "rgba(200, 200, 200, 1)";
	$.ctx.lineWidth = 2;
	$.ctx.strokeRect(0, 0, $.screen.w, $.screen.h);
	
	 if($.state === 'play'){
		$.ctx.fillStyle = "rgba(100, 100, 100, 1)";
		$.ctx.fillRect(0, 0, $.screen.w, $.screen.h);
	}
	
	for(var i = 0; i < $.players.length; i++){
		$.players[i].render($.ctx);
	}
	for(var i = 0; i < $.particleEmitters.length; i++){
		$.particleEmitters[i].render($.ctx);
	}
	for(var i = 0; i < $.tiles.length; i++){
		$.tiles[i].render($.ctx);
	}
	for(var i = 0; i < $.bullets.length; i++){
		$.bullets[i].render($.ctx);
	}
	for(var i = 0; i < $.pickups.length; i++){
		$.pickups[i].render($.ctx);
	}
	
	if($.state === 'title'){
		$.ctx.fillStyle = "rgba(20, 20, 20, 1)";
		$.ctx.lineWidth = 2;
		$.ctx.strokeStyle = "hsla(" + (100 + Math.abs(Math.sin($.ct * 0.001) * 100)) + ", 90%, 100%, 1)";
		$.drawText({
			ctx: $.ctx,
			x: $.screen.w / 2,
			y: 100,
			text: "4 Players",
			scale: 5,
			spacing: 4,
			hAlign: "center",
			vAlign: "center"
		});
		$.ctx.stroke();
		$.ctx.fill();
		$.ctx.strokeStyle = "hsla(" + (200 + Math.abs(Math.sin($.ct * 0.001) * 100)) + ", 90%, 100%, 1)";
		$.ctx.fillStyle = "rgba(20, 20, 20, 1)";
		$.drawText({
			ctx: $.ctx,
			x: $.screen.w / 2,
			y: 135,
			text: "1 Gun",
			scale: 5,
			spacing: 4,
			hAlign: "center",
			vAlign: "center"
		});
		$.ctx.stroke();
		$.ctx.fill();
		
		$.ctx.fillStyle = "rgba(10, 10, 10, 1)";
		$.ctx.strokeStyle = "rgba(200, 200, 200, 1)";
		$.ctx.lineWidth = 2;
		$.ctx.strokeRect(0, $.screen.h / 2 - 10, $.screen.w / 2 - 71, 20);
		$.ctx.fillRect(0, $.screen.h / 2 - 10, $.screen.w / 2 - 71, 20);
		$.ctx.strokeRect($.screen.w / 2 + 71, $.screen.h / 2 - 10, $.screen.w / 2, 20);
		$.ctx.fillRect($.screen.w / 2 + 71, $.screen.h / 2 - 10, $.screen.w / 2, 20);
		
		$.ctx.fillStyle = "rgba(150, 150, 150, 1)";
		$.drawText({
			ctx: $.ctx,
			x: 5,
			y: $.screen.h - 5,
			text: "By BitBoi",
			scale: 2,
			hAlign: "left",
			vAlign: "bottom"
		});
		$.ctx.fill();
	}else if($.state === 'help'){
		$.ctx.fillStyle = "rgba(10, 10, 10, 1)";
		$.ctx.strokeStyle = "rgba(200, 200, 200, 1)";
		$.ctx.lineWidth = 2;
		$.ctx.strokeRect(0, $.screen.h / 2 - 50, $.screen.w, 100);
		$.ctx.fillRect(0, $.screen.h / 2 - 50, $.screen.w, 100);
		$.ctx.save();
		$.ctx.translate($.screen.w / 2 - 180, $.screen.h / 2 - 60);
		for(var z in $.definitions.keys){
			var key = $.definitions.keys[z];
			for(var y = 0; y < $.controls.length; y++){
				for(var x in $.controls[y]){
					var control = $.controls[y][x];
					if(key === undefined){
						continue;
					}
					$.ctx.lineWidth = 2;
					$.ctx.fillStyle = "rgba(20, 20, 20, 1)";
					$.ctx.strokeStyle = "rgba(255, 255, 255, 0)";
					if(z.toString() === control.toString()){
						$.ctx.strokeStyle = $.colors[y];
						var drawText = true;
					}
					$.ctx.strokeRect(key.x + 1, key.y + 1, key.w - 2, key.h - 2);
					$.ctx.fillRect(key.x + 1, key.y + 1, key.w - 2, key.h - 2);
					$.ctx.fillStyle = "rgba(200, 200, 200, 1)";
					$.drawText({
						ctx: $.ctx,
						x: key.x + key.w / 2,
						y: key.y + key.h / 2,
						text: key.name,
						scale: 1,
						hAlign: "center",
						vAlign: "center"
					});
					$.ctx.fill();
				}
			}
		}
		$.ctx.restore();
	}else if($.state === 'start'){
		$.ctx.fillStyle = "rgba(20, 20, 20, 1)";
		$.ctx.lineWidth = 2;
		$.ctx.strokeStyle = "hsla(" + (150 + Math.abs(Math.sin($.ct * 0.001) * 50)) + ", 90%, 40%, 1)";
		$.drawText({
			ctx: $.ctx,
			x: $.screen.w / 2,
			y: 70,
			text: "Lobby",
			scale: 5,
			spacing: 4,
			hAlign: "center",
			vAlign: "center"
		});
		$.ctx.stroke();
		$.ctx.fill();
		$.ctx.fillStyle = "rgba(200, 200, 200, 1)";
		$.ctx.fillRect($.screen.w / 2 - 200, $.screen.h / 2, 400, $.screen.h / 2);
		for(var z = 0; z < 4; z++){
			$.ctx.fillRect($.screen.w / 2 - 165 + (z * 100), $.screen.h / 2 - 10, 30, 10);
		}
		for(var i = 0; i < $.controls.length; i++){
			var controls = $.controls[i];
			if(!$.clients[i]){
				$.ctx.fillStyle = $.colors[i];
				$.drawText({
					ctx: $.ctx,
					x: $.screen.w / 2 - 150 + (i * 100),
					y: $.screen.h / 2 - 25 + Math.sin(($.ct / 300) + (i * 5)) * 3,
					text: "- " + $.definitions.keys[controls.down].name+ " -",
					scale: 2,
					hAlign: "center",
					vAlign: "center"
				});
				$.ctx.fill();
				if($.keys[controls.down]){
					$.players.push(new $.Player({
						position: {x: $.screen.w / 2 - 150 + (i * 100), y: $.screen.h / 2 - 25},
						type: i
					}));
					$.clients[i] = true;
				}
			}
		}
		var text = "Waiting...";
		if($.livePlayers >= 2){
			text = "Ready!";
		}
		$.ctx.fillStyle = "rgba(20, 20, 20, 1)";
		$.drawText({
			ctx: $.ctx,
			x: $.screen.w / 2,
			y: $.screen.h / 2 + 110,
			text: text,
			scale: 2,
			hAlign: "center",
			vAlign: "center"
		});
		$.ctx.fill();
	}else if($.state === 'play'){
		if(!$.isReady){
			var text = '- ' + Math.floor($.countdown) + ' -';
			if($.countdown < 1){
				text = '- Fight -';
			}
			$.ctx.fillStyle = "rgba(20, 20, 20, 1)";
			$.ctx.lineWidth = 2;
			$.ctx.strokeStyle = "hsla(" + (150 + Math.abs(Math.sin($.ct * 0.001) * 50)) + ", 90%, 40%, 1)";
			$.drawText({
				ctx: $.ctx,
				x: $.screen.w / 2,
				y: $.screen.h / 2,
				text: text,
				scale: 6,
				spacing: 4,
				hAlign: "center",
				vAlign: "center"
			});
			$.ctx.stroke();
			$.ctx.fill();
		}else if($.livePlayers <= 1){
			if($.livePlayers <= 0){
				$.ctx.strokeStyle = "rgba(20, 20, 20, 1)";
				$.ctx.lineWidth = 2;
				$.ctx.fillStyle = "hsla(" + (150 + Math.abs(Math.sin($.ct * 0.001) * 50)) + ", 90%, 40%, 1)";
				$.drawText({
					ctx: $.ctx,
					x: $.screen.w / 2,
					y: -$.screen.h / 2 + ($.screen.h * $.winText),
					text: "- Draw -",
					scale: 6,
					spacing: 4,
					hAlign: "center",
					vAlign: "center"
				});
				$.ctx.stroke();
				$.ctx.fill();
			}else{
				$.ctx.strokeStyle = "rgba(20, 20, 20, 1)";
				$.ctx.lineWidth = 2;
				$.ctx.fillStyle = $.winColor;
				$.drawText({
					ctx: $.ctx,
					x: $.screen.w / 2,
					y: -$.screen.h / 2 + ($.screen.h * $.winText),
					text: "- Winner -",
					scale: 6,
					spacing: 4,
					hAlign: "center",
					vAlign: "center"
				});
				$.ctx.stroke();
				$.ctx.fill();
			}
			$.winText += (1 - $.winText) / 10;
			$.winTimer += $.dt;
			if($.winTimer >= 300){
				$.gameover = false;
				for(var i = 0; i < $.players.length; i++){
					$.players[i].isDead = false;
				}
				$.setState('play');
			}else if($.winTimer >= 250){
				$.winText += (2.5 - $.winText) / 10;
				$.fade += (1 - $.fade) / 10;
			}else{
				if(!$.gameover){
					$.audio.playSound('game.win');
				}
				$.gameover = true;
			}
		}
	}
	
	for(var i = 0; i < $.buttons.length; i++){
		$.buttons[i].render($.ctx);
	}
	
	if($.state === 'title'){
		$.ctx.fillStyle = "rgba(0, 255, 60, " + Math.abs(Math.sin($.ct * 0.005)) + ")";
		$.drawText({
			ctx: $.ctx,
			x: $.screen.w / 2,
			y: $.screen.h / 2,
			text: "Start",
			scale: 2,
			hAlign: "center",
			vAlign: "center"
		});
		$.ctx.fill();
	}
	
	//Fadestuff
	$.ctx.fillStyle = "rgba(0, 0, 0, " + $.fade + ")";
	$.ctx.fillRect(0, 0, $.screen.w, $.screen.h);
	if(!$.gameover){
		$.fade -= $.fade / 5;
	}
};
/*=================================================================================================================
Background
=================================================================================================================*/
$.renderBackground = function(){
	$.bgCtx.clearRect(0, 0, $.screen.w, $.screen.h);
	var size = 10000;
     for(var i = 0; i < size; i += $.screen.w / 15){
          $.bgCtx.fillStyle = "rgba(20, 20, 20, 1)";
          $.bgCtx.fillRect(0, i, size, 1);
          $.bgCtx.fillRect(i, 0, 1, size);
     }
};
/*=================================================================================================================
Foreground
=================================================================================================================*/
$.renderForeground = function(){
	$.fgCtx.clearRect(0, 0, $.screen.w, $.screen.h);
     $.fgCtx.fillStyle = "rgba(100, 100, 100, 0.2)";
     for(var i = 0; i < $.screen.h; i += 2){
          $.fgCtx.fillRect(0, i, $.screen.w, 1);
     }
     
     var gradient = $.fgCtx.createRadialGradient($.screen.w / 2, $.screen.h / 2, $.screen.h / 3, $.screen.w / 2, $.screen.h / 2, $.screen.h);
	 gradient.addColorStop(0, 'hsla(0, 0%, 0%, 0)');
	 gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0.5)');
	 $.fgCtx.fillStyle = gradient;
	 $.fgCtx.fillRect(0, 0, $.screen.w, $.screen.h);
     
     var gradient = $.fgCtx.createLinearGradient($.screen.w, 0, 0, $.screen.h);
 	 gradient.addColorStop(0, 'hsla(0, 0%, 100%, 0.04)');
	 gradient.addColorStop(0.75, 'hsla(0, 0%, 100%, 0)');
	 $.fgCtx.beginPath();
	 $.fgCtx.moveTo(0, 0);
	 $.fgCtx.lineTo($.screen.w, 0);
	 $.fgCtx.lineTo(0, $.screen.h);
	 $.fgCtx.closePath();
	 $.fgCtx.fillStyle = gradient;
	 $.fgCtx.fill();
};
/*=================================================================================================================
Resize the display to fit the window
=================================================================================================================*/
$.resizeDisplay = function(){
	var width = 660;
	var height = 540;

	$.body.style.width = $.bgCanvas.width = $.canvas.width = $.fgCanvas.width = width;
	$.body.style.height = $.bgCanvas.height = $.canvas.height = $.fgCanvas.height = height;
	
	$.body.style.left = $.bgCanvas.style.left = $.canvas.style.left = $.fgCanvas.style.left = window.innerWidth / 2 - width / 2;
	$.body.style.top = $.bgCanvas.style.top = $.canvas.style.top = $.fgCanvas.style.top = window.innerHeight / 2 - height / 2;
	
	var bounds = $.canvas.getBoundingClientRect();
	$.screen = {
		x: bounds.x,
		y: bounds.y,
		w: bounds.width,
		h: bounds.height
	};
	
	$.renderBackground();
	$.renderForeground();
};
/*=================================================================================================================
Clear da level and load a new one
=================================================================================================================*/
$.loadLevel = function(name){
	var level = $.definitions.levels[name];
	if(level === undefined){
		console.error("No level called " + name + "!");
		return;
	}
	$.clearObjects();
	for(var y = 0; y < level.tiles.length; y++){
		for(var x = 0; x < level.tiles[y].length; x++){
			var tile = level.tiles[y][x];
			var position = {x: 10 + Math.round(x * 20), y: 10 + Math.round(y * 20)};
			
			if(tile === "1"){
				$.tiles.push(new $.Tile({
					position: position,
					type: 'default'
				}));
			}else if(tile === "_"){
				$.tiles.push(new $.Tile({
					position: position,
					type: 'platform'
				}));
			}else if(tile === "$"){
				$.pickups.push(new $.Pickup({
					position: position,
					type: 'gun'
				}));
			}else if(tile === ">"){
				$.pickups.push(new $.Pickup({
					position: position,
					type: 'shield'
				}));
			}else if(tile === "S"){
				$.startPosition = position;
				for(var i = 0; i < $.players.length; i++){
					$.players[i].reset();
				}
			}
		}
	}
};
/*=================================================================================================================
Clear the current state and load a new one
=================================================================================================================*/
$.setState = function(newState){
	$.buttons = [];
	$.state = newState;
	$.fade = 1;
	if(newState === 'title'){
		$.buttons.push(new $.Button({
			position: {x: 0.5, y: 0.5},
			offset: {x: -70, y: -15},
			width: 140,
			height: 30,
			text: "",
			events: {
				onClick: function(){
					$.setState('start');
				}
			}
		}));
		$.buttons.push(new $.Button({
			position: {x: 1, y: 1},
			offset: {x: -40, y: -40},
			width: 30,
			height: 30,
			text: "?",
			events: {
				onClick: function(){
					$.setState('help');
				}
			}
		}));
	}else if(newState === 'start'){
		$.clients = [false, false, false, false];
		$.buttons.push(new $.Button({
			position: {x: 0.5, y: 1},
			offset: {x: -50, y: -40},
			width: 100,
			height: 30,
			text: "Go!",
			events: {
				onClick: function(){
					if($.players.length <= 1){
						console.log("Needs more players to start!");
						return;
					}
					$.setState('play');
				}
			}
		}));
		$.buttons.push(new $.Button({
			position: {x: 0, y: 1},
			offset: {x: 10, y: -40},
			width: 30,
			height: 30,
			text: "<",
			events: {
				onClick: function(){
					$.setState('title');
				}
			}
		}));
	}else if(newState === 'help'){
		$.buttons.push(new $.Button({
			position: {x: 0, y: 1},
			offset: {x: 10, y: -40},
			width: 30,
			height: 30,
			text: "<",
			events: {
				onClick: function(){
					$.setState('title');
				}
			}
		}));
	}else if(newState === 'play'){
		$.loadLevel($.levelNames[Math.floor(Math.random() * $.levelNames.length)]);
		$.countdown = 4;
		$.isReady = false;
		$.winTimer = 0;
		$.winText = 0;
		$.audio.sounds['game.music'].play(1, true);
	}
};
$.clearObjects = function(){
	$.tiles = [];
	$.particleEmitters = [];
	$.pickups = [];
	$.buttons = [];
	$.bullets = [];
};
