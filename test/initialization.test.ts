import fs from "fs";

import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { getSecret, initializeSecret } from "../src/init/initializeSecrets.js";
import initializeDatabase, {
  getDatabaseFile,
} from "../src/init/initializeDatabase.js";

describe("initialize secrets", () => {
  test("initialize secret with given secret", () => {
    initializeSecret("aBigSecret!");
    expect(getSecret()).toBe("aBigSecret!");
  });

  test("initialize secret with nothing given", () => {
    initializeSecret(undefined);

    // Shouldn't be empty anyways
    expect(getSecret()).toBeTruthy();
  });
});

describe("initialize database files", () => {
  beforeEach(() => {
    fs.mkdirSync("./test_environment/test/db", { recursive: true });
  });

  afterEach(() => {
    fs.rmSync("./test_environment/test/db", { recursive: true, force: true });
  });

  test("data files exist", () => {
    initializeDatabase("./test_environment/test/db");

    expect(fs.existsSync("./test_environment/test/db/stories.json")).toBe(true);
    expect(fs.existsSync("./test_environment/test/db/settings.json")).toBe(
      true,
    );
  });

  test("join paths to data files", () => {
    initializeDatabase("./test_environment/test/db");

    expect(getDatabaseFile("stories")).toBe("test_environment/test/db/stories");
    expect(getDatabaseFile("settings")).toBe(
      "test_environment/test/db/settings",
    );
  });
});
