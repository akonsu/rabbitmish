# -*- mode:coffee; coding:utf-8; -*- Time-stamp: <coloringbook.coffee - root>

AUTO_COMPLETE_PERCENT = 0.2
LINE_WIDTH = 20

drawing = false
x_prev = y_prev = 0


is_complete = (canvas) ->
  context = canvas.getContext "2d"
  data = context.getImageData(0, 0, canvas.width, canvas.height).data
  count = 0
  count += 1 for x, i in data when (i + 1) % 4 is 0 and x > 0
  count < data.length * AUTO_COMPLETE_PERCENT / 4


start = (container) ->
  canvas = container.appendChild document.createElement "canvas"
  animation = container.appendChild document.createElement "img"

  container.style.position = "relative"

  canvas.style.background = "#fff url('fantasy-color.jpg') no-repeat center"
  canvas.style.position = "absolute"
  canvas.width = 528
  canvas.height = 529

  animation.style.display = "none"
  animation.src = "fantasy-animation.gif"
  animation.style.position = "absolute"
  animation.style.left = canvas.style.left
  animation.style.top = canvas.style.top
  animation.style.zIndex = 1

  image = document.createElement("img")
  image.src = "fantasy-bw.jpg"
  image.onload = ->
    context = canvas.getContext "2d"

    context.drawImage image, 0, 0
    context.globalCompositeOperation = "destination-out"
    context.lineCap = "round"
    context.lineWidth = LINE_WIDTH
    context.strokeStyle = "rgba(0,0,0,1)"

    canvas.onmousedown = (e) ->
      drawing = true
      x_prev = e.pageX - this.offsetLeft + 1
      y_prev = e.pageY - this.offsetTop + 1

    canvas.onmousemove = (e) ->
      if drawing
        x = e.pageX - this.offsetLeft
        y = e.pageY - this.offsetTop

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x_prev, y_prev);
        context.stroke();
        context.closePath();
        x_prev = x
        y_prev = y

    window.onmouseup = (e) ->
      drawing = false
      #context.clearRect(0, 0, canvas.width, canvas.height) if is_complete(canvas)
      animation.style.display = "" if is_complete(canvas)


window["coloringbook_start"] = start
