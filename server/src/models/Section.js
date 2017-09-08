import mongoose from "mongoose";
import { autopopulate } from "./helpers";
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: "User"
  },
  created: {
    type: String,
    required: "You must supply a created string!"
  },
  drawing: {
    type: Schema.ObjectId,
    ref: "Drawing",
    required: "You must supply a drawing ID for a section!"
  },
  status: {
    type: String,
    enum: ["IN_PROGRESS", "COMPLETED"],
    default: "IN_PROGRESS"
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

sectionSchema.methods.saveAndPopulate = function() {
  return this.save().then(() => this.populate("creator").execPopulate());
};

sectionSchema.methods.execAndPopulate = function() {
  return this.exec().then(() => this.populate("creator").execPopulate());
};

const autopopulateSectionSchema = autopopulate("creator");

sectionSchema.pre("find", autopopulateSectionSchema);
sectionSchema.pre("findOne", autopopulateSectionSchema);

export default mongoose.model("Section", sectionSchema);
