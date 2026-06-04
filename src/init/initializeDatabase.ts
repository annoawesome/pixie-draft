import fs from "fs";
import path from "path";

let databasePath = "./";

export default function initializeDatabase(databaseDirectory: string) {
  databasePath = databaseDirectory;

  const storiesFilePath = getDatabaseFile("stories.json");

  if (!fs.existsSync(storiesFilePath)) {
    fs.writeFileSync(storiesFilePath, "[]", "utf-8");
    console.log("Initialized stories.json");

    return true;
  }

  return false;
}

export function getDatabaseFile(fileName: string) {
  return path.join(databasePath, fileName);
}
