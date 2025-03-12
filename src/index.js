import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.db.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 8000;

const Todos = ["Extrace Use full function in admin controlle to Utils", ""];

connectDB()
  .then(() => {
    app.listen(port, process.env.PORT_ORIGIN, () => {
      console.log(`⚙️ Server now running on http://localhost:${port}`);
      console.log(Todos);
    });
  })
  .catch((err) => {
    console.log("Error in DB connection: ", err);
  });
