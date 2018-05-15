class paintTool {
	
	constructor() {
		this.pointsX = [];
		this.pointsY = [];
		this.strokeStyle = $(".selected").children().css("background-color"); // color
		this.lineWidth = $(".brush-slider").slider("value");
	}
	
	addPoint(mouseX, mouseY) {
		this.pointsX.push(mouseX);
		this.pointsY.push(mouseY - 80);
	}
	
	draw(){
		context.beginPath();
		context.strokeStyle = this.strokeStyle;
		context.lineJoin = "round";
		context.lineWidth = this.lineWidth;
		
		if (this.pointsX.length > 1){
			context.moveTo(this.pointsX[this.pointsX.length-2], this.pointsY[this.pointsY.length-2]);
		} else {
			context.moveTo(this.pointsX[0]-1, this.pointsY[0]);
		}
		context.lineTo(this.pointsX[this.pointsX.length-1], this.pointsY[this.pointsX.length-1]);
		context.closePath();
		context.stroke();
	}
	
	redraw(){
		for (var i = 1; i < this.pointsX.length; i++) {
			context.beginPath();
			context.strokeStyle = this.strokeStyle;
			context.lineJoin = "round";
			context.lineWidth = this.lineWidth;
			context.moveTo(this.pointsX[i], this.pointsY[i]);
			context.lineTo(this.pointsX[i-1], this.pointsY[i-1]);
			context.closePath();
			context.stroke();
		}
	}
	
	setColor(color) {
		this.strokeStyle = color;
	}
	
	setLineWidth(width) {
		this.lineWidth = width;
	}
}

class shapeTool {

	constructor(shape, context, lineWidth, strokeStyle, origMouseX, origMouseY) {
		this.shape = shape;
		this.strokeStyle = strokeStyle; // color
		this.lineWidth = lineWidth;
		this.originX = origMouseX;
		this.originY = origMouseY;
		this.finalX;
		this.finalY;
		this.context = context;
		this.polygon = this.shape == "Polygon" ? true : false;
		this.polygonInProgress = this.shape == "Polygon" ? true : false; // used by polygon shapes to check whether in the middle of drawing a polygon or beginning a new one
		this.polygonX = []; // sets of coordinates for drawing/redrawing polygons
		this.polygonY = [];
	}

	draw(mouseX, mouseY) {
		this.context.beginPath();
		this.context.strokeStyle = this.strokeStyle;
		this.context.lineJoin = "miter";
		this.context.lineWidth = this.lineWidth;
		eval("this.draw" + this.shape + "(mouseX, mouseY)");
	}

	redraw() {
		this.draw(this.finalX, this.finalY);
	}

	recordFinalCoordinate(mouseX, mouseY) {
		this.finalX = mouseX;
		this.finalY = mouseY;
	}

	drawLine(mouseX, mouseY) {
		this.context.moveTo(this.originX, this.originY - 80);
		this.context.lineTo(mouseX, mouseY - 80);
		this.context.stroke();
	}

