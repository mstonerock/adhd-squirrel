import { getRequiredShopDomain } from './admin-auth';
import { shopifyAdminGraphql } from './admin-api';

type PublicationsQuery = {
  publications: {
    nodes: Array<{
      id: string;
      name: string;
    }>;
  };
};

type ProductsPageQuery = {
  products: {
    nodes: Array<{
      id: string;
      title: string;
      status: string;
      publishedOnPublication: boolean;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

type PublishMutation = {
  publishablePublish: {
    userErrors: Array<{
      field?: string[] | null;
      message: string;
    }>;
  };
};

async function getOnlineStorePublicationId(shopDomain: string): Promise<string> {
  const data = await shopifyAdminGraphql<PublicationsQuery>(
    `
      query {
        publications(first: 20) {
          nodes {
            id
            name
          }
        }
      }
    `,
    {},
    shopDomain,
  );

  const publication = data.publications.nodes.find((node) => node.name === 'Online Store');
  if (!publication) {
    throw new Error('Could not find the Online Store publication.');
  }

  return publication.id;
}

async function getActiveProducts(shopDomain: string, publicationId: string) {
  const products: ProductsPageQuery['products']['nodes'] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const data = await shopifyAdminGraphql<ProductsPageQuery>(
      `
        query ActiveProducts($cursor: String, $publicationId: ID!) {
          products(first: 100, after: $cursor, query: "status:active") {
            nodes {
              id
              title
              status
              publishedOnPublication(publicationId: $publicationId)
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      {
        cursor,
        publicationId,
      },
      shopDomain,
    );

    products.push(...data.products.nodes);
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return products;
}

async function publishProduct(shopDomain: string, productId: string, publicationId: string) {
  const data = await shopifyAdminGraphql<PublishMutation>(
    `
      mutation PublishProduct($id: ID!, $publicationId: ID!) {
        publishablePublish(id: $id, input: [{ publicationId: $publicationId }]) {
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      id: productId,
      publicationId,
    },
    shopDomain,
  );

  return data.publishablePublish.userErrors;
}

async function main() {
  const shopDomain = getRequiredShopDomain();
  const publicationId = await getOnlineStorePublicationId(shopDomain);
  const products = await getActiveProducts(shopDomain, publicationId);

  const targets = products.filter((product) => !product.publishedOnPublication);
  const failures: Array<{ title: string; errors: string[] }> = [];

  for (const product of targets) {
    const userErrors = await publishProduct(shopDomain, product.id, publicationId);
    if (userErrors.length > 0) {
      failures.push({
        title: product.title,
        errors: userErrors.map((error) => error.message),
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        shopDomain,
        publicationId,
        activeCount: products.length,
        alreadyPublishedCount: products.length - targets.length,
        publishedCount: targets.length - failures.length,
        failedCount: failures.length,
        failures,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
