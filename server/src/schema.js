import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";

import { resolvers } from "./resolvers";

const typeDefs = `
type User {
  _id: ID!
  auth0UserId: ID!
  email: String!
  username: String!
}

type Drawing {
  id: ID!
  name: String
  width: Int!
  height: Int!
  public: Boolean!
  imageUrl: String
  pixelSize: Int!
  sectionSizePx: Int!
  created: String
  sections: [Section]
  numTotalSections: Int
  sectionsNotStarted: Int
  status: DRAWING_STATUS
  messages: [Message]!
}

input DrawingInput {
  name: String!
  width: Int!
  height: Int!
  public: Boolean!
  created: String!
}

input MessageInput{
  drawing: ID!
  text: String!
  created: String!
}

enum DRAWING_STATUS {
  COMPLETED
  IN_PROGRESS
}

enum SECTION_STATUS {
  IN_PROGRESS
  COMPLETED
}

type Section {
  x: Int!
  y: Int!
  id: ID!
  creator: User
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
  drawing: ID!
  x: Int!
  y: Int!
  pixels: [PixelInput]
  created: String!
}

type Pixel {
  x: Int!
  y: Int!
  color: String!
}

type Message {
  id: ID!
  author: User!
  text: String
  created: String
}

type Neighbor {
  x: Int!
  y: Int!
  relativePosition: [String]!
  pixels: [Pixel]!
}

# This type specifies the entry points into our API
type Query {
  user: User
  drawings(status: DRAWING_STATUS, public: Boolean, belongsToUser: Boolean, offset: Int, limit: Int): [Drawing]
  drawing(id: ID!): Drawing
  neighbors(drawingId: ID!, sectionX: Int!, sectionY: Int!): [Neighbor]
}

# The mutation root type, used to define all mutations
type Mutation {
  createUser(username: String!, email: String!): User
  addDrawing(drawing: DrawingInput!): Drawing
  addMessage(message: MessageInput!): Message
  addSection(section: SectionInput!): Section
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
