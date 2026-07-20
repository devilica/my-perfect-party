import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart, BarChart } from 'react-native-gifted-charts';

import { Card } from '@/components/ui';
import { formatAmount } from '@/lib/expenseStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { CategoryBreakdownItem, ExpenseSummary } from '@/types/models';
import { colors, spacing, typography } from '@/theme/colors';

type ExpenseChartsProps = {
  breakdown: CategoryBreakdownItem[];
  summary: ExpenseSummary;
};

export function ExpenseCharts({ breakdown, summary }: ExpenseChartsProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);

  if (breakdown.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Text style={styles.emptyText}>{t('charts.empty')}</Text>
      </Card>
    );
  }

  const pieData = breakdown.map((item) => ({
    value: item.amount,
    color: item.color,
    text: formatAmount(item.amount),
  }));

  const barData = breakdown.slice(0, 6).map((item) => ({
    value: item.amount,
    label: getShortLabel(item, t),
    frontColor: item.color,
  }));

  return (
    <View style={styles.container}>
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>{t('charts.byCategory')}</Text>
        <Text style={styles.total}>
          {t('charts.total', { amount: formatAmount(summary.total) })}
        </Text>
        <View style={styles.pieWrap}>
          <PieChart
            data={pieData}
            donut
            radius={90}
            innerRadius={55}
            innerCircleColor={colors.surface}
            centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text style={styles.centerValue}>{formatAmount(summary.total)}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.legend}>
          {breakdown.map((item) => (
            <View key={item.category} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText} numberOfLines={1}>
                {item.labelKey ? t(item.labelKey) : item.category}
              </Text>
              <Text style={styles.legendAmount}>{formatAmount(item.amount)}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>{t('charts.topCategories')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={barData}
            barWidth={32}
            spacing={18}
            roundedTop
            roundedBottom
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}
            noOfSections={4}
            maxValue={Math.max(...barData.map((d) => d.value)) * 1.2 || 100}
            height={180}
            width={Math.max(280, barData.length * 62)}
          />
        </ScrollView>
      </Card>
    </View>
  );
}

function getShortLabel(
  item: CategoryBreakdownItem,
  t: (key: string) => string
): string {
  const label = item.labelKey ? t(item.labelKey) : item.category;
  return label.length > 8 ? `${label.slice(0, 7)}…` : label;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  chartCard: {
    gap: spacing.sm,
  },
  chartTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  total: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pieWrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  legend: {
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  legendAmount: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  axisText: {
    ...typography.small,
    color: colors.textMuted,
  },
});
