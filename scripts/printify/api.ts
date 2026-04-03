import { getPrintifyApiToken } from './credentials';

const PRINTIFY_API_BASE = 'https://api.printify.com/v1';

export async function printifyRequest<T>(pathname: string, init?: RequestInit): Promise<T> {
  const token = getPrintifyApiToken();

  const response = await fetch(`${PRINTIFY_API_BASE}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'ADHD-Squirrel-LocalUploadTool/1.0',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Printify request failed: ${response.status} ${response.statusText}\n${text}`);
  }

  return response.json() as Promise<T>;
}
