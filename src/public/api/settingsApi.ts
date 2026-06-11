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
