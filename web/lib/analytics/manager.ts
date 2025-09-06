import { type AnalyticsEvent, type AnalyticsProvider } from './providers/types';

export class AnalyticsManager {
  providers: AnalyticsProvider[] = [];
  #intialized = false;

  init() {
    if (this.#intialized) return;

    for (const provider of this.providers) {
      provider.init();
    }
    this.#intialized = true;
  }

  addProvider(provider: AnalyticsProvider) {
    this.providers.push(provider);
    if (this.#intialized) provider.init();
  }

  removeProvider(provider: AnalyticsProvider) {
    this.providers = this.providers.filter(p => p !== provider);
  }

  track(event: AnalyticsEvent, properties?: Record<string, JSONValue>) {
    for (const provider of this.providers) {
      provider.track(event, properties);
    }
  }

  identify(distinctId: string, properties?: Record<string, JSONValue>) {
    for (const provider of this.providers) {
      provider.identify(distinctId, properties);
    }
  }
}
