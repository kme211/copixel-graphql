import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import Canvas from "./Canvas";

class CompleteDrawing extends Component {
  ready = false;
  pixels = {};

  setPixels = drawing => {
    if (this.ready) return;

    const pixelsArr = drawing.sections
      .map(s => s.pixels)
      .reduce((a, b) => a.concat(b));
    for (let px of pixelsArr) {
      this.pixels[`${px.x},${px.y}`] = { color: px.color };
    }
    this.ready = true;
  };

  componentWillReceiveProps(nextProps) {
    const { data: { loading, error, drawing } } = nextProps;
    if (loading || error || !drawing || drawing.imageUrl) return;
    this.setPixels(drawing);
  }

  render() {
    if (this.props.data.loading) {
      return <div style={this.props.style}>Loading...</div>;
    }

    if (this.props.data.error) {
      return (
        <div>
          Error: ${this.props.data.error.message}
        </div>
      );
    }

    const { embedWidth, style, data: { drawing } } = this.props;

    if (drawing.imageUrl) {
      return (
        <img
          src={drawing.imageUrl}
          style={Object.assign({}, style, { maxWidth: "100%" })}
          alt={drawing.name}
        />
      );
    }
    const width = drawing.width * drawing.sectionSizePx;
    const height = drawing.height * drawing.sectionSizePx;

    return (
      <Canvas
        embed
        style={
          style || {
            position: "absolute",
            top: 0,
            left: 0
          }
        }
        embedWidth={embedWidth || window.innerWidth}
        width={width}
        height={height}
        pixelSize={drawing.pixelSize}
        sectionSizePx={drawing.sectionSizePx}
        pixels={this.pixels}
      />
    );
  }
}

export const drawingDetailsQuery = gql`
  query DrawingDetailsQuery($drawingId: ID!) {
    drawing(id: $drawingId) {
      id
      width
      height
      pixelSize
      sectionSizePx
      imageUrl
      sections {
        id
        x
        y
        pixels {
          color
          x
          y
        }
      }
    }
  }
`;

const CompleteDrawingWithData = graphql(drawingDetailsQuery, {
  options: props => ({
    variables: { drawingId: props.drawingId }
  })
})(CompleteDrawing);

export default CompleteDrawingWithData;
