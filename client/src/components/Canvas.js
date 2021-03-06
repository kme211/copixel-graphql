import React, { Component } from "react";
import { COLORS, ERASER } from "../constants";
import PropTypes from "prop-types";

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.updateCanvas = this.updateCanvas.bind(this);
  }

  initializeCtx(canvas) {
    if (!canvas || this.ctx) return;
    this.ctx = canvas.getContext("2d");
    if (this.props.width && this.props.height) this.updateCanvas();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props;
  }

  componentDidUpdate(prevProps) {
    this.updateCanvas();
  }

  updateCanvas() {
    console.log("updateCanvase");
    performance.mark("startUpdateCanvas");
    let {
      embed,
      embedWidth,
      highlightedPos,
      pixels,
      width,
      height,
      currentTool,
      currentColor
    } = this.props;
    let scale = 1;

    if (embed) {
      scale = embedWidth / width;
      width = width * scale;
      height = height * scale;
    }

    const ctx = this.ctx;
    // clear canvas
    ctx.clearRect(0, 0, width, height);
    // redraw pixels
    for (var pos in pixels) {
      let [x, y] = pos.split(",").map(parseFloat);

      if (embed) {
        x = Math.ceil(x * scale);
        y = Math.ceil(y * scale);
      }

      const blockSize = Math.ceil(this.props.pixelSize * scale);

      let fillStyle = null;

      if (
        highlightedPos &&
        highlightedPos[0] === x &&
        highlightedPos[1] === y
      ) {
        console.log("currentColor", currentColor);
        fillStyle = currentTool === ERASER ? COLORS.eraser : currentColor;
      } else if (pixels[pos]) {
        fillStyle = pixels[pos].color;
      }

      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x, y, blockSize, blockSize);
      }
    }
    window.canvasReady = true;
    performance.mark("endUpdateCanvas");
    performance.measure(
      "durationUpdateCanvas",
      "startUpdateCanvas",
      "endUpdateCanvas"
    );
  }

  render() {
    const {
      embed,
      embedWidth,
      pixels,
      height,
      width,
      sectionSizePx,
      pixelSize,
      isStatic,
      ...props
    } = this.props;
    let scale = 1;
    if (embedWidth) {
      scale = embedWidth / width;
    }
    console.log("pixels", pixels);
    return (
      <canvas
        ref={canvas => {
          this.initializeCtx(canvas);
        }}
        width={width * scale}
        height={height * scale}
        id="drawing"
        {...props}
      />
    );
  }
}

Canvas.propTypes = {
  static: PropTypes.bool,
  embed: PropTypes.bool,
  embedWidth: PropTypes.number,
  pixels: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  sectionSizePx: PropTypes.number.isRequired,
  pixelSize: PropTypes.number.isRequired
};

export default Canvas;
