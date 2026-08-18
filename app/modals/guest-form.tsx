import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';
import { OverviewNativeAd } from '@/components/OverviewNativeAd';

import { GuestCategoryPicker } from '@/components/GuestCategoryPicker';
import { SelectField } from '@/components/SelectField';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { Button, TextInputField } from '@/components/ui';
import { ATTENDANCE_STATUSES } from '@/constants/guestAttendance';
import { useIsOnline } from '@/hooks/useIsOnline';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { areAdsEnabled, shouldShowAdPreviews } from '@/lib/adsEnvironment';
import { didCrossGuestAdMilestone, getGuestStats } from '@/lib/guestStats';
import { getTablesForEvent } from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import {
  preloadRewardedGuestAd,
  showRewardedGuestAd,
} from '@/lib/rewardedGuestAd';
import { getRouteParam } from '@/lib/routeParams';
import { useWeddingStore } from '@/store/weddingStore';
import { AttendanceStatus } from '@/types/models';
import { radius, spacing, typography } from '@/theme/colors';

function canShowGuestMilestoneAd(isOnline: boolean): boolean {
  return isOnline && (areAdsEnabled() || shouldShowAdPreviews());
}

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
  const isOnline = useIsOnline();

  const hasGuestCategories = (event?.guestCategories?.length ?? 0) > 0;
  const defaultCategory = hasGuestCategories ? event!.guestCategories[0] : '';

  const existingGuest = useMemo(
    () => (guestId ? allGuests.find((g) => g.id === guestId) : undefined),
    [allGuests, guestId]
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>('needs_invite');
  const [partySize, setPartySize] = useState('1');
  const [tableId, setTableId] = useState<string | undefined>(undefined);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [tableError, setTableError] = useState('');

  useEffect(() => {
    if (existingGuest) {
      setFirstName(existingGuest.firstName);
      setLastName(existingGuest.lastName);
      setPhone(existingGuest.phone ?? '');
      setCategory(existingGuest.category);
      setAttendanceStatus(existingGuest.attendanceStatus);
      setPartySize(String(existingGuest.partySize));
      setTableId(existingGuest.tableId);
      setNote(existingGuest.note ?? '');
      setShowNote(!!existingGuest.note?.trim());
    } else {
      setCategory(defaultCategory);
      setShowNote(false);
      setNote('');
    }
  }, [existingGuest, defaultCategory]);

  useEffect(() => {
    if (areAdsEnabled() && isOnline) {
      preloadRewardedGuestAd();
    }
  }, [isOnline]);

  const eventTables = useMemo(
    () => (eventId ? getTablesForEvent(tables, eventId) : []),
    [tables, eventId]
  );

  const handleSave = async () => {
    if (!firstName.trim()) {
      setFirstNameError(t('guests.firstNameRequired'));
      return;
    }
    if (!eventId) return;

    const parsedPartySize = Math.max(1, parseInt(partySize, 10) || 1);
    const oldTotalPeople = getGuestStats(allGuests, eventId).totalPeople;
    const oldPartySize = existingGuest?.partySize ?? 0;
    const payload = {
      eventId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      category: hasGuestCategories ? category : '',
      attendanceStatus,
      partySize: parsedPartySize,
      tableId: tableId || undefined,
      note: showNote ? note.trim() || undefined : undefined,
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

    const newTotalPeople = oldTotalPeople - oldPartySize + parsedPartySize;
    if (
      didCrossGuestAdMilestone(oldTotalPeople, newTotalPeople) &&
      canShowGuestMilestoneAd(isOnline)
    ) {
      await showRewardedGuestAd();
      preloadRewardedGuestAd();
    }

    router.back();
  };

  const tableOptions = useMemo(() => {
    const options = eventTables.map((table) => ({
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
  }, [eventTables, tableId, tables, t]);

  const showTableHint = tableOptions.length === 1;

  const showNoTablesHint = () => {
    Alert.alert(t('guests.noTablesHintTitle'), t('guests.noTablesHintMessage'), [
      { text: t('common.close'), style: 'cancel' },
    ]);
  };

  if (!eventId) return null;

  const parsedPartySize = Math.max(1, parseInt(partySize, 10) || 1);

  return (
    <ThemedEventModal eventId={eventId} showBottomBanner>
      <FormScrollView
        contentContainerStyle={[styles.container, { paddingBottom: modalScrollPadding }]}
      >
        <Stack.Screen
          options={getThemedModalScreenOptions(
            celebrationTheme,
            existingGuest ? t('guests.edit') : t('guests.add')
          )}
        />

      <View style={styles.nameRow}>
        <View style={styles.nameField}>
          <TextInputField
            label={t('guests.firstName')}
            required
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setFirstNameError('');
            }}
            placeholder={t('guests.firstNamePlaceholder')}
            error={firstNameError}
          />
        </View>
        <View style={styles.nameField}>
          <TextInputField
            label={t('guests.lastName')}
            value={lastName}
            onChangeText={setLastName}
            placeholder={t('guests.lastNamePlaceholder')}
          />
        </View>
      </View>
      <View style={styles.nameRow}>
        <View style={styles.nameField}>
          <TextInputField
            label={t('guests.phone')}
            value={phone}
            onChangeText={setPhone}
            placeholder={t('guests.phonePlaceholder')}
            keyboardType="default"
          />
        </View>
        {hasGuestCategories ? (
          <View style={styles.nameField}>
            <GuestCategoryPicker eventId={eventId} selected={category} onSelect={setCategory} />
          </View>
        ) : null}
      </View>

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

      <View style={styles.nameRow}>
        <View style={styles.nameField}>
          <SelectField
            label={t('guests.attendance')}
            value={attendanceStatus}
            options={ATTENDANCE_STATUSES.map((value) => ({
              value,
              label: t(`guests.status.${value}`),
            }))}
            onChange={setAttendanceStatus}
            compact
          />
        </View>
        <View style={styles.nameField}>
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
            compact
          />
        </View>
      </View>

      <View style={styles.noteSection}>
        <View style={[styles.switchRow, showNote && styles.switchRowExpanded]}>
          <Text style={[styles.switchLabel, { color: theme.text }]}>{t('guests.note')}</Text>
          <Switch
            value={showNote}
            onValueChange={(value) => {
              setShowNote(value);
              if (!value) setNote('');
            }}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={showNote ? theme.primary : theme.surface}
          />
        </View>

        {showNote ? (
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t('guests.notePlaceholder')}
            placeholderTextColor={theme.textMuted}
            multiline
            style={[
              styles.noteInput,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
          />
        ) : null}
      </View>

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
  nameRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  nameField: {
    flex: 1,
    minWidth: 0,
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
  noteSection: {
    marginBottom: spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  switchRowExpanded: {
    marginBottom: spacing.xs,
  },
  switchLabel: {
    ...typography.body,
    flex: 1,
    paddingRight: spacing.md,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
