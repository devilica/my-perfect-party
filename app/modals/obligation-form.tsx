import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';
import { OverviewNativeAd } from '@/components/OverviewNativeAd';

import { DatePickerField } from '@/components/DatePickerField';
import { SelectField } from '@/components/SelectField';
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
import { ObligationStatus } from '@/types/models';
import { spacing } from '@/theme/colors';

export default function ObligationFormModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId: string; obligationId?: string }>();
  const eventId = getRouteParam(params.eventId);
  const obligationId = getRouteParam(params.obligationId);
  const language = useWeddingStore((s) => s.language);
  const obligations = useWeddingStore((s) => s.obligations);
  const addObligation = useWeddingStore((s) => s.addObligation);
  const updateObligation = useWeddingStore((s) => s.updateObligation);
  const { t } = useTranslation(language);
  const modalScrollPadding = useModalScrollPadding();
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');

  const existingObligation = useMemo(
    () => (obligationId ? obligations.find((o) => o.id === obligationId) : undefined),
    [obligations, obligationId]
  );

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<ObligationStatus>('not_scheduled');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (existingObligation) {
      setTitle(existingObligation.title);
      setDate(existingObligation.date ?? '');
      setContact(existingObligation.contact ?? '');
      setNote(existingObligation.note ?? '');
      setStatus(existingObligation.status);
    }
  }, [existingObligation]);

  const statusOptions: { value: ObligationStatus; label: string }[] = [
    { value: 'not_scheduled', label: t('obligations.status.notScheduled') },
    { value: 'scheduled', label: t('obligations.status.scheduled') },
    { value: 'confirmed', label: t('obligations.status.confirmed') },
  ];

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(t('obligations.titleRequired'));
      return;
    }
    if (!eventId) return;

    const payload = {
      title: title.trim(),
      date: date.trim() || undefined,
      contact: contact.trim() || undefined,
      note: note.trim() || undefined,
      status,
    };

    if (existingObligation) {
      updateObligation(existingObligation.id, payload);
    } else {
      addObligation({ eventId, ...payload });
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
            existingObligation ? t('obligations.edit') : t('obligations.add')
          )}
        />

      <TextInputField
        label={t('obligations.titleLabel')}
        required
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setTitleError('');
        }}
        placeholder={t('obligations.titlePlaceholder')}
        error={titleError}
      />

      <DatePickerField
        label={t('events.dateTime')}
        value={date || undefined}
        onChange={(iso) => setDate(iso ?? '')}
        placeholder={t('events.selectDateTime')}
        clearLabel={t('events.clearDate')}
        locale={language}
        mode="datetime"
      />

      <SelectField<ObligationStatus>
        label={t('obligations.statusLabel')}
        value={status}
        options={statusOptions}
        onChange={setStatus}
      />

      <TextInputField
        label={t('obligations.contact')}
        value={contact}
        onChangeText={setContact}
        placeholder={t('obligations.contactPlaceholder')}
      />

      <TextInputField
        label={t('obligations.note')}
        value={note}
        onChangeText={setNote}
        multiline
      />

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
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
