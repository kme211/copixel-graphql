import React, { Component } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import DrawingsListWithData from "./DrawingsListWithData";
import AddDrawing from "./AddDrawing";
import NotFound from "./NotFound";
import DrawingDetails from "./DrawingDetails";
import Inner from "./Inner";
import Header from "./Header";
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  toIdValue
} from "react-apollo";

import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from "subscriptions-transport-ws";

const networkInterface = createNetworkInterface({
  uri: "http://localhost:4000/graphql"
});
networkInterface.use([
  {
    applyMiddleware(req, next) {
      setTimeout(next, 500);
    }
  }
]);

const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
  reconnect: true
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

function dataIdFromObject(result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  customResolvers: {
    Query: {
      drawing: (_, args) => {
        return toIdValue(
          dataIdFromObject({ __typename: "Drawing", id: args["id"] })
        );
      }
    }
  },
  dataIdFromObject
});

const Wrapper = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 16px;
  *,
  & {
    box-sizing: border-box;
  }
`;

const Content = styled.div`
  padding: 1rem 0;
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Wrapper>
            <Header/>
            <Inner>
              <Content>
                <Switch>
                  <Route exact path="/" component={DrawingsListWithData} />
                  <Route path="/add" component={AddDrawing} />
                  <Route path="/drawing/:drawingId" component={DrawingDetails} />
                  <Route component={NotFound} />
                </Switch>
              </Content>
            </Inner>
          </Wrapper>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
