import fs from "fs";
import path from "path";

let databasePath = "./";

function initializeJson(fileName: string, defaultValue?: unknown) {
  const jsonFilePath = getDatabaseFile(fileName + ".json");

  if (!fs.existsSync(jsonFilePath)) {
    fs.writeFileSync(
      jsonFilePath,
      JSON.stringify(defaultValue) || "[]",
      "utf-8",
    );
    console.log(`Initialized ${fileName}.json`);

    return true;
  }

  return false;
}

export default function initializeDatabase(databaseDirectory: string) {
  databasePath = databaseDirectory;

  initializeJson("stories");
  initializeJson("settings", {
    endpoints: [],
  });
}

export function getDatabaseFile(fileName: string) {
  return path.join(databasePath, fileName);
}
