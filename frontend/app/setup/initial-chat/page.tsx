"use client";

import { makeMarkdownText } from "@assistant-ui/react-markdown";
import Link from "next/link";
import { MyAssistant } from "@/components/MyAssistant";

const MarkdownText = makeMarkdownText({});

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      {/* Wrapper div around everything */}
      <div className="max-w-3xl w-full space-y-6">
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h1 className="text-lg font-semibold">Outline Target Process</h1>
            <p className="text-sm text-muted-foreground">
              Chat with the AI and describe the process that should be
              represented in the event log. The AI will provide you with
              suggestions based on your input.
            </p>
          </div>

          {/* Chat Area */}
          <div className="p-6 h-96">
            <div className="h-full w-full rounded-md border border-border bg-muted-foreground">
                <main className="h-dvh">
                  <MyAssistant />
                </main>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="flex items-center justify-center p-4">
            <Link href="/additional-events">
              <button className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Proceed
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
