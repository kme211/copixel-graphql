import React from "react";
import Neighbor from "./Neighbor";

const Neighbors = ({ onClick, centerX, centerY, top, right, bottom, left, pixelSize, sectionSizePx }) => {
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
        data={top}
      />}
    {right &&
      <Neighbor
        onClick={onClick}
        top={top ? `${pixelSize}px` : "0"}
        right="0"
        width={pixelSize}
        height={sectionSizePx}
        direction="column"
        data={right}
      />}
    {bottom &&
      <Neighbor
        onClick={onClick}
        bottom="0"
        left={left ? `${pixelSize}px` : "0"}
        width={sectionSizePx}
        height={pixelSize}
        direction="row"
        data={bottom}
      />}
    {left &&
      <Neighbor
        onClick={onClick}
        top={top ? `${pixelSize}px` : "0"}
        left="0"
        width={pixelSize}
        height={sectionSizePx}
        direction="column"
        data={left}
      />}
  </div>
) 
};

export default Neighbors;
