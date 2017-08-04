// dashed line functionality for ctx
// https://stackoverflow.com/questions/4576724/dotted-stroke-in-canvas#answer-4577326
export default function addDashedLineToCtx() {
  var CP =
    window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (CP && CP.lineTo) {
    CP.dashedLine = function(x, y, x2, y2, dashArray) {
      if (!dashArray) dashArray = [10, 5];

      let dashCount = dashArray.length;
      this.moveTo(x, y);
      let dx = x2 - x, dy = y2 - y;
      let slope = dx ? dy / dx : 1e15;
      let distRemaining = Math.sqrt(dx * dx + dy * dy);
      let dashIndex = 0, draw = true;
      while (distRemaining >= 0.1) {
        let dashLength = dashArray[dashIndex++ % dashCount];
        if (dashLength === 0) dashLength = 0.001; // Hack for Safari
        if (dashLength > distRemaining) dashLength = distRemaining;
        let xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
        if (dx < 0) xStep = -xStep;
        x += xStep;
        y += slope * xStep;
        this[draw ? "lineTo" : "moveTo"](x, y);
        distRemaining -= dashLength;
        draw = !draw;
      }
    };
  }
}
