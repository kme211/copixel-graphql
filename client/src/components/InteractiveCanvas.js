import React, { Component } from "react";
import getCoords from "../utils/getCoords";
import fill from "../utils/fill";
import Canvas from "./Canvas";
import { COLORS, BRUSH, ERASER, PAINT_BUCKET, EYE_DROPPER } from "../constants";

class InteractiveCanvas extends Component {
  constructor(props) {
    super(props);

    this.startDraw = this.startDraw.bind(this);
    this.stopDraw = this.stopDraw.bind(this);
    this.stopEverything = this.stopEverything.bind(this);
    this.draw = this.draw.bind(this);
  }

  draw(e) {
    e.persist();
    const {
      updateState,
      isDrawing,
      currentColor,
      currentTool,
      pixels,
      x: sectionX,
      y: sectionY
    } = this.props;
    const isHighlighting = !isDrawing && currentTool !== EYE_DROPPER;
    const [x, y] = getCoords(
      sectionX,
      sectionY,
      this.props.pixelSize,
      this.props.sectionSizePx,
      e
    );
    const currentPixel = pixels[`${x},${y}`];
    if (!currentPixel) return console.log("pixel not found", `${x},${y}`);

    if (isHighlighting) {
      if (currentPixel.locked) return;
      updateState({ highlightedPos: [x, y] });
    } else if (isDrawing) {
      let updatedPixels;
      if (currentTool === EYE_DROPPER) {
        return updateState({
          currentColor: pixels[`${x},${y}`].color,
          currentTool: BRUSH
        });
      }
      if (currentPixel.locked) return;
      if (currentTool === PAINT_BUCKET) {
        updatedPixels = fill(
          pixels,
          `${x},${y}`,
          currentColor,
          this.props.pixelSize
        );
      } else {
        const updatedPixel = Object.assign({}, currentPixel, {
          color: currentTool === ERASER ? COLORS.eraser : currentColor
        });
        updatedPixels = Object.assign({}, pixels, {
          [`${x},${y}`]: updatedPixel
        });
      }
      updateState({ pixels: updatedPixels });
    }
  }

  startDraw(e) {
    e.persist();
    this.props.updateState(
      {
        isDrawing: true,
        isHighlighting: false
      },
      () => {
        this.draw(e);
      }
    );
  }

  stopDraw(e) {
    e.persist();
    this.props.updateState({
      isDrawing: false
    });
  }

  stopEverything() {
    this.props.updateState({
      isDrawing: false,
      highlightedPos: null
    });
  }

  render() {
    const { x, y, pixels, height, width } = this.props;

    return (
      <Canvas
        pixels={pixels}
        x={x}
        y={y}
        width={width}
        height={height}
        onMouseDown={this.startDraw}
        onTouchStart={this.startDraw}
        onMouseMove={this.draw}
        onTouchMove={this.draw}
        onMouseUp={this.stopDraw}
        onTouchEnd={this.stopDraw}
        onMouseOut={this.stopEverything}
        pixelSize={this.props.pixelSize}
        sectionSizePx={this.props.sectionSizePx}
        highlightedPos={this.props.highlightedPos}
      />
    );
  }
}

export default InteractiveCanvas;
