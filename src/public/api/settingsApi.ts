export async function getSettings(apiToken: string) {
  const request = new Request("/api/v0/settings/", {
    headers: new Headers({
      Authorization: "Bearer " + apiToken,
    }),
  });

  const response = await fetch(request);

  return response;
}

export async function updateSettings(apiToken: string, settings: unknown) {
  const request = new Request("/api/v0/settings/", {
    method: "PUT",
    headers: new Headers({
      Authorization: "Bearer " + apiToken,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(settings),
  });

  const response = await fetch(request);

  return response;
}

export async function patchSettings(
  apiToken: string,
  settingName: string,
  setting: unknown,
) {
  const request = new Request("/api/v0/settings/" + settingName, {
    method: "PATCH",
    headers: new Headers({
      Authorization: "Bearer " + apiToken,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(setting),
  });

  const response = await fetch(request);

  return response;
}
