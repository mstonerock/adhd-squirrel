import { createHmac, timingSafeEqual } from 'node:crypto';

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

export async function verifyShopifyWebhookSignature(request: Request, rawBody: string): Promise<boolean> {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim();
  const receivedHmac = request.headers.get('x-shopify-hmac-sha256')?.trim();

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
