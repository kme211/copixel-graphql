require("dotenv").config();
import mongoose from "mongoose";

mongoose.Promise = global.Promise;
console.log("db", process.env.DATABASE);
if (!mongoose.connection.db) mongoose.connect(process.env.DATABASE);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", console.log.bind(console, "connected to mongodb"));

export default db;
