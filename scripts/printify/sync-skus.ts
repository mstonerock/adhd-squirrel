import fs from 'node:fs/promises';
import path from 'node:path';

import { printifyRequest } from './api';
import { buildVariantSku, findSizeForVariantId } from './catalog';
import { PRINTIFY_PRODUCT_CONFIG } from './config';

const DEFAULT_SHOP_ID = 27048284;

interface PrintifyProductVariant {
  id: number;
  price: number;
  is_enabled: boolean;
  is_default: boolean;
  sku?: string;
}

interface PrintifyProduct {
  id: string;
  title: string;
  variants: PrintifyProductVariant[];
}

interface LiveCreateResult {
  product: {
    id: string;
  };
}

function getArgValue(flag: string): string | null {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function getShopId(): number {
  const rawShopId = getArgValue('--shop-id');
  if (!rawShopId) {
    return DEFAULT_SHOP_ID;
  }

  const parsedShopId = Number(rawShopId);
  if (!Number.isInteger(parsedShopId) || parsedShopId <= 0) {
    throw new Error(`Invalid --shop-id value: ${rawShopId}`);
  }

  return parsedShopId;
}

async function getPrintifyProductId(storefrontProductId: string, shopId: number): Promise<string> {
  const resultPath = path.join(
    process.cwd(),
    'docs',
    'printify',
    storefrontProductId,
    `live-create-result.shop-${shopId}.json`,
  );

  const raw = await fs.readFile(resultPath, 'utf8');
  const result = JSON.parse(raw) as LiveCreateResult;
  return result.product.id;
}

async function main(): Promise<void> {
  const shopId = getShopId();
  const summaries: Array<{
    storefrontProductId: string;
    printifyProductId: string;
    variantCount: number;
    skus: string[];
  }> = [];

  for (const config of PRINTIFY_PRODUCT_CONFIG) {
    const printifyProductId = await getPrintifyProductId(config.productId, shopId);
    const currentProduct = await printifyRequest<PrintifyProduct>(
      `/shops/${shopId}/products/${printifyProductId}.json`,
    );

    const variants = currentProduct.variants.map((variant) => {
      const mappedSize = findSizeForVariantId(config.blankCode, variant.id);
      return {
        id: variant.id,
        price: variant.price,
        is_enabled: variant.is_enabled,
        is_default: variant.is_default,
        sku: mappedSize ? buildVariantSku(config.productId, mappedSize) : variant.sku,
      };
    });

    await printifyRequest(`/shops/${shopId}/products/${printifyProductId}.json`, {
      method: 'PUT',
      body: JSON.stringify({ variants }),
    });

    const outputPath = path.join(
      process.cwd(),
      'docs',
      'printify',
      config.productId,
      `sku-sync.shop-${shopId}.json`,
    );

    await fs.writeFile(
      outputPath,
      `${JSON.stringify(
        {
          syncedAt: new Date().toISOString(),
          shopId,
          storefrontProductId: config.productId,
          printifyProductId,
          variants,
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    summaries.push({
      storefrontProductId: config.productId,
      printifyProductId,
      variantCount: variants.filter((variant) => Boolean(findSizeForVariantId(config.blankCode, variant.id))).length,
      skus: variants
        .filter((variant) => Boolean(findSizeForVariantId(config.blankCode, variant.id)))
        .map((variant) => variant.sku ?? ''),
    });
  }

  console.log(JSON.stringify({ shopId, summaries }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
