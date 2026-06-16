import fs from "fs";
import Story from "../../type/storyType.js";
import { getDatabaseFile } from "../../init/initializeDatabase.js";

export default function getStoryFromId(id: string) {
  const storiesPath = getDatabaseFile("stories.json");

  const stories = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));

  const index = stories.findIndex((story: Story) => story.id === id);

  if (index > -1) {
    const story = stories[index];
    story.time.accessed = Date.now();

    fs.writeFile(storiesPath, JSON.stringify(stories), () => {});

    return story;
  }

  return;
}
