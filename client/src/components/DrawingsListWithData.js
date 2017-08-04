import React from "react";
import { Link } from "react-router-dom";
import { gql, graphql } from "react-apollo";

const DrawingsList = ({ data: { loading, error, drawings } }) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      {drawings.map(ch => (
        <div
          key={ch.id}
          className={"drawing " + (ch.id < 0 ? "optimistic" : "")}
        >
          <Link to={ch.id < 0 ? `/` : `drawing/${ch.id}`}>
            {ch.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export const drawingsListQuery = gql`
  query DrawingsListQuery {
    drawings {
      id
      name
    }
  }
`;

export default graphql(drawingsListQuery, {
  options: { pollInterval: 5000 }
})(DrawingsList);
