import * as storiesApi from "../api/storiesApi";
import Story, { StoryPreview } from "../type/storyType";
import { assertResponseOk } from "../util/assertions";
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

    assertResponseOk(response);

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

    assertResponseOk(response);

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

    assertResponseOk(response);

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

    assertResponseOk(response);

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

    assertResponseOk(response);

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

    assertResponseOk(response, "Error deleting story");

    console.log("Deleted story");

    return response.ok;
  }

  /**
   *
   * @returns The relative download URL
   * @throws {TimeoutError | HttpError | AbortError | TypeError}
   */
  public async getStoriesDownload() {
    const response = await storiesApi.getStoriesDownload(
      await this.authClient.getUsableApiToken(),
    );

    assertResponseOk(response, "Error getting stories download");

    return await response.text();
  }

  /**
   *
   * @param file The stories.json file
   * @returns Whether the response succeeded or not
   * @throws {TimeoutError | HttpError}
   */
  public async importStories(file: File) {
    const response = await storiesApi.postStoriesUpload(
      await this.authClient.getUsableApiToken(),
      file,
    );

    assertResponseOk(response, "Error importing stories");

    return response.ok;
  }
}

export const storiesClient = new StoriesClient(authClient);
