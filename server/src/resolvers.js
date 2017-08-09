import { PubSub } from "graphql-subscriptions";
import { withFilter } from "graphql-subscriptions";
import { User, Drawing, Section } from "./connectors";

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    drawings: () => {
      return drawings;
    },
    drawing: (root, { id }) => {
      console.log("get drawing");
      return drawings.find(drawing => drawing.id === id);
    },
    neighbors: (root, { drawingId, sectionX, sectionY }) => {
      console.log("getSectionNeighbors", sectionX, sectionY);
      const drawing = drawings.find(drawing => drawing.id === drawingId);
      if (!drawing) throw new Error("Drawing does not exist");

      const leftNeighbor = drawing.sections.find(
        s => s.x === sectionX - 1 && s.y === sectionY
      );
      const rightNeighbor = drawing.sections.find(
        s => s.x === sectionX + 1 && s.y === sectionY
      );
      const topNeighbor = drawing.sections.find(
        s => s.x === sectionX && s.y === sectionY - 1
      );
      const bottomNeighbor = drawing.sections.find(
        s => s.x === sectionX && s.y === sectionY + 1
      );

      const results = [
        {
          neighbor: leftNeighbor,
          filter: pixel => {
            return (
              pixel.x ===
              (sectionX - 1) * drawing.sectionSizePx +
                (drawing.sectionSizePx - drawing.pixelSize)
            );
          },
          relativePosition: "LEFT"
        },
        {
          neighbor: rightNeighbor,
          filter: pixel => {
            return pixel.x === (sectionX - 1) * drawing.sectionSizePx;
          },
          relativePosition: "RIGHT"
        },
        {
          neighbor: topNeighbor,
          filter: pixel => {
            return (
              pixel.x ===
              (sectionY - 1) * drawing.sectionSizePx +
                (drawing.sectionSizePx - drawing.pixelSize)
            );
          },
          relativePosition: "TOP"
        },
        {
          neighbor: bottomNeighbor,
          filter: pixel => {
            return pixel.y === (sectionX + 1) * drawing.sectionSizePx;
          },
          relativePosition: "BOTTOM"
        }
      ];

      const neighbors = [];

      for (let result of results) {
        if (result.neighbor) {
          const { axis, axisCoord } = result;
          const neighbor = {
            x: result.neighbor.x,
            y: result.neighbor.y,
            relativePosition: result.relativePosition,
            pixels: result.neighbor.pixels.filter(result.filter)
          };
          neighbors.push(neighbor);
        }
      }

      return neighbors;
    }
  },
  Mutation: {
    addDrawing: async (root, { drawing: options }) => {
      console.log("addDrawing", options);
      const newDrawing = {
        width: options.width,
        height: options.height,
        name: options.name
      };
      const drawing = await new Drawing(newDrawing).save();
      return drawing;
    },
    addMessage: async (root, { message: options }) => {
      console.log("addMessage", options);
      const newMessage = {
        text: message.text,
        author: message.author, // grab author ID from token
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

      const newSection = {
        x: options.x,
        y: options.y,
        status: "IN_PROGRESS",
        creator: options.creator // grab creator ID from token
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
