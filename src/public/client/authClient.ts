import * as authApi from "../api/authApi";
import { HttpError } from "../type/httpError";

export class AuthClient {
  private apiToken: string = "";
  private lastRefreshTime: number = -1;
  private refreshIntervalId = -1;

  constructor() {}
  /**
   * login
   */
  public async login(password: string) {
    const response = await authApi.login(password);

    if (response.ok) {
      this.apiToken = await response.text();
      this.lastRefreshTime = Date.now();
    } else {
      throw new HttpError(response.status, `HTTP status ${response.status}`);
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
      this.lastRefreshTime = Date.now();
    } else {
      throw new HttpError(response.status, `HTTP status ${response.status}`);
    }
  }

  /**
   * getApiToken
   */
  public getApiToken() {
    return this.apiToken;
  }

  /**
   * Get a usable API token, refreshing it automatically if it may have expired
   */
  public async getUsableApiToken() {
    if (
      this.lastRefreshTime > -1 &&
      Date.now() - this.lastRefreshTime > 1e3 * 60 * 12
    ) {
      await this.refresh();
    }

    return this.apiToken;
  }

  public async logOut() {
    const response = await authApi.deleteTokens();

    if (!response.ok) {
      throw new HttpError(response.status, "Could not log out");
    }
  }
}

export const authClient = new AuthClient();
