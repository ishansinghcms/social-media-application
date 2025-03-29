/**
 * Project Name: Social Media Application
 * Description: A social networking platform with automated content moderation and context-based authentication system.
 *
 * Author: Ishan Singh
 */
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import Database from "./config/database.js";

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());

const db = new Database(process.env.MONGODB_URI);

db.connect().catch((error) =>
  console.error("Error connecting to database: ", error)
);

process.on("SIGINT", async () => {
  try {
    await db.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

app.listen(PORT, () => console.log(`Server up and running on PORT: ${PORT}`));
