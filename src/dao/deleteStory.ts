import fs from "fs";
import Story from "../type/storyType.js";

export default function deleteStory(id: string) {
  const stories = JSON.parse(fs.readFileSync("stories.json", "utf-8"));
  const updatedStories = stories.filter((story: Story) => story.id !== id);
  fs.writeFileSync("stories.json", JSON.stringify(updatedStories));
}
