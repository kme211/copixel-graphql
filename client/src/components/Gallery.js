import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Canvas from "./Canvas";
import Loader from "./Loader";
import { pixelsToObject } from "../utils/pixelUtils";

const Drawings = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-between;
align-items: flex-start;
`;

const DrawingLink = styled(Link)`
display: block;
border: 2px solid #ccc;
margin: 10px 0;
text-decoration: none;
`;

const getEmbedWidth = () => {
  const width = window.innerWidth;
  const baseFontSize = 16;
  const borderWidth = 2;
  return width > 800 ? 800 : width - (baseFontSize + borderWidth) * 2;
};

const getPixels = drawing => {
  const pixels = drawing.sections
    .map(d => d.pixels)
    .reduce((a, b) => a.concat(b), []);
  return pixelsToObject(pixels, pixel => `${pixel.x},${pixel.y}`);
};

class Gallery extends Component {
  render() {
    const { data: { loading, error, drawings } } = this.props;

    if (!drawings && loading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div>
          {error.message}
        </div>
      );
    }

    if (!drawings.length) {
      return (
        <div>
          <h2>
            Shucks, there aren't any completed drawings to check out right now.
          </h2>
        </div>
      );
    }

    return (
      <Drawings>
        {drawings.map(drawing => {
          return (
            <DrawingLink to={`/drawing/${drawing.id}`} key={drawing.id}>
              <Canvas
                embed
                embedWidth={getEmbedWidth()}
                sectionSizePx={drawing.sectionSizePx}
                pixelSize={drawing.pixelSize}
                width={drawing.width * drawing.sectionSizePx}
                height={drawing.height * drawing.sectionSizePx}
                pixels={getPixels(drawing)}
              />
            </DrawingLink>
          );
        })}
      </Drawings>
    );
  }
}

export const drawingsListQuery = gql`
  query DrawingsListQuery {
    drawings(status: COMPLETED, public: true, limit: 2, offset: 0) {
      id
      width
      height
      sectionSizePx
      pixelSize
      sections {
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

export default graphql(drawingsListQuery)(Gallery);
