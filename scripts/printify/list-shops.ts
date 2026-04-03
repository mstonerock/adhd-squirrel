import { getPrintifyApiToken } from './credentials';

interface PrintifyShop {
  id: number;
  title: string;
  sales_channel?: string;
}

async function main(): Promise<void> {
  const token = getPrintifyApiToken();

  const response = await fetch('https://api.printify.com/v1/shops.json', {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'ADHD-Squirrel-LocalUploadTool/1.0',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Printify shops request failed: ${response.status} ${response.statusText}\n${text}`);
  }

  const shops = (await response.json()) as PrintifyShop[];
  console.log(JSON.stringify(shops, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
