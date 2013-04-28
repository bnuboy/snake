var l = new LinkedList();
var Snake = (function(){
	var Body = function(x,y){
		this.x = x;
		this.y = y;
		var WIDTH = 30;
		this.draw = function(stage){
			var shape = new createjs.Shape();
			shape.graphics.ss("#ffffff").f("#000000").r(this.x,this.y,WIDTH,WIDTH);
			stage.addChild(shape);
		}
	}
	var Food = function(x,y){
		this.x = x;
		this.y = y;
		var WIDTH = 30;
		this.draw =  function(stage){
			var shape = new createjs.Shape();
			shape.graphics.ss("#ffffff").f("#ff0000").r(this.x,this.y,WIDTH,WIDTH);
			stage.addChild(shape);
		}
	}
	var Snake = function(cavasId){
		var WIDTH = 30;
		var COLOR = "#000000";
		var stage = new createjs.Stage(cavasId);
		var x = 0;
		var y = 0;
		var pause = true;
		this.direction = 39;
		for(var i = 0; i < 3; i ++){
			var body = new Body(150 - i * 30,0);
			l.addLast(body);
		}
		for(var i = 0; i < l.size(); i ++){
			var body = l.get(i);
			body.draw(stage);
		}
		stage.update();
		createjs.Ticker.setFPS(2);
		var $this = this;
		var tickHandler = function(){
			l.removeLast();
			switch($this.direction){
				case 37:
					l.addFirst(new Body(l.getFirst().x - WIDTH,l.getFirst().y));
					break;
				case 38:
					l.addFirst(new Body(l.getFirst().x,l.getFirst().y - WIDTH));
					break;
				case 39:
					l.addFirst(new Body(l.getFirst().x + WIDTH,l.getFirst().y));
					break;
				case 40:
					l.addFirst(new Body(l.getFirst().x,l.getFirst().y + WIDTH));
					break;
			}
			stage.removeAllChildren();			
			for(var i = 0; i < l.size(); i ++){
				var shape = new createjs.Shape();
				var body = l.get(i);
				body.draw(stage);
			}
			var food = new Food(90,90);
			food.draw(stage);
			stage.update();
		};
		this.pause = function(){
			createjs.Ticker.removeEventListener("tick",tickHandler);
			pause = true;
		}
		this.start = function(){
			createjs.Ticker.addEventListener("tick",tickHandler);
			pause = false;
		}
		this.isPause = function(){
			return pause;
		}
		this.setDirection = function(d){
			if(Math.abs(this.direction - d) != 2)
				this.direction = d;
		}
	};
	return Snake;
})();