import { storiesClient } from "../client/storiesClient";
import Result, { wrapInError } from "../type/result";
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
    desc: story.desc,
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
  const lowerCaseSearch = search.toLocaleLowerCase();

  return libraryPreviews.filter((story) => {
    const titleLowerCase = story.title.toLocaleLowerCase();
    const descLowerCase = story.desc.toLocaleLowerCase();

    return (
      titleLowerCase.includes(lowerCaseSearch) ||
      descLowerCase.includes(lowerCaseSearch)
    );
  });
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

function updateStoryContentByAppendingToken(story: Story, token: string) {
  return {
    ...story,
    content: (story.content += token),
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

export function locallyUpdateSelectedStoryContentByAppendingToken(
  stories: Stories,
  token: string,
) {
  return updateSelectedStory(stories, (selectedStory) =>
    updateStoryContentByAppendingToken(selectedStory, token),
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
): Promise<Result<Stories, void>> {
  try {
    const story = await storiesClient.createStory(title, content);

    const updatedStories: Stories = {
      ...stories,
      [story.id]: story,
    };

    return Result.of(updatedStories);
  } catch (error) {
    return Result.error(wrapInError(error));
  }
}

export async function duplicateStoryAndSave(
  stories: Stories,
  story: Story,
): Promise<Result<Stories, void>> {
  try {
    const dupedStory = await storiesClient.duplicateStory(
      updateStoryTitle(story, story.title),
    );

    const updatedStories = { ...stories };
    const currentSelectedStory = getSelectedStory(updatedStories);

    if (currentSelectedStory) {
      updatedStories[currentSelectedStory.id] =
        toStoryPreview(currentSelectedStory);
    }

    updatedStories[dupedStory.id] = dupedStory;

    return Result.of(updatedStories);
  } catch (error) {
    return Result.error(wrapInError(error));
  }
}

export async function loadStoryAndUpdate(
  stories: Stories,
  id: string,
): Promise<Result<Stories, void>> {
  try {
    const story = await storiesClient.loadStory(id);

    const updatedStories = { ...stories };
    const currentSelectedStory = getSelectedStory(updatedStories);

    if (currentSelectedStory) {
      updatedStories[currentSelectedStory.id] =
        toStoryPreview(currentSelectedStory);
    }

    if (updatedStories[id]) {
      updatedStories[id] = story;
      return Result.of(updatedStories);
    } else {
      throw new Error("Never error");
    }
  } catch (error) {
    return Result.error(wrapInError(error));
  }
}

export async function saveSelectedStory(
  stories: Stories,
): Promise<Result<boolean, void>> {
  const selectedStory = getSelectedStory(stories);

  if (selectedStory) {
    try {
      const success = await storiesClient.saveStory(selectedStory);

      return Result.of(success);
    } catch (error) {
      return Result.error(wrapInError(error));
    }
  } else {
    return Result.error(new Error("No selected story"));
  }
}

export async function updateSelectedStoryWithUpdaterAndSave(
  stories: Stories,
  updaterCallback: (selectedStory: Story) => Story,
): Promise<Result<Stories, void>> {
  const updatedStories = updateSelectedStory(stories, updaterCallback);

  if (!updatedStories) return Result.error(new Error("No selected story"));

  const updatedStory = getSelectedStory(updatedStories);

  if (updatedStory) {
    try {
      await storiesClient.saveStory(updatedStory);

      return Result.of(updatedStories);
    } catch (error) {
      return Result.error(wrapInError(error));
    }
  } else {
    return Result.error(new Error("No selected story"));
  }
}

export async function updateSelectedStoryContentAndSave(
  stories: Stories,
  newContent: string,
  generatedByLlm: boolean = false,
) {
  return updateSelectedStoryWithUpdaterAndSave(stories, (selectedStory) =>
    updateStoryFromAppendingHistory(selectedStory, newContent, generatedByLlm),
  );
}

export async function undoSelectedStoryAndSave(stories: Stories) {
  return updateSelectedStoryWithUpdaterAndSave(stories, (selectedStory) =>
    updateStoryFromHistoryPageFlip(selectedStory, true),
  );
}

export async function redoSelectedStoryAndSave(stories: Stories) {
  return updateSelectedStoryWithUpdaterAndSave(stories, (selectedStory) =>
    updateStoryFromHistoryPageFlip(selectedStory, false),
  );
}

export async function clearHistoryOfSelectedStoryAndSave(stories: Stories) {
  return updateSelectedStoryWithUpdaterAndSave(stories, (selectedStory) => {
    return {
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
  });
}

export async function deleteSelectedStoryAndSave(
  stories: Stories,
): Promise<Result<Stories, void>> {
  try {
    const selectedStory = getSelectedStory(stories);

    if (!selectedStory) return Result.error(new Error("No selected story"));

    await storiesClient.deleteStory(selectedStory.id);

    const updatedStories = { ...stories };
    delete updatedStories[selectedStory.id];

    return Result.of(updatedStories);
  } catch (error) {
    return Result.error(wrapInError(error));
  }
}

/**
 * Not intended for use in the main editor, but in the settings page.
 * As such, this function does not return anything beyond whether the request succeeded or not
 * @param file The stories.json file
 */
export async function wipeExistingAndImportNewStories(file: File) {
  return await storiesClient.importStories(file);
}
