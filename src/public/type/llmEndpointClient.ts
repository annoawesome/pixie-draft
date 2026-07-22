export interface LlmEndpointClient {
  /**
   * Sends a request to generate text through the API
   * @param prompt - The prompt sent to the LLM
   * @returns The continuation to be appended to the prompt
   */
  generateResponse(prompt: string): Promise<string>;
  fetchModel(): Promise<string>;
}
