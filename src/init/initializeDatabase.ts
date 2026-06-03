import fs from "fs";

export default function initializeDatabase() {
  const path = "stories.json";

  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, "[]", "utf-8");
    console.log("Initialized stories.json");

    return true;
  }

  return false;
}
