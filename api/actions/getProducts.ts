import { assert } from 'gadget-server';
import { type GetProductsQuery } from '../../shared/_generated/admin.generated';

const GET_PRODUCTS = `#graphql
  query GetProducts {
    products(first: 10) {
      nodes {
        id
        title
        handle
        featuredMedia {
          preview {
            image {
              url
              altText
            }
          }
        }
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const run: ActionRun = async ({ connections }) => {
  const shopify = assert(connections.shopify.current, 'unauthenticated');
  const response: GetProductsQuery = await shopify.graphql(GET_PRODUCTS);
  return response.products;
};
