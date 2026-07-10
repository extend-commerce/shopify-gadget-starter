import {
  type Select,
  type ShopifyShop as ShopifyShopModel,
} from '@gadget-client/shopify-gadget-starter';
import { MantleClient } from '@heymantle/client';

// NOTE: Using a custom ShopifyShop type because gadget doesn't expose the accessToken field in the ShopifyShop type
type BaseShopifyShop = Select<
  ShopifyShopModel,
  { id: true; name: true; email: true; myshopifyDomain: true }
>;
export interface ShopifyShop extends BaseShopifyShop {
  accessToken?: string;
}

export async function identifyShop(shop: ShopifyShop) {
  const { id, name, email, myshopifyDomain, accessToken } = shop;
  const mantleClient = getMantleClient();

  if (!mantleClient) {
    // eslint-disable-next-line no-console
    console.error('Mantle client not found');
    return;
  }

  const result = await mantleClient.identify({
    platform: 'shopify',
    platformId: id,
    myshopifyDomain: myshopifyDomain ?? undefined,
    accessToken,
    name: name ?? undefined,
    email: email ?? undefined,
  });

  if ('error' in result) {
    // eslint-disable-next-line no-console
    console.error(result.error);
    return null;
  }

  return result;
}

export function getMantleClient(customerApiToken?: string) {
  if (!process.env.GADGET_PUBLIC_MANTLE_APP_ID) {
    // eslint-disable-next-line no-console
    console.error('GADGET_PUBLIC_MANTLE_APP_ID not found');
    return null;
  }

  if (!process.env.MANTLE_API_KEY && !customerApiToken) {
    // eslint-disable-next-line no-console
    console.error('MANTLE_API_KEY not found');
    return null;
  }

  if (customerApiToken) {
    return new MantleClient({
      appId: process.env.GADGET_PUBLIC_MANTLE_APP_ID,
      customerApiToken,
    });
  }

  return new MantleClient({
    appId: process.env.GADGET_PUBLIC_MANTLE_APP_ID,
    apiKey: process.env.MANTLE_API_KEY,
  });
}
