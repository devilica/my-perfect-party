import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TablePreviewDiagram } from '@/components/TablePreviewDiagram';
import { PLAY_STORE_PACKAGE_ID } from '@/constants/store';
import { DEFAULT_TABLE_SHAPE } from '@/constants/tableShapes';
import { TableSeatSlot } from '@/lib/seatingStats';
import { useThemeColors } from '@/theme/EventThemeContext';
import { getGuestFullName, Guest, SeatingTable } from '@/types/models';
import { radius, spacing, typography } from '@/theme/colors';

type GuestSeatCardProps = {
  table: SeatingTable;
  guest: Guest;
  seats: TableSeatSlot[];
  occupied: number;
  seatLabel: string;
  title: string;
  youLabel: string;
  welcome: string;
  welcomeLine2: string;
  watermark: string;
};

export const GuestSeatCard = forwardRef<View, GuestSeatCardProps>(
  function GuestSeatCard(
    { table, guest, seats, occupied, seatLabel, title, youLabel, welcome, welcomeLine2, watermark },
    ref
  ) {
    const theme = useThemeColors();

    return (
      <View
        ref={ref}
        collapsable={false}
        style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <Text style={[styles.guestName, { color: theme.text }]}>
          {getGuestFullName(guest)}
        </Text>
        <Text style={[styles.kicker, { color: theme.textSecondary }]}>{title}</Text>
        <Text style={[styles.tableName, { color: theme.text }]}>{table.name}</Text>
        <TablePreviewDiagram
          tableName={table.name}
          occupied={occupied}
          capacity={table.capacity}
          seats={seats}
          shape={table.shape ?? DEFAULT_TABLE_SHAPE}
          size={260}
          guestNameMode="hidden"
          selectedGuestId={guest.id}
          youLabel={youLabel}
          showTableText={false}
          centerLabel={table.name.match(/\d+/)?.[0]}
          seatMarker="chair"
        />
        <Text style={[styles.seatLabel, { color: theme.primaryDark }]}>{seatLabel}</Text>
        <View style={[styles.welcome, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.welcomeText, { color: theme.text }]}>{welcome}</Text>
          <Text style={[styles.welcomeText, { color: theme.text }]}>{welcomeLine2}</Text>
        </View>
        <View style={styles.watermark} pointerEvents="none">
          <Text style={[styles.watermarkText, { color: theme.textSecondary }]}>
            {watermark}
          </Text>
          <Text style={[styles.watermarkApp, { color: theme.textSecondary }]}>
            {PLAY_STORE_PACKAGE_ID}
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  guestName: {
    ...typography.subheading,
    fontWeight: '700',
    textAlign: 'center',
  },
  kicker: {
    ...typography.caption,
    fontWeight: '600',
  },
  tableName: {
    ...typography.title,
    fontWeight: '800',
    textAlign: 'center',
  },
  seatLabel: {
    ...typography.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  welcome: {
    width: '100%',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  welcomeText: {
    ...typography.body,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
  },
  watermark: {
    width: '100%',
    alignItems: 'center',
    paddingTop: spacing.sm,
    gap: 2,
  },
  watermarkText: {
    fontSize: 10,
    letterSpacing: 0.4,
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0.7,
  },
  watermarkApp: {
    fontSize: 9,
    letterSpacing: 0.2,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.55,
  },
});
