/* -*- mode:javascript; coding:utf-8; -*- Time-stamp: <main.js - root> */

(function () {
    HTMLCanvasElement.prototype.mouseToLocal = function (e) {
        var offset_x = 0;
        var offset_y = 0;

        for (var node = this; node; node = node.offsetParent) {
            offset_x += node.offsetLeft;
            offset_y += node.offsetTop;
        }

        var x;
        var y;

        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return {x: x - offset_x, y: y - offset_y};
    };
})();

(function (window) {
    var NATIVE_SIZE = {w: 3245, h: 2371};

    var _assets;
    var _container;
    var _drawing_layer;
    var _stage;
    var _update_animation = true;
    var _update_drawing = true;

    function is_erased(canvas) {
        var AUTO_COMPLETE_PERCENT = 0.25;
        var context = canvas.getContext("2d");
        var data = context.getImageData(0, 0, canvas.width, canvas.height).data;

        var count = 0;
        var length = data.length;

        for (var i = 0; i < length; i++) {
            if ((i + 1) % 4 == 0 && data[i] > 0) {
                count++;
            }
        }
        return count < length * AUTO_COMPLETE_PERCENT / 4;
    }

    function make_animation_layer(parent) {
        var canvas = parent.appendChild(document.createElement("canvas"));
        var stage = new Stage(canvas);

        return stage;
    }


    function make_drawing_layer(parent) {
        var LINE_WIDTH = 20;

        var canvas = parent.appendChild(document.createElement("canvas"));
        var context = canvas.getContext("2d");

        var drawing;
        var x_prev;
        var y_prev;
/*
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "absolute";
*/
/*
        canvg(canvas, "a.svg", { scaleWidth: canvas.width,
                                        scaleHeight: canvas.height,
                                        ignoreDimensions: true,
                                        ignoreAnimation: true,
                                        ignoreMouse: true
                                      });

        context.globalCompositeOperation = "destination-out";
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = LINE_WIDTH;
        context.strokeStyle = "rgba(0,0,0,1)";
*/
        canvas.onmousedown = function (e) {
            var p = this.mouseToLocal(e);

            drawing = true;
            x_prev = p.x;
            y_prev = p.y;
        };

        canvas.onmousemove = function (e) {
            if (drawing) {
                var p = this.mouseToLocal(e);

                var x = p.x;
                var y = p.y;

                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x_prev, y_prev);
                context.stroke();
                context.closePath();
                x_prev = x;
                y_prev = y;
            }
        };

        window.onmouseup = function (e) {
            drawing = false;
            if (is_erased(canvas)) {
                console.log("erased");
            }
        };

        return canvas;
    }

    function resize() {
        var w;
        var h;
        var W = window.innerWidth;
        var H = window.innerHeight;

        if (W * NATIVE_SIZE.h > H * NATIVE_SIZE.w) {
            w = H * NATIVE_SIZE.w / NATIVE_SIZE.h;
            h = H;
        }
        else {
            w = W;
            h = W * NATIVE_SIZE.h / NATIVE_SIZE.w;
        }
        _container.style.width = w + 'px';
        _container.style.height = h + 'px';
        _container.style.marginLeft = (-w / 2) + 'px';
        _container.style.marginTop = (-h / 2) + 'px';

        _drawing_layer.width = w;
        _drawing_layer.height = h;

        _stage.canvas.width = w;
        _stage.canvas.height = h;
        _stage.scaleX = W / NATIVE_SIZE.w;
        _stage.scaleY = H / NATIVE_SIZE.h;

        _update_animation = true;
        _update_drawing = true;
    }

    function spritesheet_onload(e) {
        _assets = new TexturePackerSpriteSheet(e.target, FRAMES);
        _stage = make_animation_layer(_container);
        _drawing_layer = make_drawing_layer(_container);

        if (Touch.isSupported()) {
            Touch.enable(_stage);
        }

        resize();

        Ticker.setFPS(20);
        Ticker.addListener(window);

        window.addEventListener('resize', resize, false);
        window.addEventListener('orientationchange', resize, false);
    }

    function start(container) {
        var SPRITESHEET_URL = 'chickens.png';

        _container = container;

         var spritesheet = new Image();
         spritesheet.src = SPRITESHEET_URL;
         spritesheet.onload = spritesheet_onload;
    }

    function tick(delta) {
        if (_update_animation) {
            _stage.update();
            _update_animation = false;
        }
        if (_update_drawing) {
            var context = _drawing_layer.getContext("2d");
            var data = _assets.getFrameData("drawing.png");
            var r = data.rect;

            context.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, _drawing_layer.width, _drawing_layer.height);
            context.globalCompositeOperation = "destination-out";
            context.lineCap = "round";
            context.lineJoin = "round";
            context.lineWidth = 20;
            context.strokeStyle = "rgba(0,0,0,1)";

            _update_drawing = false;
        }
    }

    FRAMES =
{"frames": {

"background.png":
{
	"frame": {"x":0,"y":0,"w":3245,"h":2371},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":3245,"h":2371},
	"sourceSize": {"w":3245,"h":2371}
},
"brown-hen.png":
{
	"frame": {"x":0,"y":2371,"w":958,"h":1033},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":958,"h":1033},
	"sourceSize": {"w":958,"h":1033}
},
"drawing.png":
{
	"frame": {"x":0,"y":3404,"w":3245,"h":2371},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":3245,"h":2371},
	"sourceSize": {"w":3245,"h":2371}
},
"sun.png":
{
	"frame": {"x":0,"y":5775,"w":1175,"h":689},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":1175,"h":689},
	"sourceSize": {"w":1175,"h":689}
},
"violet-green-chick.png":
{
	"frame": {"x":1175,"y":5775,"w":478,"h":538},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":478,"h":538},
	"sourceSize": {"w":478,"h":538}
}}
}
    ;

    window["game_start"] = start;
    window["tick"] = tick;
}(window));
