import {
  Badge,
  BlockStack,
  Box,
  Card,
  Image,
  InlineStack,
  Layout,
  Page,
  Text,
} from '@shopify/polaris';
import { type GetProductsQuery } from 'shared/_generated/admin.generated';
import { type Route } from './+types/_app._index';

export async function loader({ context: { api } }: Route.LoaderArgs) {
  const products: GetProductsQuery['products'] = await api.getProducts();
  return { products: products.nodes };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  return (
    <Page title="Shopify Gadget Starter">
      <Layout>
        {products.map(product => (
          <ProductCard product={product} key={product.id} />
        ))}
      </Layout>
    </Page>
  );
}

interface ProductCardProps {
  product: Route.ComponentProps['loaderData']['products'][number];
}
const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/600x400';

function ProductCard({ product }: ProductCardProps) {
  const image = product.featuredMedia?.preview?.image;
  const imageAltText = image?.altText ?? product.title;
  const imageUrl = image?.url ?? PLACEHOLDER_IMAGE_URL;

  const price = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: product.priceRangeV2.minVariantPrice.currencyCode,
  }).format(product.priceRangeV2.minVariantPrice.amount ?? 0);

  return (
    <Layout.Section key={product.id} variant="oneThird">
      <Card padding="0">
        <BlockStack gap="300">
          <Image
            source={imageUrl}
            alt={imageAltText}
            width="100%"
            height={200}
            style={{ objectFit: 'cover' }}
          />
          <Box paddingInline="300" paddingBlockEnd="300">
            <BlockStack gap="200">
              <Text variant="headingSm" as="h3">
                {product.title}
              </Text>
              <InlineStack gap="200" align="space-between">
                <Text variant="bodyMd" fontWeight="semibold" as="span">
                  {price}
                </Text>
                <Badge tone="success">Available</Badge>
              </InlineStack>
            </BlockStack>
          </Box>
        </BlockStack>
      </Card>
    </Layout.Section>
  );
}
