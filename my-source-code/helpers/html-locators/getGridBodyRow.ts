import { type Locator, type Page } from "playwright/test";

const getGridBodyRowPlaywrightLocator = async (playwrightLocatorOrPage: Locator | Page): Promise<Locator> => {
    return await playwrightLocatorOrPage
        .getByRole('row')
        .and(playwrightLocatorOrPage.locator('.ps_grid-row'));
};

export { getGridBodyRowPlaywrightLocator };