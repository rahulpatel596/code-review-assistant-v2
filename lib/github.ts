import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export async function getPRDiff(
  owner: string,
  repo: string,
  pull_number: number
): Promise<string> {
  const response = await octokit.request(
    `GET /repos/${owner}/${repo}/pulls/${pull_number}`,
    {
      owner,
      repo,
      pull_number,
      headers: { accept: "application/vnd.github.v3.diff" },
    }
  );
  return response.data as string;
}
