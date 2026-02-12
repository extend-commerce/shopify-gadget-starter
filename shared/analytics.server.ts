import { AnalyticsManager } from './analytics/manager';
import { MockAnalyticsProvider } from './analytics/providers/mock';
// import { MixpanelServerAnalyticsProvider } from './analytics/providers/mixpanel.server';
// import { PostHogServerAnalyticsProvider } from './analytics/providers/posthog.server';

export async function getAnalytics() {
  const analyticsManager = new AnalyticsManager();

  // add providers
  if (process.env.NODE_ENV === 'production') {
    // analyticsManager.addProvider(new MixpanelServerAnalyticsProvider());
    // analyticsManager.addProvider(new PostHogServerAnalyticsProvider());
  } else {
    analyticsManager.addProvider(new MockAnalyticsProvider());
  }

  await analyticsManager.init();

  return analyticsManager;
}
