import { getModel, postGenerate } from "../api/koboldCppApi";
import { LlmEndpointClient } from "../type/llmEndpointClient";

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

export class KoboldCppClient implements LlmEndpointClient {
  #baseUrl: string;
  #authorization: string;

  constructor(baseUrl: string, authorization: string) {
    this.#baseUrl = baseUrl;
    this.#authorization = authorization;
  }

  async generateResponse(prompt: string): Promise<string> {
    const response = await postGenerate(
      this.#baseUrl,
      prompt,
      this.#authorization,
    );
    const output = await response.json();

    if (isGenerationOutput(output) && output.results.length > 0) {
      const result = output.results[0];
      return result.text;
    }

    throw new Error("Did not respond with generation output:", output);
  }

  async fetchModel(): Promise<string> {
    const response = await getModel(this.#baseUrl);
    const body = await response.json();

    if (typeof body.result === "string") {
      return body.result;
    }

    return "";
  }
}
