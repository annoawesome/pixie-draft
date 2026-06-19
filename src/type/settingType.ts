import * as z from "zod";

const EndpointProfileSchema = z.object({
  id: z.uuidv4(),
  name: z.string(),
  type: z.string(),
  uri: z.url(),
  authorization: z.string(),
});

export const UpdateUserSettingDto = z.union([
  z.object({
    setting: z.literal("endpoints"),
    content: z.array(EndpointProfileSchema),
  }),
]);
