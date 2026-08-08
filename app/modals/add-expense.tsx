import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';
import { OverviewNativeAd } from '@/components/OverviewNativeAd';

import { CategoryPicker } from '@/components/CategoryPicker';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { Button, TextInputField } from '@/components/ui';
import { isPredefinedCategory } from '@/constants/categories';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import { useWeddingStore } from '@/store/weddingStore';
import { ExpenseCategory } from '@/types/models';
import { spacing, typography } from '@/theme/colors';

export default function AddExpenseModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId: string; expenseId?: string }>();
  const eventId = getRouteParam(params.eventId);
  const expenseId = getRouteParam(params.expenseId);
  const language = useWeddingStore((s) => s.language);
  const expenses = useWeddingStore((s) => s.expenses);
  const addExpense = useWeddingStore((s) => s.addExpense);
  const updateExpense = useWeddingStore((s) => s.updateExpense);
  const { t } = useTranslation(language);
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');
  const theme = celebrationTheme.colors;
  const modalScrollPadding = useModalScrollPadding();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [customCategory, setCustomCategory] = useState('');
  const [coveredByOther, setCoveredByOther] = useState(false);
  const [payerName, setPayerName] = useState('');
  const [titleError, setTitleError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [payerError, setPayerError] = useState('');

  const existingExpense = useMemo(
    () => (expenseId ? expenses.find((expense) => expense.id === expenseId) : undefined),
    [expenses, expenseId]
  );

  useEffect(() => {
    if (!existingExpense) return;

    setTitle(existingExpense.title);
    setAmount(String(existingExpense.amount));
    setCoveredByOther(existingExpense.coveredByOther);
    setPayerName(existingExpense.payerName ?? '');

    if (isPredefinedCategory(existingExpense.category)) {
      setCategory(existingExpense.category);
      setCustomCategory('');
    } else {
      setCategory('other');
      setCustomCategory(existingExpense.category);
    }
  }, [existingExpense]);

  const resolvedCategory =
    category === 'other' && customCategory.trim() ? customCategory.trim() : category;

  const handleSave = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError(t('expenses.titleRequired'));
      valid = false;
    }

    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError(t('expenses.amountRequired'));
      valid = false;
    }

    if (coveredByOther && !payerName.trim()) {
      setPayerError(t('expenses.payerRequired'));
      valid = false;
    }

    if (!valid || !eventId) return;

    const payload = {
      title: title.trim(),
      amount: parsedAmount,
      category: resolvedCategory,
      coveredByOther,
      payerName: coveredByOther ? payerName.trim() : undefined,
    };

    if (existingExpense) {
      updateExpense(existingExpense.id, payload);
    } else {
      addExpense({ eventId, ...payload });
    }

    router.back();
  };

  return (
    <ThemedEventModal eventId={eventId ?? ''} showBottomBanner>
      <FormScrollView
        contentContainerStyle={[styles.container, { paddingBottom: modalScrollPadding }]}
      >
        <Stack.Screen
          options={getThemedModalScreenOptions(
            celebrationTheme,
            existingExpense ? t('expenses.edit') : t('expenses.add')
          )}
        />

      <TextInputField
        label={t('expenses.expenseTitle')}
        required
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setTitleError('');
        }}
        placeholder={t('expenses.titlePlaceholder')}
        error={titleError}
      />
      <TextInputField
        label={t('expenses.amount')}
        required
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          setAmountError('');
        }}
        placeholder={t('expenses.amountPlaceholder')}
        keyboardType="decimal-pad"
        error={amountError}
      />

      <CategoryPicker
        selected={category}
        customCategory={customCategory}
        onSelect={setCategory}
        onCustomChange={setCustomCategory}
        customRequired={category === 'other'}
      />

      <View style={styles.switchRow}>
        <Text style={[styles.switchLabel, { color: theme.text }]}>{t('expenses.coveredByOther')}</Text>
        <Switch
          value={coveredByOther}
          onValueChange={setCoveredByOther}
          trackColor={{ false: theme.border, true: theme.primaryLight }}
          thumbColor={coveredByOther ? theme.primary : theme.surface}
        />
      </View>

      {coveredByOther ? (
        <TextInputField
          label={t('expenses.payerName')}
          required
          value={payerName}
          onChangeText={(text) => {
            setPayerName(text);
            setPayerError('');
          }}
          placeholder={t('expenses.payerNamePlaceholder')}
          error={payerError}
        />
      ) : null}

      <View style={styles.actions}>
        <Button label={t('common.save')} onPress={handleSave} />
        <Button label={t('common.cancel')} variant="ghost" onPress={() => router.back()} />
      </View>
      <OverviewNativeAd placement="modal" />
      </FormScrollView>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    ...typography.body,
    flex: 1,
    paddingRight: spacing.md,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
