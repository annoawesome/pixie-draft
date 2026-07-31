import { authClient, AuthClient } from "./authClient";
import * as settingsApi from "../api/settingsApi";
import { assertResponseOk } from "../util/assertions";

export class SettingsClient {
  private authClient;

  constructor(authClient: AuthClient) {
    this.authClient = authClient;
  }

  /**
   *
   * @returns The queried setting
   * @throws {TimeoutError | AbortError | HttpError | TypeError | SyntaxError}
   */
  public async getSettings() {
    const response = await settingsApi.getSettings(
      await this.authClient.getUsableApiToken(),
    );

    assertResponseOk(response);

    const settings = await response.json();

    console.log("Fetched settings:", settings);

    return settings;
  }

  /**
   *
   * @param settings The updated setting to apply to the backend
   * @throws {TimeoutError | AbortError | HttpError | TypeError | SyntaxError}
   */
  public async updateSettings(settings: unknown) {
    const response = await settingsApi.updateSettings(
      await this.authClient.getUsableApiToken(),
      settings,
    );

    assertResponseOk(response);

    console.log("Updated settings:", settings);
  }

  /**
   *
   * @param settingName The name of the setting to modify
   * @param setting The new value of specified setting
   * @throws {TimeoutError | AbortError | HttpError | TypeError | SyntaxError}
   */
  public async updateSetting(settingName: string, setting: unknown) {
    const response = await settingsApi.patchSettings(
      await this.authClient.getUsableApiToken(),
      settingName,
      setting,
    );

    assertResponseOk(response);

    console.log(`Updated settings with patch to '${settingName}':`, setting);
  }
}

export const settingsClient = new SettingsClient(authClient);
