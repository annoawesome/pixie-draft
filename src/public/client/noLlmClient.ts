import { LlmEndpointClient } from "../type/llmEndpointClient";

export class NoLlmClient implements LlmEndpointClient {
  generateResponse(): Promise<string> {
    throw new Error("No LLM endpoint to generate response from");
  }

  fetchModels(): Promise<string[]> {
    throw new Error("No model selected");
  }
}
