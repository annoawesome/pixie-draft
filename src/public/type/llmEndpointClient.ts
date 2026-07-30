export interface LlmEndpointClient {
  /**
   * Sends a request to generate text through the API
   * @param prompt - The prompt sent to the LLM
   * @returns The continuation to be appended to the prompt
   * @throws Throws an error if either a model is not available to serve, if generation fails on the inference server, or if no response is provided.
   */
  generateResponse(prompt: string, model: string): Promise<string>;

  /**
   * Gets the name of the model being served by the endpoint
   * @returns The name of the model
   * @throws {HttpError | SyntaxError | TypeError | Error} Throws an error if no model is listed.
   */
  fetchModels(): Promise<string[]>;
}
