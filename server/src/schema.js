import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type User {
  id: ID!
  email: String
  username: String
}

type Drawing {
  id: ID!
  name: String
  width: Int!
  height: Int!
  public: Boolean!
  pixelSize: Int!
  sectionSizePx: Int!
  created: String
  sections: [Section]
  messages: [Message]!
}

input DrawingInput {
  name: String!
  width: Int!
  height: Int!
  public: Boolean!
}

input MessageInput{
  drawingId: ID!
  author: String!
  text: String!
}

enum SECTION_STATUS {
  IN_PROGRESS
  COMPLETED
}

type Section {
  x: Int!
  y: Int!
  id: ID!
  creator: String
  pixels: [Pixel]
  neighbors: [Neighbor]
  status: SECTION_STATUS!
}

input PixelInput {
  x: Int!
  y: Int!
  color: String!
}

input SectionInput {
  drawingId: ID!
  x: Int!
  y: Int!
  creator: String
  pixels: [PixelInput]
}

type Pixel {
  x: Int!
  y: Int!
  color: String!
}

type Message {
  id: ID!
  author: String!
  text: String
}

type Neighbor {
  x: Int!
  y: Int!
  relativePosition: String!
  pixels: [Pixel]!
}

# This type specifies the entry points into our API
type Query {
  drawings: [Drawing]
  drawing(id: ID!): Drawing
  neighbors(drawingId: ID!, sectionX: Int!, sectionY: Int!): [Neighbor]
}

# The mutation root type, used to define all mutations
type Mutation {
  addDrawing(drawing: DrawingInput!, token: String!): Drawing
  addMessage(message: MessageInput!, token: String!): Message
  addSection(section: SectionInput!, token: String!): Section
  addPixelsToSection(sectionId: ID!, pixels: [PixelInput!]!): Section
}

# The subscription root type, specifying what we can subscribe to
type Subscription {
  messageAdded(drawingId: ID!): Message
  sectionUpdated(drawingId: ID!): Section
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
