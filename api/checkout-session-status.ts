import { getCheckoutSessionCompletion, isCheckoutSessionStoreConfigured } from './_lib/checkout-session-store';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId')?.trim();

  if (!sessionId) {
    return jsonResponse({ error: 'Missing sessionId.' }, 400);
  }

  if (!isCheckoutSessionStoreConfigured()) {
    return jsonResponse({ completed: false, configured: false });
  }

  const completion = await getCheckoutSessionCompletion(sessionId);

  return jsonResponse({
    completed: Boolean(completion),
    configured: true,
    completedAt: completion?.completedAt ?? null,
  });
}
