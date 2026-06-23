import { describe, expect, test } from "vitest";
import { getSecret, initializeSecret } from "../src/init/initializeSecrets.js";

describe("initialization", () => {
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
