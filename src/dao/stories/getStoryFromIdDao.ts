import fs from "fs";
import Story from "../../type/storyType.js";
import { getDatabaseFile } from "../../init/initializeDatabase.js";

export default function getStoryFromId(id: string) {
  const stories = JSON.parse(
    fs.readFileSync(getDatabaseFile("stories.json"), "utf-8"),
  );
  return stories.find((story: Story) => story.id === id);
}
