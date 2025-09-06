export type AnalyticsEvent = string & {};

export interface AnalyticsProvider {
  init(): void;
  track(event: AnalyticsEvent, properties?: Record<string, JSONValue>): void;
  identify(distinctId: string, properties?: Record<string, JSONValue>): void;
}
