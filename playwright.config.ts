import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./my-source-code/my-e2e-tests",
  testMatch: "**/*.@(spec|test|e2e)?(.playwright).?(c|m)[jt]s?(x)",
  fullyParallel: true,
  reporter: [["list"], ["html"]],
  use: {
    trace: "on-first-retry",
    video: "off",
    screenshot: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
