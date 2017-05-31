$.fn.wqzGgl?console.error("jQuery插件冲突！\n 冲突原因：命名空间重复:$.fn.wqzGgl"):
(function($){
	$.fn.wqzGgl = function(options,param){
		// 执行对外开放的方法
		if (typeof options === "string"){
			var state = this.data("_wqzGgl");
			var method;
			if (state){	// 当前对象已被初始化过
				method = $.fn._wqzGgl.methods[options];
				if (method){	// 插件中存在此方法
					return method(this,param);
				}else{
					console.error("错误：_wqzGgl插件未提供此方法："+options);	
				}
				return this;
			}else{
				console.error("错误："+this[0].outerHTML+"元素尚未被_wqzGgl插件渲染过！无法调用方法："+options);
			}
			return this;
		}
		
		// 渲染插件
		return this.each(function(){
			var _options = $.extend(true,{},$.fn.wqzGgl.defaultSettings,options||{});
			var plugin = new wqzGgl(_options,$(this));
			plugin.generate();
			$(this).data("_wqzGgl",plugin);
		});
	}
	
	// 默认配置
	$.fn.wqzGgl.defaultSettings = {
		coverBg:	"#CCCCCC"
	};
	
	// 对外方法
	$.fn.wqzGgl.methods = {
	};
	
	// 插件对象
	function wqzGgl(_options,$elem){
		this._options = _options;
		this.$elem = $elem;						// 目标对象
		this.domWidth = $elem.innerWidth();		// 目标元素宽度
		this.domHeight = $elem.innerHeight();	// 目标元素高度
		this.enableClear = false;				// 是否允许擦除
		this.startPoint = {x:0,y:0};			// 起始点
		this.lineWidth = 15;					// 擦除时线的宽度
		this.canvas;							// 新增的canvas对象
		this.ctx;								// canvas对应的CanvasRenderingContext2D环境
	};
	
	/* 
	 * 插件对象原型扩展
	 * 	generate		生成插件
	 * 	init			初始化
	 * 	bindEvent		绑定事件
	 */
	wqzGgl.prototype = {
		generate: function(){
			var $plugin = this;
			$plugin.canvas = document.createElement("canvas");
			$plugin.$elem.append($plugin.canvas);
			
			if($plugin.canvas.getContext("2d")){
				$plugin.ctx = $plugin.canvas.getContext("2d");
				$plugin.init();
				$plugin.bindEvent();
			}else{
				$plugin.canvas.remove();
				console.error("当前浏览器不支持canvas！");
			}
			$plugin.$elem.children().show();
		},
		init: function(){
			var $plugin = this;
			$plugin.canvas.width = $plugin.domWidth;
			$plugin.canvas.height = $plugin.domHeight;
			$plugin.canvas.style.position = "absolute";
			$plugin.canvas.style.left = 0;
			$plugin.canvas.style.top = 0;
			
			$plugin.ctx.fillStyle =  $plugin._options.coverBg;
			$plugin.ctx.fillRect(0,0,$plugin.domWidth,$plugin.domHeight);
			$plugin.ctx.globalCompositeOperation = "destination-out";
			$plugin.ctx.lineWidth = $plugin.lineWidth;
		},
		bindEvent: function(){
			var $plugin = this;
			$plugin.$elem.on("mousedown",function(event){
				$plugin.enableClear = true;
				$plugin.startPoint.x = event.offsetX;
				$plugin.startPoint.y = event.offsetY;
				$plugin.ctx.beginPath();
				$plugin.ctx.moveTo($plugin.startPoint.x,$plugin.startPoint.y);
			});
			$plugin.$elem.on("mousemove",function(event){
				if($plugin.enableClear){
					var x = event.offsetX;
					var y = event.offsetY;
					$plugin.ctx.lineTo(x,y);
					$plugin.ctx.stroke();
					$plugin.startPoint.x = x;
					$plugin.startPoint.y = y;
				}
			});
			$(document).on("mouseup",function(event){
				$plugin.enableClear = false;
				$plugin.ctx.closePath();
			});
		}
	}
})(jQuery);