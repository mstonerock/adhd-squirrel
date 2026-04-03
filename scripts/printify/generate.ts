import fs from 'node:fs/promises';
import path from 'node:path';

import { CATEGORY_SIZES } from '../../src/lib/productUtils';
import { PRODUCTS, type Product } from '../../src/types';
import {
  PRINTIFY_PRODUCT_CONFIG,
  type PrintifyProductConfig,
  type SetupPhase,
} from './config';

const ROOT = process.cwd();
const BASE_OUTPUT_DIR = path.join(ROOT, 'docs', 'printify');

const SETUP_PHASE_ORDER: SetupPhase[] = ['tees', 'crewnecks', 'hoodies'];
const SETUP_PHASE_LABEL: Record<SetupPhase, string> = {
  tees: 'Build all 3001 tees first.',
  crewnecks: 'Build all 18000 crewnecks second.',
  hoodies: 'Build only the two Sonic hoodies last.',
};

interface ListingSizeRow {
  storefrontProductId: string;
  storefrontName: string;
  printifyAdminTitle: string;
  sku: string;
  size: string;
  retailPrice: number;
  blankCode: string;
  blankName: string;
  category: Product['category'];
  apparelLabel: string;
  color: string;
  printSides: string;
  frontMaster: string;
  backMaster: string;
}

interface ListingProductRecord {
  storefrontProductId: string;
  storefrontName: string;
  storefrontDescription: string;
  storefrontCategory: Product['category'];
  designFamily: Product['designFamily'];
  variant: Product['variant'];
  printifyAdminTitle: string;
  skuRoot: string;
  setupPhase: SetupPhase;
  blankCode: string;
  blankName: string;
  apparelLabel: string;
  color: string;
  printSides: string;
  frontMaster: string;
  backMaster: string | null;
  sizes: ListingSizeRow[];
  featureBullets: string[];
  listingDescription: string;
}

function normalizePrintSides(printSides: PrintifyProductConfig['printSides']): string {
  return printSides === 'front-and-back' ? 'Front + back' : 'Front only';
}

function buildAdminTitle(config: PrintifyProductConfig): string {
  return [
    'ADHD Squirrel',
    config.designLabel,
    config.variantLabel,
    config.blankCode,
    config.apparelLabel,
    config.color,
  ].join(' | ');
}

function buildListingDescription(product: Product, adminTitle: string): string {
  return [
    product.description,
    '',
    'Specs:',
    ...product.features.map((feature) => `- ${feature}`),
    '',
    `Internal title: ${adminTitle}`,
  ].join('\n');
}

