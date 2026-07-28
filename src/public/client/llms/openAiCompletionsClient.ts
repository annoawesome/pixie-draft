import z from "zod";
import { getModels, postGenerate } from "../../api/openAiCompletionsApi";
import { HttpError } from "../../type/httpError";
import { LlmEndpointClient } from "../../type/llmEndpointClient";

const OpenAiCompletionChoiceSchema = z.object({
  finish_reason: z.union(
    ["stop", "length", "content_filter"].map((literal) => z.literal(literal)),
  ),
  index: z.number(),
  logprobs: z.any(),
  text: z.string(),
});

const OpenAiCompletionSchema = z.object({
  id: z.string(),
  object: z.literal("text_completion"),
  created: z.number(),
  model: z.string(),
  system_fingerprint: z.string().optional(),
  choices: z.array(OpenAiCompletionChoiceSchema).nonempty(),
  usage: z
    .object({
      completion_tokens: z.number(),
      prompt_tokens: z.number(),
      total_tokens: z.number(),
      completion_tokens_details: z.any().optional(),
      prompt_tokens_details: z.any().optional(),
    })
    .optional(),
});

const OpenAiModelSchema = z.object({
  id: z.string(),
  created: z.number(),
  object: z.literal("model"),
  owned_by: z.string(),
});

const OpenAiModelsSchema = z.object({
  object: z.literal("list"),
  data: z.array(OpenAiModelSchema).nonempty(),
});

export class OpenAiCompletionsClient implements LlmEndpointClient {
  #baseUri: string;
  #apiKey: string;

  constructor(baseUri: string, apiKey: string) {
    this.#baseUri = baseUri;
    this.#apiKey = apiKey;
  }

  async generateResponse(prompt: string, model: string): Promise<string> {
    const response = await postGenerate(
      model,
      this.#baseUri,
      this.#apiKey,
      prompt,
    );

    if (!response.ok) throw new HttpError(response.status, response.statusText);

    const completion = OpenAiCompletionSchema.parse(await response.json());
    return completion.choices[0].text;
  }

  async fetchModels(): Promise<string[]> {
    const response = await getModels(this.#baseUri, this.#apiKey);

    if (!response.ok) throw new HttpError(response.status, response.statusText);

    const completion = OpenAiModelsSchema.parse(await response.json());
    return completion.data.map((model) => model.id);
  }
}
