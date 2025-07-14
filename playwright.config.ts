import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./my-source-code/my-e2e-tests",
  testMatch: "**/*.@(spec|test|e2e)?(.playwright).?(c|m)[jt]s?(x)",
  fullyParallel: true,
  reporter: [
    [
      'list',
    ],
    [
      'html',
      { open: 'never' },
    ],
    [
      'json',
      { outputFile: 'test-results/json.json' },
    ],
    [
      'junit',
      { outputFile: 'test-results/junit.xml' },
    ],
  ],
  use: {
    baseURL: process.env.PS_PORTAL_BASE_URL,
    trace: "off", // WITH SUCH A SENSITIVE WEB APPLICATION, PROBABLY BEST TO LEAVE ALL RECORDING OFF BY DEFAULT.
    video: "off", // WITH SUCH A SENSITIVE WEB APPLICATION, PROBABLY BEST TO LEAVE ALL RECORDING OFF BY DEFAULT.
    screenshot: "off", // WITH SUCH A SENSITIVE WEB APPLICATION, PROBABLY BEST TO LEAVE ALL RECORDING OFF BY DEFAULT.
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.playwright-setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: 'playwright-auth/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright-auth/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
        storageState: 'playwright-auth/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
