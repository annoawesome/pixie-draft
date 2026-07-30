import * as storiesApi from "../api/storiesApi";
import { HttpError } from "../type/error/httpError";
import Story, { StoryPreview } from "../type/storyType";
import { authClient, AuthClient } from "./authClient";

export class StoriesClient {
  private authClient;

  constructor(authClient: AuthClient) {
    this.authClient = authClient;
  }

  /**
   * createStory
   * @throws {TimeoutError | HttpError | TypeError | SyntaxError}
   */
  public async createStory(title: string, content: string): Promise<Story> {
    const response = await storiesApi.createStory(
      await this.authClient.getUsableApiToken(),
      title,
      content,
    );

    if (!response.ok) {
      throw new HttpError(response.status, `HTTP status ${response.status}`);
    }

    const story = await response.json();

    console.log("Created story:", story);

    return story;
  }

  /**
   * duplicateStory
   * @throws {TimeoutError | HttpError | TypeError | SyntaxError}
   */
  public async duplicateStory(story: Story): Promise<Story> {
    const response = await storiesApi.createStory(
      await this.authClient.getUsableApiToken(),
      story.title,
      story.content,
      story.history,
      story.historyIndex,
    );

    if (!response.ok) {
      throw new HttpError(response.status, `HTTP status ${response.status}`);
    }

    const createdStory = await response.json();

    console.log("Created story:", createdStory);

    return createdStory;
  }

  /**
   * loadLibrary
   * @throws {TimeoutError | HttpError | TypeError | SyntaxError}
   */
  public async loadLibrary(): Promise<StoryPreview[]> {
    const response = await storiesApi.getStories(
      await this.authClient.getUsableApiToken(),
    );

    if (!response.ok) {
      throw new HttpError(response.status, `HTTP status ${response.status}`);
    }

    const stories = await response.json();
    console.log("Fetched stories:", stories);

    return stories;
  }

  /**
   * loadStory
   * @throws {TimeoutError | HttpError | TypeError | SyntaxError}
   */
  public async loadStory(id: string): Promise<Story> {
    const response = await storiesApi.loadStory(
      await this.authClient.getUsableApiToken(),
      id,
    );

    const story = await response.json();

    if (!response.ok) {
      throw new HttpError(response.status, `HTTP status ${response.status}`);
    }

    console.log("Loaded story:", story);

    return story;
  }

  /**
   * saveStory
   * @throws {TimeoutError | HttpError | TypeError | SyntaxError}
   */
  public async saveStory(story: Story) {
    const response = await storiesApi.saveStory(
      await this.authClient.getUsableApiToken(),
      story,
    );

    if (!response.ok) {
      throw new HttpError(response.status, `HTTP status ${response.status}`);
    }

    console.log("Saved story");

    return response.ok;
  }

  /**
   * deleteStory
   * @throws {TimeoutError | HttpError | TypeError | SyntaxError}
   */
  public async deleteStory(id: string) {
    const response = await storiesApi.deleteStory(
      await this.authClient.getUsableApiToken(),
      id,
    );

    if (!response.ok) {
      throw new HttpError(
        response.status,
        `HTTP status ${response.status}: Error deleting story`,
      );
    }

    console.log("Deleted story");

    return response.ok;
  }

  public async getStoriesDownload() {
    const response = await storiesApi.getStoriesDownload(
      await this.authClient.getUsableApiToken(),
    );

    if (response.ok) {
      return await response.text();
    } else {
      console.error(
        `Error getting stories download: HTTP status code ${response.status}`,
      );
    }
  }

  public async importStories(file: File) {
    const response = await storiesApi.postStoriesUpload(
      await this.authClient.getUsableApiToken(),
      file,
    );

    if (!response.ok) {
      console.error(
        `Error getting stories download: HTTP status code ${response.status}`,
      );
    }

    return response.ok;
  }
}

export const storiesClient = new StoriesClient(authClient);
