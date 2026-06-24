import { storiesClient } from "../client/storiesClient";
import Story, {
  mutateStoryFromAppendingHistory,
  mutateStoryFromHistoryPageFlip,
  mutateStoryFromRemovingHistory,
  updateStoriesFromUpdatedStory,
} from "../type/storyType";

export async function updateStoryContentAndSave(
  oldStory: Story,
  newContent: string,
  generatedByLlm: boolean = false,
) {
  const mutatedStory = mutateStoryFromAppendingHistory(
    oldStory,
    newContent,
    generatedByLlm,
  );

  return storiesClient.saveStory(mutatedStory).then(() => mutatedStory);
}

export async function undoStoryAndSave(oldStory: Story) {
  const mutatedStory = mutateStoryFromHistoryPageFlip(oldStory, true);

  return storiesClient.saveStory(mutatedStory).then(() => mutatedStory);
}

export async function redoStoryAndSave(oldStory: Story) {
  const mutatedStory = mutateStoryFromHistoryPageFlip(oldStory, false);

  return storiesClient.saveStory(mutatedStory).then(() => mutatedStory);
}

export async function clearHistoryAndSave(story: Story) {
  const updatedStory: Story = mutateStoryFromRemovingHistory(story);

  return storiesClient.saveStory(updatedStory).then((success) => {
    if (success) {
      return updatedStory;
    } else {
      // Requires some more work with `storiesClient` to remove this silly hack
      throw new Error();
    }
  });
}

/**
 * Sends the updated story back to the top
 * @param stories List of stories
 * @param story Update story
 * @returns An updated copy of stories
 */
export function repushStoryToTopOfStories(stories: Story[], story: Story) {
  return updateStoriesFromUpdatedStory(stories, story);
}
