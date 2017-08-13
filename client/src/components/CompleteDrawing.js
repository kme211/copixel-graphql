import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import Canvas from "./Canvas";

class CompleteDrawing extends Component {
  constructor(props) {
    super(props);

    this.ready = false;
    this.pixels = {};
  }

  setPixels = drawing => {
    if (this.ready) return;

    const pixelsArr = drawing.sections
      .map(s => s.pixels)
      .reduce((a, b) => a.concat(b));
    for (let px of pixelsArr) {
      this.pixels[`${px.x},${px.y}`] = px.color;
    }
    this.ready = true;
  };

  componentWillReceiveProps(nextProps) {
    const { data: { loading, error, drawing } } = nextProps;
    if (loading || error || !drawing) return;
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

    const {
      embedWidth,
      width,
      height,
      pixelSize,
      sectionSizePx,
      style
    } = this.props;

    return (
      <Canvas
        embed
        style={style}
        embedWidth={embedWidth}
        width={width}
        height={height}
        pixelSize={pixelSize}
        sectionSizePx={sectionSizePx}
        pixels={this.pixels}
      />
    );
  }
}

export const drawingDetailsQuery = gql`
  query DrawingDetailsQuery($drawingId: ID!) {
    drawing(id: $drawingId) {
      id
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
