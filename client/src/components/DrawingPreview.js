import React from "react";
import { gql, graphql } from "react-apollo";

const DrawingPreview = ({ data: { loading, error, channel } }) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <div>
        {channel.name}
      </div>
      <div>Loading Messages</div>
    </div>
  );
};

export const drawingQuery = gql`
  query DrawingQuery($drawingId : ID!) {
    drawing(id: $drawingId) {
      id
      name
    }
  }
`;

export default graphql(drawingQuery, {
  options: props => ({
    variables: { drawingId: props.drawingId }
  })
})(DrawingPreview);
