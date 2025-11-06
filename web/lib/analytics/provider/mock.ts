import { type AnalyticsEvent, type AnalyticsProvider } from '../types';

export class MockAnalyticsProvider implements AnalyticsProvider {
  init(): void {
    console.log('[MockAnalyticsProvider] initialized'); // eslint-disable-line no-console
  }

  track(event: AnalyticsEvent, properties: Record<string, JSONValue>): void {
    console.log('[MockAnalyticsProvider] track', event, properties); // eslint-disable-line no-console
  }

  identify(distinctId: string, properties?: Record<string, JSONValue>): void {
    console.log('[MockAnalyticsProvider] identify', distinctId, properties); // eslint-disable-line no-console
  }
}
