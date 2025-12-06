import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { AnalyticsManager } from './manager';
import { MockAnalyticsProvider } from './provider/mock';
// import { MantleAnalyticsProvider } from './providers/mantle';
// import { MixpanelAnalyticsProvider } from './providers/mixpanel';
// import { PostHogAnalyticsProvider } from './providers/posthog';

const analyticsManager = new AnalyticsManager();
const AnalyticsContext = createContext<AnalyticsManager>(analyticsManager);

export const useAnalytics = () => useContext(AnalyticsContext);

export function AnalyticsContextProvider({ children }: PropsWithChildren) {
  const [analyticsManager] = useState<AnalyticsManager>(
    () => new AnalyticsManager(),
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // analyticsManager.addProvider(new MantleAnalyticsProvider());
      // analyticsManager.addProvider(new PostHogAnalyticsProvider());
      // analyticsManager.addProvider(new MixpanelAnalyticsProvider());
    } else {
      // analyticsManager.addProvider(new MantleAnalyticsProvider());
      analyticsManager.addProvider(new MockAnalyticsProvider());
    }

    analyticsManager.init();
  }, [analyticsManager]);

  return (
    <AnalyticsContext.Provider value={analyticsManager}>
      {children}
    </AnalyticsContext.Provider>
  );
}
