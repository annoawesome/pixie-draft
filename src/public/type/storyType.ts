import {
  applyDiff,
  applyInvertedDiff,
  DiffOp,
  generateDiff,
} from "../util/rawDiff";

export interface HistoryNode {
  content: string;
  patch?: DiffOp[];
  treePrev: number;
  attributes: {
    generatedByLlm: boolean;
  };
}

type Story = {
  id: string;
  version: string;
  title: string;
  desc: string;
  tags: string[];
  content: string;

  attributes: Record<string, string>;
  encyclopedia: Record<string, string>;

  time: {
    created: number;
    accessed: number;
    modified: number;
  };

  history: HistoryNode[];
  historyIndex: number;
};

export default Story;

export interface StoryPreview {
  id: string;
  title: string;
  time: {
    created: number;
    accessed: number;
    modified: number;
  };
}

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
  const prevContent = prevHistoryNode.content;

  const updatedPrevHistoryNode: HistoryNode = {
    ...prevHistoryNode,
    patch: generateDiff(prevContent, newContent),
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
      ...(story.history.length >= 200
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
 * Applies a patch from a history node onto the provided content. Patches to the next node's content
 * are stored in a node's `patch` property. As such, when using this function do this:
 *
 * If `reverse` is true, then supply the *previous* history node.
 *
 * If `reverse` is false, supply the *current* history node.
 * @param historyNode The history node to extract the patch from
 * @param content The current shown content
 * @param reverse Whether to reverse the patch
 * @returns The patched content
 */
function applyPatchFromHistoryNode(
  historyNode: HistoryNode,
  content: string,
  reverse: boolean,
) {
  if (!historyNode.patch)
    throw new Error(`Failed to find patch to ${reverse ? "undo" : "redo"}`);

  const patchedContent = reverse
    ? applyInvertedDiff(content, historyNode.patch)
    : applyDiff(content, historyNode.patch);

  if (!patchedContent)
    throw new Error(`Failed to ${reverse ? "undo" : "redo"}`);

  return patchedContent;
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

    return {
      ...story,
      content: applyPatchFromHistoryNode(prevHistoryNode, story.content, true),
      historyIndex: newIndex,
    };
  } else {
    const currentHistoryNode = getCurrentHistoryNode(story);

    return {
      ...story,
      content: applyPatchFromHistoryNode(
        currentHistoryNode,
        story.content,
        false,
      ),
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

  let content = story.content;

  for (let i = story.historyIndex - 1; i >= newIndex; i--) {
    const prevHistoryNode = story.history[i];

    content = applyPatchFromHistoryNode(prevHistoryNode, content, true);
  }

  return {
    ...story,
    content: content,
    historyIndex: newIndex,
  };
}

export function mutateStoryFromRemovingHistory(story: Story) {
  return {
    ...story,
    history: [
      {
        content: story.content,
        treePrev: -1,
        attributes: {
          generatedByLlm: false,
        },
      },
    ],
    historyIndex: 0,
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
