import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import "dotenv/config";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function gerarResposta(messages) {
  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 20000,
    messages: messages.slice(-10),
  });

  const command = new InvokeModelCommand({
    modelId: process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-sonnet-4-6",
    body: new TextEncoder().encode(body),
    contentType: "application/json",
    accept: "application/json",
  });

  const response = await client.send(command);
  const text = await new Response(response.body).text();
  const data = JSON.parse(text);

  const resposta = data.content[0].text;
  const tokens = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);

  return { resposta, tokens };
}