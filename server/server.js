require("dotenv").config();
import express from "express";
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import "./src/models";
import db from "./db";
import { schema } from "./src/schema";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const mongoUrl = process.env.DATABASE;
const User = mongoose.model("User");

const PORT = 4000;
const server = express();

server.use(compression());
server.use("*", cors({ origin: "*" }));

const jwtCheck = jwt({
  secret: process.env.AUTH_SECRET,
  credentialsRequired: false,
  issuer: `https://${process.env.AUTH_DOMAIN}/`,
  algorithms: ["HS256"]
});

const getMongoUser = async (req, res, next) => {
  if (req.user) {
    const auth0UserId = req.user.sub.split("|")[1];
    const user = await User.findOne({
      auth0UserId
    });
    req.user = Object.assign(user ? user.toObject() : {}, { auth0UserId });
  }
  next();
};

server.use("/graphql", jwtCheck, getMongoUser);

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
