import { LlmEndpointClient } from "./llmEndpointClient";

export interface TokenStream {
  open(onTokenStreamed: (token: string) => void): Promise<string>;
}

export interface StreamableEndpoint {
  generateResponseStream(prompt: string): TokenStream;
}

export function isStreamableEndpoint(
  llmEndpointClient: LlmEndpointClient,
): llmEndpointClient is LlmEndpointClient & StreamableEndpoint {
  return (
    "generateResponseStream" in llmEndpointClient &&
    typeof llmEndpointClient.generateResponseStream === "function"
  );
}
