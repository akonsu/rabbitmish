# -*- mode:coffee; coding:utf-8; -*- Time-stamp: <coloringbook.coffee - root>

INNER_RADIUS = 10
EDGE_THICKNESS = 5
TOOL_RADIUS = INNER_RADIUS + EDGE_THICKNESS * 2

drawing = false

start = (container) ->
  canvas = container.appendChild document.createElement("canvas")

  canvas.style.background = "#fff url('animals.png') no-repeat center"
  canvas.width = 640
  canvas.height = 475

  context = canvas.getContext "2d"

  gradient = context.createRadialGradient TOOL_RADIUS, TOOL_RADIUS, INNER_RADIUS, TOOL_RADIUS, TOOL_RADIUS, TOOL_RADIUS
  gradient.addColorStop 0, "rgba(0,0,0,1)"
  gradient.addColorStop 1, "rgba(0,0,0,0)"

  image = document.createElement("img")
  image.src = "animals-bw.png"
  image.onload = () ->
    context.drawImage image, 0, 0
    context.fillStyle = gradient
    context.globalCompositeOperation = "destination-out"

    canvas.onmousedown = (e) ->
      drawing = true
      canvas.onmousemove e

    canvas.onmousemove = (e) ->
      if drawing
        x = e.pageX - canvas.offsetLeft
        y = e.pageY - canvas.offsetTop

        context.save()
        context.translate x - TOOL_RADIUS, y - TOOL_RADIUS
        context.fillRect 0, 0, TOOL_RADIUS * 2, TOOL_RADIUS * 2
        context.restore()

    window.onmouseup = (e) -> drawing = false


window["coloringbook_start"] = start
