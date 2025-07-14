import { type Locator, type Page } from "playwright/test";

const getGridHeaderTitlePlaywrightLocator = async (playwrightLocatorOrPage: Locator | Page): Promise<Locator> => {
    return await playwrightLocatorOrPage
        .getByRole('heading')
        .and(playwrightLocatorOrPage.locator('.ps_grid-title'));
};

export { getGridHeaderTitlePlaywrightLocator };