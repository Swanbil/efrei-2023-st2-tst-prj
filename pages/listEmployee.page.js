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
    async updateEmployeeAddress(street, zipCode, city) {
        await this.page.locator('input[name=address_line1] >> visible=true').fill(street);
        await this.page.getByPlaceholder('Zip code').fill(zipCode);
        await this.page.getByPlaceholder('City').fill(city);
        await this.page.getByRole('button', { name: 'Update' }).click();
    }

    async addEmployeeToTeam(teamName) {
        await this.page.locator('table > tbody > tr').last().getByRole('link', { name: 'Edit' }).click();
        await this.page.getByRole('link', { name: 'Add to team' }).click();
        await this.page.locator('.form-select').selectOption({ label: teamName + ' team' })
        await this.page.getByRole('button', { name: 'Add' }).click();
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
    async pressUpdateButton() {
        await this.page.getByRole('button', { name: 'Update' }).click()
    }
    async pressProceedButton(){
        await this.page.getByRole('button', { name: 'Proceed' }).click();
    }
}