import { storiesClient } from "../client/storiesClient";
import Story, { HistoryNode, Stories, StoryPreview } from "../type/storyType";
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

function isFullStory(story: Story | StoryPreview) {
  return "content" in story;
}

function toStoryPreview(story: Story): StoryPreview {
  return {
    id: story.id,
    title: story.title,
    time: story.time,
  };
}

function compareStoryByTimeModified(a: StoryPreview, b: StoryPreview) {
  return b.time.modified - a.time.modified;
}

export function toLibraryPreview(stories: Stories, search?: string) {
  const unsortedLibrary = Object.values(stories).map((baseStory) =>
    isFullStory(baseStory) ? toStoryPreview(baseStory) : baseStory,
  );

  if (search) {
    return searchLibraryPreview(unsortedLibrary, search).sort(
      compareStoryByTimeModified,
    );
  } else {
    return unsortedLibrary.sort(compareStoryByTimeModified);
  }
}

export function searchLibraryPreview(
  libraryPreviews: StoryPreview[],
  search: string,
) {
  return libraryPreviews.filter((story) =>
    story.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
}

export function convertPreviewsToStories(storyPreviews: StoryPreview[]) {
  const stories: Stories = {};

  for (const storyPreview of storyPreviews) {
    stories[storyPreview.id] = storyPreview;
  }

  return stories;
}

export function getSelectedStory(stories: Stories) {
  for (const baseStory of Object.values(stories)) {
    if (isFullStory(baseStory)) {
      return baseStory;
    }
  }

  return null;
}

function updateSelectedStory(
  stories: Stories,
  updaterCallback: (selectedStory: Story) => Story,
) {
  const selectedStory = getSelectedStory(stories);
  if (!selectedStory) return;

  const updatedStory = updaterCallback(selectedStory);
  const updatedStories: Stories = {
    ...stories,
    [selectedStory.id]: updatedStory,
  };

  return updatedStories;
}

export function updateStoryTitle(story: Story, newTitle: string) {
  return {
    ...story,
    title: newTitle,
    // Purely a local change that gets overwritten by the back end
    time: { ...story.time, modified: Date.now() },
  };
}

export function locallyUpdateSelectedStoryTitle(
  stories: Stories,
  newTitle: string,
) {
  return updateSelectedStory(stories, (selectedStory) =>
    updateStoryTitle(selectedStory, newTitle),
  );
}

export function updateStoryFromAppendingHistory(
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

export function locallyUpdateSelectedStoryFromTreeBacktrack(stories: Stories) {
  return updateSelectedStory(stories, updateStoryFromTreeBacktrack);
}

/* Integrated */

export async function createStoryAndSave(
  stories: Stories,
  title: string,
  content: string,
) {
  const story = await storiesClient.createStory(title, content);

  if (!story) return;

  const updatedStories: Stories = {
    ...stories,
    [story.id]: story,
  };

  return updatedStories;
}

export async function duplicateSelectedStoryAndSave(
  stories: Stories,
  story: Story,
) {
  const dupedStory = await storiesClient.duplicateStory(
    updateStoryTitle(story, story.title + " (Copy)"),
  );

  if (!dupedStory) return;

  const updatedStories: Stories = {
    ...stories,
    [dupedStory.id]: dupedStory,
  };

  return updatedStories;
}

export async function loadStoryAndUpdate(stories: Stories, id: string) {
  const story = await storiesClient.loadStory(id);

  if (!story) return;

  const updatedStories = { ...stories };
  const currentSelectedStory = getSelectedStory(updatedStories);

  if (currentSelectedStory) {
    updatedStories[currentSelectedStory.id] =
      toStoryPreview(currentSelectedStory);
  }

  if (updatedStories[id]) {
    updatedStories[id] = story;
    return updatedStories;
  }
}

export async function saveSelectedStory(stories: Stories) {
  const selectedStory = getSelectedStory(stories);

  if (selectedStory) {
    return storiesClient.saveStory(selectedStory);
  }
}

export async function updateSelectedStoryContentAndSave(
  stories: Stories,
  newContent: string,
  generatedByLlm: boolean = false,
) {
  const updatedStories = updateSelectedStory(stories, (selectedStory) =>
    updateStoryFromAppendingHistory(selectedStory, newContent, generatedByLlm),
  );
  if (!updatedStories) return;

  const updatedStory = getSelectedStory(updatedStories);

  if (updatedStory) {
    return storiesClient.saveStory(updatedStory).then(() => updatedStories);
  }
}

export async function undoSelectedStoryAndSave(stories: Stories) {
  const updatedStories = updateSelectedStory(stories, (selectedStory) =>
    updateStoryFromHistoryPageFlip(selectedStory, true),
  );
  if (!updatedStories) return;

  const updatedStory = getSelectedStory(updatedStories);

  if (updatedStory) {
    return storiesClient.saveStory(updatedStory).then(() => updatedStories);
  }
}

export async function redoSelectedStoryAndSave(stories: Stories) {
  const updatedStories = updateSelectedStory(stories, (selectedStory) =>
    updateStoryFromHistoryPageFlip(selectedStory, false),
  );
  if (!updatedStories) return;

  const updatedStory = getSelectedStory(updatedStories);

  if (updatedStory) {
    return storiesClient.saveStory(updatedStory).then(() => updatedStories);
  }
}

export async function clearHistoryOfSelectedStoryAndSave(stories: Stories) {
  const selectedStory = getSelectedStory(stories);

  if (!selectedStory) return;

  const updatedStory: Story = {
    ...selectedStory,
    // Purely a local change that gets overwritten by the back end
    time: {
      ...selectedStory.time,
      modified: Date.now(),
    },

    history: [
      {
        content: selectedStory.content,
        treePrev: -1,
        attributes: {
          generatedByLlm: false,
        },
      },
    ],
    historyIndex: 0,
  };

  const updatedStories = updateSelectedStory(stories, () => updatedStory);

  if (updatedStories) {
    const success = await storiesClient.saveStory(updatedStory);

    if (success) {
      return updatedStories;
    }
  }
}

export async function deleteSelectedStoryAndSave(stories: Stories) {
  const selectedStory = getSelectedStory(stories);

  if (!selectedStory) return;

  const success = await storiesClient.deleteStory(selectedStory.id);

  if (success) {
    const updatedStories = { ...stories };
    delete updatedStories[selectedStory.id];

    return updatedStories;
  }
}
