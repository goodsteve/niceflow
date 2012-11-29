var nf = null;

function Niceflow() {
  this.settings = {};
  this.settings.controls = {};
  this.settings.controls.dimensions = {};
  this.settings.controls.dimensions.height = 3;
  this.settings.controls.dimensions.width = 3;
  this.settings.controls.fill = {};
  this.settings.controls.fill.color = '#fff';
  this.settings.controls.multi = 6;
  this.settings.controls.stroke = {};
  this.settings.controls.stroke.color = '#cc0000';
  this.settings.controls.stroke.width = 2;
  
  this.settings.canvas = {};
  this.settings.canvas.dimensions = {};
  this.settings.canvas.dimensions.height = 640;
  this.settings.canvas.dimensions.width = 940;
  this.settings.canvas.fill = {};
  this.settings.canvas.fill.color = '#ebf1f1';
  this.settings.canvas.grid = {};
  this.settings.canvas.grid.x = 4;
  this.settings.canvas.grid.y = 4;
  this.settings.canvas.grid.xlim = (this.settings.canvas.dimensions.width / this.settings.canvas.grid.x);
  this.settings.canvas.grid.ylim = (this.settings.canvas.dimensions.height / this.settings.canvas.grid.y);
  this.settings.canvas.id = 'nfCanvas';
  this.settings.canvas.position = {};
  this.settings.canvas.position.x = 0;
  this.settings.canvas.position.y = 0;
  this.settings.canvas.stroke = {};
  this.settings.canvas.stroke.color = '#0b5626';
  this.settings.canvas.stroke.width = 1;
  this.settings.toolbar = {};
  this.settings.toolbar.resizing = {};
  this.settings.toolbar.resizing.throttle = 6;
  
  this.settings.shapes = {};
  /**
   * Basic Shapes
   */
  // Circle
  this.settings.shapes.circle = {};
  this.settings.shapes.circle.dimensions = {};
  this.settings.shapes.circle.dimensions.height = 3;
  this.settings.shapes.circle.dimensions.width = 3;
  this.settings.shapes.circle.fill = {};
  this.settings.shapes.circle.fill.color = '#fff';
  this.settings.shapes.circle.multi = 12;
  this.settings.shapes.circle.stroke = {};
  this.settings.shapes.circle.stroke.color = '#333';
  this.settings.shapes.circle.stroke.width = 2;
  // Diamond
  this.settings.shapes.diamond = {};
  this.settings.shapes.diamond.dimensions = {};
  this.settings.shapes.diamond.dimensions.height = 3;
  this.settings.shapes.diamond.dimensions.width = 2;
  this.settings.shapes.diamond.fill = {};
  this.settings.shapes.diamond.fill.color = '#fff';
  this.settings.shapes.diamond.multi = 12;
  this.settings.shapes.diamond.stroke = {};
  this.settings.shapes.diamond.stroke.color = '#333';
  this.settings.shapes.diamond.stroke.width = 2;
  // Parallelogram
  this.settings.shapes.parallelogram = {};
  this.settings.shapes.parallelogram.dimensions = {};
  this.settings.shapes.parallelogram.dimensions.height = 4;
  this.settings.shapes.parallelogram.dimensions.width = 7;
  this.settings.shapes.parallelogram.fill = {};
  this.settings.shapes.parallelogram.fill.color = '#fff';
  this.settings.shapes.parallelogram.multi = 8;
  this.settings.shapes.parallelogram.stroke = {};
  this.settings.shapes.parallelogram.stroke.color = '#333';
  this.settings.shapes.parallelogram.stroke.width = 2;
  // Rectangle
  this.settings.shapes.rectangle = {};
  this.settings.shapes.rectangle.dimensions = {};
  this.settings.shapes.rectangle.dimensions.height = 4;
  this.settings.shapes.rectangle.dimensions.width = 7;
  this.settings.shapes.rectangle.fill = {};
  this.settings.shapes.rectangle.fill.color = '#fff';
  this.settings.shapes.rectangle.multi = 8;
  this.settings.shapes.rectangle.stroke = {};
  this.settings.shapes.rectangle.stroke.color = '#333';
  this.settings.shapes.rectangle.stroke.width = 2;
  // Square
  this.settings.shapes.square = {};
  this.settings.shapes.square.dimensions = {};
  this.settings.shapes.square.dimensions.height = 3;
  this.settings.shapes.square.dimensions.width = 3;
  this.settings.shapes.square.fill = {};
  this.settings.shapes.square.fill.color = '#fff';
  this.settings.shapes.square.multi = 12;
  this.settings.shapes.square.stroke = {};
  this.settings.shapes.square.stroke.color = '#333';
  this.settings.shapes.square.stroke.width = 2;
  // Triangle
  this.settings.shapes.triangle = {};
  this.settings.shapes.triangle.dimensions = {};
  this.settings.shapes.triangle.dimensions.height = 3;
  this.settings.shapes.triangle.dimensions.width = 3;
  this.settings.shapes.triangle.fill = {};
  this.settings.shapes.triangle.fill.color = '#fff';
  this.settings.shapes.triangle.multi = 12;
  this.settings.shapes.triangle.stroke = {};
  this.settings.shapes.triangle.stroke.color = '#333';
  this.settings.shapes.triangle.stroke.width = 2;
  
  
  this.canvas = null;
  this.state = null;
  this.toolbar = {};
  this.toolbar.resize = false;
  return null;
}

