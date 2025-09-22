import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";

const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn(
    "[AI] OPENAI_API_KEY is not configured. AI-powered features will remain disabled until the key is provided."
  );
}

const openAITextClient = apiKey
  ? createOpenAI({
      apiKey,
      baseURL,
    })
  : null;

const openAIAudioClient = apiKey
  ? new OpenAI({
      apiKey,
      baseURL,
    })
  : null;

const defaultModels = {
  chat: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
  insight:
    process.env.OPENAI_INSIGHT_MODEL || process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
  transcribe: process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe",
};

export class AIConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIConfigError";
  }
}

type OpenAIModelFactory = ReturnType<typeof createOpenAI>;

function ensureTextClient(): OpenAIModelFactory {
  if (!openAITextClient) {
    throw new AIConfigError(
      "OPENAI_API_KEY is missing. Please set it in the server environment to enable AI features."
    );
  }
  return openAITextClient;
}

function ensureAudioClient(): OpenAI {
  if (!openAIAudioClient) {
    throw new AIConfigError(
      "OPENAI_API_KEY is missing. Please set it in the server environment to enable AI voice features."
    );
  }
  return openAIAudioClient;
}

export function getChatModel(modelAlias: "chat" | "insight" = "chat") {
  const client = ensureTextClient();
  const modelName = defaultModels[modelAlias];
  return client(modelName);
}

export function getTranscribeClient() {
  return {
    client: ensureAudioClient(),
    model: defaultModels.transcribe,
  };
}

export function isAIConfigured() {
  return Boolean(apiKey);
}
