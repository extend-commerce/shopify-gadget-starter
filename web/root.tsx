import {
  AppType,
  Provider as GadgetProvider,
} from '@gadgetinc/react-shopify-app-bridge';
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
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
        <script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
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
