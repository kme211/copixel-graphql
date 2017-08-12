require("dotenv").config();
import monq from "monq";

const client = monq(process.env.DATABASE);
const queue = client.queue("drawings");

export default queue;
