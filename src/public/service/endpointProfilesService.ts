import { KoboldCppClient } from "../client/llms/koboldCppClient";
import { OpenAiCompletionsClient } from "../client/llms/openAiCompletionsClient";
import { NoLlmClient } from "../client/llms/noLlmClient";
import { settingsClient } from "../client/settingsClient";
import Endpoint, { endpointTypes } from "../type/endpointType";
import { LlmEndpointClient } from "../type/llmEndpointClient";
import Result, { wrapInError } from "../type/result";

export function getClientFromEndpointProfile(
  endpointProfile: Endpoint,
): LlmEndpointClient {
  if (endpointProfile.type === endpointTypes.KoboldCpp) {
    return new KoboldCppClient(
      endpointProfile.uri,
      endpointProfile.authorization,
    );
  } else if (endpointProfile.type === endpointTypes.OpenAiCompletions) {
    return new OpenAiCompletionsClient(
      endpointProfile.uri,
      endpointProfile.authorization,
    );
  } else {
    return new NoLlmClient();
  }
}

export async function fetchEndpointFromEndpointProfiles(): Promise<
  Result<Endpoint, void>
> {
  try {
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
          return Result.of(endpointProfile);
        }
      } catch {
        // The endpoint API probably isn't available.
        // That is expected, so we just move on to the next endpoint
      }
    }
  } catch (error) {
    return Result.error(wrapInError(error));
  }

  return Result.of({
    id: "automatic",
    name: "Automatic",
    type: endpointTypes.KoboldCpp,
    uri: "http://localhost:5001",
    authorization: "",
  });
}
