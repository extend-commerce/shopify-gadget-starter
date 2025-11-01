import { MantleProvider as BaseMantleProvider } from '@heymantle/react';
import { type PropsWithChildren } from 'react';

type MantleProviderProps = PropsWithChildren<{
  appId: string | null | undefined;
  customerApiToken: string | null | undefined;
}>;

export function MantleProvider({
  children,
  appId,
  customerApiToken,
}: MantleProviderProps) {
  if (appId && customerApiToken) {
    return (
      <BaseMantleProvider appId={appId} customerApiToken={customerApiToken}>
        {children}
      </BaseMantleProvider>
    );
  }

  // eslint-disable-next-line no-console
  console.error(
    'Mantle not initialized. `appId` or `customerApiToken` not found',
  );

  return children;
}
