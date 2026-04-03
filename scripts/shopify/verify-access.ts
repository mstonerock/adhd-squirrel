import { getRequiredShopDomain, getShopifyAdminAccessToken } from './admin-auth';
import { shopifyAdminGraphql } from './admin-api';

interface ShopInfoResponse {
  shop: {
    name: string;
    myshopifyDomain: string;
    primaryDomain?: {
      url: string;
    } | null;
  };
}

async function main(): Promise<void> {
  const shopDomain = getRequiredShopDomain();
  const accessToken = await getShopifyAdminAccessToken(shopDomain);

  const data = await shopifyAdminGraphql<ShopInfoResponse>(
    `
      query VerifyShopAccess {
        shop {
          name
          myshopifyDomain
          primaryDomain {
            url
          }
        }
      }
    `,
    {},
    shopDomain,
  );

  console.log(
    JSON.stringify(
      {
        shopDomain,
        adminAccessTokenPresent: Boolean(accessToken),
        shop: data.shop,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
