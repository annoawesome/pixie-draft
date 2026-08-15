import { secondsToMilliseconds } from "../util/time";

/**
 *
 * @param apiToken The user's access token
 * @returns The queried setting
 * @throws {TimeoutError}
 */
export async function getSettings(apiToken: string) {
  const response = await fetch("/api/v0/settings/", {
    headers: new Headers({
      Authorization: "Bearer " + apiToken,
    }),
    signal: AbortSignal.timeout(secondsToMilliseconds(5)),
  });

  return response;
}

/**
 *
 * @param apiToken The user's access token
 * @param settings The updated settings to apply to the back end
 * @returns Whether the request succeeded or not
 * @throws {TimeoutError}
 */
export async function updateSettings(apiToken: string, settings: unknown) {
  const response = await fetch("/api/v0/settings/", {
    method: "PUT",
    headers: new Headers({
      Authorization: "Bearer " + apiToken,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(settings),
    signal: AbortSignal.timeout(secondsToMilliseconds(5)),
  });

  return response;
}

/**
 *
 * @param apiToken The user's access token
 * @param settingName The name of the setting to modify
 * @param setting The new value of specified setting
 * @returns Whether the request succeeded or not
 * @throws {TimeoutError}
 */
export async function patchSettings(
  apiToken: string,
  settingName: string,
  setting: unknown,
) {
  const response = await fetch("/api/v0/settings/" + settingName, {
    method: "PATCH",
    headers: new Headers({
      Authorization: "Bearer " + apiToken,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(setting),
    signal: AbortSignal.timeout(secondsToMilliseconds(5)),
  });

  return response;
}
