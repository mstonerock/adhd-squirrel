import { createHmac, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage } from 'node:http';

const CHECKOUT_SESSION_ATTRIBUTE_KEY = 'checkout_session_id';

type AttributeLike =
  | { name?: unknown; value?: unknown }
  | { key?: unknown; value?: unknown }
  | null
  | undefined;

function getAttributeKey(attribute: AttributeLike): string | null {
  if (!attribute || typeof attribute !== 'object') {
    return null;
  }

  if ('name' in attribute && typeof attribute.name === 'string') {
    return attribute.name;
  }

  if ('key' in attribute && typeof attribute.key === 'string') {
    return attribute.key;
  }

  return null;
}

function getAttributeValue(attribute: AttributeLike): string | null {
  if (!attribute || typeof attribute !== 'object' || !('value' in attribute)) {
    return null;
  }

  return typeof attribute.value === 'string' && attribute.value.trim()
    ? attribute.value.trim()
    : null;
}

export async function readNodeRequestBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    request.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    request.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    request.on('error', reject);
  });
}

export async function verifyShopifyWebhookSignature(headers: IncomingMessage['headers'], rawBody: string): Promise<boolean> {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim();
  const headerValue = headers['x-shopify-hmac-sha256'];
  const receivedHmac = Array.isArray(headerValue) ? headerValue[0]?.trim() : headerValue?.trim();

  if (!secret || !receivedHmac) {
    return false;
  }

  const expectedHmac = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');

  const receivedBuffer = Buffer.from(receivedHmac, 'utf8');
  const expectedBuffer = Buffer.from(expectedHmac, 'utf8');

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer);
}

function extractSessionIdFromAttributes(attributes: AttributeLike[] | undefined): string | null {
  if (!Array.isArray(attributes)) {
    return null;
  }

  for (const attribute of attributes) {
    const key = getAttributeKey(attribute);

    if (key !== CHECKOUT_SESSION_ATTRIBUTE_KEY) {
      continue;
    }

    return getAttributeValue(attribute);
  }

  return null;
}

export function extractCheckoutSessionIdFromOrderPayload(payload: Record<string, unknown>): string | null {
  const noteAttributes = payload.note_attributes as AttributeLike[] | undefined;
  const customAttributes = payload.noteAttributes as AttributeLike[] | undefined;

  return extractSessionIdFromAttributes(noteAttributes) ?? extractSessionIdFromAttributes(customAttributes);
}
