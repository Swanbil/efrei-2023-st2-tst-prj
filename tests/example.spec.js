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

test('homepage has title and links to list teams page', async ({ page }) => {
  const getStarted = page.getByRole('link', { name: 'List teams' });
  await expect(getStarted).toHaveAttribute('href', '/teams');
  await getStarted.click();
  await expect(page).toHaveURL(/.*teams/);
  const row1 = page.locator('tr:has-text("teamtest")');
  await expect(row1).toEqual('teamtest'); // marche pas
});
