import type { IncomingMessage, ServerResponse } from 'node:http';
import { getCheckoutSessionCompletion, isCheckoutSessionStoreConfigured } from './_lib/checkout-session-store.js';

function sendJson(response: ServerResponse, body: unknown, status = 200): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

export default async function handler(request: IncomingMessage & { query?: Record<string, string | string[]> }, response: ServerResponse): Promise<void> {
  if (request.method !== 'GET') {
    sendJson(response, { error: 'Method not allowed.' }, 405);
    return;
  }

  const rawSessionId = request.query?.sessionId;
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0]?.trim() : rawSessionId?.trim();

  if (!sessionId) {
    sendJson(response, { error: 'Missing sessionId.' }, 400);
    return;
  }

  if (!isCheckoutSessionStoreConfigured()) {
    sendJson(response, { completed: false, configured: false });
    return;
  }

  const completion = await getCheckoutSessionCompletion(sessionId);

  sendJson(response, {
    completed: Boolean(completion),
    configured: true,
    completedAt: completion?.completedAt ?? null,
  });
}
