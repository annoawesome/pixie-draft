import { fetchModel } from "../api/koboldCppApi";
import { settingsClient } from "../client/settingsClient";
import Endpoint from "../type/endpointType";

export async function fetchEndpointFromEndpointProfiles(): Promise<Endpoint> {
  const settings = await settingsClient.getSettings();
  const endpointProfiles: Endpoint[] = settings.endpoints;

  for (const endpointProfile of endpointProfiles) {
    const uri = endpointProfile.uri;
    try {
      const model = await fetchModel(uri);

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
