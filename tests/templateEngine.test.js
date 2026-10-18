
import { test, expect } from "bun:test";
import {
  applyTemplate,
  getEventAction
} from "../src/utils/templateEngine.js";

// Test 1: Template placeholder replacement
test("Template replaces placeholders", () => {
  const result = applyTemplate(
    "{action} in {repo}",
    {
      action: "Opened",
      repo: "demo/project"
    }
  );

  expect(result).toBe("Opened in demo/project");
});

// Test 2: Push event
test("Push event returns committed", () => {
  expect(getEventAction("PushEvent", {}))
    .toBe("committed");
});

// Test 3: Merged pull request
test("Merged pull request returns merged", () => {
  const payload = {
    action: "closed",
    pull_request: { merged: true }
  };

  expect(getEventAction("PullRequestEvent", payload))
    .toBe("merged");
});

// Test 4: Empty template
test("Empty template returns null", () => {
  expect(applyTemplate("", {})).toBeNull();
});
