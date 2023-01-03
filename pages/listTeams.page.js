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

    async goToListLastTeamMembers() {
        const linkViewMembers = this.page.getByRole('link', { name: 'View members' }).last();
        await linkViewMembers.click();
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

    async getListTeamMembers(){
        let tableLocator = await this.page.locator('ul li');
        let listTeamMembers = [];
        for (const el of await tableLocator.elementHandles()) {
            const listElement = await el.innerText();
            listTeamMembers.push(listElement);
        }
        return listTeamMembers;

    }

}