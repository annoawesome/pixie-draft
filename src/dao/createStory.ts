import fs from "fs";

export default function createStory(title: string, content: string) {
  const id = crypto.randomUUID();
  const stories = JSON.parse(fs.readFileSync("stories.json", "utf-8"));
  stories.push({ id, title, content });
  fs.writeFileSync("stories.json", JSON.stringify(stories, null, 2));

  return { id, title, content };
}
