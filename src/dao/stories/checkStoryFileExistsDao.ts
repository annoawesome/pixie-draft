import fs from "fs";
import { getDatabaseFile } from "../../init/initializeDatabase.js";

export default function checkStoryFileExists() {
  return fs.existsSync(getDatabaseFile("stories.json"));
}
