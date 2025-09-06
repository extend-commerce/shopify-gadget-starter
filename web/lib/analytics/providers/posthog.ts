import { type PostHog } from 'posthog-js';
import { type AnalyticsEvent, type AnalyticsProvider } from './types';

export class PostHogAnalyticsProvider implements AnalyticsProvider {
  #posthog: PostHog | undefined;

  async init(): Promise<void> {
    if (!this.#posthog) await this.loadPostHog();

    if (!process.env.GADGET_PUBLIC_POSTHOG_API_KEY) {
      console.warn('GADGET_PUBLIC_POSTHOG_API_KEY not found'); // eslint-disable-line no-console
      return;
    }

    if (!process.env.GADGET_PUBLIC_POSTHOG_API_HOST) {
      console.warn('GADGET_PUBLIC_POSTHOG_API_HOST not found'); // eslint-disable-line no-console
      return;
    }

    this.#posthog?.init(process.env.GADGET_PUBLIC_POSTHOG_API_KEY, {
      api_host: process.env.GADGET_PUBLIC_POSTHOG_API_HOST,
      defaults: '2025-05-24',
    });
  }

  track(event: AnalyticsEvent, properties?: Record<string, JSONValue>): void {
    this.#posthog?.capture(event, properties);
  }

  identify(distinctId: string, properties?: Record<string, JSONValue>): void {
    this.#posthog?.identify(distinctId, properties);
  }

  async loadPostHog() {
    if (this.#posthog) return;

    try {
      this.#posthog = (await import('posthog-js')).default;
    } catch (_error) {
      console.warn('Error loading posthog'); // eslint-disable-line no-console
    }
  }
}
