import type { Text } from "openai/resources/beta/threads/messages";
import type { z } from "zod";
import type { JsonSchema7Type } from "zod-to-json-schema";
import OpenAI, { toFile } from "openai";
import zodToJsonSchema from "zod-to-json-schema";

import { env } from "./env";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const formatInstructionsComplex = (
  schema: JsonSchema7Type,
) => `You must format your output as a JSON value that adheres to a given "JSON Schema" instance.

"JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema exactly and there are no trailing commas!

Here is the JSON Schema instance your output must adhere to. Include the enclosing markdown codeblock:

\`\`\`json
${JSON.stringify(schema)}
\`\`\`
`;

export function createAssistant(props: {
  name: string;
  vectorStoreId?: string;
}) {
  return openai.beta.assistants.create({
    metadata: {},
    model: "gpt-4o",
    name: props.name,
    temperature: 0,
    tool_resources: {
      file_search: {
        vector_store_ids: props.vectorStoreId
          ? [props.vectorStoreId]
          : undefined,
      },
    },
    tools: [{ type: "file_search" }],
  });
}

export function createVectorStore(props: { name: string }) {
  return openai.beta.vectorStores.create({
    name: props.name,
  });
}

export async function uploadFile(props: {
  vectorStoreId: string;
  file: Buffer;
  name: string;
}) {
  const file = await toFile(props.file, props.name);

  return openai.beta.vectorStores.files.uploadAndPoll(
    props.vectorStoreId,
    file,
  );
}

export async function submitMessageToThread<
  T extends z.ZodTypeAny = z.ZodTypeAny,
>(props: {
  assistantId: string;
  threadId?: string;
  formatSchema: T;
  message: string;
}): Promise<z.infer<T>> {
  const threadId = props.threadId ?? (await openai.beta.threads.create({})).id;

  await openai.beta.threads.messages.create(threadId, {
    content: `${props.message}

    --- Start format instructions ---
    ${formatInstructionsComplex(zodToJsonSchema(props.formatSchema))}
    --- End format instructions`,
    role: "user",
  });

  await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: props.assistantId,
  });

  const messages = await openai.beta.threads.messages.list(threadId);
  const lastMessage = messages.data.at(0);
  const content =
    lastMessage?.content[0]?.type === "text"
      ? lastMessage.content[0].text
      : undefined;

  if (!content) {
    throw new Error("No content found in response");
  }

  console.log(content);
  const jsonResponse = cleanResponseToJson<T>({
    content,
    formatSchema: props.formatSchema,
  });
  console.log(jsonResponse);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return jsonResponse as unknown as z.infer<T>;
}

export async function chat<T extends z.ZodTypeAny = z.ZodTypeAny>(props: {
  formatSchema: T;
  message: string;
  model?: string;
  temperature?: number;
}): Promise<z.infer<T>> {
  const response = await openai.chat.completions.create({
    max_tokens: 2000,
    messages: [
      // {
      //   role: "system",
      //   content:
      //     "You are a helpful assistant that extracts movie script scenes along with metadata",
      // },
      {
        content: `${props.message}

        --- Start format instructions ---
        ${formatInstructionsComplex(zodToJsonSchema(props.formatSchema))}
        --- End format instructions`,
        role: "user",
      },
    ],
    model: props.model ?? "gpt-4o",
    response_format: { type: "json_object" },
    temperature: props.temperature ?? 0,
  });

  const content = response.choices[0]?.message.content;

  if (!content) {
    throw new Error("No content found in response");
  }

  try {
    const parsedMessage = JSON.parse(content) as unknown as T;

    const cleanedResponse = props.formatSchema.safeParse(parsedMessage);
    console.log(cleanedResponse.data);
    return cleanedResponse.data as unknown as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw error;
  }
}

export function cleanResponseToJson<
  T extends z.ZodTypeAny = z.ZodTypeAny,
>(props: { content: Text; formatSchema: T }): z.infer<T> {
  let messageWithoutFormatting = props.content.value
    .replaceAll("```json", "")
    .replaceAll("```", "")
    .replaceAll(String.raw`\n`, "")
    .trim();

  for (const annotation of props.content.annotations) {
    messageWithoutFormatting = messageWithoutFormatting.replace(
      annotation.text,
      "",
    );
  }

  try {
    const parsedMessage = JSON.parse(messageWithoutFormatting) as unknown as T;

    const cleanedResponse = props.formatSchema.safeParse(parsedMessage);
    return cleanedResponse as unknown as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw error;
  }
}
