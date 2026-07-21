import { AttendanceStatus } from '@/types/models';

export const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  'needs_invite',
  'invitation_sent',
  'confirmed',
  'declined',
];

export function normalizeAttendanceStatus(
  status: AttendanceStatus | 'pending' | undefined,
  legacyConfirmed?: boolean
): AttendanceStatus {
  if (status === 'pending') return 'needs_invite';
  if (status) return status;
  return legacyConfirmed ? 'confirmed' : 'needs_invite';
}
