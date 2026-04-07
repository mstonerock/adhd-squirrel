import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from 'redis';
import { Redis } from '@upstash/redis';

const CHECKOUT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;
const LOCAL_STORE_DIRECTORY = path.join(process.cwd(), '.session-store');
const LOCAL_STORE_PATH = path.join(LOCAL_STORE_DIRECTORY, 'checkout-sessions.json');

export interface CheckoutSessionCompletionRecord {
  sessionId: string;
  orderId: string | null;
  orderName: string | null;
  completedAt: string;
  source: 'shopify-webhook';
}

type LocalStore = Record<string, CheckoutSessionCompletionRecord>;
type RedisUrlClient = ReturnType<typeof createClient>;
let redisUrlClient: RedisUrlClient | null = null;
let redisUrlClientPromise: Promise<RedisUrlClient> | null = null;

function getUpstashRedisClient(): Redis | null {
  const url = process.env.KV_REST_API_URL?.trim();
  const token = process.env.KV_REST_API_TOKEN?.trim();

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

function getRedisUrl(): string | null {
  return (
    process.env.KV_REST_API_REDIS_URL?.trim() ||
    process.env.REDIS_URL?.trim() ||
    null
  );
}

async function getRedisUrlClient(): Promise<RedisUrlClient | null> {
  const redisUrl = getRedisUrl();
  if (!redisUrl) {
    return null;
  }

  if (redisUrlClient) {
    return redisUrlClient;
  }

  if (!redisUrlClientPromise) {
    const client = createClient({ url: redisUrl });
    redisUrlClientPromise = client.connect().then(() => {
      redisUrlClient = client;
      return client;
    });
  }

  return redisUrlClientPromise;
}

function isLocalDevelopmentStoreAllowed(): boolean {
  return process.env.VERCEL !== '1';
}

async function readLocalStore(): Promise<LocalStore> {
  try {
    const rawValue = await readFile(LOCAL_STORE_PATH, 'utf8');
    const parsed = JSON.parse(rawValue) as LocalStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function writeLocalStore(store: LocalStore): Promise<void> {
  await mkdir(LOCAL_STORE_DIRECTORY, { recursive: true });
  await writeFile(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

export function isCheckoutSessionStoreConfigured(): boolean {
  return Boolean(getRedisUrl() || getUpstashRedisClient()) || isLocalDevelopmentStoreAllowed();
}

function getCheckoutSessionKey(sessionId: string): string {
  return `checkout-session:${sessionId}`;
}

export async function markCheckoutSessionCompleted(record: CheckoutSessionCompletionRecord): Promise<void> {
  const redisUrlClient = await getRedisUrlClient();
  if (redisUrlClient) {
    await redisUrlClient.set(getCheckoutSessionKey(record.sessionId), JSON.stringify(record), {
      EX: CHECKOUT_SESSION_TTL_SECONDS,
    });
    return;
  }

  const redis = getUpstashRedisClient();

  if (redis) {
    await redis.set(getCheckoutSessionKey(record.sessionId), record, {
      ex: CHECKOUT_SESSION_TTL_SECONDS,
    });
    return;
  }

  if (!isLocalDevelopmentStoreAllowed()) {
    throw new Error('Checkout session store is not configured for this environment.');
  }

  const store = await readLocalStore();
  store[record.sessionId] = record;
  await writeLocalStore(store);
}

export async function getCheckoutSessionCompletion(sessionId: string): Promise<CheckoutSessionCompletionRecord | null> {
  const redisUrlClient = await getRedisUrlClient();
  if (redisUrlClient) {
    const result = await redisUrlClient.get(getCheckoutSessionKey(sessionId));
    if (typeof result !== 'string' || !result) {
      return null;
    }

    try {
      return JSON.parse(result) as CheckoutSessionCompletionRecord;
    } catch {
      return null;
    }
  }

  const redis = getUpstashRedisClient();

  if (redis) {
    const result = await redis.get<CheckoutSessionCompletionRecord>(getCheckoutSessionKey(sessionId));
    return result ?? null;
  }

  if (!isLocalDevelopmentStoreAllowed()) {
    return null;
  }

  const store = await readLocalStore();
  return store[sessionId] ?? null;
}
