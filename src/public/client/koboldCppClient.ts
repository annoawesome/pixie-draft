import z from "zod";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { getDefaultFetch, getModel, postGenerate } from "../api/koboldCppApi";
import { LlmEndpointClient } from "../type/llmEndpointClient";
import { StreamableEndpoint, TokenStream } from "../type/streamableEndpoint";

const GenerationOutputSchema = z.object({
  results: z.array(
    z.object({
      text: z.string(),
    }),
  ),
});

class KoboldCppTokenStream implements TokenStream {
  #url: string;
  #authorization: string;
  #prompt: string;

  constructor(url: string, authorization: string, prompt: string) {
    this.#url = url;
    this.#authorization = authorization;
    this.#prompt = prompt;
  }

  async open(onTokenStreamed: (token: string) => void): Promise<string> {
    return new Promise((resolve) => {
      let finalAppendedText = "";

      fetchEventSource(this.#url, {
        ...getDefaultFetch(this.#authorization, { prompt: this.#prompt }),

        onmessage(ev) {
          const data = JSON.parse(ev.data);
          const token: string = data.token;

          if (data.finish_reason != null) {
            return resolve(finalAppendedText);
          }

          finalAppendedText += token;
          onTokenStreamed(data.token);
        },
      });
    });
  }
}

export class KoboldCppClient implements LlmEndpointClient, StreamableEndpoint {
  #baseUrl: string;
  #authorization: string;

  constructor(baseUrl: string, authorization: string) {
    this.#baseUrl = baseUrl;
    this.#authorization = authorization;
  }

  generateResponseStream(prompt: string): TokenStream {
    return new KoboldCppTokenStream(
      this.#baseUrl + "/api/extra/generate/stream",
      this.#authorization,
      prompt,
    );
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

    throw new Error("No model is listed");
  }
}
