import fs from "fs";

import { afterEach, beforeEach, describe, expect, test } from "vitest";
import initializeDatabase, {
  getDatabaseFile,
} from "../src/init/initializeDatabase.js";
import createStoryDao from "../src/dao/stories/createStoryDao.js";
import getStoryFromIdDao from "../src/dao/stories/getStoryFromIdDao.js";
import updateStoryDao from "../src/dao/stories/updateStoryDao.js";
import deleteStoryDao from "../src/dao/stories/deleteStoryDao.js";
import fetchUserSettingsDao from "../src/dao/settings/fetchUserSettingsDao.js";
import patchUserSettingsDao from "../src/dao/settings/patchUserSettingsDao.js";

function readStories() {
  return JSON.parse(
    fs.readFileSync(getDatabaseFile("stories.json"), {
      encoding: "utf-8",
    }),
  );
}

describe("stories dao", () => {
  beforeEach(() => {
    fs.mkdirSync("./test_environment/test/db", { recursive: true });
    initializeDatabase("./test_environment/test/db");
  });

  afterEach(() => {
    fs.rmSync("./test_environment/test/db", { recursive: true, force: true });
  });

  test("create story", () => {
    createStoryDao("Title", "Content");
    const stories = readStories();

    expect(stories).toMatchObject([
      {
        id: expect.any(String),
        version: expect.any(String),
        title: "Title",
        content: "Content",

        time: {
          created: expect.any(Number),
          accessed: expect.any(Number),
          modified: -1,
        },

        history: [
          {
            content: "Content",
            treePrev: -1,
            attributes: { generatedByLlm: expect.any(Boolean) },
          },
        ],
        historyIndex: 0,
      },
    ]);
  });

  test("get story", () => {
    const { id } = createStoryDao("Title", "Content");
    const story = getStoryFromIdDao(id);

    expect(story).toMatchObject({
      id: expect.any(String),
      version: expect.any(String),
      title: "Title",
      content: "Content",

      time: {
        created: expect.any(Number),
        accessed: expect.any(Number),
        modified: -1,
      },

      history: [
        {
          content: "Content",
          treePrev: -1,
          attributes: { generatedByLlm: expect.any(Boolean) },
        },
      ],
      historyIndex: 0,
    });
  });

  test("save story", () => {
    const story = createStoryDao("Title", "Content");
    story.content = "New content";
    updateStoryDao(story);
    const stories = readStories();

    // NOTE: Don't have time to write out the full story object here
    expect(stories).toMatchObject([
      {
        id: story.id,
        content: "New content",
      },
    ]);
  });

  test("delete story", () => {
    const story = createStoryDao("Title", "Content");
    deleteStoryDao(story.id);
    const stories = readStories();

    expect(stories).toMatchObject([]);
  });
});

describe("settings dao", () => {
  beforeEach(() => {
    fs.mkdirSync("./test_environment/test/db", { recursive: true });
    initializeDatabase("./test_environment/test/db");
  });

  afterEach(() => {
    fs.rmSync("./test_environment/test/db", { recursive: true, force: true });
  });

  test("get settings", () => {
    const settings = fetchUserSettingsDao();

    expect(settings).toMatchObject({
      endpoints: [],
    });
  });

  test("patch settings", () => {
    patchUserSettingsDao("endpoints", [
      {
        id: crypto.randomUUID(),
        name: "My Endpoint",
        uri: "http://example.com",
        authorization: "",
      },
    ]);

    const settings = fetchUserSettingsDao();

    expect(settings).toMatchObject({
      endpoints: [
        {
          id: expect.any(String),
          name: "My Endpoint",
          uri: "http://example.com",
          authorization: "",
        },
      ],
    });
  });
});
