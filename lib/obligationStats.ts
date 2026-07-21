import { Obligation, ObligationStats, ObligationStatus } from '@/types/models';

const STATUS_CYCLE: ObligationStatus[] = ['not_scheduled', 'scheduled', 'confirmed'];

export function getNextObligationStatus(current: ObligationStatus): ObligationStatus {
  const index = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(index + 1) % STATUS_CYCLE.length];
}

export function getObligationsForEvent(
  obligations: Obligation[],
  eventId: string
): Obligation[] {
  return obligations
    .filter((obligation) => obligation.eventId === eventId)
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.createdAt.localeCompare(b.createdAt);
    });
}

export function getObligationStats(
  obligations: Obligation[],
  eventId: string
): ObligationStats {
  const eventObligations = obligations.filter((obligation) => obligation.eventId === eventId);
  const total = eventObligations.length;
  const confirmed = eventObligations.filter((o) => o.status === 'confirmed').length;
  const scheduled = eventObligations.filter((o) => o.status === 'scheduled').length;
  const notScheduled = eventObligations.filter((o) => o.status === 'not_scheduled').length;
  const completionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  return { total, confirmed, scheduled, notScheduled, completionRate };
}
