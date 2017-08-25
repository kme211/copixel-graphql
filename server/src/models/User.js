import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  auth0UserId: {
    type: String,
    required: "Please supply an auth0UserId!"
  },
  email: {
    type: String,
    unique: true,
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

export default mongoose.model("User", userSchema);
