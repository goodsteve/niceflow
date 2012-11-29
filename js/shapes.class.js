/**
 * Base Shape
 */
function NiceflowShape() {
  this.delta = 0;
  this.dh = 0;
  this.dw = 0;
  this.fillColor = '#fff';
  this.h1 = 3;
  this.h = 3;
  this.multi = 12;
  this.shapeType = 'square';
  this.strokeColor = '#333';
  this.strokeWidth = 2;
  this.w = 3;
  this.w1 = 3;
  this.x = 150;
  this.x1 = 150;
  this.y = 150;
  this.y1 = 150;
  return null;
}
NiceflowShape.prototype.contains = function(mx, my) {
  return ((this.x - (this.w * this.multi)) <= mx) && ((this.x + (this.w * this.multi)) >= mx) && ((this.y - (this.h * this.multi)) <= my) && ((this.y + (this.h * this.multi)) >= my);
}
NiceflowShape.prototype.control = function(mx, my) {
  // Delete
  var deleteX1 = (this.x + ((this.w1 + this.delta) * this.multi) + nf.settings.controls.dimensions.width);
  var deleteY1 = (this.y - ((this.h1 + this.delta) * this.multi) - (nf.settings.controls.dimensions.height * nf.settings.controls.multi));
  var deleteX2 = (deleteX1 + (nf.settings.controls.dimensions.height * nf.settings.controls.multi));
  var deleteY2 = (this.y - ((this.h1 + this.delta) * this.multi));
  if ((deleteX1 <= mx) && (deleteX2 >= mx) && (deleteY1 <= my) && (deleteY2 >= my)) {
    return 'delete';
  }
  // Resize
  var resizeX1 = (this.x + ((this.w1 + this.delta) * this.multi) + nf.settings.controls.dimensions.width);
  var resizeY1 = (this.y + ((this.h1 + this.delta) * this.multi));
  var resizeX2 = (resizeX1 + (nf.settings.controls.dimensions.height * nf.settings.controls.multi));
  var resizeY2 = (this.y + ((this.h1 + this.delta) * this.multi) + (nf.settings.controls.dimensions.height * nf.settings.controls.multi));
  if ((resizeX1 <= mx) && (resizeX2 >= mx) && (resizeY1 <= my) && (resizeY2 >= my)) {
    return 'resize';
  }
  return false;
}
NiceflowShape.prototype.setDelta = function() {
  this.dh = (this.h - this.h1);
  this.dw = (this.w - this.w1);
  if (this.dw >= this.dh) {
    this.delta = this.dw;
  } else {
    this.delta = this.dh;
  }
  return null;
}
NiceflowShape.prototype.init = function(x, y, w, h, m, fillColor, strokeColor, strokeWidth, shapeType) {
  this.fillColor = fillColor;
  this.h1 = parseInt(h);
  this.h = parseInt(h);
  this.multi = parseInt(m);
  this.shapeType = shapeType;
  this.strokeColor = strokeColor;
  this.strokeWidth = strokeWidth;
  this.w1 = parseInt(w);
  this.w = parseInt(w);
  this.x = parseInt(x);
  this.x1 = parseInt(x);
  this.y = parseInt(y);
  this.y1 = parseInt(y);
  return null;
}
/**
 * Basic Shapes
 */
