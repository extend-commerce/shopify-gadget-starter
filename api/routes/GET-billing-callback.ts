import { type RouteHandler } from 'gadget-server';
import { type CheckActiveAppSubscriptionsQuery } from '../../shared/_generated/admin.generated';

const CHECK_ACTIVE_SUBSCRIPTIONS_QUERY = `#graphql
  query CheckActiveAppSubscriptions {
    currentAppInstallation {
      activeSubscriptions {
        id
        status
      }
    }
  }
`;

/**
 * Route handler for GET billing-callback
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{
  Querystring: { shop: string; charge_id: string };
}> = async ({ request, reply, api, logger, connections }) => {
  const { charge_id, shop } = request.query;

  const shopRedirectInfo = await api.shopifyShop.findFirst({
    filter: {
      myshopifyDomain: { equals: shop },
    },
    select: {
      id: true,
      installedViaApiKey: true,
      appSubscriptions: {
        edges: {
          node: { status: true },
        },
      },
    },
  });

  const shopify = await connections.shopify.forShopDomain(shop);
  const response: CheckActiveAppSubscriptionsQuery = await shopify.graphql(
    CHECK_ACTIVE_SUBSCRIPTIONS_QUERY,
  );

  const activeSubscriptions = response.currentAppInstallation.activeSubscriptions.filter(
    sub => sub.status === 'ACTIVE',
  );

  const subscriptions = shopRedirectInfo.appSubscriptions.edges.map(e => e.node);

  // we store the charge id in case the subscriptions hasn't synced to the gadget DB yet, but the transaction has been completed on shopify's end
  if (subscriptions.every(sub => sub.status !== 'ACTIVE') && activeSubscriptions.length > 0) {
    logger.info(`no active subscription in gadget, storing chargeId temporarily for ${shop}`);
    await api.internal.shopifyShop.update(shopRedirectInfo.id, {
      chargeId: charge_id,
    });
  }

  return reply.redirect(`https://${shop}/admin/apps/${shopRedirectInfo.installedViaApiKey}`);
};

export default route;
