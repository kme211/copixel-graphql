import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
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
      if (!req.options.headers) {
        req.options.headers = {};
      }

      if (localStorage.getItem("auth0IdToken")) {
        req.options.headers.authorization = `Bearer ${localStorage.getItem("auth0IdToken")}`;
      }
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


ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));
registerServiceWorker();
