import { type Locator, type Page } from "playwright/test";

const getFlexGridBoxPlaywrightLocator = async (playwrightLocatorOrPage: Locator | Page): Promise<Locator> => {
    return await playwrightLocatorOrPage.locator('.ps_box-grid-flex');
};

export { getFlexGridBoxPlaywrightLocator };