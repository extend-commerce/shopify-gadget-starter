import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { AnalyticsManager } from 'shared/analytics/manager';
import { MockAnalyticsProvider } from 'shared/analytics/providers/mock';
// import { MantleAnalyticsProvider } from 'shared/analytics/providers/mantle';
// import { MixpanelAnalyticsProvider } from 'shared/analytics/providers/mixpanel';
// import { PostHogAnalyticsProvider } from 'shared/analytics/providers/posthog';

const analyticsManager = new AnalyticsManager();
const AnalyticsContext = createContext<AnalyticsManager>(analyticsManager);

export const useAnalytics = () => useContext(AnalyticsContext);

interface AnalyticsContextProviderProps extends PropsWithChildren {
  distinctId?: string;
}

export function AnalyticsContextProvider({ children, distinctId }: AnalyticsContextProviderProps) {
  const [analyticsManager] = useState(() => new AnalyticsManager());

  useEffect(() => {
    async function onMount() {
      if (process.env.NODE_ENV === 'production') {
        // analyticsManager.addProvider(new MantleAnalyticsProvider());
        // analyticsManager.addProvider(new PostHogAnalyticsProvider());
        // analyticsManager.addProvider(new MixpanelAnalyticsProvider());
      } else {
        analyticsManager.addProvider(new MockAnalyticsProvider());
      }

      await analyticsManager.init();

      if (distinctId) {
        analyticsManager.identify(distinctId);
      }
    }

    onMount();
  }, [analyticsManager, distinctId]);

  return <AnalyticsContext.Provider value={analyticsManager}>{children}</AnalyticsContext.Provider>;
}
