import fs from "fs";
import Story from "../../type/storyType.js";
import { getDatabaseFile } from "../../init/initializeDatabase.js";

export default function deleteStory(id: string) {
  const storiesPath = getDatabaseFile("stories.json");

  const stories = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));
  const updatedStories = stories.filter((story: Story) => story.id !== id);
  fs.writeFileSync(storiesPath, JSON.stringify(updatedStories));
}