	drawRectangle(mouseX, mouseY) {
		this.context.moveTo(this.originX, this.originY - 80);
		this.context.lineTo(mouseX, this.originY - 80);
		this.context.lineTo(mouseX, mouseY - 80);
		this.context.lineTo(this.originX, mouseY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawEllipse(mouseX, mouseY) {
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		let radiusX = deltaX / 2;
		let radiusY = deltaY / 2;
		let centerX = mouseX > this.originX ? this.originX + radiusX : this.originX - radiusX;
		let centerY = mouseY > this.originY ? this.originY + radiusY - 80 : this.originY - radiusY - 80;
		this.context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
		this.context.stroke();
	}

	drawRightTriangle(mouseX, mouseY) {
		this.context.moveTo(this.originX, this.originY - 80);
		this.context.lineTo(this.originX, mouseY - 80);
		this.context.lineTo(mouseX, mouseY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawIsoscelesTriangleVertical(mouseX, mouseY) {
		let deltaX = Math.abs(this.originX - mouseX);
		let centerX = mouseX > this.originX ? this.originX + (deltaX / 2) : this.originX - (deltaX / 2);
		this.context.moveTo(centerX, this.originY - 80);
		this.context.lineTo(mouseX, mouseY - 80);
		this.context.lineTo(this.originX, mouseY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawIsoscelesTriangleHorizontal(mouseX, mouseY) {
		let deltaY = Math.abs(this.originY - mouseY);
		let centerY = mouseY > this.originY ? this.originY + (deltaY / 2) : this.originY - (deltaY / 2);
		this.context.moveTo(mouseX, centerY- 80);
		this.context.lineTo(this.originX, mouseY- 80);
		this.context.lineTo(this.originX, this.originY- 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawDiamond(mouseX, mouseY) {
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		let centerX = mouseX > this.originX ? this.originX + (deltaX / 2) : this.originX - (deltaX / 2);
		let centerY = mouseY > this.originY ? this.originY + (deltaY / 2) : this.originY - (deltaY / 2);
		this.context.moveTo(this.originX, centerY - 80);
		this.context.lineTo(centerX, this.originY - 80);
		this.context.lineTo(mouseX, centerY - 80);
		this.context.lineTo(centerX, mouseY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawPentagon(mouseX, mouseY) {
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		let centerX = mouseX > this.originX ? this.originX + (deltaX / 2) : this.originX - (deltaX / 2);
		let innerX = mouseX > this.originX ? this.originX + (0.2 * deltaX) : this.originX - (0.2 * deltaX);
		let outerX = mouseX > this.originX ? this.originX + (0.8 * deltaX) : this.originX - (0.8 * deltaX);
		this.context.moveTo(centerX, this.originY - 80);
		this.context.lineTo(mouseX, mouseY > this.originY ? this.originY + (0.4 * deltaY) - 80 : this.originY - (0.4 * deltaY) - 80);
		this.context.lineTo(outerX, mouseY - 80);
		this.context.lineTo(innerX, mouseY - 80);
		this.context.lineTo(this.originX, mouseY > this.originY ? this.originY + (0.4 * deltaY) - 80 : this.originY - (0.4 * deltaY) - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawHexagon(mouseX, mouseY) {
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		let centerX = mouseX > this.originX ? this.originX + (deltaX / 2) : this.originX - (deltaX / 2);
		let innerY = mouseY > this.originY ? this.originY + (0.25 * deltaY) : this.originY - (0.25 * deltaY);
		let outerY = mouseY > this.originY ? this.originY + (0.75 * deltaY) : this.originY - (0.75 * deltaY);
		this.context.moveTo(centerX, this.originY - 80);
		this.context.lineTo(mouseX, innerY - 80);
		this.context.lineTo(mouseX, outerY - 80);
		this.context.lineTo(centerX, mouseY - 80);
		this.context.lineTo(this.originX, outerY - 80);
		this.context.lineTo(this.originX, innerY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawArrowHorizontal(mouseX, mouseY) {
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		let centerX = mouseX > this.originX ? this.originX + (deltaX / 2) : this.originX - (deltaX / 2);
		let centerY = mouseY > this.originY ? this.originY + (deltaY / 2) : this.originY - (deltaY / 2);
		let innerY = mouseY > this.originY ? this.originY + (0.25 * deltaY) : this.originY - (0.25 * deltaY);
		let outerY = mouseY > this.originY ? this.originY + (0.75 * deltaY) : this.originY - (0.75 * deltaY);
		this.context.moveTo(centerX, this.originY - 80);
		this.context.lineTo(mouseX, centerY - 80);
		this.context.lineTo(centerX, mouseY - 80);
		this.context.lineTo(centerX, outerY - 80);
		this.context.lineTo(this.originX, outerY - 80);
		this.context.lineTo(this.originX, innerY - 80);
		this.context.lineTo(centerX, innerY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawArrowVertical(mouseX, mouseY) {
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		let centerX = mouseX > this.originX ? this.originX + (deltaX / 2) : this.originX - (deltaX / 2);
		let centerY = mouseY > this.originY ? this.originY + (deltaY / 2) : this.originY - (deltaY / 2);
		let innerX = mouseX > this.originX ? this.originX + (0.25 * deltaX) : this.originX - (0.25 * deltaX);
		let outerX = mouseX > this.originX ? this.originX + (0.75 * deltaX) : this.originX - (0.75 * deltaX);
		this.context.moveTo(innerX, this.originY - 80);
		this.context.lineTo(outerX, this.originY - 80);
		this.context.lineTo(outerX, centerY - 80);
		this.context.lineTo(mouseX, centerY - 80);
		this.context.lineTo(centerX, mouseY - 80);
		this.context.lineTo(this.originX, centerY - 80);
		this.context.lineTo(innerX, centerY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawFourPointedStar(mouseX, mouseY) {
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		let centerX = mouseX > this.originX ? this.originX + (deltaX / 2) : this.originX - (deltaX / 2);
		let centerY = mouseY > this.originY ? this.originY + (deltaY / 2) : this.originY - (deltaY / 2);
		let innerX = mouseX > this.originX ? this.originX + (0.4 * deltaX) : this.originX - (0.4 * deltaX);
		let outerX = mouseX > this.originX ? this.originX + (0.6 * deltaX) : this.originX - (0.6 * deltaX);
		let innerY = mouseY > this.originY ? this.originY + (0.4 * deltaY) : this.originY - (0.4 * deltaY);
		let outerY = mouseY > this.originY ? this.originY + (0.6 * deltaY) : this.originY - (0.6 * deltaY);
		this.context.moveTo(centerX, this.originY - 80);
		this.context.lineTo(outerX, innerY - 80);
		this.context.lineTo(mouseX, centerY - 80);
		this.context.lineTo(outerX, outerY - 80);
		this.context.lineTo(centerX, mouseY - 80);
		this.context.lineTo(innerX, outerY - 80);
		this.context.lineTo(this.originX, centerY - 80);
		this.context.lineTo(innerX, innerY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawFivePointedStar(mouseX, mouseY) {
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		let centerX = mouseX > this.originX ? this.originX + (deltaX / 2) : this.originX - (deltaX / 2);
		let innerX = mouseX > this.originX ? this.originX + (0.2 * deltaX) : this.originX - (0.2 * deltaX);
		let middleX1 = mouseX > this.originX ? this.originX + (0.3 * deltaX) : this.originX - (0.3 * deltaX);
		let middleX2 = mouseX > this.originX ? this.originX + (0.38 * deltaX) : this.originX - (0.38 * deltaX);
		let middleX3 = mouseX > this.originX ? this.originX + (0.62 * deltaX) : this.originX - (0.62 * deltaX);
		let middleX4 = mouseX > this.originX ? this.originX + (0.7 * deltaX) : this.originX - (0.7 * deltaX);
		let outerX = mouseX > this.originX ? this.originX + (0.8 * deltaX) : this.originX - (0.8 * deltaX);
		let innerY = mouseY > this.originY ? this.originY + (0.39 * deltaY) : this.originY - (0.39 * deltaY);
		let middleY = mouseY > this.originY ? this.originY + (0.61 * deltaY) : this.originY - (0.61 * deltaY);
		let outerY = mouseY > this.originY ? this.originY + (0.79 * deltaY) : this.originY - (0.79 * deltaY);
		this.context.moveTo(centerX, this.originY - 80);
		this.context.lineTo(middleX3, innerY - 80);
		this.context.lineTo(mouseX, innerY - 80);
		this.context.lineTo(middleX4, middleY - 80);
		this.context.lineTo(outerX, mouseY - 80);
		this.context.lineTo(centerX, outerY - 80);
		this.context.lineTo(innerX, mouseY - 80);
		this.context.lineTo(middleX1, middleY - 80);
		this.context.lineTo(this.originX, innerY - 80);
		this.context.lineTo(middleX2, innerY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawSixPointedStar(mouseX, mouseY) {
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		let centerX = mouseX > this.originX ? this.originX + (deltaX / 2) : this.originX - (deltaX / 2);
		let centerY = mouseY > this.originY ? this.originY + (deltaY / 2) : this.originY - (deltaY / 2);
		let innerX = mouseX > this.originX ? this.originX + (0.16 * deltaX) : this.originX - (0.16 * deltaX);
		let middleX1 = mouseX > this.originX ? this.originX + (0.32 * deltaX) : this.originX - (0.32 * deltaX);
		let middleX2 = mouseX > this.originX ? this.originX + (0.68 * deltaX) : this.originX - (0.68 * deltaX);
		let outerX = mouseX > this.originX ? this.originX + (0.84 * deltaX) : this.originX - (0.84 * deltaX);
		let innerY = mouseY > this.originY ? this.originY + (0.25 * deltaY) : this.originY - (0.25 * deltaY);
		let outerY = mouseY > this.originY ? this.originY + (0.75 * deltaY) : this.originY - (0.75 * deltaY);
		this.context.moveTo(centerX, this.originY - 80);
		this.context.lineTo(middleX2, innerY - 80);
		this.context.lineTo(mouseX, innerY - 80);
		this.context.lineTo(outerX, centerY - 80);
		this.context.lineTo(mouseX, outerY - 80);
		this.context.lineTo(middleX2, outerY - 80);
		this.context.lineTo(centerX, mouseY - 80);
		this.context.lineTo(middleX1, outerY - 80);
		this.context.lineTo(this.originX, outerY - 80);
		this.context.lineTo(innerX, centerY - 80);
		this.context.lineTo(this.originX, innerY - 80);
		this.context.lineTo(middleX1, innerY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawPolygonFirstLine(mouseX, mouseY) { // redraws first line while holding down mouse button
		this.context.beginPath();
		this.context.strokeStyle = this.strokeStyle;
		this.context.lineJoin = "miter";
		this.context.lineWidth = this.lineWidth;
		this.context.moveTo(this.originX, this.originY - 80);
		this.context.lineTo(mouseX, mouseY - 80);
		this.context.stroke();
	}

	drawPolygonEndFirstLine(mouseX, mouseY) { // records start/end coordinates of first drawn line to build from with drawPolygonAddPoints()
		this.polygonX.push(this.originX);
		this.polygonX.push(mouseX);
		this.polygonY.push(this.originY);
		this.polygonY.push(mouseY);
	}

	drawPolygonAddPoints(mouseX, mouseY) { // accepts new pair of coordinates and redraws previous polygon sides; if click within threshold of origin, end shape, close path
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		if (deltaX < 5 && deltaY < 5) {
			this.polygonInProgress = false;
			this.drawPolygon();
			canvasController.addUndoItem(this);
		} else {
			this.context.beginPath();
			this.context.strokeStyle = this.strokeStyle;
			this.context.lineJoin = "miter";
			this.context.lineWidth = this.lineWidth;
			this.polygonX.push(mouseX);
			this.polygonY.push(mouseY);
			this.context.moveTo(this.polygonX[0], this.polygonY[0] - 80);
			for (let i = 1; i < this.polygonX.length; i++) {
				this.context.lineTo(this.polygonX[i], this.polygonY[i] - 80);
			}
			this.context.stroke();
		}
	}

	drawPolygon(mouseX, mouseY) { // more of a redraw-type function, but named drawPolygon to facilitate class compatibility as all other shapes are redrawn this way
		this.context.beginPath();
		this.context.strokeStyle = this.strokeStyle;
		this.context.lineJoin = "miter";
		this.context.lineWidth = this.lineWidth;
		this.context.moveTo(this.polygonX[0], this.polygonY[0] - 80);
		for (let i = 1; i < this.polygonX.length; i++) {
			this.context.lineTo(this.polygonX[i], this.polygonY[i] - 80);
		}
		this.context.closePath();
		this.context.stroke();
	}
}

class canvasControl {
	
	constructor() {
		this.canvas = document.getElementById('canvas');
		this.undoHistory = [];
		this.redoHistory = [];
		this.customColorCounter = 20;
		this.activeTool = "brush";
		this.eventListenerController = new eventListenerControl();
	}

	activateBrush() {
		this.eventListenerController.removeCanvasListeners();
		this.eventListenerController.setBrushListeners();
		$("#paint-brush-button").addClass("active-tool");
	}
	
	addUndoItem(item) {
		this.undoHistory.push(item);
		canvasController.redoHistory.length = 0;
		this.checkHistoryButtons();
	}
	
	addRedoItem(item) {
		this.redoHistory.push(item);
	}

	addCustomColor(color) { // sets a bottom-row square's background to color selected in browser color picker
		document.getElementsByClassName("color" + this.customColorCounter)[0].style.background = color;
		$(".color-box-outer").removeClass("selected");
		$(".color" + this.customColorCounter).parent().addClass("selected");
		if (this.customColorCounter == 29) { // progress through squares from left to right, loop at end
			this.customColorCounter = 20;
		} else {
			this.customColorCounter++;
		}
	}
	
	clearCanvas() {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.fillStyle = "white"; // canvas is naturally black, but empty dom is white; this prevents discrepancy in
		context.fillRect(0, 0, this.canvas.width, this.canvas.height); // backgrounds between on-screen and saved images
	}
	
	redrawHistory() {
		for (var i = 0; i < this.undoHistory.length; i++) {
			this.undoHistory[i].redraw(); // every type of drawing action stored in history has a redraw() function
		}
	}

	resizeCanvas() { // adjust both types of canvas dimensions & redraw to prevent image distortion & brush offset from pointer
		this.canvas.style.width = window.innerWidth;
		this.canvas.style.height = window.innerHeight - 80;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight - 80;
		this.redrawHistory();
	}
	
	undo() {
		if (!document.getElementById("undo-button").classList.contains("header-button-disabled")){	
			this.clearCanvas();
			this.redoHistory.push(this.undoHistory.pop());
			this.redrawHistory();
			this.checkHistoryButtons();
		}
	}
	
	redo() {
		if (!document.getElementById("redo-button").classList.contains("header-button-disabled")){
			this.clearCanvas();
			this.undoHistory.push(this.redoHistory.pop());
			this.redrawHistory();
			this.checkHistoryButtons();
		}
	}
	
	checkHistoryButtons() { // enable/disable undo/redo buttons when there is/isn't available history
		if (canvasController.undoHistory.length > 0){
			document.getElementById("undo-button").classList.remove("header-button-disabled");
		} else {
			document.getElementById("undo-button").classList.add("header-button-disabled");
		}
		if (canvasController.redoHistory.length > 0) {
			document.getElementById("redo-button").classList.remove("header-button-disabled");
		} else {
			document.getElementById("redo-button").classList.add("header-button-disabled");
		}
	}
}

class eventListenerControl {

	constructor() {
		this.currentTool = "brush";
	}

	removeCanvasListeners() {
		$("#canvas").off("mousedown mousemove mouseup mouseleave");
	}

	setBrushListeners() {
		$("#canvas").mousedown(e => {
			$(document).data('mousedown', true);
			brush = new paintTool();
			brush.addPoint(e.pageX, e.pageY);
			brush.draw();
		});

		$("#canvas").mousemove(e => {
			if ($(document).data('mousedown')) {
				brush.addPoint(e.pageX, e.pageY);
				brush.draw();
			}
		});

		$("#canvas").mouseup(() => {
			$(document).data('mousedown', false);
			canvasController.addUndoItem(brush);
		});

		$("#canvas").mouseleave(() => {
			if ($(document).data('mousedown')) {
				$(document).data('mousedown', false);
				canvasController.addUndoItem(brush);
			}
		});
	}

	setShapeListeners(shapeName) {
		if (shapeName == "Polygon") {
			$("#canvas").mousedown(e => {
				if (typeof brush !== "undefined" && brush.polygonInProgress == true) {
					canvasController.clearCanvas();
					canvasController.redrawHistory();
					brush.drawPolygonAddPoints(e.clientX, e.clientY);
				} else {
					$(document).data('mousedown', true);
					brush = new shapeTool(shapeName, document.getElementById('canvas').getContext('2d'), $(".brush-slider").slider("value"), $(".selected").children().css("background-color"), e.clientX, e.clientY);
				}
			});

			$("#canvas").mousemove(e => {
				if ($(document).data('mousedown')) {
					canvasController.clearCanvas();
					canvasController.redrawHistory();
					brush.drawPolygonFirstLine(e.clientX, e.clientY);
				}
			});

			$("#canvas").mouseup(e => {
				if ($(document).data('mousedown')) {
					$(document).data('mousedown', false);
					brush.drawPolygonEndFirstLine(e.clientX, e.clientY);
				}
			});

			$("#canvas").mouseleave(e => {
				if ($(document).data('mousedown')) {
					$(document).data('mousedown', false);
					brush.drawPolygonEndFirstLine(e.clientX, e.clientY);
				}
			});
		} else {

			$("#canvas").mousedown(e => {
				$(document).data('mousedown', true);
				brush = new shapeTool(shapeName, document.getElementById('canvas').getContext('2d'), $(".brush-slider").slider("value"), $(".selected").children().css("background-color"), e.clientX, e.clientY);
			});

			$("#canvas").mousemove(e => {
				if ($(document).data('mousedown')) {
					canvasController.clearCanvas();
					canvasController.redrawHistory();
					brush.draw(e.clientX, e.clientY);
				}
			});

			$("#canvas").mouseup(e => {
				$(document).data('mousedown', false);
				brush.recordFinalCoordinate(e.clientX, e.clientY);
				canvasController.addUndoItem(brush);
			});

			$("#canvas").mouseleave(e => {
				if ($(document).data('mousedown')) {
					$(document).data('mousedown', false);
					brush.recordFinalCoordinate(e.clientX, e.clientY);
					canvasController.addUndoItem(brush);
				}
			});
		}
	}

	setStaticListeners() {
		let shapes = document.getElementsByClassName('shape-box-inner');
		
		for (let i = 0; i < shapes.length; i++) {

			shapes[i].height = "18";
			shapes[i].width = "18";
			let ctx = shapes[i].getContext('2d');
			let shapeName = shapes[i].id;
			let drawShape = shape => {
				if (shape == "Polygon") {
					let brush = new shapeTool(shape, ctx, 1, "rgb(0, 0, 0)", 2, 2 + 80); // come back here to push preset points for polygon
				} else {
					let brush = new shapeTool(shape, ctx, 1, "rgb(0, 0, 0)", 2, 2 + 80);
					brush.draw(16, 16 + 80);
				}
			}

			ctx.fillStyle = 'rgb(215,215,215)'; // initial background color w/ shape
			ctx.fillRect(0, 0, 18, 18);
			drawShape(shapeName);

			shapes[i].addEventListener('mouseover', e => { // hover background color w/ shape
				if (shapes[i].classList.contains('active-shape') == false) { // hover effects only if not active
					ctx.fillStyle = 'rgb(215, 215, 255)';
					ctx.fillRect(0, 0, 18, 18);
					drawShape(shapeName);
				}
			});
			shapes[i].addEventListener('mouseleave', e => { // return to normal background when hover ends
				if (shapes[i].classList.contains('active-shape') == false) {
					ctx.fillStyle = 'rgb(215,215,215)';
					ctx.fillRect(0, 0, 18, 18);
					drawShape(shapeName);
				}
			});
			shapes[i].addEventListener('click', e => {
				let allShapes = document.getElementsByClassName('shape-box-inner');
				for (let n = 0; n < allShapes.length; n++) { // remove active-shape styling from all shapes
					let ctx2 = allShapes[n].getContext('2d');
					let shapeName2 = allShapes[n].id;
					let drawShape2 = shape => {
						if (shape == "Polygon") {
							let brush = new shapeTool(shape, ctx2, 1, "rgb(0, 0, 0)", 2, 2 + 80); // come back here to push preset points for polygon
						} else {
							let brush = new shapeTool(shape, ctx2, 1, "rgb(0, 0, 0)", 2, 2 + 80);
							brush.draw(16, 16 + 80);
						}
					}
					allShapes[n].classList.remove('active-shape');
					ctx2.fillStyle = 'rgb(215,215,215)';
					ctx2.fillRect(0, 0, 18, 18);
					drawShape2(shapeName2);
				}
				shapes[i].classList.add('active-shape'); // apply active-shape styling to this shape
				ctx.fillStyle = 'rgb(180,180,255)';
				ctx.fillRect(0, 0, 18, 18);
				drawShape(shapeName);

				let activeToolButtons = document.getElementsByClassName('active-tool'); // remove active-tool styling from other tools
				for (let n = 0; n < activeToolButtons.length; n++) {
					activeToolButtons[n].classList.remove('active-tool');
				}

				canvasController.eventListenerController.removeCanvasListeners();
				canvasController.eventListenerController.setShapeListeners(shapeName);
			});
		}

		document.getElementById('paint-brush-button').addEventListener('click', e => {

			e.target.classList.add('active-tool'); // add active-tool styling to this button

			for (let i = 0; i < shapes.length; i++) { // remove active-shape styling and class from all shapes
				let ctx = shapes[i].getContext('2d');
				let shapeName = shapes[i].id;
				let drawShape = shape => {
					let brush = new shapeTool(shape, ctx, 1, "rgb(0, 0, 0)", 2, 2 + 80);
					brush.draw(16, 16 + 80);
				}

				shapes[i].classList.remove('active-shape');
				ctx.fillStyle = 'rgb(215,215,215)';
				ctx.fillRect(0, 0, 18, 18);
				drawShape(shapeName);
			}

			canvasController.eventListenerController.removeCanvasListeners();
			canvasController.eventListenerController.setBrushListeners();
		});
	}
}