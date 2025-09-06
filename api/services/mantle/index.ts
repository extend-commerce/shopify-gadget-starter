import { type Client } from '@gadget-client/shopify-gadget-starter';
import { MantleClient } from '@heymantle/client';

interface ShopifyShop {
  accessToken?: string;
  id: string;
  name?: string | null;
  email?: string | null;
  myshopifyDomain?: string | null;
}

export async function identifyShop(shop: ShopifyShop, api: Client) {
  const { id, name, email, myshopifyDomain, accessToken } = shop;
  const mantleClient = getMantleClient();

  if (!mantleClient) {
    console.error('Mantle client not found'); // eslint-disable-line no-console
    return;
  }

  const result = await mantleClient.identify({
    platform: 'shopify',
    platformId: id,
    myshopifyDomain: myshopifyDomain ?? undefined,
    accessToken: accessToken ?? undefined,
    name: name ?? undefined,
    email: email ?? undefined,
  });

  if ('error' in result) {
    console.error(result.error); // eslint-disable-line no-console
    return;
  }

  await api.internal.shopifyShop.update(shop.id, {
    shopifyShop: {
      mantleApiToken: result.apiToken,
    },
  });
}

export function getMantleClient() {
  if (!process.env.GADGET_PUBLIC_MANTLE_APP_ID) {
    console.error('GADGET_PUBLIC_MANTLE_APP_ID not found'); // eslint-disable-line no-console
    return null;
  }

  if (!process.env.MANTLE_API_KEY) {
    console.error('MANTLE_API_KEY not found'); // eslint-disable-line no-console
    return null;
  }

  return new MantleClient({
    appId: process.env.GADGET_PUBLIC_MANTLE_APP_ID,
    apiKey: process.env.MANTLE_API_KEY,
  });
}
