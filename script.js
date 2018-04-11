class paintTool {
	
	constructor() {
		this.pointsX = [];
		this.pointsY = [];
		this.strokeStyle = document.getElementsByClassName("color-picker")[0].value;
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

class paintHistoryAction {
	
	constructor(pointsX, pointsY){
		this.pointsX = pointsX;
		this.pointsY = pointsY;
	}
}

class canvasHistoryItem {
	
	constructor(itemType, layerId, color){
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
			$("#canvas").append("<svg class='line"+layerId+"' draggable='false' style='position:absolute; left:"+item.mouseX+"; top:"+item.mouseY+"; height:"+brushSize+"px; width:"+brushSize+"px; -moz-user-select:none'><circle cx='"+radius+"' cy='"+radius+"' r='"+radius+"' fill='"+color+"' /></svg>");
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
		this.undoHistory = [];
		this.redoHistory = [];
		this.layerId = 0;
	}
	
	addUndoItem(item) {
		this.undoHistory.push(item);
		canvasController.redoHistory.length = 0;
		this.checkHistoryButtons();
	}
	
	addRedoItem(item) {
		this.redoHistory.push(item);
	}
	
	incrementLayerId() {
		this.layerId++;
	}
	
	decrementLayerId() {
		this.layerId--;
	}
	
	setLayerId(id) {
		this.layerId = id;
	}
	
	getLayerId() {
		return this.layerId;
	}
	
	clearCanvas() {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	}
	
	redrawHistory(){
		for (var i = 0; i < this.undoHistory.length; i++) {
			this.undoHistory[i].redraw();
		}
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
			this.redoHistory[this.redoHistory.length - 1].createBrushStroke();
			this.undoHistory.push(this.redoHistory.pop());
			this.checkHistoryButtons();
		}
	}
	
	checkHistoryButtons() {
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