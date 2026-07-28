import { KoboldCppClient } from "../client/koboldCppClient";
import { OpenAiCompletionsClient } from "../client/llms/openAiCompletionsClient";
import { NoLlmClient } from "../client/noLlmClient";
import { settingsClient } from "../client/settingsClient";
import Endpoint from "../type/endpointType";
import { LlmEndpointClient } from "../type/llmEndpointClient";

export function getClientFromEndpointProfile(
  endpointProfile: Endpoint,
): LlmEndpointClient {
  if (endpointProfile.type === "KoboldCpp") {
    return new KoboldCppClient(
      endpointProfile.uri,
      endpointProfile.authorization,
    );
  } else if (endpointProfile.type === "OpenAI Completions") {
    return new OpenAiCompletionsClient(
      endpointProfile.uri,
      endpointProfile.authorization,
    );
  } else {
    return new NoLlmClient();
  }
}

export async function fetchEndpointFromEndpointProfiles(): Promise<Endpoint> {
  const settings = await settingsClient.getSettings();
  const endpointProfiles: Endpoint[] = settings.endpoints;

  for (const endpointProfile of endpointProfiles) {
    const llmEndpointClient = getClientFromEndpointProfile(endpointProfile);

    try {
      const models = await llmEndpointClient.fetchModels();

      if (models && models.length > 0) {
        console.log(
          `Models found using endpoint "${endpointProfile.uri}":`,
          models,
        );
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
