import { PubSub } from "graphql-subscriptions";
import { withFilter } from "graphql-subscriptions";

const drawings = [
  {
    id: "1",
    name: "Once upon a time",
    width: 2,
    height: 2,
    pixelSize: 10,
    sectionSizePx: 300,
    public: true,
    created: "Sat Aug 05 2017 14:09:33 GMT-0500 (CDT)",
    sections: [
      {
        x: 0,
        y: 0,
        id: "1",
        creator: "Colby",
        status: "COMPLETED",
        pixels: [
          {
            x: 0,
            y: 0,
            color: "red"
          },
          {
            x: 0,
            y: 1,
            color: "blue"
          },
          {
            x: 1,
            y: 0,
            color: "green"
          },
          {
            x: 1,
            y: 1,
            color: "white"
          }
        ]
      }
    ],
    messages: [
      {
        id: "1",
        text:
          "Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
        author: "Zollie"
      },
      {
        id: "2",
        text:
          "Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius.",
        author: "Uriah"
      }
    ]
  },
  {
    id: "2",
    name: "Some random name",
    width: 2,
    height: 2,
    pixelSize: 1,
    sectionSizePx: 2,
    public: true,
    created: "Fri Aug 04 2017 14:09:33 GMT-0500 (CDT)",
    sections: [],
    messages: [
      {
        id: "3",
        text:
          "Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo.",
        author: "Marnie"
      },
      {
        id: "4",
        text: "hProin at turpis a pede posuere nonummy.",
        author: "Claude"
      }
    ]
  }
];

let nextId = 3;
let nextMessageId = 5;
let nextSectionId = 2;
let nextParticipantId = 5;

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
    addDrawing: (root, { drawing }) => {
      console.log("addDrawing", drawing);
      const newDrawing = {
        id: String(nextId++),
        messages: [],
        sections: [],
        width: drawing.width,
        height: drawing.height,
        pixelSize: 10,
        sectionSizePx: 300,
        name: drawing.name,
        created: String(new Date())
      };
      drawings.unshift(newDrawing);
      return newDrawing;
    },
    addMessage: (root, { message }) => {
      const drawing = drawings.find(
        drawing => drawing.id === message.drawingId
      );
      if (!drawing) throw new Error("Drawing does not exist");

      const newMessage = {
        id: String(nextMessageId++),
        text: message.text,
        author: message.author
      };

      drawing.messages.push(newMessage);

      pubsub.publish("messageAdded", {
        messageAdded: newMessage,
        drawingId: message.drawingId
      });

      return newMessage;
    },
    addSection: (root, { section }) => {
      console.log("addSection", section);
      const drawing = drawings.find(
        drawing => drawing.id === section.drawingId
      );
      if (!drawing) throw new Error("Drawing does not exist");

      // TODO: Check if section already exists
      // Throw error if it does

      const newSection = {
        id: String(nextSectionId++),
        x: section.x,
        y: section.y,
        status: "IN_PROGRESS",
        creator: section.creator
      };

      drawing.sections.push(newSection);

      pubsub.publish("sectionUpdated", {
        sectionUpdated: newSection,
        drawingId: section.drawingId
      });

      return newSection;
    },
    addPixelsToSection: (root, { drawingId, sectionId, pixels }) => {
      console.log("addPixelsToSection sectionId", sectionId);
      const drawing = drawings.find(drawing => drawing.id === drawingId);
      if (!drawing) throw new Error("Drawing does not exist");
      const section = drawing.sections.find(s => s.id === sectionId);
      if (!section) throw new Error("Section does not exist");
      console.log("section", section);
      // update section
      section.pixels = pixels;
      section.status = "COMPLETED";

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
