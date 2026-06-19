import * as storiesApi from "../api/storiesApi";
import { HttpError } from "../type/httpError";
import Story from "../type/storyType";
import { authClient, AuthClient } from "./authClient";

export class StoriesClient {
  private authClient;

  constructor(authClient: AuthClient) {
    this.authClient = authClient;
  }

  /**
   * createStory
   */
  public async createStory(
    title: string,
    content: string,
  ): Promise<Story | null> {
    try {
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
    } catch (error) {
      console.error("Error creating story:", error);
    }

    return null;
  }

  /**
   * duplicateStory
   */
  public async duplicateStory(story: Story) {
    try {
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
    } catch (error) {
      console.error("Error creating story:", error);
    }

    return null;
  }

  /**
   * loadLibrary
   */
  public async loadLibrary(): Promise<Story[]> {
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
   */
  public async loadStory(id: string): Promise<Story | null> {
    const response = await storiesApi.loadStory(
      await this.authClient.getUsableApiToken(),
      id,
    );

    try {
      const story = await response.json();

      console.log("Loaded story:", story);

      return story;
    } catch (error) {
      console.error("Error loading story:", error);
    }

    return null;
  }

  /**
   * saveStory
   */
  public async saveStory(story: Story) {
    const response = await storiesApi.saveStory(
      await this.authClient.getUsableApiToken(),
      story,
    );

    if (response.ok) {
      console.log("Saved story");
    } else {
      console.error(`Error saving story: HTTP status code ${response.status}`);
    }

    return response.ok;
  }

  /**
   * deleteStory
   */
  public async deleteStory(id: string) {
    const response = await storiesApi.deleteStory(
      await this.authClient.getUsableApiToken(),
      id,
    );

    if (response.ok) {
      console.log("Deleted story");
    } else {
      console.error(
        `Error deleting story: HTTP status code ${response.status}`,
      );
    }

    return response.ok;
  }
}

export const storiesClient = new StoriesClient(authClient);
