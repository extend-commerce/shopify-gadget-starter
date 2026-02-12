import { Suspense } from 'react';
import { Await, Outlet } from 'react-router';
import { generateFeaturebaseToken } from 'shared/featurebase.server';
import { getCurrentUser, safeUser } from 'shared/user.server';
import { Featurebase } from 'web/components/featurebase';
import { MantleProvider } from 'web/components/mantle-provider';
import { NavMenu } from 'web/components/nav-menu';
import { AnalyticsContextProvider } from 'web/lib/analytics';
import { type Route } from './+types/_app';

export async function loader({ context }: Route.LoaderArgs) {
  if (!context.gadgetConfig.shopifyInstallState) {
    return { gadgetConfig: context.gadgetConfig };
  }

  const shop = await context.api.shopifyShop.findFirst({
    select: { mantleApiToken: true, id: true },
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
    customerApiToken: shop.mantleApiToken,
    customerInfo,
    distinctId: shop.id,
  };
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { customerApiToken, gadgetConfig, customerInfo } = loaderData;

  if (!gadgetConfig.shopifyInstallState) {
    return <Unauthenticated />;
  }

  return (
    <AnalyticsContextProvider distinctId={loaderData.distinctId}>
      <MantleProvider
        appId={process.env.GADGET_PUBLIC_MANTLE_APP_ID}
        customerApiToken={customerApiToken}
      >
        <NavMenu />
        <Outlet />
        <Suspense fallback={null}>
          <Await resolve={customerInfo}>
            <Featurebase />
          </Await>
        </Suspense>
      </MantleProvider>
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
