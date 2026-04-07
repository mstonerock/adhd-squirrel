import { markCheckoutSessionCompleted, isCheckoutSessionStoreConfigured } from '../_lib/checkout-session-store';
import { extractCheckoutSessionIdFromOrderPayload, verifyShopifyWebhookSignature } from '../_lib/shopify-webhooks';

function textResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return textResponse('Method not allowed.', 405);
  }

  if (!isCheckoutSessionStoreConfigured()) {
    return textResponse('Checkout session store is not configured.', 503);
  }

  const rawBody = await request.text();
  const isVerified = await verifyShopifyWebhookSignature(request, rawBody);

  if (!isVerified) {
    return textResponse('Invalid webhook signature.', 401);
  }

  const topic = request.headers.get('x-shopify-topic')?.trim();
  if (topic && topic !== 'orders/paid') {
    return textResponse('Unexpected webhook topic.', 400);
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return textResponse('Invalid JSON payload.', 400);
  }

  const sessionId = extractCheckoutSessionIdFromOrderPayload(payload);
  if (!sessionId) {
    return textResponse('No checkout session id found on order.', 202);
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

  return textResponse('ok');
}
