import { authClient, AuthClient } from "./authClient";
import * as settingsApi from "../api/settingsApi";

export class SettingsClient {
  private authClient;

  constructor(authClient: AuthClient) {
    this.authClient = authClient;
  }

  public async getSettings() {
    const response = await settingsApi.getSettings(
      this.authClient.getApiToken(),
    );
    const settings = await response.json();

    console.log("Fetched settings:", settings);

    return settings;
  }

  public async updateSettings(settings: unknown) {
    const response = await settingsApi.updateSettings(
      this.authClient.getApiToken(),
      settings,
    );

    if (response.ok) {
      console.log("Updated settings:", settings);
    } else {
      throw new Error(`HTTP status ${response.status}`);
    }
  }

  public async updateSetting(settingName: string, setting: unknown) {
    const response = await settingsApi.patchSettings(
      this.authClient.getApiToken(),
      settingName,
      setting,
    );

    if (response.ok) {
      console.log(`Updated settings with patch to '${settingName}':`, setting);
    } else {
      throw new Error(`HTTP status ${response.status}`);
    }
  }
}

export const settingsClient = new SettingsClient(authClient);
