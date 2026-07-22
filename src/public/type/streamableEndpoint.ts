export interface TokenStream {
  open(onTokenStreamed: (token: string) => void): Promise<string>;
}

export interface StreamableEndpoint {
  generateResponseStream(prompt: string): TokenStream;
}
