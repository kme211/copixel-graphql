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
          const url = drawing.imageUrl.replace(
            /(upload\/)(\w+)/,
            (match, p1, p2) => {
              return `${p1}w_800/f_auto,q_auto/${p2}`;
            }
          );
          console.log("url", url);
          return (
            <DrawingLink to={`/drawing/${drawing.id}`} key={drawing.id}>
              <img src={url} alt={drawing.name} />
            </DrawingLink>
          );
        })}
      </Drawings>
    );
  }
}

export const drawingsListQuery = gql`
  query DrawingsListQuery {
    drawings(status: COMPLETED, public: true, limit: 10, offset: 0) {
      id
      name
      imageUrl
    }
  }
`;

export default graphql(drawingsListQuery)(Gallery);
