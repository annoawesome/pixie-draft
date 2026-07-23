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
      const model = await llmEndpointClient.fetchModel();

      if (model) {
        console.log(`Model found using endpoint "${uri}":`, model);
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
