export interface LlmEndpointClient {
  /**
   * Sends a request to generate text through the API
   * @param prompt - The prompt sent to the LLM
   * @returns The continuation to be appended to the prompt
   */
  generateResponse(prompt: string): Promise<string>;

  /**
   * Gets the name of the model being served by the endpoint
   * @returns The name of the model
   */
  fetchModel(): Promise<string>;
}
