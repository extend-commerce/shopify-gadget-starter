import {
  AppType,
  Provider as GadgetProvider,
} from '@gadgetinc/react-shopify-app-bridge';
import { useAppBridge } from '@shopify/app-bridge-react';
import { type RouteContext } from 'gadget-server';
import { ErrorBoundary as DefaultGadgetErrorBoundary } from 'gadget-server/react-router';
import { useEffect } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
  useNavigation,
  type LinksFunction,
  type MetaFunction,
} from 'react-router';
import { type Route } from './+types/root';
import { api } from './api';
import './app.css';
import { FullPageSpinner } from './components/full-page-spinner';

declare module 'react-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AppLoadContext extends RouteContext {}
}

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://cdn.shopify.com/' },
  {
    rel: 'stylesheet',
    href: 'https://cdn.shopify.com/static/fonts/inter/v4/styles.css',
  },
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
  return {
    gadgetConfig: context.gadgetConfig,
  };
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { gadgetConfig } = loaderData;
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  const shopify = useAppBridge();

  useEffect(() => {
    shopify.loading(isNavigating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavigating]);

  useEffect(() => {
    function handleNavigate(event: Event) {
      const target = event.target as HTMLElement | null;
      const href = target?.getAttribute('href');
      if (href) navigate(href);
    }

    document.addEventListener('shopify:navigate', handleNavigate);

    return () => {
      document.removeEventListener('shopify:navigate', handleNavigate);
    };
  }, [navigate]);

  return (
    <html lang="en" className="light">
      <head>
        <Meta />
        <Links />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
        <script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
      </head>
      <body>
        <GadgetProvider
          type={AppType.Embedded}
          shopifyApiKey={gadgetConfig.apiKeys.shopify ?? ''}
          api={api}
          location={location}
          shopifyInstallState={gadgetConfig.shopifyInstallState}
        >
          <Outlet />
        </GadgetProvider>
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
