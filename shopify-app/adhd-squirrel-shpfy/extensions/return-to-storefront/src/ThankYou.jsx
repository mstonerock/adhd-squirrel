import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {ReturnToStorefront} from './shared.jsx';

export default async () => {
  render(
    <ReturnToStorefront
      headingKey="thankYouHeading"
      bodyKey="thankYouBody"
      detailKey="thankYouDetail"
      emphasis="subtle"
    />,
    document.body,
  );
};
