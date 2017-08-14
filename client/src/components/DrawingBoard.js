import React, { Component } from "react";
import PropTypes from "prop-types";
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

const Wrapper = styled.div`position: relative;`;

class DrawingBoard extends Component {
  render() {
    const { width, height, cellSize } = this.props;
    const grid = [];
    let i = 0;
    for (let y = 0; y < height; y++) {
      const cells = [];
      for (let x = 0; x < width; x++) {
        const section = this.props.sections.find(s => s.x === x && s.y === y);

        const neighboringSections = this.props.sections.filter(
          isNeighboringSection(x, y)
        );
        const status = section ? section.status : "NOT_STARTED";
        let enabled =
          status === "NOT_STARTED"
            ? neighboringSections.length &&
              neighboringSections.every(s => s.status === "COMPLETED")
            : false;

        if (
          status === "IN_PROGRESS" &&
          section.creator._id === this.props.user._id
        ) {
          console.log("BELONGS TO CURRENT USER");
          enabled = true;
        }
        if (!this.props.sections.length) enabled = true;
        const styles = this.props.styles[i++];
        const cell = (
          <Cell
            style={{
              opacity: styles.opacity,
              transform: `scale(${styles.scale})`
            }}
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
      grid.push(
        <Row key={`row-${y}`}>
          {cells}
        </Row>
      );
    }
    return (
      <Wrapper>
        {this.props.children && this.props.children}
        {grid}
      </Wrapper>
    );
  }
}

DrawingBoard.propTypes = {
  user: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  cellSize: PropTypes.number.isRequired
};

export default DrawingBoard;
