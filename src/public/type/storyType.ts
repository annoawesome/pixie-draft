interface HistoryNode {
  content: string;
  treePrev: number;
  attributes: {
    generatedByLlm: boolean;
  };
}

type Story = {
  id: string;
  title: string;
  content: string;
  history: HistoryNode[];
  historyIndex: number;
};

export default Story;

export function getCurrentHistoryNode(story: Story) {
  return story.history[story.historyIndex];
}

export function mutateStoryTitle(story: Story, newTitle: string) {
  return { ...story, title: newTitle };
}

export function mutateStoryContent(story: Story, newContent: string) {
  return { ...story, content: newContent };
}

export function mutateStoryFromAppendingHistory(
  story: Story,
  newContent: string,
  generatedByLlm: boolean,
): Story {
  if (newContent === story.content) {
    return { ...story };
  }

  const historyNode: HistoryNode = {
    content: newContent,
    treePrev: story.historyIndex,
    attributes: {
      generatedByLlm,
    },
  };

  return {
    ...story,
    content: newContent,
    history: [
      ...(story.history.length >= 50 ? story.history.slice(1) : story.history),
      historyNode,
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
    content: story.history[newIndex].content,
    historyIndex: newIndex,
  };
}

export function mutateStoryFromTreeBacktrack(story: Story): Story {
  const newIndex = clamp(
    getCurrentHistoryNode(story).treePrev,
    0,
    story.history.length - 1,
  );

  return {
    ...story,
    content: story.history[newIndex].content,
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
