import fs from 'node:fs/promises';
import path from 'node:path';

import { shopifyAdminGraphql } from './admin-api';
import { getRequiredShopDomain } from './admin-auth';

interface ProductVariantNode {
  id: string;
  sku: string | null;
  title: string;
  product: {
    id: string;
    title: string;
    status: string;
  };
}

interface ProductVariantsResponse {
  productVariants: {
    nodes: ProductVariantNode[];
  };
}

async function findVariantBySku(shopDomain: string, sku: string): Promise<ProductVariantNode | null> {
  const data = await shopifyAdminGraphql<ProductVariantsResponse>(
    `
      query VariantBySku($query: String!) {
        productVariants(first: 5, query: $query) {
          nodes {
            id
            sku
            title
            product {
              id
              title
              status
            }
          }
        }
      }
    `,
    {
      query: `sku:${sku}`,
    },
    shopDomain,
  );

  return data.productVariants.nodes.find((node) => node.sku === sku) ?? null;
}

async function main(): Promise<void> {
  const shopDomain = getRequiredShopDomain();
  const templatePath = path.join(process.cwd(), 'docs', 'shopify-variant-id-map.template.json');
  const outputPath = path.join(process.cwd(), 'docs', 'shopify-variant-id-map.generated.json');

  const templateRaw = await fs.readFile(templatePath, 'utf8');
  const template = JSON.parse(templateRaw) as Record<string, string>;
  const entries = Object.keys(template);

  const variantMap: Record<string, string> = {};
  const missing: string[] = [];
  const resolved: Array<{ sku: string; variantId: string; productTitle: string; variantTitle: string; status: string }> = [];

  for (const sku of entries) {
    const variant = await findVariantBySku(shopDomain, sku);
    if (!variant) {
      missing.push(sku);
      continue;
    }

    variantMap[sku] = variant.id;
    resolved.push({
      sku,
      variantId: variant.id,
      productTitle: variant.product.title,
      variantTitle: variant.title,
      status: variant.product.status,
    });
  }

  await fs.writeFile(
    outputPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        shopDomain,
        variantMap,
        missing,
        resolved,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  console.log(
    JSON.stringify(
      {
        shopDomain,
        resolvedCount: resolved.length,
        missingCount: missing.length,
        outputPath,
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
