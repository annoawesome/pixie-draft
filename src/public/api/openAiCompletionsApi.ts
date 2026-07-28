const samplerConfiguration = {
  max_tokens: 150,
  temperature: 1.25,
};

export async function postGenerate(
  model: string,
  baseUri: string,
  apiKey: string,
  prompt: string,
) {
  const response = await fetch(baseUri + "/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model,
      prompt,
      ...samplerConfiguration,
    }),
  });

  return response;
}

export async function getModels(baseUri: string, apiKey: string) {
  const response = await fetch(baseUri + "/models", {
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  });

  return response;
}
