import fs from "fs";

import { getDatabaseFile } from "../../init/initializeDatabase.js";

export default function patchUserSettings(
  settingName: string,
  setting: unknown,
) {
  const settingsPath = getDatabaseFile("settings.json");
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

  if (settings[settingName]) {
    fs.writeFileSync(
      settingsPath,
      JSON.stringify({
        ...settings,
        [settingName]: setting,
      }),
      "utf-8",
    );
  } else {
    throw new Error(`Could not write to nonexistent setting ${settingName}`);
  }
}
