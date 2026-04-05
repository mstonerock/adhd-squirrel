export function buildReturnUrl(storefrontUrl) {
  if (!storefrontUrl || typeof storefrontUrl !== 'string') {
    return null;
  }

  try {
    const url = new URL(storefrontUrl);
    url.searchParams.set('purchase', 'complete');
    url.searchParams.set('source', 'shopify');
    return url.toString();
  } catch {
    return null;
  }
}

export function ReturnToStorefront({
  headingKey = 'heading',
  bodyKey = 'body',
  detailKey = null,
  tone = 'auto',
  emphasis = 'banner',
}) {
  const settings = shopify.settings.value ?? {};
  const returnUrl = buildReturnUrl(settings.storefront_url);

  if (!returnUrl) {
    return (
      <s-banner heading={shopify.i18n.translate('configureHeading')} tone="warning">
        <s-text>{shopify.i18n.translate('configureBody')}</s-text>
      </s-banner>
    );
  }

  if (emphasis === 'subtle') {
    return (
      <s-box padding="base" border="base" cornerRadius="base">
        <s-stack gap="tight">
          <s-text emphasis="bold">{shopify.i18n.translate(headingKey)}</s-text>
          <s-text>{shopify.i18n.translate(bodyKey)}</s-text>
          {detailKey ? <s-text appearance="subdued">{shopify.i18n.translate(detailKey)}</s-text> : null}
          <s-link href={returnUrl}>{shopify.i18n.translate('buttonLabel')}</s-link>
        </s-stack>
      </s-box>
    );
  }

  return (
    <s-banner heading={shopify.i18n.translate(headingKey)} tone={tone}>
      <s-stack gap="base">
        <s-text>{shopify.i18n.translate(bodyKey)}</s-text>
        {detailKey ? <s-text appearance="subdued">{shopify.i18n.translate(detailKey)}</s-text> : null}
        <s-button href={returnUrl} variant="primary">
          {shopify.i18n.translate('buttonLabel')}
        </s-button>
      </s-stack>
    </s-banner>
  );
}
