
import { test, expect } from "bun:test";
import { existsSync, statSync } from "node:fs";

test("Build artifact exists", () => {
  expect(existsSync("dist")).toBe(true);
});

test("Build archive exists", () => {
  expect(existsSync("build.zip")).toBe(true);
});

test("Build archive is not empty", () => {
  expect(statSync("build.zip").size).toBeGreaterThan(0);
});

test("TEST_ENV is configured", () => {
  expect(["staging", "prod"]).toContain(process.env.TEST_ENV);
});

