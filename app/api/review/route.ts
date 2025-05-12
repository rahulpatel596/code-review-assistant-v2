import { NextResponse } from "next/server";
import { getPRDiff } from "@/lib/github";
import { analyzeDiff } from "@/lib/reviewer";

export async function POST(req: Request) {
  const { url } = await req.json();
  const match = url?.match(/github\.com\/(.+?)\/(.+?)\/pull\/(\d+)/);

  if (!match) {
    return NextResponse.json(
      { error: "Invalid GitHub PR URL" },
      { status: 400 }
    );
  }

  const [_, owner, repo, pull_number] = match;

  try {
    const diff = await getPRDiff(owner, repo, parseInt(pull_number));
    const review = await analyzeDiff(diff);
    return NextResponse.json({ review });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to process PR" },
      { status: 500 }
    );
  }
}
