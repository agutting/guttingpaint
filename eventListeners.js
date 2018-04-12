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
// part of clearCanvas() is to set a white background for accuracy in saved files, so also do this on startup
canvasController.clearCanvas();

// initialize default paintTool
var brush = new paintTool();


// update brush color when color picker value changes
// $(".color-picker").on("change", function(e){
	// brush.setColor(e.target.value);
// });

// sync displayed brush size to slider value as slider changes
// $(".brush-slider").on("slide", function(e, ui){
	// brush.setLineWidth(ui.value);
// });

// redraw current canvas when window is resized
window.addEventListener("resize", () => { canvasController.clearCanvas(); canvasController.redrawHistory(); canvasController.resizeCanvas(); });

// set 'mousedown' flag for mousemove listener, increment layerId
$("#canvas").mousedown(function(e){
	canvasController.incrementLayerId();
	$(document).data('mousedown', true);
	brush = new paintTool();
	brush.addPoint(e.pageX, e.pageY);
	brush.draw();
});

// executes painting action if mouse is down
$("#canvas").mousemove(function(e){
	if ($(document).data('mousedown')){
		brush.addPoint(e.pageX, e.pageY);
		brush.draw();
	}
});

// set 'mousedown' flag to FALSE and record painting action to history
$("#canvas").mouseup(function(){
	$(document).data('mousedown', false);
	canvasController.addUndoItem(brush);
});

// set 'mousedown' flag to FALSE if brush leaves canvas and record painting action to history
$("#canvas").mouseleave(function(e){
	if ($(document).data('mousedown')) {
		$(document).data('mousedown', false);
		canvasController.addUndoItem(brush);
	}
});

// Clear All button, clears canvas and resets layerId counter
$(".close").click(function(){
	canvasController.clearCanvas();
	canvasController.setLayerId(0);
	canvasController.undoHistory.length = 0;
	canvasController.redoHistory.length = 0;
	canvasController.checkHistoryButtons();
});

$("#undo-button").click(function(){
	canvasController.undo();
});

$("#redo-button").click(function(){
	canvasController.redo();
});