import z from "zod";

import { getModel, postGenerate } from "../api/koboldCppApi";
import { LlmEndpointClient } from "../type/llmEndpointClient";

const GenerationOutputSchema = z.object({
  results: z.array(
    z.object({
      text: z.string(),
    }),
  ),
});

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

    const generationOutput = GenerationOutputSchema.parse(
      await response.json(),
    );

    if (generationOutput.results.length > 0) {
      const result = generationOutput.results[0];
      return result.text;
    }

    throw new Error("Did not respond with generation results");
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
