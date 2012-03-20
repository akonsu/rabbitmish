/* -*- mode:javascript; coding:utf-8; -*- Time-stamp: <coloringbook.js - root> */

(function (window) {
    var AUTO_COMPLETE_PERCENT = 0.25;

    var _actualsize;

    function is_erased(canvas) {
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

    function set_line_layer(parent) {
        var LINE_WIDTH = 20;

        var canvas = parent.appendChild(document.createElement("canvas"));
        var context = canvas.getContext("2d");

        var drawing;
        var x_prev;
        var y_prev;

        canvas.width = _actual_size.w;
        canvas.height = _actual_size.h;
        canvas.style.position = "absolute";

        canvg(canvas, "chickens.svg", { scaleWidth: _actual_size.w,
                                            scaleHeight: _actual_size.h,
                                            ignoreDimensions: true,
                                            ignoreAnimation: true,
                                            ignoreMouse: true
                                          });

        context.globalCompositeOperation = "destination-out";
        context.lineCap = "round";
        context.lineWidth = LINE_WIDTH;
        context.strokeStyle = "rgba(0,0,0,1)";

        canvas.onmousedown = function (e) {
            drawing = true;
            x_prev = e.pageX - this.offsetLeft + 1;
            y_prev = e.pageY - this.offsetTop + 1;
        };

        canvas.onmousemove = function (e) {
            if (drawing) {
                x = e.pageX - this.offsetLeft;
                y = e.pageY - this.offsetTop;

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
            //animation.style.display = "" if is_complete(canvas)
        };

        return canvas;
    }

    function start(container, w, h) {
        var REQUIRED_SIZE = {w: 1000, h: 1000};

        _actual_size = {w: isNaN(w) ? REQUIRED_SIZE.w : w, h: isNaN(h) ? REQUIRED_SIZE.h : h};

        var animation_layer = container.appendChild(document.createElement("canvas"));
        var color_layer = container.appendChild(document.createElement("canvas"));
        var line_layer = set_line_layer(container);

        container.style.position = "relative";

        color_layer.width = line_layer.width;
        color_layer.height = line_layer.height;
        color_layer.style.background = "#fff url('fantasy-color.jpg') no-repeat center"
        color_layer.style.position = "absolute";

        animation_layer.width = line_layer.width;
        animation_layer.height = line_layer.height;
        animation_layer.style.position = "absolute";

        var stage = new Stage(animation_layer);

        stage.scaleX = _actual_size.w / REQUIRED_SIZE.w;
        stage.scaleY = _actual_size.h / REQUIRED_SIZE.h;

        if (Touch.isSupported()) {
            Touch.enable(stage);
        }

        Ticker.setFPS(20);
        Ticker.addListener(stage);
    }

    window['game_start'] = start;
}(window));
