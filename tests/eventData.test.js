
import { test, expect } from "bun:test";
import { extractEventData } from "../src/utils/templateEngine.js";

const baseEvent = {
  public: true,
  repo: { name: "demo/project" },
  created_at: "2026-10-14T00:00:00Z",
};

test("Public push event formats action, branch and URL", () => {
  const result = extractEventData(
    {
      ...baseEvent,
      type: "PushEvent",
      payload: { ref: "refs/heads/feature/tests", head: "abc123" },
    },
    { PushEvent: "🚀" },
  );

  expect(result.action).toBe("Committed to");
  expect(result.emoji).toBe("🚀");
  expect(result.ref).toBe("feature/tests");
  expect(result.repo_url).toBe("https://github.com/demo/project");
  expect(result.url).toBe("https://github.com/demo/project/commit/abc123");
  expect(result.date).toBe("Oct 14, 2026");
});

test("Merged pull request includes PR number and link", () => {
  const result = extractEventData(
    {
      ...baseEvent,
      type: "PullRequestEvent",
      payload: {
        action: "closed",
        pull_request: { merged: true, number: 42 },
      },
    },
    {},
  );

  expect(result.action).toBe("Merged");
  expect(result.subject).toBe("PR");
  expect(result.number).toBe("#42");
  expect(result.url).toBe("https://github.com/demo/project/pull/42");
});

test("Private issue hides repository details and links", () => {
  const result = extractEventData(
    {
      ...baseEvent,
      type: "IssuesEvent",
      public: false,
      payload: {
        action: "opened",
        issue: { number: 7 },
        ref: "refs/heads/private-feature",
      },
    },
    {},
    true,
  );

  expect(result.action).toBe("Opened");
  expect(result.repo).toBe("a private repository");
  expect(result.repo_url).toBe("");
  expect(result.url).toBe("");
  expect(result.number).toBe("");
  expect(result.ref).toBe("");
});

test("Wiki event summarizes created and edited pages", () => {
  const result = extractEventData(
    {
      ...baseEvent,
      type: "GollumEvent",
      payload: {
        pages: [
          { action: "created" },
          { action: "edited" },
          { action: "created" },
        ],
      },
    },
    {},
  );

  expect(result.action).toBe("Updated");
  expect(result.subject).toBe("3 pages (+2 new pages)");
  expect(result.url).toBe("https://github.com/demo/project");
});
