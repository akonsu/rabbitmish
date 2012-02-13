# -*- mode:coffee; coding:utf-8; -*- Time-stamp: <coloringbook.coffee - root>

start = (container) ->
  TOOL_RADIUS = 10
  EDGE_THICKNESS = 5

  radius = TOOL_RADIUS + EDGE_THICKNESS * 2

  canvas = container.appendChild document.createElement("canvas")
  context = canvas.getContext "2d"

  image = document.createElement("img")
  image.src = "animals-bw.png"
  image.onload = () ->
    context.drawImage image, 0, 0

#    gradient = context.createRadialGradient radius, radius, TOOL_RADIUS, radius, radius, radius
#    gradient.addColorStop 0, "rgba(0,0,0,1)"
#    gradient.addColorStop 1, "rgba(0,0,0,0)"

#    context.globalCompositeOperation = "destination-out"
#    context.fillStyle = gradient
#    context.translate 100, 100
#    context.fillRect 0, 0, radius * 2, radius * 2


    canvas.onmousemove = mymove

  mymove = (e) ->
    x = e.pageX - canvas.offsetLeft
    y = e.pageY - canvas.offsetTop

    gradient = context.createRadialGradient x, y, TOOL_RADIUS, x, y, radius
    gradient.addColorStop 0, "rgba(0,0,0,1)"
    gradient.addColorStop 1, "rgba(0,0,0,0)"

    context.globalCompositeOperation = "destination-out"
    context.fillStyle = gradient
#    context.translate x - radius, y - radius
    context.fillRect x - radius, y - radius, radius * 2, radius * 2

  canvas.style.background = "#fff url('animals.png') no-repeat center"
  canvas.width = 640
  canvas.height = 475

window["coloringbook_start"] = start
