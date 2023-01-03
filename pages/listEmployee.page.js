import { expect, Locator, Page } from '@playwright/test';
export class ListEmployeePage {
    url = "https://b.hr.dmerej.info/employees";
    page;

    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(this.url);
    }
}