import React from "react";
import { gql, graphql } from "react-apollo";
import DrawingsList from "./DrawingsList";
import Loader from "./Loader";

export const drawingsListQuery = gql`
  query DrawingsListQuery {
    drawings(belongsToUser: true) {
      id
      name
      status
      sectionsNotStarted
      created
    }
  }
`;

const UserDrawingsWithData = graphql(drawingsListQuery, {
  options: { pollInterval: 5000 }
})(DrawingsList);

const UserDrawings = ({ isLoggedIn, user }) => {
  if (!isLoggedIn()) {
    return <div>You must log in to view your drawings.</div>;
  }

  if (!user) {
    return <Loader />;
  }

  return <UserDrawingsWithData isLoggedIn={isLoggedIn} user={user} />;
};

export default UserDrawings;
