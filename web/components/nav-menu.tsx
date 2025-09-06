import { NavMenu as AppBridgeNavMenu } from '@shopify/app-bridge-react';
import { Link } from 'react-router';

export function NavMenu() {
  return (
    <AppBridgeNavMenu>
      <Link to="/" rel="home">
        Shop Information
      </Link>
    </AppBridgeNavMenu>
  );
}
