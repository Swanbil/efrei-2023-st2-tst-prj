// @ts-check
const { test, expect } = require('@playwright/test');
import { HomePage } from '../pages/home.page';
import { AddNewEmployeePage } from '../pages/addNewEmployee.page';
import { AddNewTeamsPage } from '../pages/addNewTeams.page';
import { ListEmployeePage } from '../pages/listEmployee.page';
import { ListTeamPage } from '../pages/listTeams.page';
import { ResetDatabasePage } from '../pages/resetDatabase.page';

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

    await expect(listEmployeePage.page.locator('table > tbody > tr').last()).toContainText(employee.name + " " + employee.email);
  });
  test('List all employees with correct informations', async ({ page }) => {
    const addNewEmployeePage = new AddNewEmployeePage(page)
    await addNewEmployeePage.goto();
    const newEmployee = {
      name: "employee1",
      email: "employee1@email.com",
      address: "11 rue test",
      city: "Tokyo",
      zipCode: "11000",
      hiringDate: "2000-05-25",
      jobTitle: "Testor"
    };
    await addNewEmployeePage.createEmployee(newEmployee);

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();

    const employee = ["employee1", "employee1@email.com", "no", "Edit", "Delete"]

    let listEmployees = await listEmployeePage.getListEmployee();
    let listExpectedEmployees = [employee.join('-')];
    await expect(listEmployees).toEqual(listExpectedEmployees);
  });

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
    await expect(promoted).toContain("yes");
  });

  test('Edit an employee basic info', async ({ page }) => {
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
    await listEmployeePage.goToBasincInfoPage();

    //Fill new Name and Email
    await page.getByPlaceholder('Name').fill('newEmployee1');
    await page.getByPlaceholder('Email').fill('newemployee1@email.com');

    //Click on button "Update"
    const updateButton = page.getByRole('button', { name: 'Update' });
    await updateButton.click();

    //Check if the new name and email are displayed
    await listEmployeePage.goto();
    await expect(listEmployeePage.page.locator('table > tbody > tr').last()).toContainText('newEmployee1');
  });

  test('Update employee address', async ({ page }) => {
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

    await listEmployeePage.goToAddressPage();
    await page.locator('input[name=address_line1] >> visible=true').fill("20 rue test");
    await page.getByPlaceholder('Zip code').fill('12000');
    await page.getByPlaceholder('City').fill('Paris');

    const updateButton = page.getByRole('button', { name: 'Update' });
    await updateButton.click();
    await listEmployeePage.goto();
    await listEmployeePage.goToLastEmployeeEditPage();
    await listEmployeePage.goToAddressPage();
    await expect(page.locator('text=20 rue test')).toBeTruthy();
  })

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
  });

  test('Display employee info before deletion', async ({ page }) => {
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
    await expect(info).toContain("name: employee1");
    await expect(info).toContain("email: employee1@email.com");
  });

  test('Add an employee to a team', async ({ page }) => {
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
    await page.locator('table > tbody > tr').last().getByRole('link', { name: 'Edit' }).click();
    await page.getByRole('link', { name: 'Add to team' }).click();
    await page.locator('.form-select').selectOption({ label: 'Test Team' + ' team' })
    await page.getByRole('button', { name: 'Add' }).click();

    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    await listTeamPage.goToListLastTeamMembers();
    const listMembers = await listTeamPage.getListTeamMembers();

    await expect(listMembers[0]).toBe(('employee1'));

  })

  test('Deletion interface of an employee is visible', async({page}) => {
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
    await expect(listEmployeePage.page.getByRole('link', { name: 'Delete' })).toBeVisible()
  })
   test('Change employee team', async ({ page }) => {
    const addNewTeamsPage = new AddNewTeamsPage(page)
    await addNewTeamsPage.goto();
    const team1 = {
      name: 'Test Team',
    };
    const team2 = {
      name: 'Olympique Marseille',
    };
    await addNewTeamsPage.createTeam(team1);
    await addNewTeamsPage.goto();
    await addNewTeamsPage.createTeam(team2);

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
    await page.locator('table > tbody > tr').last().getByRole('link', { name: 'Edit' }).click();
    await page.getByRole('link', { name: 'Add to team' }).click();
    await page.locator('.form-select').selectOption({ label: team1.name + ' team' })
    await page.getByRole('button', { name: 'Add' }).click();
    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    await listTeamPage.goToListFirstTeamMembers();
    let listMembers = await listTeamPage.getListTeamMembers();
    await expect(listMembers[0]).toBe(('employee1'));

    await listEmployeePage.goto();
    await page.locator('table > tbody > tr').last().getByRole('link', { name: 'Edit' }).click();
    await page.getByRole('link', { name: 'Add to team' }).click();
    await page.locator('.form-select').selectOption({ label: team2.name + ' team' })
    await page.getByRole('button', { name: 'Add' }).click();
    
    await listTeamPage.goto();
    await listTeamPage.goToListLastTeamMembers();
    listMembers = await listTeamPage.getListTeamMembers();

    await expect(listMembers[0]).toBe(('employee1'));
  });
   test('Delete an employee', async ({ page }) => {
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
    await listEmployeePage.pressDeleteButton()
    await listEmployeePage.page.getByRole('button', { name: 'Proceed' }).click();

    await listEmployeePage.goto();

    await expect(listEmployeePage.page.locator('body')).toContainText('No employees yet');
  });
});



