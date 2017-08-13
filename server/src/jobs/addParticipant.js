import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import "../models";
const Drawing = mongoose.model("Drawing");

export default async function addParticipant({ drawingId, userId }, callback) {
  console.log("addParticipant job started");
  try {
    const drawing = await Drawing.findById(drawingId);
    if (!drawing) throw new Error(`Drawing with id not found: ${drawingId}`);
    const index = drawing.participants.findIndex(
      p => p.toString() === userId.toString()
    );
    console.log("index", index);
    if (index < 0) {
      drawing.participants.push(userId);
      await drawing.save();
      callback(null, { drawingId, userId, status: "added" });
    } else {
      callback(null, { drawingId, userId, status: "already added" });
    }
  } catch (err) {
    console.log("addParticipant job:", err);
    callback(err);
  }
}
