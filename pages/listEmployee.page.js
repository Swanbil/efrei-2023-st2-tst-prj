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
        let tableLocator = this.page.locator('tbody tr');
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
        const pageEdit = this.page.locator('table > tbody > tr').last().locator('a:has-text("Edit")');
        await pageEdit.click();
    }

    async returnToHomePage() {
        const pageEdit = this.page.getByRole('link', { name: 'Home' });
        await pageEdit.click();
    }

    async pressDeleteButton() {
        await this.page.getByRole('link', { name: 'Delete' }).click();
    }
    async goToBasincInfoPage() {
        const updateBasicInfoLink = this.page.locator('a:has-text("Update basic info")');
        await updateBasicInfoLink.click();
    }

    async goToAddressPage() {
        const updateAddressLink = this.page.locator('a:has-text("Update address")');
        await updateAddressLink.click();
    }
}