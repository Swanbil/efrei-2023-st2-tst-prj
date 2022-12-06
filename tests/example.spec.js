// @ts-check
const { test, expect } = require('@playwright/test');

test('homepage has title and links to intro page', async ({ page }) => {
  await page.goto('https://b.hr.dmerej.info/');

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
