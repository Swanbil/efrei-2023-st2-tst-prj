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
    async promoteAsManager() {
        const pageEdit = this.page.getByRole('link', { name: 'Edit' }).last();
        await pageEdit.click();
        const promoteButton = this.page.getByRole('link', { name: 'Promote as manager' });
        await promoteButton.click();
        const proceedButton = this.page.getByRole('button', { name: 'Proceed' });
        await proceedButton.click();
    }

    async goToLastEmployeeEditPage() {
        const pageEdit = await this.page.locator('table > tbody > tr').last().locator('a:has-text("Edit")');
        await pageEdit.click();
    }
}