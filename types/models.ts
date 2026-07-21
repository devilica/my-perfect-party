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

export type Language = 'sr' | 'bs' | 'hr' | 'en';

export type CelebrationThemeId =
  | 'wedding'
  | 'birthday'
  | 'baptism'
  | 'newYear'
  | 'christmas'
  | 'graduation'
  | 'anniversary'
  | 'engagement'
  | 'other';

export type WeddingEvent = {
  id: string;
  name: string;
  date?: string;
  location?: string;
  theme: CelebrationThemeId;
  guestCategories: string[];
  guestSides: string[];
  createdAt: string;
};

export type AttendanceStatus =
  | 'needs_invite'
  | 'invitation_sent'
  | 'confirmed'
  | 'declined';

export type Guest = {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  category: string;
  side: string;
  attendanceStatus: AttendanceStatus;
  partySize: number;
  tableId?: string;
  note?: string;
};

export type SeatingTable = {
  id: string;
  eventId: string;
  name: string;
  capacity: number;
  sortOrder: number;
  createdAt: string;
};

export type TableOccupancy = 'available' | 'almostFull' | 'full';

export type GuestFilter =
  | 'all'
  | 'invitation_sent'
  | 'confirmed'
  | 'declined'
  | 'unassigned';

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

export type BulkTableBatch = {
  count: number;
  capacity: number;
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
