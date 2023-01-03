import { expect, Locator, Page } from '@playwright/test';
export class ListTeamPage {
    url = "https://b.hr.dmerej.info/teams";
    page;

    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(this.url);
    }
}