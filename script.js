class paintBrush {
	
	constructor(brushSize = 20){
		this.canvas = document.getElementById("canvas");
		this.brushSize = brushSize;
		this.radius = this.brushSize / 2;
		this.color = $(".color-picker").val();
	}
	
	setBrushSize(size){
		this.brushSize = size;
		this.radius = this.brushSize / 2;
	}
	
	setColor(color){
		this.color = color;
	}
	
	paint(mouseX, mouseY){
		if ($(document).data('mousedown')){
			this.mouseX = mouseX - this.radius;
			this.mouseY = mouseY - this.radius - 80; // 80 is offset for header height
			$("#canvas").append("<svg class='line"+history.getLayerId()+"' draggable='false' style='position:absolute; left:"+this.mouseX+"; top:"+this.mouseY+"; height:"+this.brushSize+"px; width:"+this.brushSize+"px; -moz-user-select:none'><circle cx='"+this.radius+"' cy='"+this.radius+"' r='"+this.radius+"' fill='"+this.color+"' /></svg>");
		}
	}
	
	addToHistory(){
		if (history.undoHistory.length > 0 && history.undoHistory[history.undoHistory.length - 1].layerId != history.getLayerId()){
			if ($(".line"+history.getLayerId()).length > 0){
				history.addUndoItem(new canvasHistoryItem("brushStroke", history.getLayerId(), this.color));
				history.undoHistory[history.undoHistory.length - 1].captureBrushStroke(this.brushSize);
			}
		} else {
			if ($(".line"+history.getLayerId()).length > 0 && history.undoHistory.length == 0){
				history.addUndoItem(new canvasHistoryItem("brushStroke", history.getLayerId(), this.color));
				history.undoHistory[history.undoHistory.length - 1].captureBrushStroke(this.brushSize);
			}
		}
	}
}

class paintTool {
	
	constructor(){
		this.pointsX = [];
		this.pointsY = [];
		this.strokeStyle = document.getElementsByClassName("color-picker")[0].value;
		this.lineWidth = $(".brush-slider").slider("value");
	}
	
	addPoint(mouseX, mouseY){
		this.pointsX.push(mouseX);
		this.pointsY.push(mouseY - 80);
	}
	
	draw(){
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		
		context.strokeStyle = this.strokeStyle;
		context.lineJoin = "round";
		context.lineWidth = this.lineWidth;
		
		for (var i=0; i < this.pointsX.length; i++){
			context.beginPath();
			if (i){
				context.moveTo(this.pointsX[i-1], this.pointsY[i-1]);
			} else {
				context.moveTo(this.pointsX[i]-1, this.pointsY[i]);
			}
			context.lineTo(this.pointsX[i], this.pointsY[i]);
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

class canvasHistoryItem {
	
	constructor(itemType, layerId, color){
		this.itemType = itemType;
		this.layerId = layerId;
		this.color = color;
	}
	
	captureBrushStroke(brushSize){
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
	
	createBrushStroke(){
		var brushSize = this.brushSize;
		var layerId = this.layerId;
		var color = this.color;
		var radius = brushSize / 2;
		this.brushDataArray.forEach(function(item, index){
			$("#canvas").append("<svg class='line"+layerId+"' draggable='false' style='position:absolute; left:"+item.mouseX+"; top:"+item.mouseY+"; height:"+brushSize+"px; width:"+brushSize+"px; -moz-user-select:none'><circle cx='"+radius+"' cy='"+radius+"' r='"+radius+"' fill='"+color+"' /></svg>");
		});
	}
	
	removeFromCanvas(){
		var line = document.getElementsByClassName("line"+this.layerId);
		while(line[0]){
			line[0].remove();
		}
	}
}

class canvasControl {
	
	constructor(){
		this.undoHistory = [];
		this.redoHistory = [];
		this.layerId = 0;
	}
	
	addUndoItem(item){
		this.undoHistory.push(item);
		history.redoHistory.length = 0;
		this.checkHistoryButtons();
	}
	
	addRedoItem(item){
		this.redoHistory.push(item);
	}
	
	incrementLayerId(){
		this.layerId++;
	}
	
	decrementLayerId(){
		this.layerId--;
	}
	
	setLayerId(id){
		this.layerId = id;
	}
	
	getLayerId(){
		return this.layerId;
	}
	
	undo(){
		if (!document.getElementById("undo-button").classList.contains("header-button-disabled")){	
			this.undoHistory[this.undoHistory.length - 1].removeFromCanvas();
			this.redoHistory.push(this.undoHistory.pop());
			this.checkHistoryButtons();
		}
	}
	
	redo(){
		if (!document.getElementById("redo-button").classList.contains("header-button-disabled")){
			this.redoHistory[this.redoHistory.length - 1].createBrushStroke();
			this.undoHistory.push(this.redoHistory.pop());
			this.checkHistoryButtons();
		}
	}
	
	checkHistoryButtons(){
		if (history.undoHistory.length > 0){
			document.getElementById("undo-button").classList.remove("header-button-disabled");
		} else {
			document.getElementById("undo-button").classList.add("header-button-disabled");
		}
		if (history.redoHistory.length > 0){
			document.getElementById("redo-button").classList.remove("header-button-disabled");
		} else {
			document.getElementById("redo-button").classList.add("header-button-disabled");
		}
	}
}