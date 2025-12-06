import {
  type Client,
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
    accessToken,
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

export async function updateMissingTokens(api: Client) {
  const shops: ShopifyShop[] = [];
  let response = await api.internal.shopifyShop.findMany({
    select: {
      accessToken: true,
      id: true,
      name: true,
      email: true,
      myshopifyDomain: true,
    },
    filter: {
      OR: [
        { mantleApiToken: { isSet: false } },
        { mantleApiToken: { equals: null } },
        { mantleApiToken: { equals: '' } },
      ],
    },
    first: 250,
  });

  shops.push(...(response as unknown as ShopifyShop[]));
  while (response.hasNextPage) {
    response = await response.nextPage();
    shops.push(...(response as unknown as ShopifyShop[]));
  }

  for (const shop of shops) {
    await identifyShop(shop, api);
  }

  // eslint-disable-next-line no-console
  return console.info('all missing mantle tokens updated');
}

export async function updateAllTokens(api: Client) {
  const shops: ShopifyShop[] = [];
  let response = await api.internal.shopifyShop.findMany({
    select: {
      accessToken: true,
      id: true,
      name: true,
      email: true,
      myshopifyDomain: true,
    },
    first: 250,
  });

  shops.push(...(response as unknown as ShopifyShop[]));
  while (response.hasNextPage) {
    response = await response.nextPage();
    shops.push(...(response as unknown as ShopifyShop[]));
  }

  for (const shop of shops) {
    await identifyShop(shop, api);
  }

  // eslint-disable-next-line no-console
  return console.info('all mantle tokens have been updated');
}

export async function getCurrentCustomer(authenticatedApi: Client) {
  const shop = await authenticatedApi.shopifyShop.maybeFindFirst({
    select: { mantleApiToken: true },
  });

  if (!shop?.mantleApiToken) {
    return null;
  }

  const mantleClient = getMantleClient(shop.mantleApiToken);
  const response = await mantleClient?.getCustomer();

  if (!response || 'error' in response) {
    console.error(response?.error ?? 'empty response from mantle'); // eslint-disable-line no-console
    return null;
  }

  return response;
}

export function getMantleClient(customerApiToken?: string) {
  if (!process.env.GADGET_PUBLIC_MANTLE_APP_ID) {
    console.error('GADGET_PUBLIC_MANTLE_APP_ID not found'); // eslint-disable-line no-console
    return null;
  }

  if (!process.env.MANTLE_API_KEY && !customerApiToken) {
    console.error('MANTLE_API_KEY not found'); // eslint-disable-line no-console
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
