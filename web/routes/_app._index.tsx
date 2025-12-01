import { type GetProductsQuery } from 'shared/_generated/admin.generated';
import { type Route } from './+types/_app._index';

export async function loader({
  context: { api, gadgetConfig },
}: Route.LoaderArgs) {
  if (!gadgetConfig.shopifyInstallState) {
    return { products: [] };
  }

  const products: GetProductsQuery['products'] = await api.getProducts();
  return { products: products.nodes };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  return (
    <s-page heading="Shopify Gadget Starter">
      <s-grid
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap="base"
      >
        {products.map(product => (
          <ProductCard product={product} key={product.id} />
        ))}
      </s-grid>
    </s-page>
  );
}

interface ProductCardProps {
  product: Route.ComponentProps['loaderData']['products'][number];
}
const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/600x400';

export function ProductCard({ product }: ProductCardProps) {
  const image = product.featuredMedia?.preview?.image;
  const imageAltText = image?.altText ?? product.title;
  const imageUrl = image?.url ?? PLACEHOLDER_IMAGE_URL;

  const price = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: product.priceRangeV2.minVariantPrice.currencyCode,
  }).format(product.priceRangeV2.minVariantPrice.amount ?? 0);

  return (
    <s-section padding="none" data-testid="product-card">
      <s-stack direction="block" gap="base">
        <s-image
          data-testid="product-card-image"
          src={imageUrl}
          alt={imageAltText}
          inlineSize="fill"
          aspectRatio="16/9"
          objectFit="cover"
        />
        <s-box paddingInline="base" paddingBlockEnd="base">
          <s-stack direction="block" gap="small">
            <s-heading>{product.title}</s-heading>
            <s-stack
              direction="inline"
              gap="base"
              justifyContent="space-between"
            >
              <s-text type="strong" data-testid="product-card-price">
                {price}
              </s-text>
              <s-badge tone="success">Available</s-badge>
            </s-stack>
          </s-stack>
        </s-box>
      </s-stack>
    </s-section>
  );
}
