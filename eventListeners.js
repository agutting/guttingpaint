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
	slide: (e, ui) => {
		$(".current-brush-size").text(ui.value); // sync textual brush size display on change
	}
});
var brush;

// initialize canvasController object, handles menu functions like custom colors, undo/redo, clearing canvas
const canvasController = new canvasControl();
// part of clearCanvas() is to set a white background for accuracy in saved files, so also do this on startup
canvasController.clearCanvas();

// initialize eventListenerController, removes/adds canvas listeners when switching tools
const eventListenerController = new eventListenerControl(); 
// add event listeners for default tool, paint brush
eventListenerController.setBrushListeners();

$(".color-box-inner").click(e => {
	$(".color-box-outer").removeClass("selected");
	$(e.target).parent().addClass("selected");
});

$("#custom-color-button").click(() => {
	$("#browser-color-picker").click();
});

 $("#browser-color-picker").on("change", e => {
	 canvasController.addCustomColor(e.target.value);
 });

// redraw current canvas when window is resized
window.addEventListener("resize", () => {
	canvasController.resizeCanvas();
});

// Clear All button, clears canvas and resets layerId counter
$(".close").click(() => {
	canvasController.clearCanvas();
	canvasController.setLayerId(0);
	canvasController.undoHistory.length = 0;
	canvasController.redoHistory.length = 0;
	canvasController.checkHistoryButtons();
});

$("#undo-button").click(() => {
	canvasController.undo();
});

$("#redo-button").click(() => {
	canvasController.redo();
});