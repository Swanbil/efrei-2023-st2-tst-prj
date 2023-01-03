import { expect, Locator, Page } from '@playwright/test';
export class ResetDatabasePage {
    url = "https://b.hr.dmerej.info/reset_fb";
    page;

    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(this.url);
    }
}