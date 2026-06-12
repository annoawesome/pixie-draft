export async function getSettings(apiToken: string) {
  const request = new Request("/api/v0/settings/", {
    headers: new Headers({
      Authorization: "Bearer " + apiToken,
    }),
  });

  const response = await fetch(request);
  const settings = await response.json();

  console.log("Fetched settings:", settings);

  return settings;
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

  if (response.ok) {
    console.log("Updated settings:", settings);
  } else {
    throw new Error(`HTTP status ${response.status}`);
  }
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

  if (response.ok) {
    console.log(`Updated settings with patch to '${settingName}':`, setting);
  } else {
    throw new Error(`HTTP status ${response.status}`);
  }
}
