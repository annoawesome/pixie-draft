import * as authApi from "../api/authApi";

export class AuthClient {
  private apiToken: string = "";
  private refreshIntervalId = -1;

  constructor() {}
  /**
   * login
   */
  public async login(password: string) {
    const response = await authApi.login(password);

    if (response.ok) {
      this.apiToken = await response.text();
    } else {
      throw new Error(`HTTP status ${response.status}`);
    }
  }

  public async setRefreshInterval() {
    // Refresh api token every 12 minutes, 3 minutes before expiration
    this.refreshIntervalId = setTimeout(() => this.refresh(), 1e3 * 60 * 12);
  }

  /**
   * login
   */
  public async refresh() {
    const response = await authApi.refreshTokens();

    if (response.ok) {
      console.log("Refreshed API token");

      this.apiToken = await response.text();
    } else {
      throw new Error(`HTTP status ${response.status}`);
    }
  }

  /**
   * getApiToken
   */
  public getApiToken() {
    return this.apiToken;
  }
}

export const authClient = new AuthClient();
