import fs from "fs";

import { getDatabaseFile } from "../../init/initializeDatabase.js";

export default function updateUserSettings(settings: unknown) {
  const settingsPath = getDatabaseFile("settings.json");
  fs.writeFileSync(settingsPath, JSON.stringify(settings), "utf-8");
}
