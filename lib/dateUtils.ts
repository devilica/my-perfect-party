import { Language } from '@/types/models';

export function parseIsoDate(value?: string): Date | undefined {
  if (!value?.trim()) return undefined;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return undefined;
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

export function parseIsoDateTime(value?: string): Date | undefined {
  if (!value?.trim()) return undefined;

  const trimmed = value.trim();
  const dateOnly = parseIsoDate(trimmed);
  if (dateOnly && !trimmed.includes('T')) return dateOnly;

  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(trimmed);
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hours = Number(match[4]);
  const minutes = Number(match[5]);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (Number.isNaN(date.getTime())) return undefined;
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hours ||
    date.getMinutes() !== minutes
  ) {
    return undefined;
  }

  return date;
}

export function hasEventTime(value?: string): boolean {
  return Boolean(value?.trim().includes('T'));
}

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatIsoDateTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formatIsoDate(date)}T${hours}:${minutes}`;
}

function formatDateDdMmYyyy(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function formatDisplayDate(value: string | undefined, _locale: Language): string {
  const parsed = parseIsoDateTime(value);
  if (!parsed) return value ?? '';

  if (hasEventTime(value)) {
    const hours = String(parsed.getHours()).padStart(2, '0');
    const minutes = String(parsed.getMinutes()).padStart(2, '0');
    return `${formatDateDdMmYyyy(parsed)} ${hours}:${minutes}`;
  }

  return formatDateDdMmYyyy(parsed);
}

export function formatDisplayDateTime(value: string | undefined, _locale: Language): string {
  if (!value?.trim()) return '';

  const parsed = parseIsoDateTime(value);
  if (!parsed) return value;

  const hours = String(parsed.getHours()).padStart(2, '0');
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  return `${formatDateDdMmYyyy(parsed)} ${hours}:${minutes}`;
}

export type EventCountdownState =
  | { kind: 'no_date' }
  | { kind: 'future'; days: number }
  | { kind: 'past' }
  | { kind: 'now' };

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getEventCountdown(isoDate?: string, now = new Date()): EventCountdownState {
  const parsed = parseIsoDateTime(isoDate);
  if (!parsed) return { kind: 'no_date' };

  const today = startOfDay(now);
  const eventDay = startOfDay(parsed);
  const diffMs = eventDay.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { kind: 'past' };
  if (diffDays === 0) return { kind: 'now' };

  return { kind: 'future', days: diffDays };
}
