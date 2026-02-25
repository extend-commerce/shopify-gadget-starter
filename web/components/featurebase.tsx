import { useEffect } from 'react';
import { useAsyncValue } from 'react-router';

const FEATUREBASE_APP_ID = process.env.GADGET_PUBLIC_FEATUREBASE_APP_ID;

type ResolvedAsyncValue = Nullable<{
  featurebaseToken: string | null;
  customer: {
    id: string;
    name: string;
    locale: string;
    email: string;
  };
}>;

export function Featurebase() {
  const asyncValue = useAsyncValue() as ResolvedAsyncValue;

  useEffect(() => {
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

    const { featurebaseToken, customer } = asyncValue ?? {};
    win.Featurebase('boot', {
      appId: FEATUREBASE_APP_ID,
      featurebaseJwt: featurebaseToken,
      userId: customer?.id, // Featurebase expects a string
      name: customer?.name,
      language: customer?.locale,
      email: customer?.email,
    });
  }, [asyncValue]);

  return null;
}
