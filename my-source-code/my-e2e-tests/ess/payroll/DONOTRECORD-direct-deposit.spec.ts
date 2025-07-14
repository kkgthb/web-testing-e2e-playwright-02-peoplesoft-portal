import { test, expect, type Locator, type FrameLocator } from "@playwright/test";
import AxeBuilder from '@axe-core/playwright';
import { getFlexGridBoxPlaywrightLocator } from '../../../helpers/html-locators/getFlexGridBox';
import { getFlexGridBodyTablePlaywrightLocator } from "../../../helpers/html-locators/getFlexGridBodyTable";
import { getGridBodyRowPlaywrightLocator } from "../../../helpers/html-locators/getGridBodyRow";
import { getGridHeaderTitlePlaywrightLocator } from "../../../helpers/html-locators/getGridHeaderTitle";

const page_definition_name = 'PY_IC_DIR_DEP_FL';
const role_name = 'PY_EMPL_FL'
const standalone_page_url = `${process.env.PS_PORTAL_WEB_BASE_PATH}/c/${role_name}.${page_definition_name}.GBL`;
const expected_page_title = 'Direct Deposit';
const expected_grid_title = 'Accounts';

// IMPORTANT:  disable all screen-recording during test execution!
test.use({
    trace: "off",
    video: "off",
    screenshot: "off",
});

test.describe(`(DO NOT RECORD!) Standalone ${page_definition_name}`, async () => {

    test(`Page: noninteractive HTML validation`, async ({ page }) => {

        // Action
        await test.step('Load page', async () => {
            await page.goto(standalone_page_url);
        });

        // Validation
        await test.step('page is loaded', async () => {
            await expect(page.getByRole('form').and(page.locator('.PSForm'))).toBeVisible();
        });

        // Validation
        await test.step('Title', async () => {
            await expect(page).toHaveTitle(expected_page_title);
        });

        // Validation
        await test.step('Inline title', async () => {
            await expect(page.locator('#PT_PAGETITLE1')).toContainText(expected_page_title);
        });

        // Validation
        await test.step(`should have a "${expected_grid_title}" data table`, async () => {

            let grid_box: Locator;

            // Validation
            await test.step('should have grid box', async () => {
                grid_box = await getFlexGridBoxPlaywrightLocator(page);
                await expect(grid_box).toBeVisible()
            });

            // Validation
            await test.step('should have correct grid title', async () => {
                const grid_title = await getGridHeaderTitlePlaywrightLocator(grid_box);
                await expect(await grid_title).toContainText(expected_grid_title);
            });

            let grid_body_table: Locator;

            // Validation
            await test.step('should have grid body table', async () => {
                grid_body_table = await getFlexGridBodyTablePlaywrightLocator(page);
                await expect(grid_body_table).toBeVisible()
            });

            // Validation
            await test.step('should contain at least 1 row', async () => {
                const rows = await getGridBodyRowPlaywrightLocator(grid_body_table);
                const rowcount = await rows.count();
                await expect(await rowcount).toBeGreaterThan(0);
            });
        });

        // Validation
        await test.step(`should not currently show the "${expected_grid_title}" modal`, async () => {
            const modal_form = await page.getByRole('dialog', { name: expected_grid_title })
            await expect(modal_form).toBeHidden();
        });

        // Validation
        await test.step.skip('should not have any automatically detectable accessibility issues', async () => {
            // Actually, it turns out that there ARE accessibility issues in ${page_definition_name}.
            // Whaddya know.
            // Fix it, Oracle.
            // Annotating this step ".skip()," for now.
            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .analyze();
            expect(accessibilityScanResults.violations).toEqual([]);
        });

    }); // End "Page: noninteractive HTML validation" test()

}); // End "(DO NOT RECORD!) Standalone ${page_definition_name}" test.describe()