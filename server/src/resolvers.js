import { PubSub } from "graphql-subscriptions";
import { withFilter } from "graphql-subscriptions";
import { User, Drawing, Section } from "./connectors";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";

const verifyJwt = promisify(jwt.verify);

const pubsub = new PubSub();

const verifyToken = async token => {
  console.log("getUser");
  try {
    const decoded = await verifyJwt(
      token,
      jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`
      }),
      {
        audience: "http://localhost:7777/api", // had to set this up in the APIs section of Auth0
        issuer: `https://${process.env.AUTH_DOMAIN}/`,
        algorithms: ["RS256"]
      }
    );
    console.log("decoded", decoded);
    const id = decoded.sub.split("|")[1];
    const user = await User.findOne({ id });
    return { error: null, user };
  } catch (e) {
    return { error: e, user: null };
  }
};

export const resolvers = {
  Query: {
    user: async () => {
      console.log("getUser");
      const { error, user } = verifyToken(token);
      if (error) console.error(error);
      throw new Error(error);

      console.log("user", user);
      return user;
    },
    drawings: async () => {
      const drawings = await Drawing.find();
      return drawings;
    },
    drawing: async (root, { id }) => {
      console.log("get drawing", id);

      const drawing = await Drawing.findById(id);
      if(!drawing) throw new Error("drawing not found");
      return drawing;
    },
    neighbors: async (root, { drawingId, sectionX, sectionY }) => {
      console.log("getSectionNeighbors", sectionX, sectionY);
      
      const drawing = await Drawing.findById(drawingId);
      if(!drawing) throw new Error("drawing not found");
      const neighbors = drawing.getNeighborsOfSection(sectionX, sectionY);
      return neighbors;
    }
  },
  Mutation: {
    addDrawing: async (root, { drawing: options, token }) => {
      console.log("addDrawing", options);

      const { error, user } = verifyToken(token);
      if (error) console.error(error);
      throw new Error(error);

      const newDrawing = {
        creator: user.id,
        width: options.width,
        height: options.height,
        name: options.name
      };
      const drawing = await new Drawing(newDrawing).save();
      return drawing;
    },
    addMessage: async (root, { message: options, token }) => {
      console.log("addMessage", options);

      const { error, user } = verifyToken(token);
      if (error) console.error(error);
      throw new Error(error);

      const newMessage = {
        text: message.text,
        author: user.id, // grab author ID from token
        drawing: message.drawingId
      };

      drawing.messages.push(newMessage);
      const message = await new Message(newMessage).save();

      pubsub.publish("messageAdded", {
        messageAdded: message,
        drawingId: message.drawingId
      });

      return message;
    },
    addSection: async (root, { section: options }) => {
      console.log("addSection", options);

      const { error, user } = verifyToken(token);
      if (error) console.error(error);
      throw new Error(error);

      const newSection = {
        x: options.x,
        y: options.y,
        status: "IN_PROGRESS",
        creator: user.id // grab creator ID from token
      };

      // TODO: Check if section already exists
      // Throw error if it does
      const section = await new Section(newSection).save();

      pubsub.publish("sectionUpdated", {
        sectionUpdated: section,
        drawingId: section.drawingId
      });

      return section;
    },
    addPixelsToSection: async (root, { sectionId, pixels }) => {
      console.log("addPixelsToSection sectionId", sectionId);
      const section = await Section.findOneAndUpdate(
        { id: sectionId },
        { pixels, status: "COMPLETED" },
        {
          new: true,
          runValidators: true
        }
      ).exec();

      if (!section) throw new Error("Section not found");
      console.log("section", section);

      pubsub.publish("sectionUpdated", {
        sectionUpdated: section,
        drawingId: drawingId
      });

      console.log("section complete!", sectionId);

      return section;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("messageAdded"),
        (payload, variables) => {
          // The `messageAdded` drawing includes events for all drawings, so we filter to only
          // pass through events for the drawing specified in the query
          return payload.drawingId === variables.drawingId;
        }
      )
    },
    sectionUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("sectionUpdated"),
        (payload, variables) => {
          return payload.drawingId === variables.drawingId;
        }
      )
    }
  }
};
