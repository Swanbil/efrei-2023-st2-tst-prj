const { test, expect } = require('@playwright/test');
import { HomePage } from '../pages/home.page';
import { AddNewEmployeePage } from '../pages/addNewEmployee.page';
import { AddNewTeamsPage } from '../pages/addNewTeams.page';
import { ListEmployeePage } from '../pages/listEmployee.page';
import { ListTeamPage } from '../pages/listTeams.page';
import { ResetDatabasePage } from '../pages/resetDatabase.page';
import { fakeEmployee1, fakeTeam1, fakeTeam2 } from './datas/fake-datas';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }, testInfo) => {
  const resetDbPage = new ResetDatabasePage(page);
  await resetDbPage.goto();
  await resetDbPage.resetDatabase();
  const homepage = new HomePage(page);
  await homepage.goto();
});

test.describe("Employee", () => {
  test('Create an employee', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();

    await expect(listEmployeePage.page.locator('table > tbody > tr').last()).toContainText(fakeEmployee1.name + " " + fakeEmployee1.email);
  });
  test('List all employees with correct informations', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();

    const employee = ["employee1", "employee1@email.com", "no", "Edit", "Delete"]

    let listEmployees = await listEmployeePage.getListEmployee();
    let listExpectedEmployees = [employee.join('-')];
    expect(listEmployees).toEqual(listExpectedEmployees);
  });

  test('Promote as manager', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);
    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();
    await listEmployeePage.promoteAsManager();
    const promoted = await page.locator('table > tbody > tr').last().locator('td').nth(2).textContent();
    await expect(promoted).toContain("yes");
  });

  test('Edit an employee basic info', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();

    await listEmployeePage.goToLastEmployeeEditPage();
    await listEmployeePage.goToBasincInfoPage();
    await page.getByPlaceholder('Name').fill('newEmployee1');
    await page.getByPlaceholder('Email').fill('newemployee1@email.com');
    await listEmployeePage.pressUpdateButton();

    await listEmployeePage.goto();
    await expect(listEmployeePage.page.locator('table > tbody > tr').last()).toContainText('newEmployee1');
  });

  test('Update employee address', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();

    await listEmployeePage.goToLastEmployeeEditPage();

    await listEmployeePage.goToAddressPage();
    await listEmployeePage.updateEmployeeAddress("20 rue test", "75013", "Paris");
    await listEmployeePage.goto();
    await listEmployeePage.goToLastEmployeeEditPage();
    await listEmployeePage.goToAddressPage();
    expect(page.locator('text=20 rue test')).toBeTruthy();
  })

  test('Access to the edit function', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();
    await listEmployeePage.goToLastEmployeeEditPage();
    await expect(page.locator('text=Edit employee')).toBeVisible();
  });

  test('Display employee info before deletion', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);
    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.pressDeleteButton();
    const info = await page.locator('p').first().textContent();
    expect(info).toContain(`name: ${fakeEmployee1.name}`);
    expect(info).toContain(`email: ${fakeEmployee1.email}`);
  });

  test('Add an employee to a team', async ({ page }) => {
    const addNewTeamsPage = new AddNewTeamsPage(page)
    await addNewTeamsPage.goto();
    await addNewTeamsPage.createTeam(fakeTeam1);

    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();
    await listEmployeePage.addEmployeeToTeam(fakeTeam1.name)

    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    await listTeamPage.goToListLastTeamMembers();
    const listMembers = await listTeamPage.getListTeamMembers();

    expect(listMembers[0]).toBe(('employee1'));
  });

  test('Deletion interface of an employee is visible', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);
    const listEmployeePage = new ListEmployeePage(page);
    await expect(listEmployeePage.page.getByRole('link', { name: 'Delete' })).toBeVisible()
  })
  test('Change employee team', async ({ page }) => {
    const addNewTeamsPage = new AddNewTeamsPage(page)
    await addNewTeamsPage.goto();
    await addNewTeamsPage.createTeam(fakeTeam1);
    await addNewTeamsPage.goto();
    await addNewTeamsPage.createTeam(fakeTeam2);

    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();
    await listEmployeePage.addEmployeeToTeam(fakeTeam1.name)

    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    await listTeamPage.goToListFirstTeamMembers();
    let listMembers = await listTeamPage.getListTeamMembers();
    expect(listMembers[0]).toBe(fakeEmployee1.name);

    await listEmployeePage.goto();
    await listEmployeePage.addEmployeeToTeam(fakeTeam2.name)
    await listTeamPage.goto();
    await listTeamPage.goToListLastTeamMembers();
    listMembers = await listTeamPage.getListTeamMembers();

    expect(listMembers[0]).toBe(fakeEmployee1.name);
  });
  test('Delete an employee', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);
    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.pressDeleteButton()
    await listEmployeePage.pressProceedButton()
    await listEmployeePage.goto();

    await expect(listEmployeePage.page.locator('body')).toContainText('No employees yet');
  });
});



test.describe("Team", () => {
  test('Create team', async ({ page }) => {
    const addNewTeamsPage = new AddNewTeamsPage(page)
    await addNewTeamsPage.goto();
    await addNewTeamsPage.createTeam(fakeTeam1);
    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    await expect(await listTeamPage.getLastTeamRow()).toContainText('Test Team');
  });

  test('Display team', async ({ page }) => {
    const addNewTeamsPage = new AddNewTeamsPage(page)
    await addNewTeamsPage.goto();
    await addNewTeamsPage.createTeam(fakeTeam1);

    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    const listTeams = await listTeamPage.getListTeams();

    let listExpectedTeams = ['Test Team']
    expect(listTeams).toEqual(listExpectedTeams);
  });

  test('Delete empty team', async ({ page }) => {
    const addNewTeamsPage = new AddNewTeamsPage(page)
    await addNewTeamsPage.goto();
    await addNewTeamsPage.createTeam(fakeTeam1);

    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    await listTeamPage.deleteLastTeam();

    await expect(listTeamPage.page.locator('body')).toContainText('No teams yet');
  })

  test('Display team members', async ({ page }) => {
    const addNewTeamsPage = new AddNewTeamsPage(page)
    await addNewTeamsPage.goto();
    await addNewTeamsPage.createTeam(fakeTeam1);

    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();
    await listEmployeePage.addEmployeeToTeam(fakeTeam1.name)

    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    await listTeamPage.goToListLastTeamMembers();
    const listMembers = await listTeamPage.getListTeamMembers();

    expect(listMembers[0]).toBe(fakeEmployee1.name);
  });

  test('Delete a team with members', async ({ page }) => {
    const addNewTeamsPage = new AddNewTeamsPage(page)
    await addNewTeamsPage.goto();
    await addNewTeamsPage.createTeam(fakeTeam1);

    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();
    await listEmployeePage.addEmployeeToTeam(fakeTeam1.name)

    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    await listTeamPage.deleteLastTeam()
    await expect(listTeamPage.page.locator('body')).toContainText('No teams yet');
  })

});


test.describe("Functionnality", () => {
  test('Return to home page', async ({ page }) => {
    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.returnToHomePage();
    await expect(page).toHaveURL('https://b.hr.dmerej.info/');
  });
  test('Reset database', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    await addNewEmployeePage.createEmployee(fakeEmployee1);

    const resetDbPage = new ResetDatabasePage(page);
    await resetDbPage.goto();
    await resetDbPage.resetDatabase();

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();

    await expect(listEmployeePage.page.locator('body')).toContainText('No employees yet');
  });

});








