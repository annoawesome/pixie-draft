import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import storiesRouter from "./router/storiesRouter.js";
import authRouter from "./router/authRouter.js";
import settingsRouter from "./router/settingsRouter.js";
import initializeDatabase from "./init/initializeDatabase.js";
import { initializeSecret } from "./init/initializeSecrets.js";

const port = process.env.PIXIE_PORT || 8080;
const dbDirectory = process.env.PIXIE_DB_DIRECTORY || "./";

const app = express();

initializeDatabase(dbDirectory);
initializeSecret(process.env.PIXIE_SECRET);

app.use(express.json());
app.use(cookieParser(process.env.PIXIE_COOKIE_SECRET || crypto.randomUUID()));

app.use("/api/v0/stories", storiesRouter);
app.use("/api/v0/auth", authRouter);
app.use("/api/v0/settings", settingsRouter);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
