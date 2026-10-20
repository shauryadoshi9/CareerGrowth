/**
 * Privacy-Preserving Analytics Service
 * 
 * Strict privacy-by-design principles:
 * 1. Zero third-party trackers or external ad-tech beacons
 * 2. Strict compliance with "Do Not Track" (DNT) header and setting
 * 3. Respects user cookie/tracking consent preference
 * 4. Zero personally identifiable information (PII) captured or transmitted
 */

const CONSENT_KEY = 'careergrowth_cookie_consent';
const STORAGE_KEY = 'careergrowth_analytics_events';
const MAX_STORED_EVENTS = 100;

export interface AnalyticsEvent {
  id: string;
  type: 'pageview' | 'event';
  name: string;
  category?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

class AnalyticsService {
  private isDntEnabled(): boolean {
    if (typeof window === 'undefined') return true;
    const dnt = navigator.doNotTrack || (window as unknown as { doNotTrack?: string }).doNotTrack;
    return dnt === '1' || dnt === 'yes';
  }

  private hasConsent(): boolean {
    if (typeof window === 'undefined') return false;
    const consent = localStorage.getItem(CONSENT_KEY);
    // Explicit decline blocks tracking
    if (consent === 'declined') return false;
    return true;
  }

  public trackPageView(tabName: string): void {
    if (this.isDntEnabled() || !this.hasConsent()) return;

    this.recordEvent({
      id: `pv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'pageview',
      name: tabName,
      timestamp: new Date().toISOString()
    });
  }

  public trackEvent(category: string, action: string, metadata?: Record<string, string | number | boolean>): void {
    if (this.isDntEnabled() || !this.hasConsent()) return;

    this.recordEvent({
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'event',
      name: action,
      category,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  private recordEvent(event: AnalyticsEvent): void {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(STORAGE_KEY);
      const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
      events.push(event);

      // Keep only last N events to prevent storage bloat
      if (events.length > MAX_STORED_EVENTS) {
        events.splice(0, events.length - MAX_STORED_EVENTS);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // Ignore local storage quota errors safely
    }
  }

  public getStoredEvents(): AnalyticsEvent[] {
    try {
      if (typeof window === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public clearEvents(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const analytics = new AnalyticsService();
