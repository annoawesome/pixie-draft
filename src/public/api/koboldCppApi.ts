const samplerConfiguration = {
  max_length: 150,
  temperature: 1.25,
  min_p: 0.05,
  dynatemp_range: 0.25,
  rep_pen: 1.05,
  rep_pen_range: 360,
  rep_pen_slope: 0.7,

  // Disable samplers
  top_p: 1,
  top_k: 0,
  top_a: 0,
  typical: 1,
  tfs: 1,
};

export async function postGenerate(
  baseUrl: string,
  prompt: string,
  authorization: string,
) {
  const request = new Request(baseUrl + "/api/v1/generate", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + authorization,
    }),
    body: JSON.stringify({
      prompt,
      ...samplerConfiguration,
    }),
  });

  return fetch(request);
}

export function getDefaultFetch(authorization: string, body: object) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authorization,
    },
    body: JSON.stringify({
      ...body,
      ...samplerConfiguration,
    }),
  };
}

export async function getModel(baseUri: string): Promise<Response> {
  const request = new Request(baseUri + "/api/v1/model");

  return fetch(request);
}
