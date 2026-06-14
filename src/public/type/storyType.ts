import {
  applyPatch,
  reversePatch,
  StructuredPatch,
  structuredPatch,
} from "diff";

export interface HistoryNode {
  content: string;
  patch?: StructuredPatch;
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

  const prevHistoryNode = story.history[story.history.length - 1];

  const updatedPrevHistoryNode: HistoryNode = {
    ...prevHistoryNode,
    patch: structuredPatch("", "", prevHistoryNode.content, newContent),
    content: "",
  };

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
      ...(story.history.length >= 50
        ? story.history.slice(1, -1)
        : story.history.slice(0, -1)),
      updatedPrevHistoryNode,
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

/**
 *
 * @param story A story object
 * @param revert If true, undo by one node. Otherwise, redo one node
 * @returns A new story object
 */
export function mutateStoryFromHistoryPageFlip(
  story: Story,
  revert: boolean,
): Story {
  const newIndex = clamp(
    story.historyIndex + (revert ? -1 : 1),
    0,
    story.history.length - 1,
  );

  if (newIndex === story.historyIndex) return { ...story };

  if (revert) {
    const prevHistoryNode = story.history[story.historyIndex - 1];

    if (!prevHistoryNode.patch) throw new Error("Failed to find patch to undo");

    const patchedContent = applyPatch(
      story.content,
      reversePatch(prevHistoryNode.patch),
    );

    if (!patchedContent) throw new Error("Failed to undo");

    return {
      ...story,
      content: patchedContent,
      historyIndex: newIndex,
    };
  } else {
    const currentHistoryNode = getCurrentHistoryNode(story);

    if (!currentHistoryNode.patch)
      throw new Error("Failed to find patch to redo");

    const patchedContent = applyPatch(story.content, currentHistoryNode.patch);

    if (!patchedContent) throw new Error("Failed to redo");

    return {
      ...story,
      content: patchedContent,
      historyIndex: newIndex,
    };
  }
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
