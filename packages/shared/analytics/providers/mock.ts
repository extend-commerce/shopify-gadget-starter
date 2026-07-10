/* eslint-disable no-console */
import { type AnalyticsEvent, type AnalyticsProvider } from '../types';

export class MockAnalyticsProvider implements AnalyticsProvider {
  async init(): Promise<void> {
    console.log('[MockAnalyticsProvider] initialized');
  }

  track(event: AnalyticsEvent, properties: Record<string, JSONValue>): void {
    console.log('[MockAnalyticsProvider] track', event, properties);
  }

  identify(distinctId: string, properties?: Record<string, JSONValue>): void {
    console.log('[MockAnalyticsProvider] identify', distinctId, properties);
  }
}
