import { Language, Obligation, WeddingEvent } from '@/types/models';

export type NotificationSyncInput = {
  enabled: boolean;
  events: WeddingEvent[];
  obligations: Obligation[];
  language: Language;
};

export function areNotificationsSupported(): boolean {
  return false;
}

export async function setupNotifications(_language: Language): Promise<void> {}

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function cancelAllNotifications(): Promise<void> {}

export async function syncAllNotifications(_input: NotificationSyncInput): Promise<void> {}
