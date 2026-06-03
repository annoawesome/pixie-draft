import fs from "fs";
import Story from "../type/storyType.js";

export default function getStoriesPreview() {
  const stories = JSON.parse(fs.readFileSync("stories.json", "utf-8"));
  return stories.map((story: Story) => ({
    id: story.id,
    title: story.title,
  }));
}
