import { DatePickerField } from '@/components/DatePickerField';
import { BottomSystemBarFill } from '@/components/BottomSystemBarFill';
import { StringListEditor } from '@/components/StringListEditor';
import { FormScrollView } from '@/components/FormScrollView';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemePicker } from '@/components/ThemePicker';
import { Button, TextInputField } from '@/components/ui';
import { DEFAULT_GUEST_CATEGORIES, getGuestCategoryLabel } from '@/constants/guestCategories';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import {
  formatIsoDateTime,
  hasEventTime,
  parseIsoDateTime,
} from '@/lib/dateUtils';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import { flexFill } from '@/lib/webLayout';
import { useWeddingStore } from '@/store/weddingStore';
import { EventThemeProvider, useThemeColors } from '@/theme/EventThemeContext';
import { spacing } from '@/theme/colors';
import { CelebrationThemeId, WeddingEvent } from '@/types/models';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function AddEventModal() {
  const params = useLocalSearchParams<{ eventId?: string }>();
  const eventId = getRouteParam(params.eventId);
  const events = useWeddingStore((s) => s.events);
  const existingEvent = useMemo(
    () => (eventId ? events.find((event) => event.id === eventId) : undefined),
    [events, eventId]
  );

  const [theme, setTheme] = useState<CelebrationThemeId>(
    existingEvent?.theme ?? 'wedding'
  );

  useEffect(() => {
    if (existingEvent) {
      setTheme(existingEvent.theme);
    }
  }, [existingEvent]);

  return (
    <EventThemeProvider themeId={theme}>
      <AddEventForm
        existingEvent={existingEvent}
        theme={theme}
        onThemeChange={setTheme}
      />
    </EventThemeProvider>
  );
}

type AddEventFormProps = {
  existingEvent: WeddingEvent | undefined;
  theme: CelebrationThemeId;
  onThemeChange: (themeId: CelebrationThemeId) => void;
};

function AddEventForm({ existingEvent, theme, onThemeChange }: AddEventFormProps) {
  const router = useRouter();
  const language = useWeddingStore((s) => s.language);
  const addEvent = useWeddingStore((s) => s.addEvent);
  const updateEvent = useWeddingStore((s) => s.updateEvent);
  const { t } = useTranslation(language);
  const modalScrollPadding = useModalScrollPadding();
  const themeColors = useThemeColors();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCategories, setGuestCategories] = useState<string[]>([...DEFAULT_GUEST_CATEGORIES]);
  const [guestSides, setGuestSides] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');
  const [dateError, setDateError] = useState('');
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (existingEvent) {
      setName(existingEvent.name);
      setDate(existingEvent.date ?? '');
      setLocation(existingEvent.location ?? '');
      setGuestCategories(existingEvent.guestCategories ?? [...DEFAULT_GUEST_CATEGORIES]);
      setGuestSides(existingEvent.guestSides ?? []);
    }
  }, [existingEvent]);

  const handleSave = () => {
    let hasError = false;

    if (name.trim().length < 2) {
      setNameError(t('events.nameRequired'));
      hasError = true;
    }

    const parsedDate = parseIsoDateTime(date.trim());
    if (!parsedDate) {
      setDateError(t('events.dateTimeRequired'));
      hasError = true;
    } else if (!existingEvent && !hasEventTime(date.trim())) {
      setDateError(t('events.dateTimeRequired'));
      hasError = true;
    }

    if (location.trim().length < 2) {
      setLocationError(t('events.locationRequired'));
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      name: name.trim(),
      date: parsedDate ? formatIsoDateTime(parsedDate) : undefined,
      location: location.trim(),
      theme,
      guestCategories,
      guestSides,
    };

    if (existingEvent) {
      updateEvent(existingEvent.id, payload);
      router.back();
      return;
    }

    const id = addEvent(payload);
    router.replace(`/event/${id}`);
  };

  return (
    <ScreenContainer padded={false} style={styles.screen}>
      <FormScrollView
        contentContainerStyle={[styles.container, { paddingBottom: modalScrollPadding }]}
      >
        <Stack.Screen
          options={{
            title: existingEvent ? t('events.edit') : t('events.add'),
            headerStyle: { backgroundColor: themeColors.background },
            headerTintColor: themeColors.primary,
            headerTitleStyle: { color: themeColors.text },
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />

        <TextInputField
          label={t('events.name')}
          required
          value={name}
          onChangeText={(text) => {
            setName(text);
            setNameError('');
          }}
          placeholder={t('events.namePlaceholder')}
          error={nameError}
        />
        <DatePickerField
          label={t('events.dateTime')}
          required
          value={date || undefined}
          onChange={(iso) => {
            setDate(iso ?? '');
            setDateError('');
          }}
          placeholder={t('events.selectDateTime')}
          clearLabel={t('events.clearDate')}
          locale={language}
          error={dateError}
          mode="datetime"
          clearable={false}
        />
        <TextInputField
          label={t('events.location')}
          required
          value={location}
          onChangeText={(text) => {
            setLocation(text);
            setLocationError('');
          }}
          placeholder={t('events.locationPlaceholder')}
          error={locationError}
        />
        <ThemePicker
          label={t('events.theme')}
          selected={theme}
          onSelect={onThemeChange}
          getLabel={(themeId) => t(`events.themes.${themeId}`)}
        />
        <StringListEditor
          label={t('events.guestCategories')}
          items={guestCategories}
          onChange={setGuestCategories}
          addLabel={t('events.addGuestCategory')}
          placeholder={t('events.guestCategoryPlaceholder')}
          getItemLabel={(item) => getGuestCategoryLabel(item, t)}
        />
        <StringListEditor
          label={t('events.guestSides')}
          items={guestSides}
          onChange={setGuestSides}
          addLabel={t('events.addGuestSide')}
          placeholder={t('events.guestSidePlaceholder')}
        />

        <View style={styles.actions}>
          <Button label={t('common.save')} onPress={handleSave} />
          <Button label={t('common.cancel')} variant="ghost" onPress={() => router.back()} />
        </View>
      </FormScrollView>
      <BottomSystemBarFill color={themeColors.background} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...flexFill,
  },
  container: {
    flexGrow: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
