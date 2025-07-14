import { type Locator, type Page } from "playwright/test";

const getFlexGridBodyTablePlaywrightLocator = async (playwrightLocatorOrPage: Locator | Page): Promise<Locator> => {
    return await playwrightLocatorOrPage
        .getByRole('table')
        .and(playwrightLocatorOrPage.locator('.ps_grid-flex'));
};

export { getFlexGridBodyTablePlaywrightLocator };