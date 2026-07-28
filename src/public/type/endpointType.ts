export const endpointTypes = {
  KoboldCpp: "KoboldCpp",
  OpenAiCompletions: "OpenAI Completions",
};

export default interface Endpoint {
  id: string;
  name: string;
  type: string;
  uri: string;
  authorization: string;
}
