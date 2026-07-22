export interface LlmEndpointClient {
  generateResponse(prompt: string): Promise<string>;
  fetchModel(): Promise<string>;
}
