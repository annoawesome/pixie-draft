import fs from "fs";
import { getDatabaseFile } from "../../init/initializeDatabase.js";
import Story from "../../type/storyType.js";

export default function createStory(
  title: string,
  content: string,
  history?: unknown[],
  historyIndex?: number,
) {
  const storiesPath = getDatabaseFile("stories.json");

  const id = crypto.randomUUID();
  const stories = JSON.parse(fs.readFileSync(storiesPath, "utf-8"));
  const story: Story = {
    id,
    version: "0.0.0",
    title,
    desc: "",
    tags: [],
    content,

    attributes: {},
    encyclopedia: {},

    time: {
      created: Date.now(),
      accessed: Date.now(),
      modified: -1,
    },

    history: history || [
      {
        content: content,
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
