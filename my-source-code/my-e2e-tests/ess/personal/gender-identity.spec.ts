import { test, expect, type Locator, type FrameLocator } from "@playwright/test";
import AxeBuilder from '@axe-core/playwright';
import { getFlexGridBoxPlaywrightLocator } from '../../../helpers/html-locators/getFlexGridBox';
import { getFlexGridBodyTablePlaywrightLocator } from "../../../helpers/html-locators/getFlexGridBodyTable";
import { getGridBodyRowPlaywrightLocator } from "../../../helpers/html-locators/getGridBodyRow";
import { getGridHeaderTitlePlaywrightLocator } from "../../../helpers/html-locators/getGridHeaderTitle";

const page_definition_name = 'HR_EE_GENDER_FL';
const role_name = 'EL_EMPLOYEE_FL'
const standalone_page_url = `${process.env.PS_PORTAL_WEB_BASE_PATH}/c/${role_name}.${page_definition_name}.GBL`;
const expected_page_title = 'Gender Identity';
const expected_grid_title = 'Gender Details';

test.describe(`Standalone ${page_definition_name}`, async () => {

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
        await test.step('should have a gender details data table', async () => {

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
            await test.step('should contain at least 1 gender detail', async () => {
                const rows = await getGridBodyRowPlaywrightLocator(grid_body_table);
                const rowcount = await rows.count();
                await expect(await rowcount).toBeGreaterThan(0);
            });
        });

        // Validation
        await test.step('should not currently show the "Gender Details" modal', async () => {
            const modal_form = await page.getByRole('dialog', { name: 'Gender Details' })
            await expect(modal_form).toBeHidden();
        });

        // Validation
        await test.step('should not have any automatically detectable accessibility issues', async () => {
            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .analyze();
            expect(accessibilityScanResults.violations).toEqual([]);
        });

    }); // End "Page: noninteractive HTML validation" test()

    test('Modal contents: noninteractive HTML validation', async ({ page }) => {

        await test.step('Prereqs to get modal open', async () => {
            // Action
            await test.step('Load page', async () => {
                await page.goto(standalone_page_url);
            });

            // Action
            await test.step('wait for page load', async () => {
                page.getByRole('form').and(page.locator('.PSForm')).waitFor();
            });

            // Action
            await test.step('activate row-1 gender-edit modal', async () => {
                await (await getGridBodyRowPlaywrightLocator(page)).first().click();
            });

            // Action
            await test.step('wait for modal load', async () => {
                page.getByRole('dialog', { name: expected_grid_title }).waitFor();
            });
        });

        const modal_form: Locator = await page.getByRole('dialog', { name: expected_grid_title });

        // Validation
        await test.step('modal exists', async () => {
            // Default timeout is 5 seconds.  Modal can take a while to load, so we'll bump it up to 20, to be safe.
            await expect(modal_form).toBeVisible({ timeout: 20000 });
        });

        const modal_iframe: FrameLocator = await modal_form.frameLocator('iframe');

        // Validation
        await test.step('Inline title correct', async () => {
            await expect(await modal_iframe.locator('#PT_PAGETITLE')).toContainText(expected_grid_title);
        });

        // Validation
        await test.step('cancel button exists', async () => {
            await expect(await modal_iframe.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
        });

        // Validation
        await test.step('should not have any automatically detectable accessibility issues', async () => {
            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .analyze();
            expect(accessibilityScanResults.violations).toEqual([]);
        });

    }); // End "Modal contents: noninteractive HTML validation" test()

}); // End "Standalone ${page_definition_name}" test.describe()