import { faker } from '@faker-js/faker';
import { cleanup, render, screen } from '@testing-library/react';
import { type CurrencyCode } from 'shared/_generated/admin.types';
import { afterEach, expect, test } from 'vitest';
import { type Route } from '../routes/+types/_app._index';
import IndexRoute from '../routes/_app._index';

afterEach(() => cleanup());

test('Index Route renders product cards', async () => {
  const products = [generateSampleProduct(), generateSampleProduct()];

  render(
    <IndexRoute
      loaderData={{ products }}
      params={{}}
      // @ts-expect-error: `matches` won't align between test code and app code
      matches={[]}
    />,
  );

  expect(screen.getAllByTestId('product-card')).toHaveLength(products.length);
});

test('Index Route renders product card with correct data', async () => {
  const product = generateSampleProduct();

  render(
    <IndexRoute
      loaderData={{ products: [product] }}
      params={{}}
      // @ts-expect-error: `matches` won't align between test code and app code
      matches={[]}
    />,
  );

  expect(screen.getByText(product.title)).toBeDefined();
  expect(screen.getByTestId('product-card-image').getAttribute('src')).toBe(
    product.featuredMedia.preview.image.url,
  );
  expect(screen.getByTestId('product-card-image').getAttribute('alt')).toBe(
    product.featuredMedia.preview.image.altText,
  );
});

test('Index Route renders currency correctly', async () => {
  const product = generateSampleProduct();

  render(
    <IndexRoute
      loaderData={{ products: [product] }}
      params={{}}
      // @ts-expect-error: `matches` won't align between test code and app code
      matches={[]}
    />,
  );

  // Format the price using Intl.NumberFormat
  const expectedPrice = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: product.priceRangeV2.minVariantPrice.currencyCode,
  }).format(Number(product.priceRangeV2.minVariantPrice.amount));

  expect(screen.getByTestId('product-card-price').textContent).toBe(
    expectedPrice,
  );
});

// helpers
function generateSampleProduct() {
  return {
    id: faker.string.uuid(),
    handle: faker.string.alphanumeric(10),
    title: faker.commerce.product(),
    featuredMedia: {
      preview: {
        image: {
          url: faker.image.url(),
          altText: faker.lorem.sentence(),
        },
      },
    },
    priceRangeV2: {
      minVariantPrice: {
        amount: Number(faker.commerce.price()),
        currencyCode: faker.finance.currencyCode() as CurrencyCode,
      },
    },
  } satisfies Route.ComponentProps['loaderData']['products'][number];
}
