import { storiesClient } from "../client/storiesClient";

export async function getDownloadUrl() {
  return await storiesClient.getStoriesDownload();
}
