import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ExpenseCharts } from '@/components/ExpenseCharts';
import { ExpenseRow } from '@/components/ExpenseRow';
import { FormScrollView } from '@/components/FormScrollView';
import { ThemedScreenContainer } from '@/components/ThemedScreenContainer';
import { EmptyState, Fab, StatCard } from '@/components/ui';
import { useFabScrollPadding } from '@/hooks/useFabBottomOffset';
import {
  formatAmount,
  getExpenseBreakdown,
  getExpenseSummary,
} from '@/lib/expenseStats';
import { useTranslation } from '@/lib/i18n';
import { useEventId } from '@/lib/useEventId';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { spacing, typography } from '@/theme/colors';

export default function ExpensesScreen() {
  const eventId = useEventId();
  const router = useRouter();
  const language = useWeddingStore((s) => s.language);
  const allExpenses = useWeddingStore((s) => s.expenses);
  const deleteExpense = useWeddingStore((s) => s.deleteExpense);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const fabScrollPadding = useFabScrollPadding();

  const expenses = useMemo(
    () =>
      allExpenses
        .filter((expense) => expense.eventId === eventId)
        .sort((a, b) => b.amount - a.amount),
    [allExpenses, eventId]
  );
  const breakdown = useMemo(
    () => getExpenseBreakdown(allExpenses, eventId),
    [allExpenses, eventId]
  );
  const summary = useMemo(
    () => getExpenseSummary(allExpenses, eventId),
    [allExpenses, eventId]
  );

  const handleDelete = (expenseId: string) => {
    Alert.alert(t('expenses.delete'), t('expenses.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => deleteExpense(expenseId),
      },
    ]);
  };

  return (
    <ThemedScreenContainer>
      <FormScrollView
        contentContainerStyle={{ paddingBottom: fabScrollPadding }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryRow}>
          <StatCard label={t('overview.totalExpenses')} value={formatAmount(summary.total)} />
          <StatCard
            label={t('overview.yourShare')}
            value={formatAmount(summary.yourShare)}
            accent={theme.primaryDark}
          />
        </View>

        <ExpenseCharts breakdown={breakdown} summary={summary} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('expenses.title')}</Text>

        {expenses.length === 0 ? (
          <EmptyState
            icon="wallet-outline"
            title={t('expenses.emptyTitle')}
            subtitle={t('expenses.emptySubtitle')}
          />
        ) : (
          expenses.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              onDelete={() => handleDelete(expense.id)}
            />
          ))
        )}
      </FormScrollView>

      <Fab onPress={() => router.push(`/modals/add-expense?eventId=${eventId}`)} />
    </ThemedScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subheading,
    marginBottom: spacing.sm,
  },
});
