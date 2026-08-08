import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { hasEventTime, parseIsoDate, parseIsoDateTime } from '@/lib/dateUtils';
import { getDefaultLanguage, translate } from '@/lib/i18n';
import { Language, Obligation, WeddingEvent } from '@/types/models';

export type NotificationSyncInput = {
  enabled: boolean;
  events: WeddingEvent[];
  obligations: Obligation[];
  language: Language;
};

const CHANNEL_ID = 'reminders';
const ID_PREFIX = 'mpp-';
const DATE_ONLY_HOUR = 12;
const DATE_ONLY_MINUTE = 0;

let infrastructureReady = false;
let permissionsGranted = false;

function notificationId(kind: string, entityId: string, suffix: string): string {
  return `${ID_PREFIX}${kind}-${entityId}-${suffix}`;
}

function atLocalTime(source: Date, hours: number, minutes: number): Date {
  const date = new Date(source);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function addDays(source: Date, days: number): Date {
  const date = new Date(source);
  date.setDate(date.getDate() + days);
  return date;
}

function addHours(source: Date, hours: number): Date {
  return new Date(source.getTime() + hours * 60 * 60 * 1000);
}

function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}

function getEventAnchorDate(event: WeddingEvent): Date | undefined {
  const parsed = parseIsoDateTime(event.date);
  if (!parsed) return undefined;

  if (hasEventTime(event.date)) {
    return parsed;
  }

  return atLocalTime(parsed, DATE_ONLY_HOUR, DATE_ONLY_MINUTE);
}

function getObligationAnchorDate(obligation: Obligation): Date | undefined {
  const parsed = parseIsoDate(obligation.date);
  if (!parsed) return undefined;
  return atLocalTime(parsed, DATE_ONLY_HOUR, DATE_ONLY_MINUTE);
}

async function ensureInfrastructure(language: Language): Promise<void> {
  if (infrastructureReady) {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: translate(language, 'notifications.channelName'),
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: translate(language, 'notifications.channelName'),
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  infrastructureReady = true;
}

async function refreshPermissionStatus(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  permissionsGranted = status === 'granted';
  return permissionsGranted;
}

export async function setupNotifications(language: Language): Promise<void> {
  await ensureInfrastructure(language);
}

export async function requestNotificationPermissions(): Promise<boolean> {
  await ensureInfrastructure(getDefaultLanguage());

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') {
    permissionsGranted = true;
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  permissionsGranted = status === 'granted';
  return permissionsGranted;
}

export async function hasNotificationPermissions(): Promise<boolean> {
  return refreshPermissionStatus();
}

export async function cancelAllNotifications(): Promise<void> {
  if (!areNotificationsModuleAvailable()) return;

  await ensureInfrastructure(getDefaultLanguage());

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.identifier.startsWith(ID_PREFIX))
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier))
  );
}

function areNotificationsModuleAvailable(): boolean {
  return Platform.OS !== 'web';
}

async function scheduleAt(
  identifier: string,
  title: string,
  body: string,
  date: Date
): Promise<void> {
  if (!permissionsGranted || !isFuture(date)) return;

  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title,
      body,
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    },
  });
}

function buildEventSchedules(
  event: WeddingEvent,
  language: Language
): Array<{ id: string; title: string; body: string; date: Date }> {
  const anchor = getEventAnchorDate(event);
  if (!anchor) return [];

  const schedules: Array<{ id: string; title: string; body: string; date: Date }> = [];
  const eventName = event.name.trim() || translate(language, 'app.name');

  const sevenDaysBefore = addDays(anchor, -7);
  if (isFuture(sevenDaysBefore)) {
    schedules.push({
      id: notificationId('event', event.id, '7d'),
      title: translate(language, 'notifications.event7DaysTitle'),
      body: translate(language, 'notifications.event7DaysBody', { eventName }),
      date: sevenDaysBefore,
    });
  }

  const twentyFourHoursBefore = addHours(anchor, -24);
  if (isFuture(twentyFourHoursBefore)) {
    schedules.push({
      id: notificationId('event', event.id, '24h'),
      title: translate(language, 'notifications.event24HoursTitle'),
      body: translate(language, 'notifications.event24HoursBody', { eventName }),
      date: twentyFourHoursBefore,
    });
  }

  const oneHourBefore = addHours(anchor, -1);
  if (isFuture(oneHourBefore)) {
    schedules.push({
      id: notificationId('event', event.id, '1h'),
      title: translate(language, 'notifications.event1HourTitle'),
      body: translate(language, 'notifications.event1HourBody', { eventName }),
      date: oneHourBefore,
    });
  }

  return schedules;
}

function buildObligationSchedules(
  obligation: Obligation,
  eventName: string,
  language: Language
): Array<{ id: string; title: string; body: string; date: Date }> {
  const anchor = getObligationAnchorDate(obligation);
  if (!anchor) return [];

  const title = obligation.title.trim();
  if (!title) return [];

  const schedules: Array<{ id: string; title: string; body: string; date: Date }> = [];
  const safeEventName = eventName.trim() || translate(language, 'app.name');

  const twentyFourHoursBefore = addHours(anchor, -24);
  if (isFuture(twentyFourHoursBefore)) {
    schedules.push({
      id: notificationId('obligation', obligation.id, '24h'),
      title: translate(language, 'notifications.obligationTomorrowTitle'),
      body: translate(language, 'notifications.obligationTomorrowBody', {
        title,
        eventName: safeEventName,
      }),
      date: twentyFourHoursBefore,
    });
  }

  if (isFuture(anchor)) {
    schedules.push({
      id: notificationId('obligation', obligation.id, 'day'),
      title: translate(language, 'notifications.obligationTodayTitle'),
      body: translate(language, 'notifications.obligationTodayBody', {
        title,
        eventName: safeEventName,
      }),
      date: anchor,
    });
  }

  return schedules;
}

export async function syncAllNotifications(input: NotificationSyncInput): Promise<void> {
  await ensureInfrastructure(input.language);

  if (!input.enabled) {
    await cancelAllNotifications();
    return;
  }

  const granted = await refreshPermissionStatus();
  if (!granted) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.identifier.startsWith(ID_PREFIX))
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier))
  );

  const eventNames = new Map(input.events.map((event) => [event.id, event.name]));
  const schedules = [
    ...input.events.flatMap((event) => buildEventSchedules(event, input.language)),
    ...input.obligations.flatMap((obligation) =>
      buildObligationSchedules(
        obligation,
        eventNames.get(obligation.eventId) ?? '',
        input.language
      )
    ),
  ];

  await Promise.all(
    schedules.map((item) => scheduleAt(item.id, item.title, item.body, item.date))
  );
}
