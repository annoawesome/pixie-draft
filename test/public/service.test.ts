import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import * as storiesService from "../../src/public/service/storiesService";
import Story, { Stories, StoryPreview } from "../../src/public/type/storyType";

import baseStory from "./baseStory.json";

class StoriesBuilder {
  #stories: Stories = {};

  public add(story: StoryPreview | Story) {
    this.#stories[story.id] = story;
    return this;
  }

  public addAll(stories: (StoryPreview | Story)[]) {
    stories.forEach((story) => this.add(story));
    return this;
  }

  public finish(): Stories {
    return { ...this.#stories };
  }
}

function buildStoryPreview(id: string, title: string): StoryPreview {
  return {
    id,
    title,
    time: { created: 1, accessed: 1, modified: 1 },
  };
}

function buildStory(id: string, title: string, content: string): Story {
  return {
    ...buildStoryPreview(id, title),
    ...baseStory,
    history: [
      {
        content: content,
        treePrev: -1,
        attributes: { generatedByLlm: false },
      },
    ],
    content,
  };
}

describe("stories service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("convert to previews", () => {
    const stories = new StoriesBuilder()
      .add(buildStoryPreview("1", "Title 1"))
      .add(buildStory("2", "Title 2", "Content"))
      .finish();

    const previews = [
      buildStoryPreview("1", "Title 1"),
      buildStoryPreview("2", "Title 2"),
    ];

    expect(storiesService.toLibraryPreview(stories)).toEqual(previews);
  });

  test("search previews", () => {
    const previews = [
      buildStoryPreview("1", "Big Buck Bunny"),
      buildStoryPreview("2", "Big Rabbit 2"),
      buildStoryPreview("3", "A bunny's life"),
    ];

    const filteredPreviews = [
      buildStoryPreview("1", "Big Buck Bunny"),
      buildStoryPreview("3", "A bunny's life"),
    ];

    expect(storiesService.searchLibraryPreview(previews, "BUNNY")).toEqual(
      filteredPreviews,
    );
  });

  test("convert previews to stories", () => {
    const previews = [
      buildStoryPreview("1", "Big Buck Bunny"),
      buildStoryPreview("2", "Big Rabbit 2"),
      buildStoryPreview("3", "A bunny's life"),
    ];

    expect(storiesService.convertPreviewsToStories(previews)).toEqual(
      new StoriesBuilder().addAll(previews).finish(),
    );
  });

  test("get selected story", () => {
    const stories = new StoriesBuilder()
      .add(buildStoryPreview("1", "Title 1"))
      .add(buildStory("2", "Title 2", "Content"))
      .finish();

    expect(storiesService.getSelectedStory(stories)).toEqual(
      buildStory("2", "Title 2", "Content"),
    );
  });

  test("update story title", () => {
    const updatedTitle = "Reselected";
    const story = buildStory("1", "Selected", "Content");
    vi.setSystemTime(new Date(1970, 0, 1, 0, 0, 1, 0));

    const updatedStory = {
      ...buildStory("1", updatedTitle, "Content"),
      time: { ...story.time, modified: 1000 },
    };

    expect(storiesService.updateStoryTitle(story, updatedTitle)).toEqual(
      updatedStory,
    );
  });

  test("locally update story title in stories", () => {
    // First millisecond after UNIX time, as stated in the test object
    vi.setSystemTime(new Date(1970, 0, 1, 0, 0, 0, 1));

    const newTitle = "Reselected";
    const stories = new StoriesBuilder()
      .add(buildStory("2", "Selected", "Content"))
      .add(buildStoryPreview("1", "Title 1"))
      .finish();

    const updatedStories = new StoriesBuilder()
      .add(buildStory("2", newTitle, "Content"))
      .add(buildStoryPreview("1", "Title 1"))
      .finish();

    expect(
      storiesService.locallyUpdateSelectedStoryTitle(stories, newTitle),
    ).toEqual(updatedStories);
  });

  test("locally backtrack story history");

  test("create story and save");
  test("duplicate selected story and save");
  test("load story and update");
  test("save selected story");
  test("update selected story content and save");
  test("undo selected story and save");
  test("redo selected story and save");
  test("clear history of selected story and save");
  test("delete selected story and save");
});
