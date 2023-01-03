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

    async getListEmployee() {
        let tableLocator = await this.page.locator('tbody tr');
        let listEmployees = [];
        for (const el of await tableLocator.elementHandles()) {
            const row = await el.innerText();
            listEmployees.push(row.toString().replace(/\t/g, '-'));
        }
        return listEmployees;
    }
}