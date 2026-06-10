import fs from "fs";
import { getDatabaseFile } from "../init/initializeDatabase.js";

export default function createStory(title: string, content: string) {
  const storiesPath = getDatabaseFile("stories.json");

  const id = crypto.randomUUID();
  const stories = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));
  const story = { id, title, content, history: [content], historyIndex: 0 };
  stories.push(story);
  fs.writeFileSync(storiesPath, JSON.stringify(stories, null, 2));

  return story;
}
