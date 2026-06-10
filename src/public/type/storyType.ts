type Story = {
  id: string;
  title: string;
  content: string;
  history: string[];
  historyIndex: number;
};

export default Story;

export function mutateStoryTitle(story: Story, newTitle: string) {
  return { ...story, title: newTitle };
}

export function mutateStoryContent(story: Story, newContent: string) {
  return { ...story, content: newContent };
}

export function mutateStoryFromAppendingHistory(
  story: Story,
  newContent: string,
): Story {
  if (newContent === story.content) {
    return { ...story };
  }

  return {
    ...story,
    content: newContent,
    history: [
      ...(story.history.length >= 50 ? story.history.slice(1) : story.history),
      newContent,
    ],
    historyIndex: story.history.length,
  };
}

function clamp(x: number, min: number, max: number) {
  if (x < min) {
    return min;
  } else if (x > max) {
    return max;
  } else {
    return x;
  }
}

export function mutateStoryFromHistoryPageFlip(
  story: Story,
  rel: number,
): Story {
  const newIndex = clamp(story.historyIndex + rel, 0, story.history.length - 1);

  return {
    ...story,
    content: story.history[newIndex],
    historyIndex: newIndex,
  };
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
