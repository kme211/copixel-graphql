import React from "react";
import Neighbor from "./Neighbor";
import PropTypes from "prop-types";

const Neighbors = ({
  onClick,
  centerX,
  centerY,
  top,
  right,
  bottom,
  left,
  pixelSize,
  sectionSizePx
}) => {
  return (
    <div>
      {top &&
        <Neighbor
          onClick={onClick}
          top="0"
          left={left ? `${pixelSize}px` : "0"}
          width={sectionSizePx}
          height={pixelSize}
          direction="row"
          data={top.pixels}
        />}
      {right &&
        <Neighbor
          onClick={onClick}
          top={top ? `${pixelSize}px` : "0"}
          right="0"
          width={pixelSize}
          height={sectionSizePx}
          direction="column"
          data={right.pixels}
        />}
      {bottom &&
        <Neighbor
          onClick={onClick}
          bottom="0"
          left={left ? `${pixelSize}px` : "0"}
          width={sectionSizePx}
          height={pixelSize}
          direction="row"
          data={bottom.pixels}
        />}
      {left &&
        <Neighbor
          onClick={onClick}
          top={top ? `${pixelSize}px` : "0"}
          left="0"
          width={pixelSize}
          height={sectionSizePx}
          direction="column"
          data={left.pixels}
        />}
    </div>
  );
};

Neighbors.propTypes = {
  onClick: PropTypes.func.isRequired,
  centerX: PropTypes.number.isRequired,
  centerY: PropTypes.number.isRequired,
  top: PropTypes.object,
  right: PropTypes.object,
  bottom: PropTypes.object,
  left: PropTypes.object,
  pixelSize: PropTypes.number.isRequired,
  sectionSizePx: PropTypes.number.isRequired
};

export default Neighbors;
