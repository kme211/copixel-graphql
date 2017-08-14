import { gql, graphql } from "react-apollo";
import DrawingsList from "./DrawingsList";

export const drawingsListQuery = gql`
  query DrawingsListQuery {
    drawings(status: IN_PROGRESS, public: true) {
      id
      name
      status
      sectionsNotStarted
      created
    }
  }
`;

export default graphql(drawingsListQuery, {
  options: { pollInterval: 5000 }
})(DrawingsList);
