import fs from "fs";
import Story from "../type/storyType.js";

export default function getStoryFromId(id: string) {
  const stories = JSON.parse(fs.readFileSync("stories.json", "utf-8"));
  return stories.find((story: Story) => story.id === id);
}
