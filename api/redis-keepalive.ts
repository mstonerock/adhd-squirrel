import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from 'redis';

const KEEPALIVE_KEY = 'adhd-squirrel:keepalive';
const KEEPALIVE_TTL_SECONDS = 60 * 60 * 24 * 7;

function sendJson(response: ServerResponse, body: unknown, status = 200): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

function getAuthorizationHeader(request: IncomingMessage): string | null {
  const value = request.headers.authorization;
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function getRedisUrl(): string | null {
  return process.env.REDIS_URL?.trim() || process.env.KV_REST_API_REDIS_URL?.trim() || null;
}

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (request.method !== 'GET') {
    sendJson(response, { error: 'Method not allowed.' }, 405);
    return;
  }

  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret || getAuthorizationHeader(request) !== `Bearer ${cronSecret}`) {
    sendJson(response, { error: 'Unauthorized.' }, 401);
    return;
  }

  const redisUrl = getRedisUrl();
  if (!redisUrl) {
    sendJson(response, { error: 'Redis is not configured.' }, 503);
    return;
  }

  const client = createClient({ url: redisUrl });

  try {
    await client.connect();
    await client.set(KEEPALIVE_KEY, 'active', { EX: KEEPALIVE_TTL_SECONDS });
    sendJson(response, { ok: true });
  } finally {
    await client.quit().catch(() => undefined);
  }
}
