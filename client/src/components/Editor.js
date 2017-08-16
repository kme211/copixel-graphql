import React, { Component } from "react";
import styled, { css } from "styled-components";
import generatePixels from "../utils/generatePixels";
import Button from "./Button";
import GridBackground from "./GridBackground";
import InteractiveCanvas from "./InteractiveCanvas";
import ToolBar from "./ToolBar";
import Neighbors from "./Neighbors";
import { EYE_DROPPER, BRUSH, COLORS } from "../constants";

const canvasContainerStyles = ({
  width,
  height,
  top,
  right,
  bottom,
  left
}) => css`
  top: ${top}px;
  right: ${right}px;
  bottom: ${bottom}px;
  left: ${left}px;
  position: absolute;
  background: white;
  overflow: hidden;
  width: ${width}px;
  height: ${height}px;
`;

const CanvasContainer = styled.div`${canvasContainerStyles};`;

const containerStyles = ({ width, height }) => css`
  position: relative;
  margin: 0 auto;
  box-shadow: 6px 0px 15px -6px rgba(50, 50, 50, 0.25), -6px 0px 15px -6px rgba(50, 50, 50, 0.25);
  border: 1px solid #c8ccce; 
`;

const Container = styled.div`${containerStyles};`;

const Wrapper = styled.div`
  display: flex;
  background: #ccc;
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
    let pixels = generatePixels({
      blockSizePx: this.props.pixelSize,
      sectionX: this.props.x,
      sectionY: this.props.y,
      widthPx: this.props.sectionSizePx,
      heightPx: this.props.sectionSizePx,
      color: "#fff"
    });

    for (let neighbor of this.props.neighbors) {
      console.log("n pxs", neighbor.pixels);
      for (let px of neighbor.pixels) {
        console.log("px", `${px.x},${px.y}`, px.color);
        pixels[`${px.x},${px.y}`] = { color: px.color, locked: true };
      }
    }

    this.setState({ pixels });
    console.log("pixels", pixels);
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
    const pixelsArray = Object.keys(this.state.pixels).map(position => {
      const [x, y] = position.split(",").map(parseFloat);
      const pixel = {
        x,
        y,
        color: this.state.pixels[position].color
      };
      return pixel;
    });
    this.props.savePixels(pixelsArray);
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
          <Container width={canvasWidth} height={canvasHeight}>
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
