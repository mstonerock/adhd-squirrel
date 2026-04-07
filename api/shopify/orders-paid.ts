import type { IncomingMessage, ServerResponse } from 'node:http';
import { markCheckoutSessionCompleted, isCheckoutSessionStoreConfigured } from '../_lib/checkout-session-store.js';
import { extractCheckoutSessionIdFromOrderPayload, readNodeRequestBody, verifyShopifyWebhookSignature } from '../_lib/shopify-webhooks.js';

function sendText(response: ServerResponse, body: string, status = 200): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(body);
}

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (request.method !== 'POST') {
    sendText(response, 'Method not allowed.', 405);
    return;
  }

  if (!isCheckoutSessionStoreConfigured()) {
    sendText(response, 'Checkout session store is not configured.', 503);
    return;
  }

  const rawBody = await readNodeRequestBody(request);
  const isVerified = await verifyShopifyWebhookSignature(request.headers, rawBody);

  if (!isVerified) {
    sendText(response, 'Invalid webhook signature.', 401);
    return;
  }

  const topicHeader = request.headers['x-shopify-topic'];
  const topic = Array.isArray(topicHeader) ? topicHeader[0]?.trim() : topicHeader?.trim();
  if (topic && topic !== 'orders/paid') {
    sendText(response, 'Unexpected webhook topic.', 400);
    return;
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    sendText(response, 'Invalid JSON payload.', 400);
    return;
  }

  const sessionId = extractCheckoutSessionIdFromOrderPayload(payload);
  if (!sessionId) {
    sendText(response, 'No checkout session id found on order.', 202);
    return;
  }

  await markCheckoutSessionCompleted({
    sessionId,
    orderId: payload.id != null ? String(payload.id) : null,
    orderName: payload.name != null ? String(payload.name) : null,
    completedAt:
      typeof payload.processed_at === 'string' && payload.processed_at.trim()
        ? payload.processed_at
        : new Date().toISOString(),
    source: 'shopify-webhook',
  });

  sendText(response, 'ok');
}
