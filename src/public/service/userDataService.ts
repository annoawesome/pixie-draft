import { storiesClient } from "../client/storiesClient";

class UserDataService {
  public async getDownloadUrl() {
    return await storiesClient.getStoriesDownload();
  }
}

export const userDataService = new UserDataService();
