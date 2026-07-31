import { storiesClient } from "../client/storiesClient";
import Result, { wrapInError } from "../type/result";

export async function getDownloadUrl(): Promise<Result<string, void>> {
  try {
    return Result.of(await storiesClient.getStoriesDownload());
  } catch (error) {
    return Result.error(wrapInError(error));
  }
}
