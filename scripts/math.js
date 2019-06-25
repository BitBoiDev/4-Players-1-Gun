$.math = {};

$.math.random = function(min, max){
	return min + Math.random() * (max - min);
};
$.math.distance = function(point, target){
	var diffX = target.x - point.x;
	var diffY = target.y - point.y;
	return Math.sqrt((diffX * diffX) + (diffY * diffY));
};
