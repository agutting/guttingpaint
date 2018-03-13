document.getElementById("canvas").width = window.innerWidth;
document.getElementById("canvas").height = window.innerHeight - 80;

// initialize canvas context
context = document.getElementById("canvas").getContext("2d");

// initialize brush size slider (jqueryUI)
$(".brush-slider").slider({
	value: 20,
	min: 2,
	max: 50,
	step: 2,
	slide: function(e, ui){
		$(".current-brush-size").text(ui.value);
	}
});

// initialize painting action history object, handles all undo/redo functionality by storing an object representing each action
var canvasController = new canvasControl();
// initialize brush variable
var brush = new paintTool();

// update brush color when color picker value changes
$(".color-picker").on("change", function(e){
	brush.setColor(e.target.value);
});

// sync displayed brush size to slider value as slider changes
$(".brush-slider").on("slide", function(e, ui){
	brush.setLineWidth(ui.value);
});

// executes painting action if mouse is down
$("#canvas").mousemove(function(e){
	if ($(document).data('mousedown')){
		brush.addPoint(e.pageX, e.pageY);
		brush.draw();
	}
});

// set 'mousedown' flag for mousemove listener, increment layerId
$("#canvas").mousedown(function(e){
	canvasController.incrementLayerId();
	$(document).data('mousedown', true);
	brush.addPoint(e.pageX, e.pageY);
	//brush.draw();
});

// set 'mousedown' flag to FALSE and record painting action to history
$(document).mouseup(function(){
	$(document).data('mousedown', false);
});

// Clear All button, clears canvas and resets layerId counter
$(".close").click(function(){
	$("svg").remove();
	canvasController.setLayerId(0);
	canvasController.undoHistory.length = 0;
	canvasController.redoHistory.length = 0;
});

$("#undo-button").click(function(){
	canvasController.undo();
});

$("#redo-button").click(function(){
	canvasController.redo();
});