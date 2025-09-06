import { type AnalyticsEvent, type AnalyticsProvider } from './types';

interface MantleAnalytics {
  track: (event: string) => void;
}

export class MantleAnalyticsProvider implements AnalyticsProvider {
  private mantle: MantleAnalytics | undefined;

  async init(): Promise<void> {
    if (!this.mantle) await this.#loadMantle();
  }

  track(event: AnalyticsEvent, _properties: Record<string, JSONValue>): void {
    this.mantle?.track(event);
  }

  identify(_: string, __?: Record<string, JSONValue>): void {
    // Mantle app track script doesn't support identify
  }

  async #loadMantle() {
    this.mantle = await new Promise<MantleAnalytics | undefined>(resolve => {
      if (
        document.querySelector('mantle-apptrack-script') &&
        'mantleTrack' in window &&
        checkMantleAnalytics(window['mantleTrack'])
      ) {
        return resolve(window.mantleTrack);
      }

      document
        .querySelectorAll('mantle-apptrack-script')
        .forEach(script => script.remove());

      const mantleScript = `https://cdn.heymantle.com/mantle_apptrack.js?appToken=${process.env.GADGET_PUBLIC_MANTLE_APP_TOKEN}`;
      const scriptTag = document.createElement('script');
      scriptTag.async = true;
      scriptTag.src = mantleScript;
      scriptTag.id = 'mantle-apptrack-script';
      scriptTag.onload = () => {
        if (
          'mantleTrack' in window &&
          checkMantleAnalytics(window.mantleTrack)
        ) {
          resolve(window.mantleTrack);
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
