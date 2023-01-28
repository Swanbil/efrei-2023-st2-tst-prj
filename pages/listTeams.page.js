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
    async goToListFirstTeamMembers() {
        const linkViewMembers = this.page.getByRole('link', { name: 'View members' }).first();
        await linkViewMembers.click();
    }

    async goToListLastTeamMembers() {
        const linkViewMembers = this.page.getByRole('link', { name: 'View members' }).last();
        await linkViewMembers.click();
    }

    async getListTeams() {
        let tableLocator = this.page.locator('tbody > tr');
        let listTeams = [];
        const rowCount = await tableLocator.count();
        for (let i = 0; i < rowCount; i++) {
            listTeams.push(await tableLocator.nth(i).locator('td').nth(0).innerText())
        }
        return listTeams;
    }

    async getListTeamMembers() {
        let tableLocator = this.page.locator('ul > li');
        let listTeamMembers = [];
        const rowCount = await tableLocator.count();
        for (let i = 0; i < rowCount; i++) {
            listTeamMembers.push(await tableLocator.nth(i).innerText())
        }
        return listTeamMembers;

    }

}