// @ts-check
const { test, expect } = require('@playwright/test');
import { HomePage } from '../pages/home.page';
import { AddNewEmployeePage } from '../pages/addNewEmployee.page';
import { AddNewTeamsPage } from '../pages/addNewTeams.page';
import { ListEmployeePage } from '../pages/listEmployee.page';
import { ListTeamPage } from '../pages/listTeams.page';
import { ResetDatabasePage } from '../pages/resetDatabase.page';

test.beforeEach(async ({ page }) => {
  const resetDbPage = new ResetDatabasePage(page);
  await resetDbPage.goto();
  await resetDbPage.resetDatabase();

  const homepage = new HomePage(page);
  await homepage.goto();
});

//Create teams
test('Create team', async ({ page }) => {
  const addNewTeamsPage = new AddNewTeamsPage(page)
  await addNewTeamsPage.goto();

  const team = {
    name: 'Test Team',
  };

  await addNewTeamsPage.createTeam(team);

  //Return to list Teams
  const listTeamPage = new ListTeamPage(page);
  await listTeamPage.goto();

  //Expect the page to contain the name of the team
  await expect(listTeamPage.page.locator('table > tbody > tr').last()).toContainText('Test Team');

});

test('Display team', async ({ page }) => {
  const addNewTeamsPage = new AddNewTeamsPage(page)
  await addNewTeamsPage.goto();
  const team = {
    name: 'Test Team',
  };
  await addNewTeamsPage.createTeam(team);

  const listTeamPage = new ListTeamPage(page);
  await listTeamPage.goto();
  const listTeams = await listTeamPage.getListTeams();

  let tableLocator = await listTeamPage.page.locator('tbody tr');
  let listExpectedTeams = []
  for (const el of await tableLocator.elementHandles()) {
    listExpectedTeams.push('Test Team');
  }
  await expect(listTeams).toEqual(listExpectedTeams);
});


test('Display team members', async ({ page }) => {
  const addNewTeamsPage = new AddNewTeamsPage(page)
  await addNewTeamsPage.goto();
  const team = {
    name: 'Test Team',
  };
  await addNewTeamsPage.createTeam(team);

  const addNewEmployeePage = new AddNewEmployeePage(page)
  await addNewEmployeePage.goto();
  const employee = {
    name: "employee1",
    email: "employee1@email.com",
    address: "11 rue test",
    city: "Tokyo",
    zipCode: "11000",
    hiringDate: "2000-05-25",
    jobTitle: "Testor"
  };
  await addNewEmployeePage.createEmployee(employee);

  const listEmployeePage = new ListEmployeePage(page);
  await listEmployeePage.goto();
  const pageEdit = await listEmployeePage.page.locator('table > tbody > tr').last().locator('a:has-text("Edit")');
  await pageEdit.click();
  const linkAddToTeam = await listEmployeePage.page.getByRole('link', { name: 'Add to team' });
  await linkAddToTeam.click();

  await listEmployeePage.page.locator('.form-select').selectOption({ label: team.name + ' team' })
  await listEmployeePage.page.getByRole('button', { name: 'Add' }).click();

  const listTeamPage = new ListTeamPage(page);
  await listTeamPage.goto();
  await listTeamPage.goToListLastTeamMembers();
  const listMembers = await listTeamPage.getListTeamMembers();

  await expect(listMembers[0]).toBe(('employee1'));

});

test('Delete empty team', async ({ page }) => {
  const pageTeams = page.getByRole('link', { name: 'List teams' });
  await pageTeams.click();
  await expect(page).toHaveURL(/.*teams/);

  const pageDelete = page.locator('tr').last().locator('a:has-text("Delete")');
  await pageDelete.click();

  const pageConfirmDelete = page.locator('button:has-text("Proceed")');
  await pageConfirmDelete.click();

  await expect(page).toHaveURL(/.*teams/);
});

test('Create an employee', async ({ page }) => {
  const addNewEmployeePage = new AddNewEmployeePage(page)
  await addNewEmployeePage.goto();
  const employee = {
    name: "employee1",
    email: "employee1@email.com",
    address: "11 rue test",
    city: "Tokyo",
    zipCode: "11000",
    hiringDate: "2000-05-25",
    jobTitle: "Testor"
  };
  await addNewEmployeePage.createEmployee(employee);

  //return to list employee
  const listEmployeePage = new ListEmployeePage(page);
  await listEmployeePage.goto();

  //test if the list employee contain the new user
  await expect(listEmployeePage.page.locator('table > tbody > tr').last()).toContainText(employee.name + " " + employee.email);

})

test('List all employees with correct informations', async ({ page }) => {
  const listEmployeePage = new ListEmployeePage(page);
  await listEmployeePage.goto();

  let tableLocator = await page.locator('tbody tr');
  const employee = ["employee1", "employee1@email.com", "no", "Edit", "Delete"]

  let listEmployees = await listEmployeePage.getListEmployee();
  let listExpectedEmployees = [];
  for (const el of await tableLocator.elementHandles()) {
    listExpectedEmployees.push(employee.join('-'));
  }
  await expect(listEmployees).toEqual(listExpectedEmployees);
});

// Promote as manager
test('Promote as manager', async ({ page }) => {
  const addNewEmployeePage = new AddNewEmployeePage(page)
  await addNewEmployeePage.goto();
  const employee = {
    name: "employee1",
    email: "employee1@email.com",
    address: "11 rue test",
    city: "Tokyo",
    zipCode: "11000",
    hiringDate: "2000-05-25",
    jobTitle: "Testor"
  };
  await addNewEmployeePage.createEmployee(employee);
  const listEmployeePage = new ListEmployeePage(page);
  await listEmployeePage.goto();
  await listEmployeePage.promoteAsManager();
  const promoted = await page.locator('table > tbody > tr').last().locator('td').nth(2).textContent();
  expect(promoted).toContain("yes");
});

test('Access to the edit function', async ({ page }) => {
  const addNewEmployeePage = new AddNewEmployeePage(page)
  await addNewEmployeePage.goto();

  const employee = {
    name: "employee1",
    email: "employee1@email.com",
    address: "11 rue test",
    city: "Tokyo",
    zipCode: "11000",
    hiringDate: "2000-05-25",
    jobTitle: "Testor"
  };

  await addNewEmployeePage.createEmployee(employee);

  const listEmployeePage = new ListEmployeePage(page);
  await listEmployeePage.goto();

  await listEmployeePage.goToLastEmployeeEditPage();

  //Check if the page is the edit page
  await expect(page.locator('text=Edit employee')).toBeVisible();
})

test('Edit an employee', async ({ page }) => {

})

// Return to home page
test('Return to home page', async ({ page }) => {
  const listEmployeePage = new ListEmployeePage(page);
  await listEmployeePage.returnToHomePage();
  await expect(page).toHaveURL('https://b.hr.dmerej.info/');
});

// display employee info before deletion
test('display employee info before deletion', async ({ page }) => {
  const addNewEmployeePage = new AddNewEmployeePage(page)
  await addNewEmployeePage.goto();
  const employee = {
    name: "employee1",
    email: "employee1@email.com",
    address: "11 rue test",
    city: "Tokyo",
    zipCode: "11000",
    hiringDate: "2000-05-25",
    jobTitle: "Testor"
  };
  await addNewEmployeePage.createEmployee(employee);
  const listEmployeePage = new ListEmployeePage(page);
  await listEmployeePage.pressDeleteButton();
  const info = await page.locator('p').first().textContent();
  expect(info).toContain("name: employee1");
  expect(info).toContain("email: employee1@email.com");
});
