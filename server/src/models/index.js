import mongoose from "mongoose";
const Schema = mongoose.Schema;

// User

const userSchema = new Schema({
  id: {
    type: String,
    required: "Please supply an id!"
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true
  }
});

const User = mongoose.model("User", userSchema);

// Drawing

const drawingSchema = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: "User"
  },
  created: {
    type: Date,
    default: Date.now
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
  height: {
    type: Number,
    min: 1,
    max: 4,
    required: "You must supply a drawing height!"
  },
  public: {
    type: Boolean,
    required: "You must supply a boolean value for public!"
  }
});

drawingSchema.virtual("sections", {
  ref: "Section",
  localField: "_id",
  foreignField: "drawing"
});

drawingSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "drawing"
});

function autopopulate(next) {
  this.populate("sections");
  next();
}

drawingSchema.pre("find", autopopulate);
drawingSchema.pre("findOne", autopopulate);

drawingSchema.methods.getNeighborsOfSection = function(sectionX, sectionY) {
  console.log("getNeighborsOfSection", sectionX, sectionY);

  const leftNeighbor = this.sections.find(
    s => s.x === sectionX - 1 && s.y === sectionY
  );
  const rightNeighbor = this.sections.find(
    s => s.x === sectionX + 1 && s.y === sectionY
  );
  const topNeighbor = this.sections.find(
    s => s.x === sectionX && s.y === sectionY - 1
  );
  const bottomNeighbor = this.sections.find(
    s => s.x === sectionX && s.y === sectionY + 1
  );

  const results = [
    {
      neighbor: leftNeighbor,
      filter: pixel => {
        return (
          pixel.x ===
          (sectionX - 1) * this.sectionSizePx +
            (this.sectionSizePx - this.pixelSize)
        );
      },
      relativePosition: "LEFT"
    },
    {
      neighbor: rightNeighbor,
      filter: pixel => {
        return pixel.x === (sectionX - 1) * this.sectionSizePx;
      },
      relativePosition: "RIGHT"
    },
    {
      neighbor: topNeighbor,
      filter: pixel => {
        return (
          pixel.x ===
          (sectionY - 1) * this.sectionSizePx +
            (this.sectionSizePx - this.pixelSize)
        );
      },
      relativePosition: "TOP"
    },
    {
      neighbor: bottomNeighbor,
      filter: pixel => {
        return pixel.y === (sectionX + 1) * this.sectionSizePx;
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
};

const Drawing = mongoose.model("Drawing", drawingSchema);

// Section

const sectionSchema = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: "User"
  },
  created: {
    type: Date,
    default: Date.now
  },
  drawing: {
    type: Schema.ObjectId,
    ref: "Drawing",
    required: "You must supply a drawing ID for a section!"
  },
  status: {
    type: String,
    default: "NOT_STARTED"
  },
  x: {
    type: Number,
    required: "You must supply an x coordinate for a section!"
  },
  y: {
    type: Number,
    required: "You must supply a y coordinate for a section!"
  },
  pixels: Schema.Types.Mixed
});

const Section = mongoose.model("Section", sectionSchema);

// Message

const messageSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: "User",
    required: "You must supply an author for a Message!"
  },
  drawing: {
    type: Schema.ObjectId,
    ref: "Drawing",
    required: "You must supply a drawing for a Message!"
  },
  created: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    trim: true,
    required: "You must supply text for a Message!"
  }
});

const Message = mongoose.model("Message", messageSchema);

export { User, Drawing, Section, Message };