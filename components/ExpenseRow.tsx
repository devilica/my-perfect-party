import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { isPredefinedCategory } from '@/constants/categories';
import { formatAmount } from '@/lib/expenseStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { Expense } from '@/types/models';
import { radius, spacing, typography } from '@/theme/colors';

type ExpenseRowProps = {
  expense: Expense;
  onPress: () => void;
  onDelete: () => void;
};

export function ExpenseRow({ expense, onPress, onDelete }: ExpenseRowProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const categoryLabel = isPredefinedCategory(expense.category)
    ? t(`categories.${expense.category}`)
    : expense.category;

  return (
    <Card style={styles.card}>
      <Pressable onPress={onPress} style={styles.main}>
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {expense.title}
          </Text>
          <Text style={[styles.amount, { color: theme.primaryDark }]}>
            {formatAmount(expense.amount)}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={[styles.categoryChip, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.categoryText, { color: theme.primaryDark }]}>
              {categoryLabel}
            </Text>
          </View>
          {expense.coveredByOther && expense.payerName ? (
            <View style={[styles.payerChip, { backgroundColor: theme.successLight }]}>
              <Ionicons name="gift-outline" size={12} color={theme.primaryDark} />
              <Text style={[styles.payerText, { color: theme.success }]}>
                {t('expenses.coveredBy', { name: expense.payerName })}
              </Text>
            </View>
          ) : (
            <Text style={[styles.yourExpense, { color: theme.textMuted }]}>
              {t('expenses.yourExpense')}
            </Text>
          )}
        </View>
      </Pressable>
      <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
        <Ionicons name="trash-outline" size={18} color={theme.danger} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  main: {
    flex: 1,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
  },
  amount: {
    ...typography.subheading,
  },
  bottomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  categoryText: {
    ...typography.small,
    fontWeight: '600',
  },
  payerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  payerText: {
    ...typography.small,
  },
  yourExpense: {
    ...typography.small,
  },
  deleteBtn: {
    paddingLeft: spacing.sm,
    paddingTop: spacing.xs,
  },
});
