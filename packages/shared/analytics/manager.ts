import { type AnalyticsEvent, type AnalyticsProvider } from './types';

export class AnalyticsManager {
  providers: AnalyticsProvider[] = [];
  #initialized = false;

  async init() {
    if (this.#initialized) return;

    const results = await Promise.allSettled(this.providers.map(provider => provider.init()));
    results.forEach(result => {
      if (result.status === 'rejected') {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize analytics provider', result.reason);
      }
    });
    this.#initialized = true;
  }

  addProvider(provider: AnalyticsProvider) {
    this.providers.push(provider);
    if (this.#initialized) {
      // eslint-disable-next-line no-console
      provider.init().catch(e => console.error('Failed to init analytics provider', e));
    }
  }

  removeProvider(provider: AnalyticsProvider) {
    this.providers = this.providers.filter(p => p !== provider);
  }

  track(event: AnalyticsEvent, properties?: Record<string, JSONValue>) {
    if (!this.#initialized) {
      // eslint-disable-next-line no-console
      console.warn('AnalyticsManager not initialized');
      return;
    }

    for (const provider of this.providers) {
      provider.track(event, properties);
    }
  }

  identify(distinctId: string, properties?: Record<string, JSONValue>) {
    if (!this.#initialized) {
      // eslint-disable-next-line no-console
      console.warn('AnalyticsManager not initialized');
      return;
    }

    for (const provider of this.providers) {
      provider.identify(distinctId, properties);
    }
  }
}
