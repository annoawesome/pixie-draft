import express from "express";

import storiesRouter from "./router/stories.js";
import initializeDatabase from "./init/initializeDatabase.js";

const port = 8080;

const app = express();

initializeDatabase();

app.use("/api/v0/stories", storiesRouter);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
