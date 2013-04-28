var Snake = (function(){
	var Body = function(x,y){
		this.x = x;
		this.y = y;
		var WIDTH = 30;
		this.draw = function(stage){
			var shape = new createjs.Shape();
			shape.graphics.ss(1).s("#ffffff").f("#000000").r(this.x,this.y,WIDTH,WIDTH);
			stage.addChild(shape);
		}
	}
	var Food = function(x,y){
		this.x = x;
		this.y = y;
		var WIDTH = 30;
		var shape = new createjs.Shape();
		this.setXY = function(x,y){
			this.x = x;
			this.y = y;
		}
		this.draw =  function(stage){
			shape.graphics.c().ss("#ffffff").f("#ff0000").r(this.x,this.y,WIDTH,WIDTH);
			stage.addChild(shape);
		}
	}
	var Snake = function(cavasId){
		var l = new LinkedList();
		var WIDTH = 30;
		var MAX = 9;
		var COLOR = "#000000";
		var stage = new createjs.Stage(cavasId);
		var x = 0;
		var y = 0;
		var score = 0;
		var pause = true;
		var food = new Food(90,90);
		var tempDirection = 39;
		var zhuangqiangHandler = [];
		var eatBodyHandler = [];
		var eatFoodHandler = [];
		this.direction = 39;
		for(var i = 0; i < 5; i ++){
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
		var isInBody = function(x,y){
			for(var i = 0; i < l.size(); i ++){
				var body = l.get(i);
				if(x == body.x && y == body.y){
					return true;
				}
			}
			return false;
		}
		var getXY = function(){
			var x1 = Math.round(Math.random() * MAX) * 30;
			var y1 = Math.round(Math.random() * MAX) * 30;
			while (isInBody(x1,y1)) {
				x1 = Math.round(Math.random() * MAX) * 30;
				y1 = Math.round(Math.random() * MAX) * 30;
			}
			return {x:x1,y:y1};
		}
		var isEat = function(x,y){
			var head = l.getFirst();
			if(x == head.x && y == head.y){
				score ++;
				for(var i = 0; i < eatFoodHandler.length; i ++){
					eatFoodHandler[i](score);
				}
				return true;
			}
			return false;
		}
		var eat = function(){
			var xy = getXY();
			console.log("x:" + xy.x + ";y:" + xy.y);
			food.setXY(xy.x,xy.y);
		}
		var isZhuangqiang = function(){
			if(l.getFirst().x > 270 || l.getFirst().x < 0 || l.getFirst().y > 270 || l.getFirst().y < 0){
				for(var i = 0; i < zhuangqiangHandler.length; i ++){
					createjs.Ticker.removeEventListener("tick",tickHandler);
					zhuangqiangHandler[i]();
				}
				return true;
			}
			return false;
		}
		var eatBody = function(){
			var head = l.getFirst();
			for(var i = 3; i < l.size(); i ++){
				var body = l.get(i);
				if(head.x == body.x && head.y == body.y){
					for(var j = 0; j < eatBodyHandler.length; j ++){
						createjs.Ticker.removeEventListener("tick",tickHandler);
						eatBodyHandler[j]();
					}
					return true;
				}
			}
			return false;
		}
		var isOver = function(){
			if(isZhuangqiang() || eatBody()){
				return true;
			}
			return false;
		}
		var tickHandler = function(){
			if(Math.abs($this.direction - tempDirection) != 2)
				$this.direction = tempDirection;
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
			if(isEat(food.x,food.y)){
				eat();
			}else{
				l.removeLast();
			}
			if (isOver()) {
				return;
			};	
			stage.removeAllChildren();	
			for(var i = 0; i < l.size(); i ++){
				var body = l.get(i);
				body.draw(stage);
			}
			food.draw(stage);
			stage.update();
		};
		this.addZhuangqiangHandler = function(handler){
			zhuangqiangHandler.push(handler);
		}
		this.addEatBodyHandler = function(handler){
			eatBodyHandler.push(handler);
		}
		this.addEatFoodHandler = function(handler){
			eatFoodHandler.push(handler);
		}
		this.pause = function(){
			createjs.Ticker.removeEventListener("tick",tickHandler);
			pause = true;
		}
		this.start = function(){
			createjs.Ticker.addEventListener("tick",tickHandler);
			//food.draw(stage);
			pause = false;
		}
		this.isPause = function(){
			return pause;
		}
		this.setDirection = function(d){
			tempDirection = d;
		}
	};
	return Snake;
})();