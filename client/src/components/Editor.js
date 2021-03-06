import React, { Component } from "react";
import styled from "styled-components";
import * as pixelUtils from "../utils/pixelUtils";
import Button from "./Button";
import GridBackground from "./GridBackground";
import InteractiveCanvas from "./InteractiveCanvas";
import ToolBar from "./ToolBar";
import { EYE_DROPPER, BRUSH, COLORS } from "../constants";

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  box-shadow: 6px 0px 15px -6px rgba(50, 50, 50, 0.25), -6px 0px 15px -6px rgba(50, 50, 50, 0.25);
  border: 1px solid #c8ccce; 
`;

const Wrapper = styled.div`
  display: flex;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAANUlEQVQoU2NUUlL6z0AEYCRZ4cRNfFjNzff7BBaHmwhSCBOE6UAWGywKsfkGwzOEgpLocAQA76Er/cb+8aMAAAAASUVORK5CYII=);
  justify-content: space-between;
  margin-bottom: 16px;
  flex-direction: column-reverse;
  @media (min-width: 424px) {
    flex-direction: row;
  }
`;

class Editor extends Component {
  state = {
    pixels: {},
    isDrawing: false,
    isHighlighting: false,
    highlightedPos: null,
    isGridOn: true,
    currentTool: BRUSH,
    currentColor: COLORS.default
  };

  componentDidMount() {
    let sectionPixels = pixelUtils.generatePixels({
      blockSizePx: this.props.pixelSize,
      sectionX: this.props.x,
      sectionY: this.props.y,
      widthPx: this.props.sectionSizePx,
      heightPx: this.props.sectionSizePx,
      color: "#fff"
    });

    let neighborPixels = pixelUtils.getNeighborPixels(this.props.neighbors);
    let pixels = pixelUtils.getLocalizedPixels(
      this.props.pixelSize,
      sectionPixels,
      neighborPixels
    );
    pixels = pixelUtils.pixelsToObject(
      pixels,
      pixel => `${pixel.localX},${pixel.localY}`
    );

    this.setState({ pixels });
  }

  toggleGrid = () => {
    this.setState({ isGridOn: !this.state.isGridOn });
  };

  updateColor = color => {
    this.setState({
      currentColor: color
    });
  };

  updateTool = tool => {
    this.setState({
      currentTool: tool
    });
  };

  updateState = (newState, callback) => {
    this.setState(newState, callback);
  };

  setCurrentColorToNeighborColor = e => {
    if (this.state.currentTool !== EYE_DROPPER) return;
    this.setState({
      currentColor: e.target.dataset.color,
      currentTool: BRUSH
    });
  };

  onSave = () => {
    const { pixelSize, sectionSizePx, x, y } = this.props;
    const minX = x * sectionSizePx;
    const maxX = minX + sectionSizePx - pixelSize;
    const minY = y * sectionSizePx;
    const maxY = minY + sectionSizePx - pixelSize;
    const pixels = pixelUtils
      .pixelsToArray(this.state.pixels)
      .filter(pixel => {
        const outOfBounds =
          pixel.x < minX || pixel.x > maxX || pixel.y < minY || pixel.y > maxY;
        return !outOfBounds;
      })
      .map(pixel =>
        Object.assign({}, { color: pixel.color, x: pixel.x, y: pixel.y })
      );
    this.props.savePixels(pixels);
  };

  render() {
    const {
      pixels,
      isGridOn,
      currentColor,
      currentTool,
      isDrawing,
      isHighligting,
      highlightedPos
    } = this.state;

    const { neighbors, x, y, pixelSize, sectionSizePx } = this.props;
    const topNeighbor = neighbors.find(n => n.relativePosition === "TOP");
    const rightNeighbor = neighbors.find(n => n.relativePosition === "RIGHT");
    const bottomNeighbor = neighbors.find(n => n.relativePosition === "BOTTOM");
    const leftNeighbor = neighbors.find(n => n.relativePosition === "LEFT");

    const canvasWidth =
      sectionSizePx +
      (leftNeighbor ? pixelSize : 0) +
      (rightNeighbor ? pixelSize : 0);
    const canvasHeight =
      sectionSizePx +
      (topNeighbor ? pixelSize : 0) +
      (bottomNeighbor ? pixelSize : 0);

    return (
      <div>
        <Wrapper>
          <Container
            style={{ width: canvasWidth + 2, height: canvasHeight + 2 }}
          >
            <InteractiveCanvas
              x={x}
              y={y}
              height={canvasWidth}
              width={canvasHeight}
              interactive={true}
              isDrawing={isDrawing}
              isHighligting={isHighligting}
              highlightedPos={highlightedPos}
              pixels={pixels}
              updateState={this.updateState}
              currentTool={currentTool}
              currentColor={currentColor}
              pixelSize={this.props.pixelSize}
              sectionSizePx={this.props.sectionSizePx}
            />
            {isGridOn &&
              <GridBackground
                pixelSize={this.props.pixelSize}
                height={canvasHeight}
                width={canvasWidth}
              />}
          </Container>
          <ToolBar
            isGridOn={isGridOn}
            currentTool={currentTool}
            currentColor={currentColor}
            toggleGrid={this.toggleGrid}
            updateTool={this.updateTool}
            updateColor={this.updateColor}
          />
        </Wrapper>

        <Button onClick={this.onSave}>Save</Button>
      </div>
    );
  }
}

export default Editor;
