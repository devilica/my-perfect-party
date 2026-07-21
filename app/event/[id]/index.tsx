import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedScreenContainer } from '@/components/ThemedScreenContainer';
import { Button, Card, ProgressBar, StatCard } from '@/components/ui';
import { useBannerClearance } from '@/hooks/useBannerClearance';
import { formatDisplayDate } from '@/lib/dateUtils';
import { formatAmount, getExpenseSummary } from '@/lib/expenseStats';
import { getGuestStats } from '@/lib/guestStats';
import { getObligationStats } from '@/lib/obligationStats';
import { getSeatingStats } from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import { useEventId } from '@/lib/useEventId';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { spacing, typography } from '@/theme/colors';

export default function EventOverviewScreen() {
  const eventId = useEventId();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const language = useWeddingStore((s) => s.language);
  const events = useWeddingStore((s) => s.events);
  const guests = useWeddingStore((s) => s.guests);
  const tables = useWeddingStore((s) => s.tables);
  const expenses = useWeddingStore((s) => s.expenses);
  const obligations = useWeddingStore((s) => s.obligations);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const bannerClearance = useBannerClearance();

  const event = useMemo(
    () => events.find((item) => item.id === eventId),
    [events, eventId]
  );
  const guestStats = useMemo(() => getGuestStats(guests, eventId), [guests, eventId]);
  const seatingStats = useMemo(
    () => getSeatingStats(tables, guests, eventId),
    [tables, guests, eventId]
  );
  const expenseSummary = useMemo(
    () => getExpenseSummary(expenses, eventId),
    [expenses, eventId]
  );
  const obligationStats = useMemo(
    () => getObligationStats(obligations, eventId),
    [obligations, eventId]
  );

  if (!event) return null;

  return (
    <ThemedScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl + bannerClearance }}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.hero}>
          <View style={styles.heroHeader}>
            <View style={styles.heroContent}>
              <Text style={[styles.eventName, { color: theme.text }]}>{event.name}</Text>
              {event.date ? (
                <Text style={[styles.meta, { color: theme.textSecondary }]}>
                  {formatDisplayDate(event.date, language)}
                </Text>
              ) : null}
              {event.location ? (
                <Text style={[styles.meta, { color: theme.textSecondary }]}>{event.location}</Text>
              ) : null}
            </View>
            <Pressable
              onPress={() => router.push(`/modals/add-event?eventId=${eventId}`)}
              hitSlop={8}
            >
              <Ionicons name="pencil-outline" size={20} color={theme.primary} />
            </Pressable>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('overview.guestStats')}
        </Text>
        <View style={styles.statRows}>
          <View style={styles.statRow}>
            <StatCard
              label={t('overview.totalPeople')}
              value={String(guestStats.totalPeople)}
            />
            <StatCard
              label={t('overview.confirmedPeople')}
              value={String(guestStats.confirmedPeople)}
              accent={theme.success}
            />
          </View>
          <View style={styles.statRow}>
            <StatCard
              label={t('overview.assignedPeople')}
              value={String(guestStats.assignedPeople)}
              accent={theme.primaryDark}
            />
            <StatCard
              label={t('overview.unassignedPeople')}
              value={String(guestStats.unassignedPeople)}
              accent={theme.seatAlmostFull}
            />
          </View>
        </View>

        <Card style={styles.statsCard}>
          <Text style={[styles.statMain, { color: theme.text }]}>
            {t('overview.confirmed', {
              confirmed: guestStats.confirmedPeople,
              total: guestStats.totalPeople,
            })}
          </Text>
          <ProgressBar progress={guestStats.confirmationRate} />
          <Text style={[styles.statSecondary, { color: theme.textSecondary }]}>
            {t('overview.confirmationRate')}: {guestStats.confirmationRate}%
          </Text>
        </Card>

        {obligationStats.total > 0 ? (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('overview.obligationStats')}
            </Text>
            <Card style={styles.statsCard}>
              <Text style={[styles.statMain, { color: theme.text }]}>
                {t('overview.obligationsConfirmed', {
                  confirmed: obligationStats.confirmed,
                  total: obligationStats.total,
                })}
              </Text>
              <ProgressBar progress={obligationStats.completionRate} />
              <Text style={[styles.statSecondary, { color: theme.textSecondary }]}>
                {t('overview.obligationCompletionRate')}: {obligationStats.completionRate}%
              </Text>
            </Card>
            <Button
              label={t('overview.manageObligations')}
              icon="clipboard-outline"
              variant="secondary"
              onPress={() => router.push(`/event/${eventId}/obligations`)}
              style={styles.obligationBtn}
            />
          </>
        ) : null}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('overview.seatingStats')}
        </Text>
        <View style={styles.statGrid}>
          <StatCard
            label={t('overview.tablesTotal')}
            value={String(seatingStats.totalTables)}
          />
          <StatCard
            label={t('overview.tablesFull')}
            value={String(seatingStats.fullTables)}
            accent={theme.seatFull}
          />
          <StatCard
            label={t('overview.tablesAvailable')}
            value={String(seatingStats.availableTables)}
            accent={theme.seatAvailable}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('overview.expenseStats')}
        </Text>
        <View style={styles.statGrid}>
          <StatCard label={t('overview.totalExpenses')} value={formatAmount(expenseSummary.total)} />
          <StatCard
            label={t('overview.yourShare')}
            value={formatAmount(expenseSummary.yourShare)}
            accent={theme.primaryDark}
          />
          <StatCard
            label={t('overview.coveredByOthers')}
            value={formatAmount(expenseSummary.coveredByOthers)}
            accent={theme.success}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('overview.quickActions')}
        </Text>
        <View style={styles.actions}>
          <Button
            label={t('overview.addGuest')}
            icon="person-add-outline"
            onPress={() => router.push(`/modals/guest-form?eventId=${eventId}`)}
            style={styles.actionBtn}
          />
          <Button
            label={t('overview.manageSeating')}
            icon="restaurant-outline"
            variant="secondary"
            onPress={() => router.push(`/event/${eventId}/seating`)}
            style={styles.actionBtn}
          />
          <Button
            label={t('overview.addExpense')}
            icon="add-circle-outline"
            variant="secondary"
            onPress={() => router.push(`/modals/add-expense?eventId=${eventId}`)}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </ThemedScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  heroContent: {
    flex: 1,
    gap: spacing.xs,
  },
  eventName: {
    ...typography.heading,
  },
  meta: {
    ...typography.caption,
  },
  sectionTitle: {
    ...typography.subheading,
    marginBottom: spacing.sm,
  },
  statsCard: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  statMain: {
    ...typography.subheading,
  },
  statSecondary: {
    ...typography.small,
  },
  statRows: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
  obligationBtn: {
    width: '100%',
    marginBottom: spacing.lg,
  },
});
