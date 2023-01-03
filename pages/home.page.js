import { expect, Locator, Page } from '@playwright/test';
export class HomePage {
    url = "https://b.hr.dmerej.info/";
    page;

    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(this.url);
    }
}