function csvValue(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function buildCsv(rows: ListingSizeRow[]): string {
  const header = [
    'storefront_product_id',
    'storefront_name',
    'printify_admin_title',
    'sku',
    'size',
    'retail_price',
    'blank_code',
    'blank_name',
    'category',
    'apparel',
    'color',
    'print_sides',
    'front_master',
    'back_master',
  ];

  const lines = rows.map((row) =>
    [
      row.storefrontProductId,
      row.storefrontName,
      row.printifyAdminTitle,
      row.sku,
      row.size,
      row.retailPrice.toFixed(2),
      row.blankCode,
      row.blankName,
      row.category,
      row.apparelLabel,
      row.color,
      row.printSides,
      row.frontMaster,
      row.backMaster,
    ]
      .map(csvValue)
      .join(','),
  );

  return [header.join(','), ...lines].join('\n');
}

function buildMarkdown(records: ListingProductRecord[]): string {
  const lines: string[] = [
    '# Printify Listing Pack',
    '',
    'Generated from storefront product data and explicit Printify mappings.',
    '',
    '## Setup order',
    '',
    ...SETUP_PHASE_ORDER.map((phase, index) => `${index + 1}. ${SETUP_PHASE_LABEL[phase]}`),
    '',
    '## Product summary',
    '',
  ];

  for (const record of records) {
    lines.push(`- \`${record.storefrontProductId}\`: ${record.printifyAdminTitle}`);
    lines.push(
      `  Blank: ${record.blankName}. Sides: ${record.printSides}. Front master: \`${record.frontMaster}\`. Back master: \`${record.backMaster ?? 'none'}\`.`,
    );
  }

  lines.push('');

  for (const record of records) {
    lines.push(`## ${record.storefrontName}`);
    lines.push('');
    lines.push(`- Storefront ID: \`${record.storefrontProductId}\``);
    lines.push(`- Printify admin title: ${record.printifyAdminTitle}`);
    lines.push(`- SKU root: \`${record.skuRoot}\``);
    lines.push(`- Blank: ${record.blankName}`);
    lines.push(`- Print sides: ${record.printSides}`);
    lines.push(`- Front master: \`${record.frontMaster}\``);
    lines.push(`- Back master: \`${record.backMaster ?? 'none'}\``);
    lines.push(`- Setup phase: ${record.setupPhase}`);
    lines.push('');
    lines.push('### Size pricing');
    lines.push('');
    lines.push('| Size | SKU | Retail |');
    lines.push('|---|---|---|');
    for (const size of record.sizes) {
      lines.push(`| ${size.size} | \`${size.sku}\` | $${size.retailPrice.toFixed(2)} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function validate(products: Product[], configs: PrintifyProductConfig[]): void {
  const productIds = new Set(products.map((product) => product.id));
  const configIds = new Set<string>();

  for (const config of configs) {
    if (!productIds.has(config.productId)) {
      throw new Error(`Config references unknown storefront product: ${config.productId}`);
    }

    if (configIds.has(config.productId)) {
      throw new Error(`Duplicate Printify config for product: ${config.productId}`);
    }
    configIds.add(config.productId);

    const fullPath = path.join(ROOT, config.frontMaster);
    if (!fullPath.startsWith(ROOT)) {
      throw new Error(`Front master resolves outside repo: ${config.frontMaster}`);
    }

    if (config.backMaster) {
      const backPath = path.join(ROOT, config.backMaster);
      if (!backPath.startsWith(ROOT)) {
        throw new Error(`Back master resolves outside repo: ${config.backMaster}`);
      }
    }
  }

  const liveProductIds = products.map((product) => product.id).sort();
  const configuredProductIds = configs.map((config) => config.productId).sort();

  if (liveProductIds.join('|') !== configuredProductIds.join('|')) {
    const missing = liveProductIds.filter((id) => !configIds.has(id));
    const extra = configuredProductIds.filter((id) => !productIds.has(id));
    throw new Error(
      `Printify config mismatch. Missing: ${missing.join(', ') || 'none'}. Extra: ${extra.join(', ') || 'none'}.`,
    );
  }
}

async function verifyAssets(configs: PrintifyProductConfig[]): Promise<void> {
  for (const config of configs) {
    await fs.access(path.join(ROOT, config.frontMaster));
    if (config.backMaster) {
      await fs.access(path.join(ROOT, config.backMaster));
    }
  }
}

function buildRecords(products: Product[], configs: PrintifyProductConfig[]): ListingProductRecord[] {
  const productMap = new Map(products.map((product) => [product.id, product]));

  return configs.map((config) => {
    const product = productMap.get(config.productId);
    if (!product) {
      throw new Error(`Missing storefront product for config: ${config.productId}`);
    }

    const sizes = CATEGORY_SIZES[product.category];
    if (!sizes || sizes.length === 0) {
      throw new Error(`No size map found for category: ${product.category}`);
    }

    const adminTitle = buildAdminTitle(config);
    const skuRoot = product.id;
    const printSides = normalizePrintSides(config.printSides);

    const sizeRows: ListingSizeRow[] = sizes.map((size) => {
      const retailPrice = product.sizePricing[size];
      if (typeof retailPrice !== 'number') {
        throw new Error(`Missing size price for ${product.id} size ${size}`);
      }

      return {
        storefrontProductId: product.id,
        storefrontName: product.name,
        printifyAdminTitle: adminTitle,
        sku: `${skuRoot}__${size}`,
        size,
        retailPrice,
        blankCode: config.blankCode,
        blankName: config.blankName,
        category: product.category,
        apparelLabel: config.apparelLabel,
        color: config.color,
        printSides,
        frontMaster: config.frontMaster,
        backMaster: config.backMaster ?? '',
      };
    });

    return {
      storefrontProductId: product.id,
      storefrontName: product.name,
      storefrontDescription: product.description,
      storefrontCategory: product.category,
      designFamily: product.designFamily,
      variant: product.variant,
      printifyAdminTitle: adminTitle,
      skuRoot,
      setupPhase: config.setupPhase,
      blankCode: config.blankCode,
      blankName: config.blankName,
      apparelLabel: config.apparelLabel,
      color: config.color,
      printSides,
      frontMaster: config.frontMaster,
      backMaster: config.backMaster ?? null,
      sizes: sizeRows,
      featureBullets: product.features,
      listingDescription: buildListingDescription(product, adminTitle),
    };
  });
}

function getArgValue(flag: string): string | null {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

async function writeOutputs(records: ListingProductRecord[], outputDir: string): Promise<void> {
  await fs.mkdir(outputDir, { recursive: true });

  const sizeRows = records.flatMap((record) => record.sizes);
  const manifest = {
    generatedAt: new Date().toISOString(),
    productCount: records.length,
    sizeRowCount: sizeRows.length,
    products: records,
  };

  await fs.writeFile(
    path.join(outputDir, 'catalog.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  await fs.writeFile(path.join(outputDir, 'listing-rows.csv'), `${buildCsv(sizeRows)}\n`, 'utf8');
  await fs.writeFile(path.join(outputDir, 'README.md'), `${buildMarkdown(records)}\n`, 'utf8');
}

async function main(): Promise<void> {
  const checkOnly = process.argv.includes('--check');
  const requestedProductId = getArgValue('--product');

  validate(PRODUCTS, PRINTIFY_PRODUCT_CONFIG);
  await verifyAssets(PRINTIFY_PRODUCT_CONFIG);

  const scopedProducts = requestedProductId
    ? PRODUCTS.filter((product) => product.id === requestedProductId)
    : PRODUCTS;
  const scopedConfig = requestedProductId
    ? PRINTIFY_PRODUCT_CONFIG.filter((config) => config.productId === requestedProductId)
    : PRINTIFY_PRODUCT_CONFIG;

  if (requestedProductId && scopedProducts.length === 0) {
    throw new Error(`Unknown product id: ${requestedProductId}`);
  }

  const records = buildRecords(scopedProducts, scopedConfig);
  const outputDir = requestedProductId
    ? path.join(BASE_OUTPUT_DIR, requestedProductId)
    : BASE_OUTPUT_DIR;

  if (checkOnly) {
    console.log(`Validated ${records.length} products and ${records.flatMap((record) => record.sizes).length} size rows.`);
    return;
  }

  await writeOutputs(records, outputDir);
  console.log(`Generated Printify listing pack in ${path.relative(ROOT, outputDir)}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
