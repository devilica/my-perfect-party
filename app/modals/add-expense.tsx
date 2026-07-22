import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';

import { CategoryPicker } from '@/components/CategoryPicker';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { Button, TextInputField } from '@/components/ui';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import { useWeddingStore } from '@/store/weddingStore';
import { ExpenseCategory } from '@/types/models';
import { spacing, typography } from '@/theme/colors';

export default function AddExpenseModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId: string }>();
  const eventId = getRouteParam(params.eventId);
  const language = useWeddingStore((s) => s.language);
  const addExpense = useWeddingStore((s) => s.addExpense);
  const { t } = useTranslation(language);
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');
  const theme = celebrationTheme.colors;
  const modalScrollPadding = useModalScrollPadding();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [customCategory, setCustomCategory] = useState('');
  const [coveredByOther, setCoveredByOther] = useState(false);
  const [payerName, setPayerName] = useState('');
  const [titleError, setTitleError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [payerError, setPayerError] = useState('');

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

    addExpense({
      eventId,
      title: title.trim(),
      amount: parsedAmount,
      category: resolvedCategory,
      coveredByOther,
      payerName: coveredByOther ? payerName.trim() : undefined,
    });

    router.back();
  };

  return (
    <ThemedEventModal eventId={eventId ?? ''}>
      <FormScrollView
        contentContainerStyle={[styles.container, { paddingBottom: modalScrollPadding }]}
      >
        <Stack.Screen
          options={getThemedModalScreenOptions(celebrationTheme, t('expenses.add'))}
        />

      <TextInputField
        label={t('expenses.expenseTitle')}
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
