import mongoose from "mongoose";
const Schema = mongoose.Schema;

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
    type: String,
    required: "You must supply a created string!"
  },
  text: {
    type: String,
    trim: true,
    required: "You must supply text for a Message!"
  }
});

messageSchema.methods.saveAndPopulate = function() {
  return this.save().then(() => this.populate("author").execPopulate());
};

const autopopulateMessageSchema = autopopulate("author");

messageSchema.pre("find", autopopulateMessageSchema);
messageSchema.pre("findOne", autopopulateMessageSchema);

export default mongoose.model("Message", messageSchema);
