import { expect, test } from '@playwright/test';

test.describe('storefront smoke paths', () => {
  test('mobile hero entry points to the standard tee path', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This flow is specific to the mobile hero.');

    await page.goto('/');

    await expect(page.getByText('TEES FROM $27.99')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'FREE SHIPPING' }).first()).toBeVisible();

    const heroImageLink = page.locator('a').filter({
      has: page.getByAltText('Sonic Inferno — Standard Tee'),
    }).first();

    await heroImageLink.click();

    await expect(page).toHaveURL(/\/product\/sonic-inferno-standard-tee$/);
    await expect(page.getByText('Flagship Line // Standard', { exact: true })).toBeVisible();
    await expect(page.getByText('Front Print Only', { exact: true }).first()).toBeVisible();
  });

  test('sonic inferno variant switcher reaches the full design tee', async ({ page }) => {
    await page.goto('/product/sonic-inferno-standard-tee');

    await page.getByRole('link', { name: /Full Design \(Front \+ Back\)/i }).click();

    await expect(page).toHaveURL(/\/product\/sonic-inferno-fulldesign-tee$/);
    await expect(page.getByText('Premium Path')).toBeVisible();
  });

  test('cart drawer can reach the local checkout flow', async ({ page }) => {
    await page.goto('/product/sonic-inferno-standard-tee');

    await page.getByRole('button', { name: /YEAH, THIS ONE/i }).first().click();
    await expect(page.getByRole('heading', { name: 'Your Haul' })).toBeVisible();

    await page.getByRole('button', { name: 'COMMIT (FOR ONCE)' }).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByRole('heading', { name: /LET'S DO THIS\./i })).toBeVisible();
  });

  [
    {
      name: 'sonic inferno standard tee',
      path: '/product/sonic-inferno-standard-tee',
      expectedItems: ['Sonic Inferno — Standard Tee', 'ADHD Squirrel Tee'],
    },
    {
      name: 'adhd squirrel tee',
      path: '/product/adhd-squirrel-tee',
      expectedItems: ['ADHD Squirrel Tee', 'Sonic Inferno — Standard Tee'],
    },
    {
      name: 'late diagnosed tee',
      path: '/product/late-diagnosed-tee',
      expectedItems: ['Late Diagnosed Tee', 'Sonic Inferno — Standard Tee'],
    },
  ].forEach(({ name, path, expectedItems }) => {
    test(`bundle CTA completes the set from ${name}`, async ({ page }) => {
      await page.goto(path);

      await page.getByRole('button', { name: 'ADD THE SET.' }).click();

      await expect(page.getByRole('heading', { name: 'Your Haul' })).toBeVisible();

      for (const itemName of expectedItems) {
        await expect(page.locator('h3').filter({ hasText: itemName }).first()).toBeVisible();
      }
    });
  });
});
