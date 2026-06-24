import { storiesClient } from "../client/storiesClient";
import Story, { HistoryNode } from "../type/storyType";
import { clamp } from "../util/math";
import { applyDiff, applyInvertedDiff, generateDiff } from "../util/rawDiff";

/* Pure updating functions */

export function getCurrentHistoryNode(story: Story) {
  return story.history[story.historyIndex];
}

/**
 * Check whether a LLM can regenerate text
 * @param story Current story
 * @returns Whether it is possible to regenerate
 */
export function regeneratable(story: Story) {
  return (
    story.historyIndex !== 0 &&
    getCurrentHistoryNode(story).attributes.generatedByLlm
  );
}

export function updateStoryTitle(story: Story, newTitle: string) {
  return {
    ...story,
    title: newTitle,
    // Purely a local change that gets overwritten by the back end
    time: { ...story.time, modified: Date.now() },
  };
}

function updateStoryFromAppendingHistory(
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
    // Purely a local change that gets overwritten by the back end
    time: {
      ...story.time,
      modified: Date.now(),
    },

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
function updateStoryFromHistoryPageFlip(story: Story, revert: boolean): Story {
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
      // Purely a local change that gets overwritten by the back end
      time: {
        ...story.time,
        modified: Date.now(),
      },

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
      // Purely a local change that gets overwritten by the back end
      time: {
        ...story.time,
        modified: Date.now(),
      },

      historyIndex: newIndex,
    };
  }
}

export function updateStoryFromTreeBacktrack(story: Story): Story {
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
    // Purely a local change that gets overwritten by the back end
    time: {
      ...story.time,
      modified: Date.now(),
    },

    historyIndex: newIndex,
  };
}

function compareStoryByTimeModified(a: Story, b: Story) {
  return b.time.modified - a.time.modified;
}

/**
 * Sends the updated story back to the top
 * @param stories List of stories
 * @param updatedStory Updated story
 * @returns An updated copy of stories
 */
export function updateStoriesFromUpdatedStory(
  stories: Story[],
  updatedStory: Story,
) {
  return sortStories(
    stories.map((story) =>
      story.id === updatedStory.id ? updatedStory : story,
    ),
  );
}

export function sortStories(stories: Story[]) {
  return stories.toSorted(compareStoryByTimeModified);
}

// offline helper function that removes the story contained in stories
export function removeStoryFromStories(stories: Story[], storyToRemove: Story) {
  return stories.filter((story) => story.id !== storyToRemove.id);
}

/* Integrated */

export async function updateStoryContentAndSave(
  oldStory: Story,
  newContent: string,
  generatedByLlm: boolean = false,
) {
  const mutatedStory = updateStoryFromAppendingHistory(
    oldStory,
    newContent,
    generatedByLlm,
  );

  return storiesClient.saveStory(mutatedStory).then(() => mutatedStory);
}

export async function undoStoryAndSave(oldStory: Story) {
  const mutatedStory = updateStoryFromHistoryPageFlip(oldStory, true);

  return storiesClient.saveStory(mutatedStory).then(() => mutatedStory);
}

export async function redoStoryAndSave(oldStory: Story) {
  const mutatedStory = updateStoryFromHistoryPageFlip(oldStory, false);

  return storiesClient.saveStory(mutatedStory).then(() => mutatedStory);
}

export async function clearHistoryAndSave(story: Story) {
  const updatedStory: Story = {
    ...story,
    // Purely a local change that gets overwritten by the back end
    time: {
      ...story.time,
      modified: Date.now(),
    },

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

  return storiesClient.saveStory(updatedStory).then((success) => {
    if (success) {
      return updatedStory;
    } else {
      // Requires some more work with `storiesClient` to remove this silly hack
      throw new Error();
    }
  });
}

export async function duplicateStoryAndSave(story: Story) {
  return storiesClient.duplicateStory(
    updateStoryTitle(story, story.title + " (Copy)"),
  );
}
