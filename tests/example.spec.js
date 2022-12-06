// @ts-check
const { test, expect } = require('@playwright/test');

//Create teams
test('Create team', async ({ page }) => {
  await page.goto('https://b.hr.dmerej.info/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/HR DB/);

  // create a locator
  const getStarted = page.getByRole('link', { name: 'Create new team' });

  // Click the get started link.
  await getStarted.click();
  
  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*add_team/);

  // Fill the form.
  await page.fill('input[name="name"]', 'Test Team');

  // Click the submit button.
  await page.click('button:has-text("Add")');

  //Go to the page Teams
  await page.goto('https://b.hr.dmerej.info/teams');

  //Expect the page to contain the name of the team
  await expect(page.locator('table > tbody > tr').last()).toContainText('Test Team');

});