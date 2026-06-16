import fs from "fs";
import { getDatabaseFile } from "../../init/initializeDatabase.js";

export default function createStory(
  title: string,
  content: string,
  history?: unknown[],
  historyIndex?: number,
) {
  const storiesPath = getDatabaseFile("stories.json");

  const id = crypto.randomUUID();
  const stories = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));
  const story = {
    id,
    title,
    content,

    time: {
      created: Date.now(),
      accessed: Date.now(),
      modified: -1,
    },

    history: history || [
      {
        content: "",
        treePrev: -1,
        attributes: {
          generatedByLlm: false,
        },
      },
    ],
    historyIndex: historyIndex || 0,
  };
  stories.push(story);
  fs.writeFileSync(storiesPath, JSON.stringify(stories));

  return story;
}
