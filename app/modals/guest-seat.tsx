import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';
import { GuestSeatCard } from '@/components/GuestSeatCard';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { Button } from '@/components/ui';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import {
  buildTableSeatSlots,
  getGuestSeatNumbers,
  getTableOccupiedSeats,
} from '@/lib/seatingStats';
import { shareInvitationImage } from '@/lib/shareInvitationImage';
import { useWeddingStore } from '@/store/weddingStore';
import { spacing } from '@/theme/colors';

function formatSeatLabel(
  seats: number[],
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  if (seats.length === 0) return '';
  if (seats.length === 1) return t('guests.seatCardSeat', { seat: seats[0] });

  const consecutive = seats.every((seat, index) => index === 0 || seat === seats[index - 1] + 1);
  if (consecutive) {
    return t('guests.seatCardSeatRange', {
      start: seats[0],
      end: seats[seats.length - 1],
    });
  }

  return t('guests.seatCardSeats', { seats: seats.join(', ') });
}

export default function GuestSeatModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId: string; guestId?: string }>();
  const eventId = getRouteParam(params.eventId);
  const guestId = getRouteParam(params.guestId);
  const language = useWeddingStore((s) => s.language);
  const guests = useWeddingStore((s) => s.guests);
  const tables = useWeddingStore((s) => s.tables);
  const { t } = useTranslation(language);
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');
  const modalScrollPadding = useModalScrollPadding();
  const cardRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);

  const guest = useMemo(
    () => (guestId ? guests.find((item) => item.id === guestId) : undefined),
    [guests, guestId]
  );

  const table = useMemo(
    () =>
      guest?.tableId ? tables.find((item) => item.id === guest.tableId) : undefined,
    [guest, tables]
  );

  const eventGuests = useMemo(
    () => guests.filter((item) => item.eventId === eventId),
    [guests, eventId]
  );

  const seats = useMemo(
    () => (table ? buildTableSeatSlots(table, eventGuests) : []),
    [table, eventGuests]
  );

  const seatNumbers = useMemo(
    () => (table && guest ? getGuestSeatNumbers(table, eventGuests, guest.id) : []),
    [table, guest, eventGuests]
  );

  const occupied = table ? getTableOccupiedSeats(eventGuests, table.id) : 0;

  useEffect(() => {
    if (!guest || !table) {
      router.back();
    }
  }, [guest, table, router]);

  const handleShare = async () => {
    setSharing(true);
    await new Promise((resolve) => setTimeout(resolve, 32));
    try {
      const result = await shareInvitationImage(
        cardRef,
        t('guests.seatCardShareUnavailable')
      );
      if (result === 'unavailable') {
        Alert.alert(t('guests.seatCardShareUnavailable'));
      }
    } finally {
      setSharing(false);
    }
  };

  if (!eventId || !guest || !table) {
    return null;
  }

  return (
    <ThemedEventModal eventId={eventId}>
      <Stack.Screen
        options={getThemedModalScreenOptions(celebrationTheme, t('guests.seatCard'))}
      />
      <FormScrollView
        contentContainerStyle={[styles.content, { paddingBottom: modalScrollPadding }]}
      >
        <GuestSeatCard
          ref={cardRef}
          table={table}
          guest={guest}
          seats={seats}
          occupied={occupied}
          title={t('guests.seatCardTitle')}
          youLabel={t('guests.seatCardYou')}
          seatLabel={formatSeatLabel(seatNumbers, t)}
          welcome={t('guests.seatCardWelcome')}
          welcomeLine2={t('guests.seatCardWelcomeHappy')}
          watermark={t('guests.seatCardWatermark')}
        />
        <Button
          label={t('guests.seatCardShare')}
          icon="share-outline"
          onPress={handleShare}
          loading={sharing}
        />
      </FormScrollView>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
});
