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
    drawings: async (
      root,
      { status, public: isPublic, belongsToUser },
      { user }
    ) => {
      const queryOptions = {};
      if (status !== undefined) queryOptions.status = status;
      if (isPublic !== undefined) queryOptions.public = isPublic;
      if (belongsToUser !== undefined)
        queryOptions.participants = {
          $in: [user._id]
        };
      const drawings = await Drawing.find(queryOptions).sort({ created: -1 });
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

      // Check if section already exists
      // Throw error if it does
      const sectionInDb = await Section.findOne({
        drawing: options.drawing,
        x: options.x,
        y: options.y
      });
      if (sectionInDb) {
        throw new Error("Section already exists.");
      }

      const section = await new Section(
        Object.assign({}, options, {
          status: "IN_PROGRESS",
          creator: user._id
        })
      ).saveAndPopulate();

      console.log("section", section);
      const drawingId = section.drawing.toString();

      pubsub.publish("sectionUpdated", {
        sectionUpdated: section,
        drawingId
      });

      queue.enqueue("addParticipant", { drawingId, userId: user._id }, () => {
        console.log("addParticipant job done?");
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

      console.log("add drawing to queue");
      queue.enqueue("checkStatus", drawingId, () => {
        console.log("checkStatus job done?");
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
