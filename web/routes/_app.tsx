import { Suspense } from 'react';
import { Await, Outlet } from 'react-router';
import { generateFeaturebaseToken } from 'shared/featurebase.server';
import { Featurebase } from 'web/components/featurebase';
import { MantleProvider } from 'web/components/mantle-provider';
import { NavMenu } from 'web/components/nav-menu';
import { AnalyticsContextProvider } from 'web/lib/analytics';
import { type Route } from './+types/_app';

export async function loader({ context }: Route.LoaderArgs) {
  if (!context.gadgetConfig.shopifyInstallState) {
    return { gadgetConfig: context.gadgetConfig };
  }

  const shop = await context.api.shopifyShop.maybeFindFirst({
    select: { mantleApiToken: true },
  });

  // NOTE: streaming the featurebase token, because it is not needed for the initial render
  const featurebaseToken = generateFeaturebaseToken(context.api);

  return {
    gadgetConfig: context.gadgetConfig,
    customerApiToken: shop?.mantleApiToken,
    featurebaseToken,
  };
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { customerApiToken, gadgetConfig, featurebaseToken } = loaderData;

  if (!gadgetConfig.shopifyInstallState) {
    return <Unauthenticated />;
  }

  return (
    <AnalyticsContextProvider>
      <MantleProvider
        appId={process.env.GADGET_PUBLIC_MANTLE_APP_ID}
        customerApiToken={customerApiToken}
      >
        <NavMenu />
        <Outlet />
        {featurebaseToken ? (
          <Suspense fallback={null}>
            <Await resolve={featurebaseToken}>
              {token => <Featurebase featurebaseToken={token} />}
            </Await>
          </Suspense>
        ) : null}
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
