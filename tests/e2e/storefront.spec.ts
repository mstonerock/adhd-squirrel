import { expect, test, type Page } from '@playwright/test';

test.describe('storefront smoke paths', () => {
  const expectCartItems = async (page: Page, itemNames: string[]) => {
    await expect(page.getByRole('heading', { name: 'Your Haul' })).toBeVisible();

    for (const itemName of itemNames) {
      await expect(page.locator('h3').filter({ hasText: itemName }).first()).toBeVisible();
    }
  };

  const expectCartBadge = async (page: Page, count: string) => {
    const cartHeader = page.getByRole('heading', { name: 'Your Haul' }).locator('..');
    await expect(cartHeader.getByText(count, { exact: true })).toBeVisible();
  };

  const expectCartSubtotal = async (page: Page, total: string) => {
    const subtotalRow = page.locator('div').filter({ has: page.getByText('Subtotal', { exact: true }) }).last();
    await expect(subtotalRow.locator('span').last()).toHaveText(total);
  };

  test('mobile hero entry points to the standard tee path', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This flow is specific to the mobile hero.');

    await page.goto('/');

    await expect(page.getByText('TEES FROM $23.99')).toBeVisible();
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

  test('upgrade section is legible and navigates to alternate apparel', async ({ page }) => {
    await page.goto('/product/sonic-inferno-standard-tee');

    await expect(page.getByText('GET IT AS', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /CREWNECK.*STANDARD.*\$34\.99/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /HOODIE.*STANDARD.*\$39\.99/i })).toBeVisible();

    await page.getByRole('link', { name: /CREWNECK.*STANDARD.*\$34\.99/i }).click();

    await expect(page).toHaveURL(/\/product\/sonic-inferno-standard-crewneck$/);
  });

  test('cart drawer can reach the local checkout flow', async ({ page }) => {
    await page.goto('/product/sonic-inferno-standard-tee');

    await page.getByRole('button', { name: /YEAH, THIS ONE/i }).first().click();
    await expect(page.getByRole('heading', { name: 'Your Haul' })).toBeVisible();

    await page.getByRole('button', { name: 'COMMIT (FOR ONCE)' }).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByRole('heading', { name: /LET'S DO THIS\./i })).toBeVisible();
  });

  test('footer policy links resolve to real pages', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Shipping Policy' }).click();
    await expect(page).toHaveURL(/\/shipping-policy$/);
    await expect(page.getByRole('heading', { name: /SHIPPING\./i })).toBeVisible();

    await page.goto('/');
    await page.getByRole('link', { name: 'Returns' }).click();
    await expect(page).toHaveURL(/\/returns$/);
    await expect(page.getByRole('heading', { name: /RETURNS\./i })).toBeVisible();
  });

  test('bundles page can add the full set directly', async ({ page }) => {
    await page.goto('/bundles');

    await expect(page.getByRole('heading', { name: /LESS CLICKING\./i })).toBeVisible();
    await page.locator('article').filter({ hasText: 'The Full Set' }).getByRole('button', { name: 'ADD BUNDLE' }).click();

    await expectCartBadge(page, '2');
    await expectCartItems(page, ['Sonic Inferno — Standard Tee', 'ADHD Squirrel Tee']);
    await expectCartSubtotal(page, '$42.99');
  });

  test('bundles page can add diagnosis pack directly', async ({ page }) => {
    await page.goto('/bundles');

    await page.locator('article').filter({ hasText: 'Diagnosis Pack' }).getByRole('button', { name: 'ADD BUNDLE' }).click();

    await expectCartBadge(page, '2');
    await expectCartItems(page, ['Late Diagnosed Tee', 'Sonic Inferno — Standard Tee']);
    await expectCartSubtotal(page, '$42.99');
  });

  test('bundles page can add complete chaos set directly', async ({ page }) => {
    await page.goto('/bundles');

    await page.locator('article').filter({ hasText: 'Complete Chaos Set' }).getByRole('button', { name: 'ADD BUNDLE' }).click();

    await expectCartBadge(page, '3');
    await expectCartItems(page, ['Sonic Inferno — Standard Tee', 'ADHD Squirrel Tee', 'Late Diagnosed Tee']);
    await expectCartSubtotal(page, '$59.99');
  });

  test('bundles page applies the selected tee size to the set', async ({ page }) => {
    await page.goto('/bundles');

    await page.getByRole('button', { name: '2XL' }).click();
    await page.locator('article').filter({ hasText: 'The Full Set' }).getByRole('button', { name: 'ADD BUNDLE' }).click();

    await expectCartBadge(page, '2');
    await expectCartItems(page, ['Sonic Inferno — Standard Tee', 'ADHD Squirrel Tee']);
    await expect(page.getByText('Size: 2XL', { exact: false }).first()).toBeVisible();
    await expectCartSubtotal(page, '$42.99');
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

      await expectCartItems(page, expectedItems);
    });
  });

  test('bundle flow upgrades from one shirt to complete chaos without duplicating the anchor tee', async ({ page }) => {
    await page.goto('/product/sonic-inferno-standard-tee');
    await page.getByRole('button', { name: /YEAH, THIS ONE/i }).first().click();

    await expectCartBadge(page, '1');
    await page.getByRole('button', { name: /Wait—what was I doing\?/i }).click();

    await page.goto('/product/late-diagnosed-tee');
    await page.getByRole('button', { name: 'COMPLETE THE SET.' }).click();

    await expectCartBadge(page, '2');
    await expectCartItems(page, ['Sonic Inferno — Standard Tee', 'Late Diagnosed Tee']);
    await expect(page.getByText('$42.99', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: /Wait—what was I doing\?/i }).click();

    await page.goto('/product/adhd-squirrel-tee');
    await page.getByRole('button', { name: 'COMPLETE THE SET.' }).click();

    await expectCartBadge(page, '3');
    await expectCartItems(page, [
      'Sonic Inferno — Standard Tee',
      'Late Diagnosed Tee',
      'ADHD Squirrel Tee',
    ]);
    await expect(page.getByText('$59.99', { exact: true })).toBeVisible();
    await expect(page.getByText('-$11.98', { exact: true })).toBeVisible();
  });

  test('bundle CTA respects 2XL tee pricing and discount math', async ({ page }) => {
    await page.goto('/product/sonic-inferno-standard-tee');

    await page.getByRole('button', { name: '2XL' }).click();
    await page.getByRole('button', { name: 'ADD THE SET.' }).click();

    await expectCartItems(page, ['Sonic Inferno — Standard Tee', 'ADHD Squirrel Tee']);
    await expect(page.getByText('$42.99', { exact: true })).toBeVisible();
    await expect(page.getByText('-$8.99', { exact: true })).toBeVisible();
  });
});
