//home.page.ts
import { expect, Locator, Page } from '@playwright/test';
export class AddNewEmployeePage {
    url = "https://b.hr.dmerej.info/add_employee";
    page;

    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(this.url);
    }
    async createEmployee(employee) {
        await this.page.getByPlaceholder('Name').fill(employee.name);

        await this.page.getByPlaceholder('Email').fill(employee.email);

        await this.page.locator('input[name=address_line1] >> visible=true').fill(employee.address);

        await this.page.getByPlaceholder('Zip code').fill(employee.zipCode);

        await this.page.getByPlaceholder('City').fill(employee.city);

        await this.page.locator('input[name=hiring_date] >> visible=true').fill(employee.hiringDate);

        await this.page.getByLabel('Job title').fill(employee.jobTitle);

        await this.page.getByRole('button', { name: 'Add' }).click();
    }
}