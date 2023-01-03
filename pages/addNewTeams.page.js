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

    async createTeam(team) {
        // Fill the form.
        await this.page.fill('input[name="name"]', team.name);

        // Click the submit button.
        await this.page.click('button:has-text("Add")');
    }
}