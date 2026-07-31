import { generateFeaturebaseToken } from '@packages/shared/featurebase.server';
import { getCurrentUser, safeUser } from '@packages/shared/user.server';
import { Suspense } from 'react';
import { Await, Outlet } from 'react-router';
import { Featurebase } from 'web/components/featurebase';
import { NavMenu } from 'web/components/nav-menu';
import { AnalyticsContextProvider } from 'web/lib/analytics';
import { type Route } from './+types/_app';

export async function loader({ context }: Route.LoaderArgs) {
  if (!context.gadgetConfig.shopifyInstallState) {
    return { gadgetConfig: context.gadgetConfig };
  }

  const shopifyApp = await context.api.shopifyApp.maybeFindFirst({
    select: { handle: true },
  });

  // NOTE: turning the customer info into a promise to allow streaming, because it is not needed for the initial render
  const customerInfo = getCurrentUser(context.connections.shopify)
    .then(merchant => {
      if (!merchant) {
        return null;
      }

      const customer = safeUser(merchant); // only sending the required properties of the customer
      return { customer, featurebaseToken: generateFeaturebaseToken(customer) };
    })
    .catch(() => null);

  return {
    gadgetConfig: context.gadgetConfig,
    customerInfo,
    distinctId: context.connections.shopify.currentShopId?.toString(),
    appHandle: shopifyApp?.handle,
  };
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { gadgetConfig, customerInfo, appHandle } = loaderData;

  if (!gadgetConfig.shopifyInstallState) {
    return <Unauthenticated />;
  }

  return (
    <AnalyticsContextProvider distinctId={loaderData.distinctId}>
      <NavMenu appHandle={appHandle} />
      <Outlet />
      <Suspense fallback={null}>
        <Await resolve={customerInfo}>
          <Featurebase />
        </Await>
      </Suspense>
    </AnalyticsContextProvider>
  );
}

function Unauthenticated() {
  return (
    <s-page>
      <s-section padding="base">
        <s-heading>App must be viewed in the Shopify Admin</s-heading>
      </s-section>
    </s-page>
  );
}