// Circle
function NiceflowCircle() {
  return null;
}
NiceflowCircle.prototype = new NiceflowShape();
NiceflowCircle.prototype.draw = function(ctx) {
  this.setDelta();
  ctx.fillStyle = this.fillColor;
  ctx.strokeStyle = this.strokeColor;
  ctx.lineWidth = this.strokeWidth;
  ctx.beginPath();
  ctx.arc(this.x, this.y, ((this.h1 + this.delta) * this.multi), 0, (2 * Math.PI));
  ctx.stroke();
  ctx.fill();
  return null;
}
// Diamond
function NiceflowDiamond() {
  return null;
}
NiceflowDiamond.prototype = new NiceflowShape();
NiceflowDiamond.prototype.draw = function(ctx) {
  this.setDelta();
  ctx.fillStyle = this.fillColor;
  ctx.strokeStyle = this.strokeColor;
  ctx.lineWidth = this.strokeWidth;
  ctx.beginPath();
  ctx.moveTo((this.x - ((this.w1 + this.delta) * this.multi)), this.y);
  ctx.lineTo(this.x, (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x + ((this.w1 + this.delta) * this.multi)), this.y);
  ctx.lineTo(this.x, (this.y + ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x - ((this.w1 + this.delta) * this.multi)), this.y);
  ctx.stroke();
  ctx.fill();
  return null;
}
// Parallelogram
function NiceflowParallelogram() {
  return null;
}
NiceflowParallelogram.prototype = new NiceflowShape();
NiceflowParallelogram.prototype.draw = function(ctx) {
  this.setDelta();
  ctx.fillStyle = this.fillColor;
  ctx.strokeStyle = this.strokeColor;
  ctx.lineWidth = this.strokeWidth;
  ctx.beginPath();
  ctx.moveTo((this.x - ((this.h1 + this.delta) * this.multi)), (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x + ((this.w1 + this.delta) * this.multi)), (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x + ((this.h1 + this.delta) * this.multi)), (this.y + ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x - ((this.w1 + this.delta) * this.multi)), (this.y + ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x - ((this.h1 + this.delta) * this.multi)), (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.stroke();
  ctx.fill();
  return null;
}
// Rectangle
function NiceflowRectangle() {
  return null;
}
NiceflowRectangle.prototype = new NiceflowShape();
NiceflowRectangle.prototype.draw = function(ctx) {
  this.setDelta();
  ctx.fillStyle = this.fillColor;
  ctx.strokeStyle = this.strokeColor;
  ctx.lineWidth = this.strokeWidth;
  ctx.beginPath();
  ctx.moveTo((this.x - ((this.w1 + this.delta) * this.multi)), (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x + ((this.w1 + this.delta) * this.multi)), (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x + ((this.w1 + this.delta) * this.multi)), (this.y + ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x - ((this.w1 + this.delta) * this.multi)), (this.y + ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x - ((this.w1 + this.delta) * this.multi)), (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.stroke();
  ctx.fill();
  return null;
}
// Square
function NiceflowSquare() {
  return null;
}
NiceflowSquare.prototype = new NiceflowShape();
NiceflowSquare.prototype.draw = function(ctx) {
  this.setDelta();
  ctx.fillStyle = this.fillColor;
  ctx.strokeStyle = this.strokeColor;
  ctx.lineWidth = this.strokeWidth;
  ctx.beginPath();
  ctx.moveTo((this.x - ((this.w1 + this.delta) * this.multi)), (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x + ((this.w1 + this.delta) * this.multi)), (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x + ((this.w1 + this.delta) * this.multi)), (this.y + ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x - ((this.w1 + this.delta) * this.multi)), (this.y + ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x - ((this.w1 + this.delta) * this.multi)), (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.stroke();
  ctx.fill();
  return null;
}
// Triangle
function NiceflowTriangle() {
  return null;
}
NiceflowTriangle.prototype = new NiceflowShape();
NiceflowTriangle.prototype.draw = function(ctx) {
  this.setDelta();
  ctx.fillStyle = this.fillColor;
  ctx.strokeStyle = this.strokeColor;
  ctx.lineWidth = this.strokeWidth;
  ctx.beginPath();
  ctx.moveTo((this.x - ((this.w1 + this.delta) * this.multi)), (this.y + ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo(this.x, (this.y - ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x + ((this.w1 + this.delta) * this.multi)), (this.y + ((this.h1 + this.delta) * this.multi)));
  ctx.lineTo((this.x - ((this.w1 + this.delta) * this.multi)), (this.y + ((this.h1 + this.delta) * this.multi)));
  ctx.stroke();
  ctx.fill();
  return null;
}
