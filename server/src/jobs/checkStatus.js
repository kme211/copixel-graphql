import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import "../models";
const Drawing = mongoose.model("Drawing");

export default async function checkStatus(drawingId, callback) {
  console.log("checkStatus");
  try {
    const drawing = await Drawing.findById(drawingId);
    if (!drawing) throw new Error("Drawing not found");
    const totalNumSections = drawing.width * drawing.height;
    const numCompletedSections = drawing.sections.filter(
      s => s.status === "COMPLETED"
    ).length;
    if (totalNumSections === numCompletedSections) {
      console.log("drawing status is COMPLETED");
      drawing.status = "COMPLETED";
      await drawing.save();
      console.log("saved");
      callback(null, { drawingId, status: drawing.status });
    } else {
      callback(null, { drawingId, status: drawing.status });
    }
  } catch (err) {
    console.log("checkStatus job:", err);
    callback(err);
  }
}
