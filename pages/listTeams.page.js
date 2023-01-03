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

    async getListTeams() {
        let tableLocator = await this.page.locator('tbody tr');
        let listTeams = [];
        for (const el of await tableLocator.elementHandles()) {
            const row = await el.innerText();
            listTeams.push(row.toString().replace(/\t/g, '-').split('-')[0]);
        }
        return listTeams;

    }
}