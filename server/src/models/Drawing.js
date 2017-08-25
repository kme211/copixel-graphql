import mongoose from "mongoose";
const Schema = mongoose.Schema;

const drawingSchema = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: "User"
  },
  created: {
    type: String,
    required: "You must supply a created string!"
  },
  name: {
    type: String,
    required: "You must supply a drawing name!",
    trim: true
  },
  width: {
    type: Number,
    min: 1,
    max: 4,
    required: "You must supply a drawing width!"
  },
  sectionSizePx: {
    type: Number,
    default: 300
  },
  pixelSize: {
    type: Number,
    default: 10
  },
  status: {
    type: String,
    enum: ["IN_PROGRESS", "COMPLETED"],
    default: "IN_PROGRESS"
  },
  imageUrl: {
    type: String
  },
  height: {
    type: Number,
    min: 1,
    max: 4,
    required: "You must supply a drawing height!"
  },
  public: {
    type: Boolean,
    required: "You must supply a boolean value for public!"
  },
  participants: [
    {
      type: Schema.ObjectId,
      ref: "User"
    }
  ]
});

drawingSchema.virtual("sections", {
  ref: "Section",
  localField: "_id",
  foreignField: "drawing"
});

drawingSchema.virtual("numTotalSections").get(function() {
  return this.height * this.width;
});

drawingSchema.virtual("sectionsNotStarted").get(function() {
  const numTotalSections = this.height * this.width;
  return numTotalSections - this.sections.length;
});

drawingSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "drawing"
});

function autopopulate(next) {
  this.populate("sections messages");
  next();
}

function autopopulate(fieldStr) {
  return function(next) {
    this.populate(fieldStr);
    next();
  };
}

const autopopulateDrawingSchema = autopopulate("sections messages");

drawingSchema.pre("find", autopopulateDrawingSchema);
drawingSchema.pre("findOne", autopopulateDrawingSchema);

drawingSchema.methods.getNeighborsOfSection = function(sectionX, sectionY) {
  let neighbors = [
    {
      x: sectionX - 1,
      y: sectionY,
      relativePosition: "LEFT"
    },
    {
      x: sectionX + 1,
      y: sectionY,
      relativePosition: "RIGHT"
    },
    {
      x: sectionX,
      y: sectionY - 1,
      relativePosition: "TOP"
    },
    {
      x: sectionX,
      y: sectionY + 1,
      relativePosition: "BOTTOM"
    },
    {
      x: sectionX - 1,
      y: sectionY - 1,
      relativePosition: ["TOP", "LEFT"]
    },
    {
      x: sectionX + 1,
      y: sectionY - 1,
      relativePosition: ["TOP", "RIGHT"]
    },
    {
      x: sectionX - 1,
      y: sectionY + 1,
      relativePosition: ["BOTTOM", "LEFT"]
    },
    {
      x: sectionX + 1,
      y: sectionY + 1,
      relativePosition: ["BOTTOM", "RIGHT"]
    }
  ];

  // These filters are used to return only the pixels
  // that are on the edge of a neighboring section
  const filters = {
    LEFT: pixel => pixel.x === sectionX * this.sectionSizePx - this.pixelSize,
    RIGHT: pixel => pixel.x === (sectionX + 1) * this.sectionSizePx,
    TOP: pixel => pixel.y === sectionY * this.sectionSizePx - this.pixelSize,
    BOTTOM: pixel => pixel.y === (sectionY + 1) * this.sectionSizePx
  };

  for (let i = 0; i < 8; i++) {
    let neighbor = neighbors[i];
    const outOfBounds =
      neighbor.x < 0 ||
      neighbor.y < 0 ||
      neighbor.x >= this.width ||
      neighbor.y >= this.height;

    if (outOfBounds) {
      neighbors = [...neighbors.slice(0, i), null, ...neighbors.slice(i + 1)];
      continue;
    }

    const result = this.sections.find(
      s => s.x === neighbor.x && s.y === neighbor.y
    );

    if (typeof neighbor.relativePosition === "string") {
      const pos = neighbor.relativePosition;
      console.log("pos", pos);
      neighbors = [
        ...neighbors.slice(0, i),
        Object.assign({}, neighbor, {
          pixels: result ? result.pixels.filter(filters[pos]) : []
        }),
        ...neighbors.slice(i + 1)
      ];
    } else {
      const [pos1, pos2] = neighbor.relativePosition;
      console.log(pos1, pos2);
      neighbors = [
        ...neighbors.slice(0, i),
        Object.assign({}, neighbor, {
          pixels: result && result.pixels
            ? [result.pixels.find(p => filters[pos1](p) && filters[pos2](p))] // find that corner pixel!
            : []
        }),
        ...neighbors.slice(i + 1)
      ];
    }
  }

  return neighbors.filter(n => n);
  // return neighbors
  //   .filter(n => n) // filter out null values
  //   .reduce((a, b) => a.concat(b), []) // create single array
  //   .map(n => n.pixels.map(p => Object.assign({}, p, { locked: true }))); // add locked prop to each pixel
};

export default mongoose.model("Drawing", drawingSchema);
