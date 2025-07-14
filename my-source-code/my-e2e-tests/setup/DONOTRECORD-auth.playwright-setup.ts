import { test as setup, expect, chromium, type Page, type Browser, type BrowserContext, type Locator } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../../../playwright-auth/.auth/user.json');

// STRONGLY SUGGESTED:  disable all screen-recording during setup execution
setup.use({
    trace: "off",
    video: "off",
    screenshot: "off",
});

setup('authenticate', async () => {

    if (!!fs.existsSync(authFile)) {
        console.log('Authentication file already exists. Skipping setup.');
        return; // Short-circuit
    }

    let browser: Browser;
    let page: Page;


    await setup.step('Connect to pre-authenticated browser', async () => {

        try {
            browser = await chromium.connectOverCDP('http://localhost:9222');
        }
        catch (e) {
            //if (e.name === 'Error' && e.message === 'browserType.connectOverCDP: connect ECONNREFUSED 127.0.0.1:9222') {
            browser = await chromium.launch({
                headless: false,
                args: ['--remote-debugging-port=9222'],
            });
            //}
        }

        let defaultContext: BrowserContext;
        if (browser.contexts().length > 0) {
            defaultContext = browser.contexts()[0];
        } else {
            defaultContext = await browser.newContext();
        }

        if (defaultContext.pages().length > 0) {
            page = defaultContext.pages()[0];
        } else {
            page = await defaultContext.newPage();
        }

    });

    let logged_in_evidence: Locator;
    let need_to_log_in_evidence: Locator;

    await setup.step('Return to the landing page (which prompts for login if necessary)', async () => {
        await page.goto(`${process.env.PS_PORTAL_WEB_BASE_PATH}/c/NUI_FRAMEWORK.PT_LANDINGPAGE.GBL`);
    });

    await setup.step('Detect which page we are on', async () => {
        logged_in_evidence = await page.getByRole('form').and(page.locator('.PSForm'));
        need_to_log_in_evidence = await page.locator('div.signonMain');
    });

    await setup.step('Log in if necessary', async () => {
        if (await logged_in_evidence.count() === 0 && await need_to_log_in_evidence.count() > 0) {
            await page.pause();
            // Don't forget to click "resume" in the Playwright Inspector that pops up once you're logged in!
        }
    });

    await setup.step('Validate we are properly logged in', async () => {
        await expect(logged_in_evidence).toBeVisible();
    });

    await setup.step('Write cookies and such to disk', async () => {
        await page.context().storageState({ path: authFile });
    });

});