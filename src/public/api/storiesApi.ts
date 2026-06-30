import Story, { HistoryNode } from "../type/storyType";

export async function getStories(apiToken: string) {
  const response = await fetch("/api/v0/stories", {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  return response;
}

export async function createStory(
  apiToken: string,
  title: string,
  content: string,
  history?: HistoryNode[],
  historyIndex?: number,
) {
  const response = await fetch("/api/v0/stories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, history, historyIndex }),
  });

  return response;
}

export async function saveStory(apiToken: string, story: Story) {
  const response = await fetch(`/api/v0/stories/${story.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(story),
  });

  return response;
}

export async function loadStory(apiToken: string, id: string) {
  const response = await fetch(`/api/v0/stories/${id}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  return response;
}

export async function deleteStory(apiToken: string, id: string) {
  const response = await fetch(`/api/v0/stories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  return response;
}
