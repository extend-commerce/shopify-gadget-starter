import { type Client } from '@gadget-client/shopify-gadget-starter';
import jwt from 'jsonwebtoken';
import { getCurrentCustomer } from './mantle.server';

export async function generateFeaturebaseToken(api: Client) {
  if (!process.env.FEATUREBASE_SECRET) {
    console.error('FEATUREBASE_SECRET not found'); // eslint-disable-line no-console
    return null;
  }

  const customer = await getCurrentCustomer(api);

  if (!customer) {
    return null;
  }

  const shop = await api.shopifyShop.maybeFindFirst({
    select: {
      customerEmail: true,
    },
  });

  const customerData = {
    name: customer.name,
    email: shop?.customerEmail,
    userId: customer.id,
  };

  return jwt.sign(customerData, process.env.FEATUREBASE_SECRET, {
    algorithm: 'HS256',
  });
}
