import { execFileSync } from 'node:child_process';
import path from 'node:path';

const SHOPIFY_CLIENT_ID_TARGET = 'ADHD-Squirrel/Shopify/ClientId';
const SHOPIFY_CLIENT_SECRET_TARGET = 'ADHD-Squirrel/Shopify/ClientSecret';
const SHOPIFY_STOREFRONT_TOKEN_TARGET = 'ADHD-Squirrel/Shopify/StorefrontToken';

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

export function getShopifyClientId(): string {
  return getWindowsSecret(SHOPIFY_CLIENT_ID_TARGET);
}

export function getShopifyClientSecret(): string {
  return getWindowsSecret(SHOPIFY_CLIENT_SECRET_TARGET);
}

export function getShopifyStorefrontToken(): string {
  return getWindowsSecret(SHOPIFY_STOREFRONT_TOKEN_TARGET);
}
