import { execFileSync } from 'node:child_process';
import path from 'node:path';

const SHOPIFY_SECRET_TARGETS = {
  production: {
    clientId: 'ADHD-Squirrel/Shopify/ClientId',
    clientSecret: 'ADHD-Squirrel/Shopify/ClientSecret',
    storefrontToken: 'ADHD-Squirrel/Shopify/StorefrontToken',
  },
  dev: {
    clientId: 'ADHD-Squirrel/Shopify/Dev/ClientId',
    clientSecret: 'ADHD-Squirrel/Shopify/Dev/ClientSecret',
    storefrontToken: 'ADHD-Squirrel/Shopify/Dev/StorefrontToken',
  },
} as const;

export type ShopifyEnvironment = keyof typeof SHOPIFY_SECRET_TARGETS;

function getWindowsSecret(target: string): string {
  if (process.platform !== 'win32') {
    throw new Error(`Shopify credential lookup for ${target} is configured for the Windows DPAPI store only.`);
  }

  const scriptPath = path.join(process.cwd(), 'scripts', 'printify', 'windows-credential.ps1');

  const output = execFileSync(
    'powershell',
    [
      '-NoProfile',
      '-ExecutionPolicy',
      'Bypass',
      '-File',
      scriptPath,
      '-Action',
      'get',
      '-Target',
      target,
    ],
    {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  const secret = output.trim();
  if (!secret) {
    throw new Error(`Credential lookup returned an empty value for ${target}.`);
  }

  return secret;
}

export function getShopifyClientId(environment: ShopifyEnvironment = 'production'): string {
  return getWindowsSecret(SHOPIFY_SECRET_TARGETS[environment].clientId);
}

export function getShopifyClientSecret(environment: ShopifyEnvironment = 'production'): string {
  return getWindowsSecret(SHOPIFY_SECRET_TARGETS[environment].clientSecret);
}

export function getShopifyStorefrontToken(environment: ShopifyEnvironment = 'production'): string {
  return getWindowsSecret(SHOPIFY_SECRET_TARGETS[environment].storefrontToken);
}
