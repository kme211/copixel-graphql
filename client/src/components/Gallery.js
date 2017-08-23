import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Loader from "./Loader";

const Drawings = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-between;
align-items: flex-start;
`;

const DrawingLink = styled(Link)`
display: block;
margin: 10px 0;
text-decoration: none;
`;

const Image = styled.img`
  max-width: 100%;
  border: 2px solid #ccc;
`;

const getUrl = (url, width) => {
  return url.replace(/(upload\/)(\w+)/, (match, p1, p2) => {
    return `${p1}w_${width}/f_auto,q_auto/${p2}`;
  });
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
              <picture>
                <source
                  srcSet={getUrl(drawing.imageUrl, 400)}
                  media="(max-width: 400px)"
                />
                <source
                  srcSet={getUrl(drawing.imageUrl, 600)}
                  media="(min-width: 401px) and (max-width: 600px)"
                />
                <Image
                  srcSet={getUrl(drawing.imageUrl, 800)}
                  alt={drawing.name}
                />
              </picture>
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
