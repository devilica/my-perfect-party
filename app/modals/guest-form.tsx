import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GuestCategoryPicker } from '@/components/GuestCategoryPicker';
import { GuestSidePicker } from '@/components/GuestSidePicker';
import { SelectField } from '@/components/SelectField';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { Button, TextInputField } from '@/components/ui';
import { ATTENDANCE_STATUSES } from '@/constants/guestAttendance';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { getAssignableTables } from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import { useWeddingStore } from '@/store/weddingStore';
import { AttendanceStatus } from '@/types/models';
import { radius, spacing, typography } from '@/theme/colors';

export default function GuestFormModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId: string; guestId?: string }>();
  const eventId = getRouteParam(params.eventId);
  const guestId = getRouteParam(params.guestId);
  const language = useWeddingStore((s) => s.language);
  const event = useWeddingStore((s) => s.events.find((e) => e.id === eventId));
  const allGuests = useWeddingStore((s) => s.guests);
  const tables = useWeddingStore((s) => s.tables);
  const addGuest = useWeddingStore((s) => s.addGuest);
  const updateGuest = useWeddingStore((s) => s.updateGuest);
  const { t } = useTranslation(language);
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');
  const theme = celebrationTheme.colors;
  const modalScrollPadding = useModalScrollPadding();

  const hasGuestCategories = (event?.guestCategories?.length ?? 0) > 0;
  const hasGuestSides = (event?.guestSides?.length ?? 0) > 0;
  const defaultCategory = hasGuestCategories ? event!.guestCategories[0] : '';
  const defaultSide = hasGuestSides ? event!.guestSides[0] : '';

  const existingGuest = useMemo(
    () => (guestId ? allGuests.find((g) => g.id === guestId) : undefined),
    [allGuests, guestId]
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [side, setSide] = useState(defaultSide);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>('needs_invite');
  const [partySize, setPartySize] = useState('1');
  const [tableId, setTableId] = useState<string | undefined>(undefined);
  const [note, setNote] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [tableError, setTableError] = useState('');

  useEffect(() => {
    if (existingGuest) {
      setFirstName(existingGuest.firstName);
      setLastName(existingGuest.lastName);
      setPhone(existingGuest.phone ?? '');
      setCategory(existingGuest.category);
      setSide(existingGuest.side);
      setAttendanceStatus(existingGuest.attendanceStatus);
      setPartySize(String(existingGuest.partySize));
      setTableId(existingGuest.tableId);
      setNote(existingGuest.note ?? '');
    } else {
      setCategory(defaultCategory);
      setSide(defaultSide);
    }
  }, [existingGuest, defaultCategory, defaultSide]);

  const assignableTables = useMemo(() => {
    if (!eventId || !firstName.trim()) return [];

    const previewGuest = {
      id: existingGuest?.id ?? 'draft',
      eventId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      category,
      side,
      attendanceStatus,
      partySize: Math.max(1, parseInt(partySize, 10) || 1),
      tableId,
    };

    return getAssignableTables(tables, allGuests, eventId, previewGuest);
  }, [
    tables,
    allGuests,
    eventId,
    firstName,
    lastName,
    category,
    side,
    attendanceStatus,
    partySize,
    tableId,
    existingGuest?.id,
  ]);

  const handleSave = () => {
    if (!firstName.trim()) {
      setFirstNameError(t('guests.firstNameRequired'));
      return;
    }
    if (!eventId) return;

    const parsedPartySize = Math.max(1, parseInt(partySize, 10) || 1);
    const payload = {
      eventId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      category: hasGuestCategories ? category : '',
      side: hasGuestSides ? side : '',
      attendanceStatus,
      partySize: parsedPartySize,
      tableId: tableId || undefined,
      note: note.trim() || undefined,
    };

    if (existingGuest) {
      const success = updateGuest(existingGuest.id, payload);
      if (!success) {
        if (tableId) setTableError(t('seating.capacityError'));
        else setFirstNameError(t('guests.duplicateName'));
        return;
      }
    } else {
      const result = addGuest(payload);
      if (!result) {
        if (tableId) setTableError(t('seating.capacityError'));
        else setFirstNameError(t('guests.duplicateName'));
        return;
      }
    }

    router.back();
  };

  const tableOptions = useMemo(() => {
    const options = assignableTables.map((table) => ({
      value: table.id,
      label: `${table.name} (${table.capacity})`,
    }));

    if (tableId && !options.some((option) => option.value === tableId)) {
      const currentTable = tables.find((table) => table.id === tableId);
      if (currentTable) {
        options.unshift({
          value: currentTable.id,
          label: `${currentTable.name} (${currentTable.capacity})`,
        });
      }
    }

    return [{ value: 'none', label: t('guests.noTable') }, ...options];
  }, [assignableTables, tableId, tables, t]);

  const showTableHint = tableOptions.length === 1;

  const showNoTablesHint = () => {
    Alert.alert(t('guests.noTablesHintTitle'), t('guests.noTablesHintMessage'), [
      { text: t('common.close'), style: 'cancel' },
    ]);
  };

  if (!eventId) return null;

  const parsedPartySize = Math.max(1, parseInt(partySize, 10) || 1);

  return (
    <ThemedEventModal eventId={eventId}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: modalScrollPadding }]}
        keyboardShouldPersistTaps="handled"
      >
        <Stack.Screen
          options={getThemedModalScreenOptions(
            celebrationTheme,
            existingGuest ? t('guests.edit') : t('guests.add')
          )}
        />

      <TextInputField
        label={t('guests.firstName')}
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);
          setFirstNameError('');
        }}
        placeholder={t('guests.firstNamePlaceholder')}
        error={firstNameError}
      />
      <TextInputField
        label={t('guests.lastName')}
        value={lastName}
        onChangeText={setLastName}
        placeholder={t('guests.lastNamePlaceholder')}
      />
      <TextInputField
        label={`${t('guests.phone')} (${t('common.optional')})`}
        value={phone}
        onChangeText={setPhone}
        placeholder={t('guests.phonePlaceholder')}
        keyboardType="default"
      />

      {hasGuestCategories ? (
        <GuestCategoryPicker eventId={eventId} selected={category} onSelect={setCategory} />
      ) : null}

      {hasGuestSides ? (
        <GuestSidePicker eventId={eventId} selected={side} onSelect={setSide} />
      ) : null}

      <SelectField
        label={t('guests.attendance')}
        value={attendanceStatus}
        options={ATTENDANCE_STATUSES.map((value) => ({
          value,
          label: t(`guests.status.${value}`),
        }))}
        onChange={setAttendanceStatus}
      />

      <View style={styles.stepperRow}>
        <Text style={[styles.stepperLabel, { color: theme.textSecondary }]}>
          {t('guests.partySize')}
        </Text>
        <View style={styles.stepperContent}>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => setPartySize(String(Math.max(1, parsedPartySize - 1)))}
              disabled={parsedPartySize <= 1}
              style={({ pressed }) => [
                styles.stepperBtn,
                {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.border,
                },
                parsedPartySize <= 1 && styles.stepperBtnDisabled,
                pressed && styles.stepperBtnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('guests.partySize')}
            >
              <Ionicons name="remove" size={22} color={theme.primaryDark} />
            </Pressable>
            <Text style={styles.stepperValue}>{partySize}</Text>
            <Pressable
              onPress={() => setPartySize(String(Math.min(10, parsedPartySize + 1)))}
              disabled={parsedPartySize >= 10}
              style={({ pressed }) => [
                styles.stepperBtn,
                {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.border,
                },
                parsedPartySize >= 10 && styles.stepperBtnDisabled,
                pressed && styles.stepperBtnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('guests.partySize')}
            >
              <Ionicons name="add" size={22} color={theme.primaryDark} />
            </Pressable>
          </View>
          <Text style={styles.hint}>{t('guests.partySizeHint')}</Text>
        </View>
      </View>

      <SelectField
        label={t('guests.assignTable')}
        labelRight={
          showTableHint ? (
            <Pressable
              onPress={showNoTablesHint}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t('guests.noTablesHintTitle')}
            >
              <Ionicons name="information-circle-outline" size={18} color={theme.primary} />
            </Pressable>
          ) : undefined
        }
        value={tableId ?? 'none'}
        options={tableOptions}
        onChange={(value) => {
          setTableError('');
          setTableId(value === 'none' ? undefined : value);
        }}
        error={tableError}
      />

      <TextInputField
        label={`${t('guests.note')} (${t('common.optional')})`}
        value={note}
        onChangeText={setNote}
        placeholder={t('guests.notePlaceholder')}
        multiline
      />

      <View style={styles.actions}>
        <Button label={t('common.save')} onPress={handleSave} />
        <Button label={t('common.cancel')} variant="ghost" onPress={() => router.back()} />
      </View>
      </ScrollView>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  stepperRow: {
    marginBottom: spacing.md,
  },
  stepperLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  stepperContent: {
    alignItems: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnPressed: {
    opacity: 0.85,
  },
  stepperBtnDisabled: {
    opacity: 0.5,
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'center',
  },
  hint: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: '#9C9590',
    textAlign: 'center',
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
