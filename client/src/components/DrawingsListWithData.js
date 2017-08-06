import React from "react";
import { Link } from "react-router-dom";
import { gql, graphql } from "react-apollo";
import styled from "styled-components";
import moment from "moment-timezone";

const DrawingLink = styled(Link)`
  display: block;
  text-decoration: none;
  margin-bottom: 0.5rem;
  & .name {
    color: #FC8A15;
    font-size: 1.25rem;
  }
  & .created {
    color: #909090;
  }
`;

const DrawingsList = ({ data: { loading, error, drawings } }) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return (<div><p>{error.message}</p><pre>{error.stack}</pre></div>);
  }

  const zone = moment.tz.guess();
  return (
    <div>
      {drawings.map(ch => (
        <div
          key={ch.id}
          className={"drawing " + (ch.id < 0 ? "optimistic" : "")}
        >
          <DrawingLink to={ch.id < 0 ? `/` : `drawing/${ch.id}`}>
            <div className="name mono">{ch.name}</div>
            <div className="created">{moment(ch.created).tz(zone).fromNow()}</div>
          </DrawingLink>
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
      created
    }
  }
`;

export default graphql(drawingsListQuery, {
  options: { pollInterval: 5000 }
})(DrawingsList);
