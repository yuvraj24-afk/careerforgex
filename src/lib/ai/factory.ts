import { AIProvider } from "./provider";
import { MockDeterministicProvider } from "./mock-provider";
import { OpenAIProvider } from "./openai-provider";

export function getAIProvider(): AIProvider {
  const isDemo = process.env.DEMO_MODE !== "false";
  const openaiKey = process.env.OPENAI_API_KEY;

  if (isDemo || !openaiKey) {
    return new MockDeterministicProvider();
  }

  return new OpenAIProvider(openaiKey);
}
