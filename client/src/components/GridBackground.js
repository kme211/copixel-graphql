import React, { Component } from "react";
import styled from "styled-components";
import addDashedLineToCtx from "../utils/addDashedLineToCtx";

const Wrapper = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
`;

class GridBackground extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props;
  }
  
  initializeCtx(canvas) {
    if (!canvas) return;

    addDashedLineToCtx();
    const { width, height } = this.props;
    const offset = 0.5; // w/o this the lines will look blurry
    const ctx = canvas.getContext("2d");
    const dashSize = Math.max(this.props.pixelSize / 10, 1);
    const dashGap = Math.max(this.props.pixelSize / 8, 1);
    const dashOptions = [dashSize, dashGap];
    ctx.globalAlpha = 1;
    ctx.beginPath();
    for (let x = this.props.pixelSize; x < width; x += this.props.pixelSize) {
      ctx.dashedLine(x - offset, 0, x - offset, height, dashOptions);
    }
    for (let y = this.props.pixelSize; y < height; y += this.props.pixelSize) {
      ctx.dashedLine(0, y - offset, width, y - offset, dashOptions);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#c8ccce";
    ctx.stroke();
    this.setState({ initialized: true });
  }

  render() {
    const { width, height } = this.props;
    return (
      <Wrapper>
        <canvas
          ref={canvas => {
            this.initializeCtx(canvas);
          }}
          width={width}
          height={height}
        />
      </Wrapper>
    );
  }
}

export default GridBackground;
