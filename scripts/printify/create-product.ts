import fs from 'node:fs/promises';
import path from 'node:path';

import { PRODUCTS } from '../../src/types';
import { printifyRequest } from './api';
import { buildVariantSku, getMonsterDigitalBlackBlank } from './catalog';
import { PRINTIFY_PRODUCT_CONFIG } from './config';

const DEFAULT_SHOP_ID = 9228181;
const PRINT_PROVIDER_ID = 29; // Monster Digital

interface PrintifyUpload {
  id: string;
  file_name: string;
  width: number;
  height: number;
  preview_url?: string;
}

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  blueprint_id: number;
  print_provider_id: number;
  variants: Array<{
    id: number;
    title: string;
    price: number;
    is_enabled: boolean;
    is_default: boolean;
    sku?: string;
  }>;
  print_areas: unknown[];
  visible: boolean;
}

function formatSizeNote(sizeLabels: string[]): string {
  if (sizeLabels.length === 0) return 'unknown';
  if (sizeLabels.length === 1) return sizeLabels[0];
  if (sizeLabels.length === 2) return `${sizeLabels[0]}-${sizeLabels[1]}`;
  return `${sizeLabels[0]}-${sizeLabels[sizeLabels.length - 1]}`;
}

function getArgValue(flag: string): string | null {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function getRequiredProductId(): string {
  return getArgValue('--product') ?? 'sonic-inferno-standard-tee';
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

async function uploadImage(filePath: string): Promise<PrintifyUpload> {
  const fileBuffer = await fs.readFile(filePath);
  return printifyRequest<PrintifyUpload>('/uploads/images.json', {
    method: 'POST',
    body: JSON.stringify({
      file_name: path.basename(filePath),
      contents: fileBuffer.toString('base64'),
    }),
  });
}

async function main(): Promise<void> {
  const productId = getRequiredProductId();
  const shopId = getShopId();
  const dryRun = process.argv.includes('--dry-run');
  const existingFrontUploadId = getArgValue('--front-upload-id');
  const existingBackUploadId = getArgValue('--back-upload-id');
  const frontMasterOverride = getArgValue('--front-master');
  const backMasterOverride = getArgValue('--back-master');

  const product = PRODUCTS.find((item) => item.id === productId);
  const config = PRINTIFY_PRODUCT_CONFIG.find((item) => item.productId === productId);

  if (!product || !config) {
    throw new Error(`Missing storefront/config entry for ${productId}`);
  }

  const blank = getMonsterDigitalBlackBlank(config.blankCode);
  if (!blank) {
    throw new Error(`Live create script currently supports Monster Digital black blanks 3001, 18000, and 18500 only. Received ${config.blankCode}.`);
  }

  const outputDir = path.join(process.cwd(), 'docs', 'printify', productId);
  const frontMasterPath = frontMasterOverride
    ? path.resolve(process.cwd(), frontMasterOverride)
    : path.join(process.cwd(), config.frontMaster);
  const backMasterPath = backMasterOverride
    ? path.resolve(process.cwd(), backMasterOverride)
    : config.backMaster
      ? path.join(process.cwd(), config.backMaster)
      : null;

  const frontUpload = existingFrontUploadId
    ? ({ id: existingFrontUploadId, file_name: path.basename(frontMasterPath), width: 4500, height: 5400 } satisfies PrintifyUpload)
    : await uploadImage(frontMasterPath);

  const backUpload = backMasterPath
    ? existingBackUploadId
      ? ({ id: existingBackUploadId, file_name: path.basename(backMasterPath), width: 4500, height: 5400 } satisfies PrintifyUpload)
      : await uploadImage(backMasterPath)
    : null;

  const frontPlacement = config.frontPlacement ?? { x: 0.5, y: 0.5, scale: 1, angle: 0 };
  const backPlacement = config.backPlacement ?? config.frontPlacement ?? { x: 0.5, y: 0.5, scale: 1, angle: 0 };

  const variants = Object.entries(blank.variantIds).map(([size, id], index) => {
    const retailPrice = product.sizePricing[size];
    if (typeof retailPrice !== 'number') {
      throw new Error(`Missing price for ${productId} size ${size}`);
    }

    return {
      id,
      price: Math.round(retailPrice * 100),
      is_enabled: true,
      is_default: index === 2, // L
      sku: buildVariantSku(product.id, size),
    };
  });

  const description = [
    product.description,
    '',
    'Specs:',
    ...product.features.map((feature) => `- ${feature}`),
    '',
    `Storefront product id: ${product.id}`,
    `Monster Digital note: Black is currently available in ${formatSizeNote(Object.keys(blank.variantIds))} for ${config.blankName}.`,
  ].join('\n');

  const placeholders = [
    {
      position: 'front',
      images: [
        {
          id: frontUpload.id,
          x: frontPlacement.x,
          y: frontPlacement.y,
          scale: frontPlacement.scale,
          angle: frontPlacement.angle,
        },
      ],
    },
  ];

  if (backUpload) {
    placeholders.push({
      position: 'back',
      images: [
        {
          id: backUpload.id,
          x: backPlacement.x,
          y: backPlacement.y,
          scale: backPlacement.scale,
          angle: backPlacement.angle,
        },
      ],
    });
  }

  const payload = {
    title: ['ADHD Squirrel', config.designLabel, config.variantLabel, config.blankCode, config.apparelLabel, config.color].join(' | '),
    description,
    blueprint_id: blank.blueprintId,
    print_provider_id: PRINT_PROVIDER_ID,
    variants,
    print_areas: [
      {
        variant_ids: variants.map((variant) => variant.id),
        placeholders,
      },
    ],
    visible: false,
  };

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          productId,
          frontUpload,
          backUpload,
          payload,
        },
        null,
        2,
      ),
    );
    return;
  }

  const created = await printifyRequest<PrintifyProduct>(`/shops/${shopId}/products.json`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    path.join(outputDir, `live-create-result.shop-${shopId}.json`),
    `${JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        shopId,
        productId,
        printProviderId: PRINT_PROVIDER_ID,
        printProviderTitle: 'Monster Digital',
        notes: [
          'Monster Digital is the source of truth for live tee sizes.',
          `Front placement baseline: x=${frontPlacement.x}, y=${frontPlacement.y}, scale=${frontPlacement.scale}, angle=${frontPlacement.angle}.`,
          `Back placement baseline: x=${backPlacement.x}, y=${backPlacement.y}, scale=${backPlacement.scale}, angle=${backPlacement.angle}.`,
          'Product created as visible=false for safe review.',
        ],
        uploads: {
          front: frontUpload,
          back: backUpload,
        },
        product: created,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  console.log(
    JSON.stringify(
      {
        shopId,
        storefrontProductId: productId,
        productId: created.id,
        title: created.title,
        visible: created.visible,
        frontUploadId: frontUpload.id,
        backUploadId: backUpload?.id ?? null,
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
