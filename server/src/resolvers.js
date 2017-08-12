import { PubSub } from "graphql-subscriptions";
import { withFilter } from "graphql-subscriptions";
import { User, Drawing, Section, Message } from "./models";
import queue from "./jobs/client";

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    user: async (root, args, { user }) => {
      console.log("getUser", root, user);
      return user && user.username ? user : null;
    },
    drawings: async (root, args) => {
      console.log("args", args);
      const drawings = await Drawing.find(args).sort({ created: -1 });
      return drawings;
    },
    drawing: async (root, { id }) => {
      console.log("get drawing", id);

      const drawing = await Drawing.findById(id);
      if (!drawing) throw new Error("drawing not found");
      return drawing;
    },
    neighbors: async (root, { drawingId, sectionX, sectionY }) => {
      console.log("getSectionNeighbors", sectionX, sectionY);

      const drawing = await Drawing.findById(drawingId);
      if (!drawing) throw new Error("drawing not found");
      const neighbors = drawing.getNeighborsOfSection(sectionX, sectionY);
      return neighbors;
    }
  },
  Mutation: {
    createUser: async (root, { username, email }, context) => {
      console.log("createUser", username, email);
      console.log("context", context);

      const newUser = {
        username,
        email,
        auth0UserId: context.user.auth0UserId
      };

      const user = await new User(newUser).save();
      return user;
    },
    addDrawing: async (root, { drawing: options }, { user }) => {
      console.log("addDrawing", options);

      const drawing = await new Drawing(
        Object.assign({}, options, { creator: user._id })
      ).save();
      return drawing;
    },
    addMessage: async (root, { message: options }, { user }) => {
      console.log("addMessage", options);

      const message = await new Message(
        Object.assign({}, options, { author: user._id })
      ).saveAndPopulate();

      pubsub.publish("messageAdded", {
        messageAdded: message,
        drawingId: message.drawing.toString()
      });

      return message;
    },
    addSection: async (root, { section: options }, { user }) => {
      console.log("addSection", options);

      // TODO: Check if section already exists
      // Throw error if it does
      const section = await new Section(
        Object.assign({}, options, {
          status: "IN_PROGRESS",
          creator: user._id
        })
      ).saveAndPopulate();

      console.log("section", section);

      pubsub.publish("sectionUpdated", {
        sectionUpdated: section,
        drawingId: section.drawing.toString()
      });

      return section;
    },
    addPixelsToSection: async (root, { sectionId, pixels }, { user }) => {
      console.log("addPixelsToSection sectionId", sectionId);
      const section = await Section.findOneAndUpdate(
        { _id: sectionId },
        { pixels, status: "COMPLETED" },
        {
          new: true,
          runValidators: true
        }
      )
        .populate("creator")
        .exec();

      if (!section) throw new Error("Section not found");
      console.log("section", section);
      const drawingId = section.drawing.toString();

      pubsub.publish("sectionUpdated", {
        sectionUpdated: section,
        drawingId
      });

      console.log("section complete!", sectionId);

      queue.enqueue("checkStatus", drawingId, () => {
        console.log("job done?");
      });

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
