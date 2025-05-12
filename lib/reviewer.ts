import { Anthropic } from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
dotenv.config();

// Create a Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Type guard to check if content block is a text block
function isTextBlock(block): block is { type: "text"; text: string } {
  return block.type === "text" && typeof block.text === "string";
}

export async function analyzeDiff(diff: string): Promise<string> {
  const prompt = `
You are a senior software engineer. You are reviewing the following GitHub PR diff. 

Provide a structured code review report:
- Group feedback by file
- Mention line numbers
- Highlight bugs, optimization opportunities, readability issues, or missing best practices
- Use markdown formatting

GitHub Diff:
\`\`\`diff
${diff}
\`\`\`
`;

  const response = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 2048,
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Filter for text blocks only and concatenate
  const textBlocks = response.content.filter(isTextBlock) as {
    type: "text";
    text: string;
  }[];
  return (
    textBlocks.map((block) => block.text).join("\n") || "No review returned."
  );
}
