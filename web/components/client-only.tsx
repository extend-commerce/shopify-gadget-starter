import { Fragment } from 'react';
import { useHydrated } from 'web/hooks/use-hydrated';

export interface ClientOnlyProps {
  /**
   * The children to render when the JS is loaded.
   */
  children: React.ReactNode;
  /**
   * The fallback component to render if the JS is not yet loaded.
   */
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  return useHydrated() ? <Fragment>{children}</Fragment> : <Fragment>{fallback}</Fragment>;
}