Niceflow.prototype.capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

Niceflow.prototype.disableResize = function() {
  this.toolbar.resize = false;
  //$('#pf .toolbar .tools .resize').removeClass('green');
  //$('#pf .toolbar .tools .resize').addClass('gray');
  nf.state.lastKey = 0;
  nf.state.clickx = 0;
  nf.state.clicky = 0;
  nf.state.lastx = 0;
  nf.state.lasty = 0;
  return null;
}
Niceflow.prototype.drawControls = function(curX, curY, curW, curH) {
  this.drawDelete(curX, curY, curW, curH);
  this.drawResize(curX, curY, curW, curH);
  return null;
}
Niceflow.prototype.drawDelete = function(curX, curY, curW, curH) {
  var ctx = nf.canvas.ctx;
  var ctrlX = (curX + curW + (this.settings.controls.dimensions.width - 3));
  var ctrlY = (curY - (this.settings.controls.dimensions.height - 2));
  // delete
  ctx.fillStyle = this.settings.controls.fill.color;
  ctx.strokeStyle = this.settings.controls.stroke.color;
  ctx.lineWidth = this.settings.controls.stroke.width;
  ctx.beginPath();
  ctx.moveTo(ctrlX, ctrlY);
  ctx.lineTo(ctrlX, (ctrlY - (this.settings.controls.dimensions.height * this.settings.controls.multi)));
  ctx.lineTo((ctrlX + (this.settings.controls.dimensions.width * this.settings.controls.multi)), (ctrlY - (this.settings.controls.dimensions.height * this.settings.controls.multi)));
  ctx.lineTo((ctrlX + (this.settings.controls.dimensions.width * this.settings.controls.multi)), ctrlY);
  ctx.lineTo(ctrlX, ctrlY);
  ctx.stroke();
  ctx.fill();
  // delete x line 1
  ctx.strokeStyle = this.settings.controls.stroke.color;
  ctx.lineWidth = this.settings.controls.stroke.width;
  ctx.beginPath();
  ctx.moveTo(ctrlX + ((this.settings.controls.dimensions.width * this.settings.controls.multi) / 4), ctrlY - ((this.settings.controls.dimensions.height * this.settings.controls.multi) / 1.3));
  ctx.lineTo(ctrlX + ((this.settings.controls.dimensions.width * this.settings.controls.multi) / 1.3), ctrlY - this.settings.controls.dimensions.height );
  ctx.stroke();
  // delete x line 2
  ctx.strokeStyle = this.settings.controls.stroke.color;
  ctx.lineWidth = this.settings.controls.stroke.width;
  ctx.beginPath();
  ctx.moveTo(ctrlX + ((this.settings.controls.dimensions.width * this.settings.controls.multi) / 1.3), ctrlY - ((this.settings.controls.dimensions.height * this.settings.controls.multi) / 1.3));
  ctx.lineTo(ctrlX + ((this.settings.controls.dimensions.width * this.settings.controls.multi) / 4), ctrlY - this.settings.controls.dimensions.height);
  ctx.stroke();
  return null;
}
Niceflow.prototype.drawResize = function(curX, curY, curW, curH) {
  var ctx = nf.canvas.ctx;
  var ctrlX = (curX + curW + (this.settings.controls.dimensions.width - 3));
  var ctrlY = (curY + curH + (this.settings.controls.dimensions.height - 2));
  // delete
  ctx.fillStyle = this.settings.controls.fill.color;
  ctx.strokeStyle = this.settings.controls.stroke.color;
  ctx.lineWidth = this.settings.controls.stroke.width;
  ctx.beginPath();
  ctx.moveTo(ctrlX, ctrlY);
  ctx.lineTo(ctrlX, (ctrlY + (this.settings.controls.dimensions.height * this.settings.controls.multi)));
  ctx.lineTo((ctrlX + (this.settings.controls.dimensions.width * this.settings.controls.multi)), (ctrlY + (this.settings.controls.dimensions.height * this.settings.controls.multi)));
  ctx.lineTo((ctrlX + (this.settings.controls.dimensions.width * this.settings.controls.multi)), ctrlY);
  ctx.lineTo(ctrlX, ctrlY);
  ctx.stroke();
  ctx.fill();
  // resize arrow line 1
  ctx.strokeStyle = this.settings.controls.stroke.color;
  ctx.lineWidth = this.settings.controls.stroke.width;
  ctx.beginPath();
  ctx.moveTo(ctrlX + ((this.settings.controls.dimensions.width * this.settings.controls.multi) / 3.9), ctrlY + this.settings.controls.dimensions.height + 1);
  ctx.lineTo(ctrlX + ((this.settings.controls.dimensions.width * this.settings.controls.multi) / 1.3), ctrlY + ((this.settings.controls.dimensions.height * this.settings.controls.multi) / 1.3));
  ctx.stroke();
  // resize arrow line 2
  ctx.strokeStyle = this.settings.controls.stroke.color;
  ctx.lineWidth = this.settings.controls.stroke.width;
  ctx.beginPath();
  ctx.moveTo(ctrlX + ((this.settings.controls.dimensions.width * this.settings.controls.multi) / 1.3), ctrlY + ((this.settings.controls.dimensions.height * this.settings.controls.multi) / 1.3));
  ctx.lineTo(ctrlX + ((this.settings.controls.dimensions.width * this.settings.controls.multi) / 2.5), ctrlY + ((this.settings.controls.dimensions.height * this.settings.controls.multi) / 1.3));
  ctx.stroke();
  // resize arrow line 3
  ctx.strokeStyle = this.settings.controls.stroke.color;
  ctx.lineWidth = this.settings.controls.stroke.width;
  ctx.beginPath();
  ctx.moveTo(ctrlX + ((this.settings.controls.dimensions.width * this.settings.controls.multi) / 1.3), ctrlY + ((this.settings.controls.dimensions.height * this.settings.controls.multi) / 1.3));
  ctx.lineTo(ctrlX + ((this.settings.controls.dimensions.width * this.settings.controls.multi) / 1.3), ctrlY + this.settings.controls.dimensions.height + 3.1);
  ctx.stroke();
  return null;
}
Niceflow.prototype.enableResize = function() {
  this.toolbar.resize = true;
  //$('#pf .toolbar .tools .resize').removeClass('gray');
  //$('#pf .toolbar .tools .resize').addClass('green');
  return null;
}
Niceflow.prototype.init = function() {
  this.canvas = new NiceflowCanvas(document.getElementById(this.settings.canvas.id));
  var initShape = new NiceflowRectangle();
  initShape.init(0, 0, 1, 1, 1, '#eee', '#eee', 1, 'rectangle');
  this.canvas.addShape(initShape);
  return null;
}
Niceflow.prototype.toggleResize = function() {
  if (this.toolbar.resize == false) {
    this.enableResize();
  } else {
    this.disableResize();
  }
  return null;
}