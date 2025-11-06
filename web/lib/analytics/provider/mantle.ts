import { type AnalyticsEvent, type AnalyticsProvider } from '../types';

interface MantleAnalytics {
  track: (event: string) => void;
}

function getMantleFromWindow(): MantleAnalytics | undefined {
  const windowWithMantle = window as unknown as Record<string, unknown>;
  const mantleTrack = windowWithMantle['mantleTrack'];

  if (mantleTrack && checkMantleAnalytics(mantleTrack)) {
    return mantleTrack;
  }

  return undefined;
}

export class MantleAnalyticsProvider implements AnalyticsProvider {
  private mantle: MantleAnalytics | undefined;

  async init(): Promise<void> {
    if (!this.mantle) await this.#loadMantle();
  }

  track(event: AnalyticsEvent, _properties: Record<string, JSONValue>): void {
    this.mantle?.track(event);
  }

  identify(_distinctId: string, _properties?: Record<string, JSONValue>): void {
    // Mantle app track script doesn't support identify
  }

  async #loadMantle() {
    this.mantle = await new Promise<MantleAnalytics | undefined>(resolve => {
      // Check if Mantle is already loaded
      const existingMantle = this.#getExistingMantle();
      if (existingMantle) {
        return resolve(existingMantle);
      }

      // Remove any existing script tags before loading a new one
      this.#removeExistingScripts();

      // Load the Mantle script
      this.#loadMantleScript().then(resolve);
    });
  }

  #getExistingMantle(): MantleAnalytics | undefined {
    const scriptExists =
      document.querySelector('#mantle-apptrack-script') !== null;
    const mantleTrackExists = 'mantleTrack' in window;

    if (scriptExists && mantleTrackExists) {
      return getMantleFromWindow();
    }

    return undefined;
  }

  #removeExistingScripts(): void {
    const existingScripts = document.querySelectorAll(
      '#mantle-apptrack-script',
    );
    existingScripts.forEach(script => script.remove());
  }

  #loadMantleScript(): Promise<MantleAnalytics | undefined> {
    return new Promise<MantleAnalytics | undefined>(resolve => {
      const appToken = process.env.GADGET_PUBLIC_MANTLE_APP_TOKEN;
      const scriptUrl = `https://cdn.heymantle.com/mantle_apptrack.js?appToken=${appToken}`;

      const scriptTag = document.createElement('script');
      scriptTag.async = true;
      scriptTag.src = scriptUrl;
      scriptTag.id = 'mantle-apptrack-script';

      scriptTag.onload = () => {
        const mantle = getMantleFromWindow();
        if (mantle) {
          resolve(mantle);
        } else {
          console.warn('Failed to load mantle-apptrack-script'); // eslint-disable-line no-console
          resolve(undefined);
        }
      };

      document.head.appendChild(scriptTag);
    });
  }
}

function checkMantleAnalytics(mantle: unknown): mantle is MantleAnalytics {
  return (
    typeof mantle === 'object' &&
    mantle !== null &&
    'track' in mantle &&
    typeof mantle.track === 'function'
  );
}
