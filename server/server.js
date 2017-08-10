require("dotenv").config();
import express from "express";
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import "./src/models";
import { schema } from "./src/schema";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const mongoUrl = process.env.DATABASE;
const User = mongoose.model("User");

const connectWithRetry = function() {
  return mongoose.connect(mongoUrl, function(err) {
    if (err) {
      console.error(
        "Failed to connect to mongo on startup - retrying in 5 sec",
        err
      );
      setTimeout(connectWithRetry, 5000);
    }
  });
};
connectWithRetry();

const PORT = 4000;
const server = express();

server.use("*", cors({ origin: "*" }));

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: "http://localhost:3000/api", // had to set this up in the APIs section of Auth0
  issuer: `https://${process.env.AUTH_DOMAIN}/`,
  algorithms: ["RS256"]
});

const getMongoUser = async (req, res, next) => {
  const id = req.user.sub.split("|")[1];
  const user = await User.findOne({
    id
  });
  req.user = user;
  next();
};

server.use(jwtCheck, getMongoUser);

server.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(req => {
    return {
      context: { user: req.user },
      schema
    };
  })
);

server.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
  })
);

// We wrap the express server so that we can attach the WebSocket for subscriptions
const ws = createServer(server);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: ws,
      path: "/subscriptions"
    }
  );
});
