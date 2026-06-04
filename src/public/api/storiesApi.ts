import Story from "../type/storyType";

export async function getStories(): Promise<Story[]> {
  const response = await fetch("/api/v0/stories");

  try {
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching stories:", error);
  }

  return [];
}

export async function createStory(
  title: string,
  content: string,
): Promise<Story> {
  const response = await fetch("/api/v0/stories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  try {
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating story:", error);
  }

  return { id: "", title, content };
}

export async function saveStory(story: Story) {
  const response = await fetch(`/api/v0/stories/${story.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(story),
  });

  return response.ok;
}

export async function loadStory(id: string): Promise<Story> {
  const response = await fetch(`/api/v0/stories/${id}`);
  return response.json();
}

export async function deleteStory(id: string) {
  const response = await fetch(`/api/v0/stories/${id}`, {
    method: "DELETE",
  });

  return response.ok;
}

/* Should probably be moved somewhere else */

export function mutateStoryTitle(story: Story, newTitle: string) {
  return { ...story, title: newTitle };
}

export function mutateStoryContent(story: Story, newContent: string) {
  return { ...story, content: newContent };
}

// offline helper function that updates the story contained in stories to save a bit of bandwidth
export function updateStoriesFromUpdatedStory(
  stories: Story[],
  updatedStory: Story,
) {
  return stories.map((story) =>
    story.id === updatedStory.id ? updatedStory : story,
  );
}

// offline helper function that removes the story contained in stories
export function removeStoryFromStories(stories: Story[], storyToRemove: Story) {
  return stories.filter((story) => story.id !== storyToRemove.id);
}
