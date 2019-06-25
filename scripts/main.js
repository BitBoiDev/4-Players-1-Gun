window.onload = function(){
	$.init();
	setInterval(function(){
		$.update();
		$.render();
	}, 1000 / 60);
}
