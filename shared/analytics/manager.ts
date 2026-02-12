import { type AnalyticsEvent, type AnalyticsProvider } from './types';

export class AnalyticsManager {
  providers: AnalyticsProvider[] = [];
  #initialized = false;

  async init() {
    if (this.#initialized) return;

    await Promise.allSettled(this.providers.map(provider => provider.init()));
    this.#initialized = true;
  }

  addProvider(provider: AnalyticsProvider) {
    this.providers.push(provider);
    if (this.#initialized) provider.init();
  }

  removeProvider(provider: AnalyticsProvider) {
    this.providers = this.providers.filter(p => p !== provider);
  }

  track(event: AnalyticsEvent, properties?: Record<string, JSONValue>) {
    if (!this.#initialized) {
      console.warn('AnalyticsManager not initialized'); // eslint-disable-line no-console
      return;
    }

    for (const provider of this.providers) {
      provider.track(event, properties);
    }
  }

  identify(distinctId: string, properties?: Record<string, JSONValue>) {
    if (!this.#initialized) {
      console.warn('AnalyticsManager not initialized'); // eslint-disable-line no-console
      return;
    }

    for (const provider of this.providers) {
      provider.identify(distinctId, properties);
    }
  }
}
