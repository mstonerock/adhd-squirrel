import { getRequiredShopDomain, getShopifyAdminAccessToken } from './admin-auth';

function getArgValue(flag: string): string | null {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

const DEFAULT_TITLE = 'ADHD Squirrel Headless Storefront';

interface RestStorefrontTokenResponse {
  storefront_access_token?: {
    access_token: string;
    access_scope: string;
    created_at: string;
    title: string;
    id: number;
    admin_graphql_api_id: string;
  };
}

async function main(): Promise<void> {
  const shopDomain = getRequiredShopDomain();
  const title = getArgValue('--title') ?? DEFAULT_TITLE;
  const accessToken = await getShopifyAdminAccessToken(shopDomain);

  const response = await fetch(`https://${shopDomain}/admin/api/2026-01/storefront_access_tokens.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({
      storefront_access_token: {
        title,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify storefront token creation failed: ${response.status} ${response.statusText}\n${text}`);
  }

  const payload = (await response.json()) as RestStorefrontTokenResponse;
  if (!payload.storefront_access_token) {
    throw new Error('Storefront token creation returned no token.');
  }

  console.log(JSON.stringify({ shopDomain, storefrontAccessToken: payload.storefront_access_token }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
