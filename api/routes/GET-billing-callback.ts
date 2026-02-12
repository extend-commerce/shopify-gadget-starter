import { type RouteHandler } from 'gadget-server';

/**
 * Route handler for GET billing-callback
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{
  Querystring: { shop: string; charge_id: string };
}> = async ({ request, reply, api, logger }) => {
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

  const subscriptions = shopRedirectInfo.appSubscriptions.edges.map(e => e.node);

  if (subscriptions.some(sub => sub.status !== 'ACTIVE')) {
    logger.info(`no active subscription, storing chargeId temporarily for ${shop}`);
    await api.internal.shopifyShop.update(shopRedirectInfo.id, {
      chargeId: charge_id,
    });
  }

  return reply.redirect(`https://${shop}/admin/apps/${shopRedirectInfo.installedViaApiKey}`);
};

export default route;
