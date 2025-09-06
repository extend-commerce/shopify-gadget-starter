import { minutesToMilliseconds } from 'date-fns/minutesToMilliseconds';
import { type OverridedMixpanel } from 'mixpanel-browser';
import { type AnalyticsProvider } from './types';

export class MixpanelAnalyticsProvider implements AnalyticsProvider {
  #mixpanel: OverridedMixpanel | undefined;

  constructor() {
    this.loadMixpanel();
  }

  async init() {
    if (!this.#mixpanel) await this.loadMixpanel();

    if (!process.env.GADGET_PUBLIC_MIXPANEL_TOKEN) {
      console.warn('GADGET_PUBLIC_MIXPANEL_TOKEN not found'); // eslint-disable-line no-console
      return;
    }

    this.#mixpanel?.init(process.env.GADGET_PUBLIC_MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV === 'development',
      persistence: 'localStorage',

      // Session Replay Settings https://docs.mixpanel.com/docs/session-replay/session-replay-web
      record_sessions_percent: 100,
      record_max_ms: minutesToMilliseconds(30),
      record_mask_text_selector: '*',
    });
  }

  track(event: string, properties?: Record<string, JSONValue>): void {
    this.#mixpanel?.track(event, properties);
  }

  identify(distinctId: string, properties?: Record<string, JSONValue>): void {
    this.#mixpanel?.identify(distinctId);

    if (properties) {
      this.#mixpanel?.people.set(properties);
    }
  }

  async loadMixpanel() {
    if (this.#mixpanel) return;

    try {
      this.#mixpanel = (await import('mixpanel-browser')).default;
    } catch (_error) {
      console.warn('Error loading mixpanel-browser'); // eslint-disable-line no-console
    }
  }
}
