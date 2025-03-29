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
import morgan from "morgan";
import userRoutes from "./routes/user.route.js";

const PORT = process.env.PORT || 4000;
const app = express();
const db = new Database(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

db.connect().catch((error) =>
  console.error("Error connecting to database: ", error)
);

app.use("/users", userRoutes);

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
