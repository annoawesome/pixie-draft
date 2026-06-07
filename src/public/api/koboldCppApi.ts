interface GenerationResult {
  text: string;
}

interface GenerationOutput {
  results: GenerationResult[];
}

function isGenerationResult(result): result is GenerationResult {
  return typeof result === "object" && typeof result.text === "string";
}

/**
 * Tests whether a response is a generation output.
 * @param response A JSON object returned by the /generate endpoint
 * @returns Whether the return object is of type `GenerationOutput`
 */
function isGenerationOutput(response): response is GenerationOutput {
  return (
    typeof response === "object" &&
    Array.isArray(response.results) &&
    response.results.every(isGenerationResult)
  );
}

/**
 * Sends a request to generate text through the "KoboldAI Unified" API
 * @param baseUrl - The URL of the KoboldCpp instance. This should not include a path, nor end with a trailing slash
 * @param prompt - The prompt sent to the LLM
 * @returns The continuation to be appended to the prompt
 */
export async function generateResponse(baseUrl: string, prompt: string) {
  const request = new Request(baseUrl + "/api/v1/generate", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      prompt,
      temperature: 1.25,
      top_p: 1,
      min_p: 0.05,
      dynatemp_range: 0.75,
    }),
  });

  const response = await fetch(request);
  const output = await response.json();

  if (isGenerationOutput(output) && output.results.length > 0) {
    const result = output.results[0];
    return result.text;
  }

  throw new Error("Did not respond with generation output:", output);
}
