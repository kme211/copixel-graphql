import mongoose from "mongoose";
import "../models";
import puppeteer from "puppeteer";
import cloudinary from "cloudinary";
import fs from "fs";
import { promisify } from "util";
mongoose.Promise = global.Promise;
const Drawing = mongoose.model("Drawing");
const Section = mongoose.model("Section");
const TEMP_IMAGES_DIR = "images";

const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const uploadDrawing = path => {
  return new Promise((resolve, reject) => {
    try {
      cloudinary.uploader.upload(path, result => {
        resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });
};
const removeTempImage = promisify(fs.unlink);

async function takeScreenshot(drawing) {
  console.log("takeScreenshot");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const width = drawing.width * drawing.sectionSizePx;
  const height = drawing.height * drawing.sectionSizePx;
  const maxWidth = 1200;
  const scale = maxWidth / width;
  page.setViewport({
    width: width * scale,
    height: height * scale
  });
  await page.goto(`http://localhost:7777/canvas/${drawing._id}`);
  const watchDog = page.waitForFunction("window.canvasReady");
  await watchDog;
  const tempImagePath = `${TEMP_IMAGES_DIR}/${drawing._id}.png`;
  await page.screenshot({
    path: tempImagePath
  });
  return tempImagePath;
}

async function removePixels(sectionId) {
  console.log("removing pixels from section with id", sectionId);
  const section = await Section.findById(sectionId);
  console.log("section", section);
  section.pixels = undefined;
  return section.save();
}

export default async function checkStatus(drawingId, callback) {
  console.log("checkStatus job starting...");
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
      const tempImagePath = await takeScreenshot(drawing);
      console.log("tempImagePath", tempImagePath);
      const { secure_url } = await uploadDrawing(tempImagePath);
      console.log("secure_url", secure_url);
      const promises = drawing.sections.map(section =>
        removePixels(section._id)
      );
      await Promise.all(promises);
      console.log("pixels removed from all sections");
      drawing.imageUrl = secure_url;
      await drawing.save();
      console.log("drawing saved");
      await removeTempImage(tempImagePath);
      callback(null, { drawingId, status: drawing.status });
    } else {
      callback(null, { drawingId, status: drawing.status });
    }
  } catch (err) {
    console.log("checkStatus job:", err);
    callback(err);
  }
}
