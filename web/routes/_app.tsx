import { Card, Page, Text } from '@shopify/polaris';
import { Fragment } from 'react';
import { Outlet } from 'react-router';
import { NavMenu } from 'web/components/nav-menu';
import { type Route } from './+types/_app';

export function loader({ context }: Route.LoaderArgs) {
  return { gadgetConfig: context.gadgetConfig };
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { gadgetConfig } = loaderData;

  if (!gadgetConfig.shopifyInstallState) return <Unauthenticated />;

  return (
    <Fragment>
      <NavMenu />
      <Outlet />
    </Fragment>
  );
}

function Unauthenticated() {
  return (
    <Page>
      <Card padding="500">
        <Text variant="headingLg" as="h1">
          App must be viewed in the Shopify Admin
        </Text>
      </Card>
    </Page>
  );
}
