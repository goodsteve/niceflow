function NiceflowCanvas(canvas) {
  // **** First some setup ****
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;
  // **** Keep track of state! ****
  this.valid = false; // when set to true, the canvas will redraw everything
  this.shapes = [];  // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  // the current selected object.
  // In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;
  this.lastKey = 0;
  this.clickx = 0;
  this.clicky = 0;
  this.lastx = 0;
  this.lasty = 0;
  nf.state = this;
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  canvas.addEventListener('mousedown', this.eMouseDown, true);
  canvas.addEventListener('mousemove', this.eMouseMove, true);
  canvas.addEventListener('mouseup', this.eMouseUp, true);
  canvas.addEventListener('dblclick', function(e) { e.preventDefault(); return false; }, false);
  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;  
  this.interval = 30;
  setInterval(function() { nf.state.draw(); }, nf.state.interval);
  return null;
}
NiceflowCanvas.prototype.addShape = function(shape) {
  $('#niceflow div.properties').hide();
  this.selection = null;
  this.shapes.push(shape);
  this.valid = false;
}
NiceflowCanvas.prototype.addShapeClone = function(shape, w1, h1) {
  shape.w1 = w1;
  shape.h1 = h1;
  this.shapes.push(shape);
  this.valid = false;
}
NiceflowCanvas.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}
NiceflowCanvas.prototype.cloneShape = function() {
  var key = parseInt($('#shapeProperties-key').val());
  var clone = null;
  nf.disableResize();
  if (typeof(this.shapes[key]) !== 'undefined') {
    var shape = this.shapes[key].shapeType;
    var className = 'Niceflow' + nf.capitalize(shape);
    if (typeof(window[className]) == 'function') {
      clone = new window[className]();
      clone.init((nf.settings.canvas.dimensions.width / 2), (nf.settings.canvas.dimensions.height / 2), this.shapes[key].w, this.shapes[key].h, this.shapes[key].multi, this.shapes[key].fillColor, this.shapes[key].strokeColor, this.shapes[key].strokeWidth, shape);
      nf.canvas.addShapeClone(clone, this.shapes[key].w1, this.shapes[key].h1);
    }
  }
  return null;
}
NiceflowCanvas.prototype.deleteShape = function(key) {
  var s, shape;
  var shapes2 = this.shapes;
  this.shapes = [];
  nf.disableResize();
  $.each(shapes2, function(s, shape) {
    if (s != key) {
      nf.canvas.shapes.push(shape);
    }
  });
  $('#niceflow div.properties').hide();
  this.selection = null;
  this.valid = false;
  this.draw();
  return null;
}
NiceflowCanvas.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    var ctx = this.ctx;
    var shapes = this.shapes;
    this.clear();
    // ** Add stuff you want drawn in the background all the time here **
    // draw all shapes
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
      shapes[i].draw(ctx);
    }
    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.selection != null) {
      this.drawSelection();
    }
    // ** Add stuff you want drawn on top all the time here **
    this.valid = true;
  }
}
NiceflowCanvas.prototype.drawSelection = function() {
  var ctx = this.ctx;
  ctx.strokeStyle = this.selectionColor;
  ctx.lineWidth = this.selectionWidth;
  var mySel = this.selection;
  var curX = (mySel.x - ((mySel.w1 + mySel.delta) * mySel.multi));
  var curY = (mySel.y - ((mySel.h1 + mySel.delta) * mySel.multi));
  var curW = (((mySel.w1 + mySel.delta) * mySel.multi) * 2);
  var curH = (((mySel.h1 + mySel.delta) * mySel.multi) * 2);
  ctx.strokeRect(curX, curY, curW, curH);
  // Put controls here.
  nf.drawControls(curX, curY, curW, curH);
  return null;
}
NiceflowCanvas.prototype.eDoubleClick = function(e) {
  
}
NiceflowCanvas.prototype.eDragShape = function(e) {
  var mouse = nf.state.getMouse(e);
  // We don't want to drag the object by its top-left corner,
  // we want to drag from where we clicked.
  // Thats why we saved the offset and use it here
  var x = (mouse.x - nf.state.dragoffx);
  var y = (mouse.y - nf.state.dragoffy);
  var ix = 1;
  var iy = 1;
  // Align to X grid.
  for (ix = 1; ix < nf.settings.canvas.grid.xlim; ++ix) {
    if ((x > (ix * nf.settings.canvas.grid.x)) && (x < ((ix + 1) * nf.settings.canvas.grid.x))) {
      x = ((ix + 1) * nf.settings.canvas.grid.x);
      break;
    }
  }
  // Align to Y grid.
  for (iy = 1; iy < nf.settings.canvas.grid.ylim; ++iy) {
    if ((y > (iy * nf.settings.canvas.grid.y)) && (y < ((iy + 1) * nf.settings.canvas.grid.y))) {
      y = ((iy + 1) * nf.settings.canvas.grid.y);
      break;
    }
  }
  nf.state.selection.x = x;
  nf.state.selection.y = y;
  nf.state.valid = false; // Something's dragging so we must redraw
}
NiceflowCanvas.prototype.eMouseDown = function(e) {
  var mouse = nf.state.getMouse(e);
  var mx = mouse.x;
  var my = mouse.y;
  var shapes = nf.state.shapes;
  var l = shapes.length;
  $('#niceflow div.properties').hide();
  nf.disableResize();
  for (var i = l-1; i >= 0; i--) {
    switch (shapes[i].control(mx, my)) {
      case 'delete':
        nf.canvas.deleteShape(i);
        return;
        break;
      case 'resize':
        nf.enableResize();
        nf.canvas.selectShape(i, shapes[i], mx, my);
        return;
        break;
      default:
        if (shapes[i].contains(mx, my)) {
          nf.canvas.selectShape(i, shapes[i], mx, my);
          return;
        }
        break;
    }
  }
  // havent returned means we have failed to select anything.
  // If there was an object selected, we deselect it
  nf.disableResize();
  if (nf.state.selection) {
    nf.state.selection = null;
    nf.state.valid = false; // Need to clear the old selection border
  }
}
NiceflowCanvas.prototype.eMouseMove = function(e) {
  if (nf.toolbar.resize == false) {
    if (nf.state.dragging){
      nf.canvas.eDragShape(e);
    }
  } else {
    if (nf.state.dragging){
      nf.canvas.eResizeShape(e);
    }
  }
}
NiceflowCanvas.prototype.eMouseUp = function(e) {
  nf.state.dragging = false;
  nf.state.lastKey = 0;
  nf.state.lastx = 0;
  nf.state.lasty = 0;
}
NiceflowCanvas.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }
  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
}
NiceflowCanvas.prototype.eResizeShape = function(e) {
  var mouse = nf.state.getMouse(e);
  if (nf.state.lastx > 0) {
    var ldx = (nf.state.lastx - nf.state.selection.x);
    var ldy = (nf.state.lasty - nf.state.selection.y);
    var dx = (mouse.x - nf.state.selection.x);
    var dy = (mouse.y - nf.state.selection.y);
    var vdx = (dx - ldx);
    var vdy = (dy - ldy);
    var delta = 0;
    if (vdx >= vdy) {
      delta = vdx;
    } else {
      delta = vdy;
    }
    var w2 = nf.state.selection.w + (delta / nf.settings.toolbar.resizing.throttle);
    var h2 = nf.state.selection.h + (delta / nf.settings.toolbar.resizing.throttle);
    //console.log('x:' + nf.state.selection.x + ' y:' + nf.state.selection.y + ' w:' + nf.state.selection.w + ' h:' + nf.state.selection.h + ' ldx:' + ldx + ' ldy:' + ldy + ' dx:' + dx + ' dy:' + dy + ' vdx:' + vdx + ' vdy:' + vdy + ' delta:' + delta);
    if (w2 > 1 && h2 > 1) {
      nf.state.selection.w = w2;
      nf.state.selection.h = h2;
    }
    nf.state.valid = false;
  }
  nf.state.lastx = mouse.x;
  nf.state.lasty = mouse.y;
  return null;
}
NiceflowCanvas.prototype.newShape = function(shape) {
  var className = 'Niceflow' + nf.capitalize(shape);
  var shapeObj = null;
  nf.disableResize();
  if (typeof(nf.settings.shapes[shape]) !== 'undefined') {
    if (typeof(window[className]) == 'function') {
      shapeObj = new window[className]();
      shapeObj.init((nf.settings.canvas.dimensions.width / 2), (nf.settings.canvas.dimensions.height / 2), nf.settings.shapes[shape].dimensions.width, nf.settings.shapes[shape].dimensions.height, nf.settings.shapes[shape].multi, nf.settings.shapes[shape].fill.color, nf.settings.shapes[shape].stroke.color, nf.settings.shapes[shape].stroke.width, shape);
      nf.canvas.addShape(shapeObj);
    }
  }
  return null;
}
NiceflowCanvas.prototype.shapeProperties = function(key, shape) {
  return null;
}
NiceflowCanvas.prototype.saveProperties = function() {
  var key = parseInt($('#shapeProperties-key').val());
  if (typeof(this.shapes[key]) !== 'undefined') {
    this.shapes[key].fillColor = $('#shapeProperties-fillColor').val();
    this.shapes[key].strokeColor = $('#shapeProperties-strokeColor').val();
    this.shapes[key].strokeWidth = parseInt($('#shapeProperties-strokeWidth').val());
    this.valid = false;
    this.draw();
  }
  return null;
}
NiceflowCanvas.prototype.selectShape = function(key, shape, mx, my) {
  var mySel = shape;
  // Keep track of where in the object we clicked
  // so we can move it smoothly (see mousemove)
  nf.state.dragoffx = mx - mySel.x;
  nf.state.dragoffy = my - mySel.y;
  if (key != nf.state.lastKey) {
    nf.state.lastKey = key;
    nf.state.clickx = mx;
    nf.state.clicky = my;
  }
  nf.state.dragging = true;
  nf.state.selection = mySel;
  nf.state.valid = false;
  nf.canvas.shapeProperties(key, nf.state.selection);
  return null;
}
