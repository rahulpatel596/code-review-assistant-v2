export async function analyzeDiff(diff: string): Promise<string> {
  const prompt = `
You are a senior software engineer. You are reviewing the following GitHub PR diff. 

Provide a structured code review report:
- Add a separator line before each section, and use clear section headers
- Give general feedback and summary first
- Group feedback by file
- Mention line numbers
- Highlight bugs, optimization opportunities, readability issues, or missing best practices
- Use markdown formatting

GitHub Diff:
\`\`\`diff
${diff}
\`\`\`
`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 2048,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const result = await response.json();

  const textBlocks = result?.content?.filter(
    (block) => block.type === "text" && typeof block.text === "string"
  );

  return textBlocks?.map((b) => b.text).join("\n") || "No review returned.";
}
