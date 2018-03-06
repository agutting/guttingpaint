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
			$("#canvas").append("<svg class='line"+paintHistory.getLayerId()+"' draggable='false' style='position:absolute; left:"+this.mouseX+"; top:"+this.mouseY+"; height:"+this.brushSize+"px; width:"+this.brushSize+"px; -moz-user-select:none'><circle cx='"+this.radius+"' cy='"+this.radius+"' r='"+this.radius+"' fill='"+this.color+"' /></svg>");
		}
	}
	
	addToHistory(){
		if (paintHistory.undoHistory.length > 0 && paintHistory.undoHistory[paintHistory.undoHistory.length - 1].layerId != paintHistory.getLayerId()){
			if ($(".line"+paintHistory.getLayerId()).length > 0){
				paintHistory.addUndoItem(new canvasHistoryItem("brushStroke", paintHistory.getLayerId(), this.color));
				paintHistory.undoHistory[paintHistory.undoHistory.length - 1].captureBrushStroke(this.brushSize);
			}
		} else {
			if ($(".line"+paintHistory.getLayerId()).length > 0 && paintHistory.undoHistory.length == 0){
				paintHistory.addUndoItem(new canvasHistoryItem("brushStroke", paintHistory.getLayerId(), this.color));
				paintHistory.undoHistory[paintHistory.undoHistory.length - 1].captureBrushStroke(this.brushSize);
			}
		}
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

class canvasHistory {
	
	constructor(){
		this.undoHistory = [];
		this.redoHistory = [];
		this.layerId = 0;
	}
	
	addUndoItem(item){
		this.undoHistory.push(item);
		paintHistory.redoHistory.length = 0;
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
		this.undoHistory[this.undoHistory.length - 1].removeFromCanvas();
		this.redoHistory.push(this.undoHistory.pop());
		this.checkHistoryButtons();
	}
	
	redo(){
		this.redoHistory[this.redoHistory.length - 1].createBrushStroke();
		this.undoHistory.push(this.redoHistory.pop());
		this.checkHistoryButtons();
	}
	
	checkHistoryButtons(){
		if (paintHistory.undoHistory.length > 0){
			document.getElementById("undo-button").classList.remove("header-button-disabled");
		} else {
			document.getElementById("undo-button").classList.add("header-button-disabled");
		}
		if (paintHistory.redoHistory.length > 0){
			document.getElementById("redo-button").classList.remove("header-button-disabled");
		} else {
			document.getElementById("redo-button").classList.add("header-button-disabled");
		}
	}
}