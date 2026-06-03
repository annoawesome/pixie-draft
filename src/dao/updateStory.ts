import fs from "fs";
import Story from "../type/storyType.js";

export default function updateStory(
  id: string,
  title: string,
  content: string,
) {
  const stories = JSON.parse(fs.readFileSync("stories.json", "utf-8"));
  const index = stories.findIndex((s: Story) => s.id === id);

  if (index !== -1) {
    stories[index] = { id, title, content };
    fs.writeFileSync("stories.json", JSON.stringify(stories, null, 2));
  }
}
