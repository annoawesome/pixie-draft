import * as z from "zod";

const DiffModifyOpCode = z.union([z.literal(1), z.literal(3)]);
const DiffModify = z.tuple([DiffModifyOpCode, z.string()]);
const DiffOp = z.union([z.number(), DiffModify]);

const HistoryNodeSchema = z.object({
  content: z.string(),
  patch: z.array(DiffOp).optional(),
  treePrev: z.number(),
  attributes: z.object({
    generatedByLlm: z.boolean(),
  }),
});

export const StorySchema = z.object({
  id: z.uuidv4(),
  version: z.string(),
  title: z.string(),
  desc: z.string(),
  tags: z.array(z.string()),
  content: z.string(),

  attributes: z.record(z.string(), z.string()),
  encyclopedia: z.record(z.string(), z.string()),

  time: z.object({
    created: z.number(),
    accessed: z.number(),
    modified: z.number(),
  }),

  history: z.array(HistoryNodeSchema),
  historyIndex: z.number(),
});

type Story = z.infer<typeof StorySchema>;
export default Story;
