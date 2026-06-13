import fs from "fs";

import { getDatabaseFile } from "../../init/initializeDatabase.js";

export default function fetchUserSettings() {
  const settingsPath = getDatabaseFile("settings.json");
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

  return settings;
}
