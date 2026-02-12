import { type Select, type ShopifyAppSubscription } from '@gadget-client/shopify-gadget-starter';
import { assert, type RouteContext, type ShopifyClient } from 'gadget-server';
import { type GetCurrentShopPlanQuery } from 'shared/_generated/admin.generated';

type CheckBillingResult = {
  hasActivePayment: boolean;
  appSubscriptions: Select<ShopifyAppSubscription, { id: true; status: true }>[];
};

export async function checkBilling({
  api,
  connections,
}: RouteContext): Promise<CheckBillingResult> {
  const currentShopId = String(connections.shopify.currentShopId);
  const shopify = assert(connections.shopify.current, 'unauthenticated');
  const devStore = await isDevStore(shopify);
  if (devStore) {
    return { hasActivePayment: true, appSubscriptions: [] };
  }

  const appSubscriptions = await api.actAsSession.shopifyAppSubscription.findMany({
    select: { id: true, status: true },
    first: 250,
  });

  const hasActiveSubscription = appSubscriptions.some(sub => sub.status === 'ACTIVE');
  if (hasActiveSubscription) {
    return { hasActivePayment: true, appSubscriptions };
  }

  const shopRecord = await api.shopifyShop.findById(currentShopId, {
    select: { chargeId: true },
  });
  const hasActiveCharge = Boolean(shopRecord.chargeId);

  if (hasActiveCharge) {
    return { hasActivePayment: true, appSubscriptions };
  }

  return { hasActivePayment: false, appSubscriptions };
}

async function isDevStore(shopify: ShopifyClient) {
  const QUERY = `#graphql
    query GetCurrentShopPlan {
      shop {
        plan {
          partnerDevelopment
        }
      }
    }
  `;

  const response: GetCurrentShopPlanQuery = await shopify.graphql(QUERY);
  return response.shop.plan.partnerDevelopment;
}
