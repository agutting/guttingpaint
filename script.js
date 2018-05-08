class paintTool {
	
	constructor() {
		this.pointsX = [];
		this.pointsY = [];
		this.strokeStyle = $(".selected").children().css("background-color");
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
		this.strokeStyle = strokeStyle;
		this.lineWidth = lineWidth;
		this.originX = origMouseX;
		this.originY = origMouseY;
		this.finalX;
		this.finalY;
		this.context = context;
	}

	draw(mouseX, mouseY) {
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
		this.context.beginPath();
		this.context.strokeStyle = this.strokeStyle;
		this.context.lineJoin = "miter";
		this.context.lineWidth = this.lineWidth;
		this.context.moveTo(this.originX, this.originY - 80);
		this.context.lineTo(mouseX, mouseY - 80);
		this.context.stroke();
	}

	drawRectangle(mouseX, mouseY) {
		this.context.beginPath();
		this.context.strokeStyle = this.strokeStyle;
		this.context.lineJoin = "miter";
		this.context.lineWidth = this.lineWidth;
		this.context.moveTo(this.originX, this.originY - 80);
		this.context.lineTo(mouseX, this.originY - 80);
		this.context.lineTo(mouseX, mouseY - 80);
		this.context.lineTo(this.originX, mouseY - 80);
		this.context.closePath();
		this.context.stroke();
	}

	drawCircle(mouseX, mouseY) {
		this.context.beginPath();
		this.context.strokeStyle = this.strokeStyle;
		this.context.lineJoin = "miter";
		this.context.lineWidth = this.lineWidth;
		let deltaX = Math.abs(this.originX - mouseX);
		let deltaY = Math.abs(this.originY - mouseY);
		let radius = deltaX > deltaY ? deltaX / 2 : deltaY / 2;
		let centerX = mouseX > this.originX ? this.originX + (deltaX / 2) : this.originX - (deltaX / 2);
		let centerY = mouseY > this.originY ? this.originY + (deltaY / 2) - 80 : this.originY - (deltaY / 2) - 80;
		this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		this.context.stroke();
	}
}

class paintHistoryAction {
	
	constructor(pointsX, pointsY){
		this.pointsX = pointsX;
		this.pointsY = pointsY;
	}
}

class canvasHistoryItem {
	
	constructor(itemType, layerId, color){
		this.canvas = document.getElementById('canvas');
		this.itemType = itemType;
		this.layerId = layerId;
		this.color = color;
	}
	
	captureBrushStroke(brushSize) {
		this.brushSize = brushSize;
		var elements = $(".line"+this.layerId);
		var brushDataArray = [];
		elements.each(function(){
			brushDataArray.push({
				mouseX: $(this).css('left'),
				mouseY: $(this).css('top')
			});
		});
		this.brushDataArray = brushDataArray;
	}
	
	createBrushStroke() {
		var brushSize = this.brushSize;
		var layerId = this.layerId;
		var color = this.color;
		var radius = brushSize / 2;
		this.brushDataArray.forEach(function(item, index){
			this.canvas.append("<svg class='line"+layerId+"' draggable='false' style='position:absolute; left:"+item.mouseX+"; top:"+item.mouseY+"; height:"+brushSize+"px; width:"+brushSize+"px; -moz-user-select:none'><circle cx='"+radius+"' cy='"+radius+"' r='"+radius+"' fill='"+color+"' /></svg>");
		});
	}
	
	removeFromCanvas() {
		var line = document.getElementsByClassName("line"+this.layerId);
		while(line[0]) {
			line[0].remove();
		}
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

	setStaticListeners() {
		let shapes = document.getElementsByClassName('shape-box-inner');
		
		for (let i = 0; i < shapes.length; i++) {

			shapes[i].height = "18";
			shapes[i].width = "18";
			let ctx = shapes[i].getContext('2d');
			let shapeName = shapes[i].id;
			let drawShape = shape => {
				let brush = new shapeTool(shape, ctx, 1, "rgb(0, 0, 0)", 2, 2 + 80);
				brush.draw(16, 16 + 80);
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
						let brush = new shapeTool(shape, ctx2, 1, "rgb(0, 0, 0)", 2, 2 + 80);
						brush.draw(16, 16 + 80);
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