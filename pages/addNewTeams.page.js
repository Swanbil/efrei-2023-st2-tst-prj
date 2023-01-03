import { expect, Locator, Page } from '@playwright/test';
export class AddNewTeamsPage {
    url = "https://b.hr.dmerej.info/add_team";
    page;

    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(this.url);
    }
}