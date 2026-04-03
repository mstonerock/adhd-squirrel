import { getRequiredShopDomain, getShopifyAdminAccessToken } from './admin-auth';

const SHOPIFY_ADMIN_API_VERSION = '2025-10';

interface GraphQlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function shopifyAdminGraphql<T>(
  query: string,
  variables: Record<string, unknown> = {},
  shopDomain = getRequiredShopDomain(),
): Promise<T> {
  const accessToken = await getShopifyAdminAccessToken(shopDomain);

  const response = await fetch(`https://${shopDomain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Admin GraphQL request failed: ${response.status} ${response.statusText}\n${text}`);
  }

  const result = (await response.json()) as GraphQlResponse<T>;
  if (result.errors?.length) {
    throw new Error(`Shopify Admin GraphQL errors: ${result.errors.map((error) => error.message).join('; ')}`);
  }

  if (!result.data) {
    throw new Error('Shopify Admin GraphQL response did not include data.');
  }

  return result.data;
}
