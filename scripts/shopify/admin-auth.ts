import { getShopifyClientId, getShopifyClientSecret, type ShopifyEnvironment } from './credentials';

function getArgValue(flag: string): string | null {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

export function getRequiredShopDomain(): string {
  const rawShop = getArgValue('--shop') ?? process.env.SHOPIFY_SHOP_DOMAIN ?? process.env.VITE_SHOPIFY_DOMAIN ?? '';
  const shop = rawShop.trim();

  if (!shop) {
    throw new Error('Missing Shopify shop domain. Pass --shop snsjrm-sh.myshopify.com.');
  }

  if (!shop.endsWith('.myshopify.com')) {
    throw new Error(`Invalid Shopify shop domain: ${shop}`);
  }

  return shop;
}

export function getShopifyEnvironment(): ShopifyEnvironment {
  const rawEnvironment = (getArgValue('--environment') ?? process.env.SHOPIFY_ENVIRONMENT ?? 'production').trim().toLowerCase();
  if (rawEnvironment === 'production' || rawEnvironment === 'dev') {
    return rawEnvironment;
  }

  throw new Error(`Invalid Shopify environment: ${rawEnvironment}. Use production or dev.`);
}

interface AdminAccessTokenResponse {
  access_token: string;
  scope?: string;
}

export async function getShopifyAdminAccessToken(shopDomain: string): Promise<string> {
  const environment = getShopifyEnvironment();
  const response = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: getShopifyClientId(environment),
      client_secret: getShopifyClientSecret(environment),
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify admin token exchange failed: ${response.status} ${response.statusText}\n${text}`);
  }

  const result = (await response.json()) as AdminAccessTokenResponse;
  const accessToken = result.access_token?.trim();
  if (!accessToken) {
    throw new Error('Shopify admin token exchange returned an empty access token.');
  }

  return accessToken;
}
