import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import * as storiesService from "../../src/public/service/storiesService";
import Story, { Stories, StoryPreview } from "../../src/public/type/storyType";

import baseStory from "./baseStory.json";
import { AuthClient } from "../../src/public/client/authClient";

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

vi.mock(import("../../src/public/client/storiesClient"), () => {
  const MockedStoryClass = class {
    private authClient;

    constructor(authClient: AuthClient) {
      this.authClient = authClient;
    }

    public async createStory(
      title: string,
      content: string,
    ): Promise<Story | null> {
      return buildStory("1", title, content);
    }

    public async duplicateStory(story: Story) {
      return { ...story, id: "3" };
    }

    public async loadLibrary(): Promise<StoryPreview[]> {
      return [
        buildStoryPreview("2", "Title 2"),
        buildStoryPreview("3", "Title 3"),
      ];
    }

    public async loadStory(id: string): Promise<Story | null> {
      return buildStory(id, "Title", "Content");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async saveStory(story: Story) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async deleteStory(id: string) {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  const StoriesClient = vi.fn(MockedStoryClass);

  return { StoriesClient, storiesClient: new MockedStoryClass(null) };
});

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

  test("update story from appending history", () => {
    vi.setSystemTime(new Date(1970, 0, 1, 0, 0, 1, 0));

    const story = buildStory("1", "Title", "Content");
    const updatedStory: Story = {
      ...buildStory("1", "Title", "New content"),
      time: {
        created: 1,
        accessed: 1,
        modified: 1000,
      },
      history: [
        {
          content: "",
          patch: [[1, "C"], [3, "New c"], 6], // Use https://neil.fraser.name/software/diff_match_patch/demos/diff.html to view patches
          treePrev: -1,
          attributes: {
            generatedByLlm: false,
          },
        },
        {
          content: "New content",
          treePrev: 0,
          attributes: {
            generatedByLlm: true,
          },
        },
      ],
      historyIndex: 1,
    };

    expect(
      storiesService.updateStoryFromAppendingHistory(
        story,
        "New content",
        true,
      ),
    ).toEqual(updatedStory);
  });

  test("locally backtrack story history", () => {
    vi.setSystemTime(new Date(1970, 0, 1, 0, 0, 0, 1));

    const story = buildStory("1", "Title", "Content");
    const updatedStory1 = storiesService.updateStoryFromAppendingHistory(
      story,
      "New content",
      true,
    );

    // Test backtrack by one node
    const backtrackedStory1 =
      storiesService.updateStoryFromTreeBacktrack(updatedStory1);

    expect(backtrackedStory1).toEqual({ ...story, history: expect.any(Array) });

    const updatedStory2 = storiesService.updateStoryFromAppendingHistory(
      backtrackedStory1,
      "Really new content",
      true,
    );

    // Test backtrack by two nodes
    const backtrackedStory2 =
      storiesService.updateStoryFromTreeBacktrack(updatedStory2);

    expect(backtrackedStory2).toEqual({ ...story, history: expect.any(Array) });
  });

  test("create story and save", async () => {
    const newStory = buildStory("1", "New Story", "Content");
    const stories = new StoriesBuilder()
      .add(buildStoryPreview("2", "Title"))
      .finish();
    const updatedStories = new StoriesBuilder()
      .add(buildStoryPreview("2", "Title"))
      .add(newStory)
      .finish();

    expect(
      await storiesService.createStoryAndSave(
        stories,
        newStory.title,
        newStory.content,
      ),
    ).toEqual(updatedStories);
  });

  test("duplicate selected story and save", async () => {
    vi.setSystemTime(new Date(1970, 0, 1, 0, 0, 0, 1));

    const story = buildStory("1", "New Story", "Content");
    const copiedStory = buildStory("3", "New Story (Copy)", "Content");

    const stories = new StoriesBuilder()
      .add(buildStoryPreview("2", "Title"))
      .add(story)
      .finish();
    const updatedStories = new StoriesBuilder()
      .add(buildStoryPreview("2", "Title"))
      .add(story)
      .add(copiedStory)
      .finish();

    expect(
      await storiesService.duplicateSelectedStoryAndSave(stories, story),
    ).toEqual(updatedStories);
  });

  test("load story and update", async () => {
    const loadedStory = buildStory("1", "Title", "Content");

    const stories = new StoriesBuilder()
      .add(buildStoryPreview("2", "Title"))
      .add(buildStoryPreview(loadedStory.id, loadedStory.title))
      .finish();

    const updatedStories = new StoriesBuilder()
      .add(buildStoryPreview("2", "Title"))
      .add(loadedStory)
      .finish();

    expect(await storiesService.loadStoryAndUpdate(stories, "1")).toEqual(
      updatedStories,
    );
  });

  // Essentially a stub test
  test("save selected story", async () => {
    const stories = new StoriesBuilder()
      .add(buildStory("1", "Title", "New Content"))
      .finish();

    expect(await storiesService.saveSelectedStory(stories)).toBe(true);
  });

  test("update selected story content and save", async () => {
    vi.setSystemTime(new Date(1970, 0, 1, 0, 0, 0, 1));

    const stories = new StoriesBuilder()
      .add(buildStoryPreview("1", "Preview"))
      .add(buildStory("2", "Title", "Content"))
      .finish();

    const updatedStories =
      await storiesService.updateSelectedStoryContentAndSave(
        stories,
        "New content",
        false,
      );

    expect(updatedStories).toEqual(
      new StoriesBuilder()
        .add(buildStoryPreview("1", "Preview"))
        .add({
          ...buildStory("2", "Title", "New content"),
          historyIndex: 1,
          history: expect.any(Array),
        })
        .finish(),
    );
  });

  // These probably work assuming the above tests regarding history continue to work?
  test("undo selected story and save");
  test("redo selected story and save");
  test("clear history of selected story and save");

  test("delete selected story and save", async () => {
    const stories = new StoriesBuilder()
      .add(buildStory("1", "Title", "New Content"))
      .add(buildStoryPreview("2", "Preview"))
      .finish();

    expect(await storiesService.deleteSelectedStoryAndSave(stories)).toEqual(
      new StoriesBuilder().add(buildStoryPreview("2", "Preview")).finish(),
    );
  });
});
