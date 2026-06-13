import { fetchModel } from "../api/koboldCppApi";
import { getSettings } from "../api/settingsApi";
import Endpoint from "../type/endpointType";

export async function fetchUriFromEndpointProfiles(apiToken: string) {
  const settings = await getSettings(apiToken);
  const endpointProfiles: Endpoint[] = settings.endpoints;

  for (const endpointProfile of endpointProfiles) {
    const uri = endpointProfile.uri;
    try {
      const model = await fetchModel(uri);

      if (model) {
        console.log(`Model found via URI "${uri}":`, model);
        return uri;
      }
    } catch {
      /* empty */
    }
  }

  return "http://localhost:5001";
}
