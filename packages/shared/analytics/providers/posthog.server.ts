import { PostHog } from 'posthog-node';
import { type AnalyticsEvent, type AnalyticsProvider } from '../types';

export class PostHogServerAnalyticsProvider implements AnalyticsProvider {
  #posthog: PostHog | null = null;

  async init() {
    if (!process.env.GADGET_PUBLIC_POSTHOG_API_HOST) {
      // eslint-disable-next-line no-console
      console.error('GADGET_PUBLIC_POSTHOG_API_HOST not found');
      return Promise.resolve();
    }

    if (!process.env.GADGET_PUBLIC_POSTHOG_API_KEY) {
      // eslint-disable-next-line no-console
      console.error('GADGET_PUBLIC_POSTHOG_API_KEY not found');
      return Promise.resolve();
    }

    this.#posthog = new PostHog(process.env.GADGET_PUBLIC_POSTHOG_API_KEY, {
      host: process.env.GADGET_PUBLIC_POSTHOG_API_HOST,
    });
  }

  track(event: AnalyticsEvent, properties?: Record<string, JSONValue>): void {
    this.#posthog?.capture({
      event,
      properties: properties ?? {},
      distinctId: properties?.distinct_id as string | undefined,
    });
  }

  identify(distinctId: string, properties?: Record<string, JSONValue>): void {
    this.#posthog?.identify({ distinctId, properties });
  }
}
