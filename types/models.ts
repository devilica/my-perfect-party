export type PredefinedCategory =
  | 'music'
  | 'food'
  | 'photography'
  | 'venue'
  | 'decoration'
  | 'attire'
  | 'transport'
  | 'other';

export type ExpenseCategory = PredefinedCategory | string;

export type { Language } from '@/constants/languages';

export type CelebrationThemeId =
  | 'default'
  | 'wedding'
  | 'birthday'
  | 'baptism'
  | 'newYear'
  | 'christmas'
  | 'graduation'
  | 'anniversary'
  | 'engagement'
  | 'other';

export type InvitationFontFamily = 'script' | 'serif' | 'sans';

export type InvitationTextAlign = 'left' | 'center' | 'right';

export type InvitationSubEvent = {
  id: string;
  icon: string;
  time?: string;
  title: string;
  location?: string;
};

export type InvitationTextBox = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: InvitationFontFamily;
  color: string;
  align?: InvitationTextAlign;
};

export type EventInvitation = {
  templateId: string;
  backgroundOpacity: number;
  lineSpacing: number;
  headerIcon: string;
  headerTitle: string;
  hostNames: string;
  namesFontFamily: InvitationFontFamily;
  fontSize: number;
  fontColor: string;
  eventDateText: string;
  subEvents: InvitationSubEvent[];
  customTexts: InvitationTextBox[];
  rsvpMessage: string;
  watermarkRemoved?: boolean;
  updatedAt: string;
};

export type WeddingEvent = {
  id: string;
  name: string;
  date?: string;
  location?: string;
  theme: CelebrationThemeId;
  guestCategories: string[];
  createdAt: string;
  invitation?: EventInvitation;
};

export type AttendanceStatus =
  | 'needs_invite'
  | 'invitation_sent'
  | 'confirmed'
  | 'declined';

export type GuestFilter =
  | 'all'
  | 'needs_invite'
  | 'invitation_sent'
  | 'confirmed'
  | 'declined'
  | 'unassigned';

export type GuestSort =
  | 'added_desc'
  | 'added_asc'
  | 'name_asc'
  | 'name_desc'
  | 'partySize_desc'
  | 'partySize_asc';

export type Guest = {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  category: string;
  attendanceStatus: AttendanceStatus;
  partySize: number;
  tableId?: string;
  /** Order around the assigned table (list + diagram seats). */
  seatOrder?: number;
  note?: string;
  createdAt?: string;
};

export type TableShape = 'round' | 'singleSided' | 'rectangular' | 'square';

export type SeatingTable = {
  id: string;
  eventId: string;
  name: string;
  capacity: number;
  sortOrder: number;
  shape?: TableShape;
  layoutX?: number;
  layoutY?: number;
  createdAt: string;
};

export type TableOccupancy = 'available' | 'almostFull' | 'full';

export type GuestStats = {
  totalInvites: number;
  totalPeople: number;
  confirmedPeople: number;
  pendingPeople: number;
  needsInvitePeople: number;
  invitationSentPeople: number;
  declinedPeople: number;
  assignedPeople: number;
  unassignedPeople: number;
  confirmationRate: number;
  attendanceChartTotal: number;
};

export type SeatingStats = {
  totalTables: number;
  fullTables: number;
  almostFullTables: number;
  availableTables: number;
  totalCapacity: number;
  occupiedSeats: number;
};

export type Expense = {
  id: string;
  eventId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  coveredByOther: boolean;
  payerName?: string;
};

export type ExpenseSummary = {
  total: number;
  coveredByOthers: number;
  yourShare: number;
};

export type CategoryBreakdownItem = {
  category: ExpenseCategory;
  amount: number;
  color: string;
  labelKey?: string;
};

export function getGuestFullName(guest: Guest): string {
  return `${guest.firstName} ${guest.lastName}`.trim();
}

export type GuestSeatNameMode = 'hidden' | 'abbreviated' | 'full';

/** Seat label on hall diagrams — full name or first name + last initial. */
export function formatGuestSeatLabel(fullName: string, mode: GuestSeatNameMode): string {
  if (mode !== 'abbreviated') return fullName;

  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return fullName;

  const lastName = parts[parts.length - 1];
  const firstNames = parts.slice(0, -1).join(' ');
  const initial = lastName.charAt(0);
  return initial ? `${firstNames} ${initial}.` : firstNames;
}

export type BulkTableBatch = {
  count: number;
  capacity: number;
  shape?: TableShape;
};

export type ObligationStatus = 'not_scheduled' | 'scheduled' | 'confirmed';

export type Obligation = {
  id: string;
  eventId: string;
  title: string;
  date?: string;
  note?: string;
  contact?: string;
  status: ObligationStatus;
  sortOrder: number;
  createdAt: string;
};

export type ObligationStats = {
  total: number;
  confirmed: number;
  scheduled: number;
  notScheduled: number;
  completionRate: number;
};
