"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Markdown from "react-markdown";
export default function Home() {
  const [url, setUrl] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReview("");

    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setReview(data.review || data.error);
    setLoading(false);
  };

  return (
    <main className=" w-full min-h-screen flex flex-col  items-center p-8">
      <h1 className="text-2xl font-bold mb-4 ">Code review assistant</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mb-4 w-full items-center justify-center p-16"
      >
        <Input
          type="text"
          className="border border-black p-2 mb-2 h-10"
          placeholder="Enter GitHub PR URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          variant="default"
          className="items-center justify-center text-md h-12 p-4 w-1/2"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Review PR"}
        </Button>
      </form>
      <div className="bg-gray-100 p-8 w-full rounded-lg shadow-md">
        {review && (
          // <pre className="bg-gray-100 p-4 whitespace-pre-wrap">{review}</pre>
          <Markdown>{review}</Markdown>
        )}
      </div>
    </main>
  );
}
