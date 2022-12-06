// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://b.hr.dmerej.info/');
});

test('homepage has title and links to list employees page', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/HR DB/);

  // create a locator
  const getStarted = page.getByRole('link', { name: 'List Employees' });

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute('href', '/employees');

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*employees/);
});

test('Create an employee', async ({ page }) => {
  const pageNewemployee = page.getByRole('link', { name: 'Add new employee' });
  await pageNewemployee.click();

  const employee = {
    name: "employee1",
    email: "employee1@email.com",
    address: "11 rue test",
    city: "Tokyo",
    zipCode: "11000",
    hiringDate: "2000-05-25",
    jobTitle: "Testor"
  };
  await page.getByPlaceholder('Name').fill(employee.name);

  await page.getByPlaceholder('Email').fill(employee.email);

  await page.locator('input[name=address_line1] >> visible=true').fill(employee.address);

  await page.getByPlaceholder('Zip code').fill(employee.zipCode);

  await page.getByPlaceholder('City').fill(employee.city);

  await page.locator('input[name=hiring_date] >> visible=true').fill(employee.hiringDate);

  await page.getByLabel('Job title').fill(employee.jobTitle);

  await page.getByRole('button', { name: 'Add' }).click();

  //return to list employee
  await page.goto('https://b.hr.dmerej.info/employees');

  //test if the list employee contain the new user
  await expect(page.locator('table > tbody > tr').last()).toContainText(employee.name + " " + employee.email);

})
