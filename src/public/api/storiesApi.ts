import Story, { HistoryNode } from "../type/storyType";
import { secondsToMilliseconds } from "../util/time";

/**
 * @throws {TimeoutError}
 */
export async function getStories(apiToken: string) {
  const response = await fetch("/api/v0/stories", {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    signal: AbortSignal.timeout(secondsToMilliseconds(5)),
  });

  return response;
}

/**
 * @throws {TimeoutError}
 */
export async function createStory(
  apiToken: string,
  title: string,
  content: string,
  history?: HistoryNode[],
  historyIndex?: number,
) {
  const response = await fetch("/api/v0/stories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, history, historyIndex }),
    signal: AbortSignal.timeout(secondsToMilliseconds(5)),
  });

  return response;
}

/**
 * @throws {TimeoutError}
 */
export async function saveStory(apiToken: string, story: Story) {
  const response = await fetch(`/api/v0/stories/${story.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(story),
    signal: AbortSignal.timeout(secondsToMilliseconds(5)),
  });

  return response;
}

/**
 * @throws {TimeoutError}
 */
export async function loadStory(apiToken: string, id: string) {
  const response = await fetch(`/api/v0/stories/${id}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    signal: AbortSignal.timeout(secondsToMilliseconds(5)),
  });

  return response;
}

/**
 * @throws {TimeoutError}
 */
export async function deleteStory(apiToken: string, id: string) {
  const response = await fetch(`/api/v0/stories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    signal: AbortSignal.timeout(secondsToMilliseconds(5)),
  });

  return response;
}

/**
 * @throws {TimeoutError}
 */
export async function getStoriesDownload(apiToken: string) {
  return await fetch(`/api/v0/stories/download`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    signal: AbortSignal.timeout(secondsToMilliseconds(5)),
  });
}

/**
 * @throws {TimeoutError}
 */
export async function postStoriesUpload(apiToken: string, file: File) {
  return await fetch(`/api/v0/stories/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      Authorization: `Bearer ${apiToken}`,
    },
    body: file,
    signal: AbortSignal.timeout(secondsToMilliseconds(5)),
  });
}
