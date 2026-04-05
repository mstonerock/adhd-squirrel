import fs from 'node:fs/promises';
import path from 'node:path';

import { getRequiredShopDomain, getShopifyEnvironment } from './admin-auth';
import { getShopifyStorefrontToken } from './credentials';

interface GeneratedVariantMapFile {
  variantMap: Record<string, string>;
}

function formatEnvValue(value: string): string {
  return JSON.stringify(value);
}

async function main(): Promise<void> {
  const shopDomain = getRequiredShopDomain();
  const environment = getShopifyEnvironment();
  const storefrontAccessToken = getShopifyStorefrontToken(environment);
  const variantMapPath = path.join(process.cwd(), 'docs', 'shopify-variant-id-map.generated.json');
  const envPath = path.join(process.cwd(), '.env.local');

  const rawVariantMap = await fs.readFile(variantMapPath, 'utf8');
  const variantMap = (JSON.parse(rawVariantMap) as GeneratedVariantMapFile).variantMap;

  const envLines = [
    `VITE_SHOPIFY_DOMAIN=${formatEnvValue(shopDomain)}`,
    `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=${formatEnvValue(storefrontAccessToken)}`,
    `VITE_SHOPIFY_VARIANT_ID_MAP=${JSON.stringify(JSON.stringify(variantMap))}`,
    '',
  ];

  await fs.writeFile(envPath, envLines.join('\n'), 'utf8');
  console.log(JSON.stringify({ envPath, shopDomain, environment, variantCount: Object.keys(variantMap).length }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
