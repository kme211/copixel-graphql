require("dotenv").config();
import monq from "monq";
const client = monq(process.env.DATABASE);
const worker = client.worker(["drawings"]);
import db from "./db";
import jobs from "./src/jobs";
db.once("open", console.log.bind(console, "worker connected to mongoose"));

console.log("worker jobs", jobs);
worker.register(jobs);

worker.on("dequeued", function(data) {
  console.log("job dequeued");
});
worker.on("failed", function(data) {
  console.log("job failed");
});
worker.on("complete", function(data) {
  console.log("job complete");
});
worker.on("error", function(err) {
  console.log("job error", err);
});

worker.start();