test.describe("Team", () => {
  test('Create team', async ({ page }) => {
    const addNewTeamsPage = new AddNewTeamsPage(page)
    await addNewTeamsPage.goto();

    const team = {
      name: 'Test Team',
    };

    await addNewTeamsPage.createTeam(team);
    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
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

    let listExpectedTeams = ['Test Team']
    await expect(listTeams).toEqual(listExpectedTeams);
  });

  test('Delete empty team', async ({ page }) => {
    const addNewTeamsPage = new AddNewTeamsPage(page)
    await addNewTeamsPage.goto();
    const team = {
      name: 'Test Team',
    };
    await addNewTeamsPage.createTeam(team);

    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();

    await page.locator('table > tbody > tr').last().locator('a:has-text("Delete")').click();
    await page.locator('button:has-text("Proceed")').click();

    await expect(listTeamPage.page.locator('body')).toContainText('No teams yet');
  })

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
    await page.locator('table > tbody > tr').last().getByRole('link', { name: 'Edit' }).click();
    await page.getByRole('link', { name: 'Add to team' }).click();
    await page.locator('.form-select').selectOption({ label: 'Test Team' + ' team' })
    await page.getByRole('button', { name: 'Add' }).click();

    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    await listTeamPage.goToListLastTeamMembers();
    const listMembers = await listTeamPage.getListTeamMembers();

    await expect(listMembers[0]).toBe(('employee1'));
  });

  test('Delete a team with members', async ({ page }) => {
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
    await page.locator('table > tbody > tr').last().getByRole('link', { name: 'Edit' }).click();
    await page.getByRole('link', { name: 'Add to team' }).click();
    await page.locator('.form-select').selectOption({ label: 'Test Team' + ' team' })
    await page.getByRole('button', { name: 'Add' }).click();

    const listTeamPage = new ListTeamPage(page);
    await listTeamPage.goto();
    await page.locator('table > tbody > tr').last().locator('a:has-text("Delete")').click();
    await page.locator('button:has-text("Proceed")').click();

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

    const resetDbPage = new ResetDatabasePage(page);
    await resetDbPage.goto();
    await resetDbPage.resetDatabase();

    const listEmployeePage = new ListEmployeePage(page);
    await listEmployeePage.goto();

    await expect(listEmployeePage.page.locator('body')).toContainText('No employees yet');
  });

});








