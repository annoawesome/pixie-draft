import fs from "fs";
import Story from "../../type/storyType.js";
import { getDatabaseFile } from "../../init/initializeDatabase.js";

function shortenDescription(desc: string) {
  if (desc.length > 128) {
    return desc.substring(0, 128);
  }

  return desc;
}

export default function getStoriesPreview() {
  const stories = JSON.parse(
    fs.readFileSync(getDatabaseFile("stories.json"), "utf-8"),
  );
  return stories.map((story: Story) => ({
    id: story.id,
    desc: shortenDescription(story.desc),
    title: story.title,
    time: story.time,
  }));
}
