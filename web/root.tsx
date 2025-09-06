import {
  AppType,
  Provider as GadgetProvider,
} from '@gadgetinc/react-shopify-app-bridge';
import { AppProvider } from '@shopify/polaris';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import enTranslations from '@shopify/polaris/locales/en.json';
import { type RouteContext } from 'gadget-server';
import { ErrorBoundary as DefaultGadgetErrorBoundary } from 'gadget-server/react-router';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  type LinksFunction,
  type MetaFunction,
} from 'react-router';
import { type Route } from './+types/root';
import { api } from './api';
import './app.css';
import { AdaptorLink } from './components/adaptor-link';
import { FullPageSpinner } from './components/full-page-spinner';
import { AnalyticsContextProvider } from './lib/analytics';

declare module 'react-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AppLoadContext extends RouteContext {}
}

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://cdn.shopify.com' },
  { rel: 'stylesheet', href: 'https://assets.gadget.dev/assets/reset.min.css' },
  {
    rel: 'stylesheet',
    href: 'https://cdn.shopify.com/static/fonts/inter/v4/styles.css',
  },
  { rel: 'stylesheet', href: polarisStyles },
];

export const meta: MetaFunction = () => [
  { charset: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  {
    name: 'shopify-api-key',
    suppressHydrationWarning: true,
    content: '%SHOPIFY_API_KEY%',
  },
  { title: 'Shopify Gadget Starter' },
];

export async function loader({ context }: Route.LoaderArgs) {
  const shop = await context.api.shopifyShop.maybeFindFirst({
    select: { mantleApiToken: true },
  });

  return {
    gadgetConfig: context.gadgetConfig,
    customerApiToken: shop?.mantleApiToken,
  };
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { gadgetConfig } = loaderData;
  const location = useLocation();

  return (
    <html lang="en" className="light">
      <head>
        <Meta />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
        <Links />
      </head>
      <body>
        <AnalyticsContextProvider>
          {/*<MantleProvider
            appId={process.env.GADGET_PUBLIC_MANTLE_APP_ID}
            customerApiToken={customerApiToken}
          > */}
          <GadgetProvider
            type={AppType.Embedded}
            shopifyApiKey={gadgetConfig.apiKeys.shopify ?? ''}
            api={api}
            location={location}
            shopifyInstallState={gadgetConfig.shopifyInstallState}
          >
            <AppProvider i18n={enTranslations} linkComponent={AdaptorLink}>
              <Outlet />
            </AppProvider>
          </GadgetProvider>
          {/* </MantleProvider> */}
        </AnalyticsContextProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <FullPageSpinner />;
}

// Default Gadget error boundary component
// This can be replaced with your own custom error boundary implementation
// For more info, checkout https://reactrouter.com/how-to/error-boundary#1-add-a-root-error-boundary
export const ErrorBoundary = DefaultGadgetErrorBoundary;
