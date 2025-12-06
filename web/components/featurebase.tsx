import { useMantle } from '@heymantle/react';
import { useEffect } from 'react';

const FEATUREBASE_APP_ID = process.env.GADGET_PUBLIC_FEATUREBASE_APP_ID;

interface FeaturebaseProps {
  featurebaseToken: string;
}

export function Featurebase({ featurebaseToken }: FeaturebaseProps) {
  const { customer, loading } = useMantle();

  useEffect(() => {
    if (loading) return;

    const script = document.createElement('script');
    script.src = 'https://do.featurebase.app/js/sdk.js';
    script.id = 'featurebase-sdk';
    document.head.appendChild(script);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    if (typeof win.Featurebase !== 'function') {
      win.Featurebase = function () {
        // eslint-disable-next-line prefer-rest-params
        (win.Featurebase.q = win.Featurebase.q || []).push(arguments);
      };
    }

    win.Featurebase('boot', {
      appId: FEATUREBASE_APP_ID,
      featurebaseJwt: featurebaseToken,
      userId: customer?.id,
      name: customer?.name,
    });
  }, [customer, featurebaseToken, loading]);

  return null;
}
