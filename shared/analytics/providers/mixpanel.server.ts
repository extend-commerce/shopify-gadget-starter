import Mixpanel from 'mixpanel';
import { type AnalyticsEvent, type AnalyticsProvider } from '../types';

export class MixpanelServerAnalyticsProvider implements AnalyticsProvider {
  #mixpanel: Mixpanel.Mixpanel | null = null;

  async init() {
    if (!process.env.GADGET_PUBLIC_MIXPANEL_TOKEN) {
      console.error('GADGET_PUBLIC_MIXPANEL_TOKEN not found'); // eslint-disable-line no-console
      return Promise.resolve();
    }

    this.#mixpanel = Mixpanel.init(process.env.GADGET_PUBLIC_MIXPANEL_TOKEN);
  }

  track(event: AnalyticsEvent, properties?: Record<string, JSONValue>): void {
    this.#mixpanel?.track(event, properties ?? {});
  }

  identify(distinctId: string, properties?: Record<string, JSONValue>): void {
    if (properties) {
      this.#mixpanel?.people.set(distinctId, properties);
    }
  }
}
