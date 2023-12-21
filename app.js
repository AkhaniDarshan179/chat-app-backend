import bodyParser from "body-parser";
import connectDB from "./database/connectdb.js";
import express from "express";
import userController from "./controllers/userController.js";
import cors from "cors";

const app = express();
const PORT = 8000;
const DATABASE_URI = "mongodb://127.0.0.1:27017";

connectDB(DATABASE_URI);

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/register", userController.register);
app.post("/api/login", userController.login);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
