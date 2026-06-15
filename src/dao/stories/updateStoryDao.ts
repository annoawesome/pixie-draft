import fs from "fs";
import Story from "../../type/storyType.js";
import { getDatabaseFile } from "../../init/initializeDatabase.js";

export default function updateStory(story: Story) {
  const storiesPath = getDatabaseFile("stories.json");

  const stories = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));
  const index = stories.findIndex((s: Story) => s.id === story.id);

  if (index !== -1) {
    stories[index] = story;
    fs.writeFileSync(storiesPath, JSON.stringify(stories));
  }
}
