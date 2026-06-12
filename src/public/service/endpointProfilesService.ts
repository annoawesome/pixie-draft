import { fetchModel } from "../api/koboldCppApi";
import { getSettings } from "../api/settingsApi";
import Endpoint from "../type/endpointType";

export async function fetchUriFromEndpointProfiles(apiToken: string) {
  const settings = await getSettings(apiToken);

  let uri = "http://localhost:5001";
  const endpointProfiles: Endpoint[] = settings.endpoints;

  for (const endpointProfile of endpointProfiles) {
    uri = endpointProfile.uri;

    const model = await fetchModel(uri);

    if (model) {
      console.log(`Model found via URI "${uri}":`, model);
      break;
    }
  }

  return uri;
}
