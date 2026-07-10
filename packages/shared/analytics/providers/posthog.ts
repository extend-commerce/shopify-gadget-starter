import { type PostHog } from 'posthog-js';
import { type AnalyticsEvent, type AnalyticsProvider } from '../types';

export class PostHogAnalyticsProvider implements AnalyticsProvider {
  #posthog: PostHog | undefined;

  async init(): Promise<void> {
    if (!this.#posthog) await this.loadPostHog();

    if (!process.env.GADGET_PUBLIC_POSTHOG_API_KEY) {
      // eslint-disable-next-line no-console
      console.warn('GADGET_PUBLIC_POSTHOG_API_KEY not found');
      return;
    }

    if (!process.env.GADGET_PUBLIC_POSTHOG_API_HOST) {
      // eslint-disable-next-line no-console
      console.warn('GADGET_PUBLIC_POSTHOG_API_HOST not found');
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.#posthog = (await import('posthog-js')).default;
    } catch (_error) {
      // eslint-disable-next-line no-console
      console.warn('Error loading posthog');
    }
  }
}
