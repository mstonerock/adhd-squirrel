import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {ReturnToStorefront} from './shared.jsx';

export default async () => {
  render(
    <ReturnToStorefront
      headingKey="orderStatusHeading"
      bodyKey="orderStatusBody"
      detailKey="orderStatusDetail"
      emphasis="subtle"
    />,
    document.body,
  );
};
