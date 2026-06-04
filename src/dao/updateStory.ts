import fs from "fs";
import Story from "../type/storyType.js";
import { getDatabaseFile } from "../init/initializeDatabase.js";

export default function updateStory(
  id: string,
  title: string,
  content: string,
) {
  const storiesPath = getDatabaseFile("stories.json");

  const stories = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));
  const index = stories.findIndex((s: Story) => s.id === id);

  if (index !== -1) {
    stories[index] = { id, title, content };
    fs.writeFileSync(storiesPath, JSON.stringify(stories, null, 2));
  }
}
