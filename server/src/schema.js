import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Drawing {
  id: ID!
  name: String
  width: Int!
  height: Int!
  public: Boolean!
  pixelSize: Int!
  sectionSizePx: Int!
  sections: [Section]
  messages: [Message]!
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
  addDrawing(name: String!, width: Int!, height: Int!, public: Boolean!, pixelSize: Int = 1): Drawing
  addMessage(message: MessageInput!): Message
  addSection(section: SectionInput!): Section
  addPixelsToSection(drawingId: ID!, sectionId: ID!, pixels: [PixelInput!]!): Section
}

# The subscription root type, specifying what we can subscribe to
type Subscription {
  messageAdded(drawingId: ID!): Message
  sectionUpdated(drawingId: ID!): Section
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
