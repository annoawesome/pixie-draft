import express from "express";
import "dotenv/config";

import storiesRouter from "./router/stories.js";
import authRouter from "./router/authRouter.js";
import initializeDatabase from "./init/initializeDatabase.js";

const port = process.env.PIXIE_PORT || 8080;
const dbDirectory = process.env.PIXIE_DB_DIRECTORY || "./";

const app = express();

initializeDatabase(dbDirectory);

app.use(express.json());
app.use("/api/v0/stories", storiesRouter);
app.use("/api/v0/auth", authRouter);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
