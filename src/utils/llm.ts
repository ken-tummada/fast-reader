import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AzureChatOpenAI, ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatBedrockConverse } from "@langchain/aws";

export const createLLM = (): BaseChatModel => {
  const provider = import.meta.env.VITE_LLM_PROVIDER as string;
  const model = import.meta.env.VITE_LLM_MODEL as string;
  const apiKey = import.meta.env.VITE_LLM_API_KEY as string;

  switch (provider) {
    case "google-genai":
      return new ChatGoogleGenerativeAI({ model, apiKey }) as unknown as BaseChatModel;

    case "openai":
      return new ChatOpenAI({ model, apiKey }) as unknown as BaseChatModel;

    case "anthropic":
      return new ChatAnthropic({ model, apiKey }) as unknown as BaseChatModel;

    case "azure": {
      const azureEndpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT as string;
      return new AzureChatOpenAI({
        model,
        apiKey,
        azureOpenAIApiKey: apiKey,
        azureOpenAIBasePath: azureEndpoint,
      }) as unknown as BaseChatModel;
    }

    case "aws": {
      const region = import.meta.env.VITE_AWS_REGION as string;
      return new ChatBedrockConverse({ model, region }) as unknown as BaseChatModel;
    }

    default:
      throw new Error(
        `Unsupported LLM provider: "${provider}". Valid values: google-genai, openai, anthropic, azure, aws.`
      );
  }
};
