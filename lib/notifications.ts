import Constants from 'expo-constants';
import { Platform } from 'react-native';

export type { NotificationSyncInput } from './notificationsImpl';

export function areNotificationsSupported(): boolean {
  if (Platform.OS === 'web') return false;
  return Constants.appOwnership !== 'expo';
}

export async function setupNotifications(language: import('@/types/models').Language): Promise<void> {
  if (!areNotificationsSupported()) return;

  const { setupNotifications: setup } =
    require('./notificationsImpl') as typeof import('./notificationsImpl');
  return setup(language);
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!areNotificationsSupported()) return false;

  const { requestNotificationPermissions: request } =
    require('./notificationsImpl') as typeof import('./notificationsImpl');
  return request();
}

export async function cancelAllNotifications(): Promise<void> {
  if (!areNotificationsSupported()) return;

  const { cancelAllNotifications: cancel } =
    require('./notificationsImpl') as typeof import('./notificationsImpl');
  return cancel();
}

export async function syncAllNotifications(
  input: import('./notificationsImpl').NotificationSyncInput
): Promise<void> {
  if (!areNotificationsSupported()) return;

  const { syncAllNotifications: sync } =
    require('./notificationsImpl') as typeof import('./notificationsImpl');
  return sync(input);
}
