import Story, { HistoryNode } from "../type/storyType";

export async function getStories(apiToken: string): Promise<Story[]> {
  const response = await fetch("/api/v0/stories", {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP status ${response.status}`);
  }

  const stories = await response.json();
  console.log("Fetched stories:", stories);

  return stories;
}

export async function createStory(
  apiToken: string,
  title: string,
  content: string,
  history?: HistoryNode[],
  historyIndex?: number,
): Promise<Story | null> {
  const response = await fetch("/api/v0/stories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, history, historyIndex }),
  });

  try {
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    const story = await response.json();

    console.log("Created story:", story);

    return story;
  } catch (error) {
    console.error("Error creating story:", error);
  }

  return null;
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

  if (response.ok) {
    console.log("Saved story");
  } else {
    console.error(`Error saving story: HTTP status code ${response.status}`);
  }

  return response.ok;
}

export async function loadStory(
  apiToken: string,
  id: string,
): Promise<Story | null> {
  const response = await fetch(`/api/v0/stories/${id}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  try {
    const story = await response.json();

    console.log("Loaded story:", story);

    return story;
  } catch (error) {
    console.error("Error loading story:", error);
  }

  return null;
}

export async function deleteStory(apiToken: string, id: string) {
  const response = await fetch(`/api/v0/stories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  if (response.ok) {
    console.log("Deleted story");
  } else {
    console.error(`Error deleting story: HTTP status code ${response.status}`);
  }

  return response.ok;
}
