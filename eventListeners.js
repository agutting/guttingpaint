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
var paintHistory = new canvasHistory;
// initialize default painting action, paintBrush
var brush = new paintBrush();

// update brush color when color picker value changes
$(".color-picker").on("change", function(e){
	brush.setColor(e.target.value);
});

// sync displayed brush size to slider value as slider changes
$(".brush-slider").on("slide", function(e, ui){
	brush.setBrushSize(ui.value);
});

// executes painting action if mouse is down
$("#canvas").mousemove(function(e){
	brush.paint(e.pageX, e.pageY);
});

// set 'mousedown' flag for mousemove listener, increment layerId
$("#canvas").mousedown(function(){
	paintHistory.incrementLayerId();
	$(document).data('mousedown', true);
});

// set 'mousedown' flag to FALSE and record painting action to history
$(document).mouseup(function(){
	$(document).data('mousedown', false);
	brush.addToHistory();
});

// Clear All button, clears canvas and resets layerId counter
$(".close").click(function(){
	$("svg").remove();
	paintHistory.setLayerId(0);
	paintHistory.undoHistory.length = 0;
	paintHistory.redoHistory.length = 0;
});

$("#undo-button").click(function(){
	paintHistory.undo();
});

$("#redo-button").click(function(){
	paintHistory.redo();
});