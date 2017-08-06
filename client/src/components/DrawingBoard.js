import React, { Component } from "react";
import styled from "styled-components";
import Cell from "./DrawingBoardCell";

function isNeighboringSection(currentX, currentY) {
  const x = currentX;
  const y = currentY;
  return function(section) {
    if (section.y === y && section.x === x - 1) return true;
    if (section.y === y && section.x === x + 1) return true;
    if (section.x === x && section.y === y - 1) return true;
    if (section.x === x && section.y === y + 1) return true;
  };
}

const Row = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

class DrawingBoard extends Component {
  render() {
    const { width, height } = this.props;
    const MAX_HEIGHT = window.innerHeight * 0.45; // Height of the grid should not exceed 45% of window height
    const MAX_INNER_WIDTH = 800; // This value comes from the max-width of the Inner component
    const optimalCellWidth = window.innerWidth >= MAX_INNER_WIDTH
      ? MAX_INNER_WIDTH / width
      : window.innerWidth / width;
    const optimalCellHeight = height * optimalCellWidth > MAX_HEIGHT
      ? MAX_HEIGHT / height
      : optimalCellWidth;
    const cellSize = Math.min(optimalCellWidth, optimalCellHeight);
    const grid = [];

    for (let y = 0; y < height; y++) {
      const cells = [];
      for (let x = 0; x < width; x++) {
        const section = this.props.sections.find(s => s.x === x && s.y === y);

        const neighboringSections = this.props.sections.filter(
          isNeighboringSection(x, y)
        );
        const status = section ? section.status : "NOT_STARTED";
        let enabled = status === "NOT_STARTED"
          ? neighboringSections.length &&
              neighboringSections.every(s => s.status === "COMPLETED")
          : false;
        if(!this.props.sections.length) enabled = true;

        const cell = (
          <Cell
            key={`cell-${x}-${y}`}
            x={x}
            y={y}
            size={cellSize}
            status={status}
            enabled={enabled}
            onCellClick={this.props.onCellClick}
          />
        );
        cells.push(cell);
      }
      grid.push(<Row key={`row-${y}`}>{cells}</Row>);
    }
    return <div>{grid}</div>;
  }
}

export default DrawingBoard;
