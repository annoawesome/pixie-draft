import { KoboldCppClient } from "../client/koboldCppClient";
import { NoLlmClient } from "../client/noLlmClient";
import { settingsClient } from "../client/settingsClient";
import Endpoint from "../type/endpointType";
import { LlmEndpointClient } from "../type/llmEndpointClient";

export async function fetchEndpointFromEndpointProfiles(): Promise<Endpoint> {
  const settings = await settingsClient.getSettings();
  const endpointProfiles: Endpoint[] = settings.endpoints;

  for (const endpointProfile of endpointProfiles) {
    const uri = endpointProfile.uri;
    let llmEndpointClient: LlmEndpointClient = new NoLlmClient();

    if (endpointProfile.type === "KoboldCpp") {
      llmEndpointClient = new KoboldCppClient(
        endpointProfile.uri,
        endpointProfile.authorization,
      );
    }

    try {
      const models = await llmEndpointClient.fetchModels();

      if (models && models.length > 0) {
        console.log(`Models found using endpoint "${uri}":`, models);
        console.log("Using endpoint profile", endpointProfile);
        return endpointProfile;
      }
    } catch {
      /* empty */
    }
  }

  return {
    id: "automatic",
    name: "Automatic",
    type: "KoboldCpp",
    uri: "http://localhost:5001",
    authorization: "",
  };
}
