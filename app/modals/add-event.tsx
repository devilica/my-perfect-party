import { DatePickerField } from '@/components/DatePickerField';
import { StringListEditor } from '@/components/StringListEditor';
import { ThemedScreenContainer } from '@/components/ThemedScreenContainer';
import { ThemePicker } from '@/components/ThemePicker';
import { Button, TextInputField } from '@/components/ui';
import { DEFAULT_GUEST_CATEGORIES } from '@/constants/guestCategories';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import { useWeddingStore } from '@/store/weddingStore';
import { getCelebrationTheme } from '@/theme/celebrations';
import { EventThemeProvider } from '@/theme/EventThemeContext';
import { spacing } from '@/theme/colors';
import { CelebrationThemeId } from '@/types/models';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function AddEventModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId?: string }>();
  const eventId = getRouteParam(params.eventId);
  const language = useWeddingStore((s) => s.language);
  const events = useWeddingStore((s) => s.events);
  const addEvent = useWeddingStore((s) => s.addEvent);
  const updateEvent = useWeddingStore((s) => s.updateEvent);
  const existingEvent = useMemo(
    () => (eventId ? events.find((event) => event.id === eventId) : undefined),
    [events, eventId]
  );
  const { t } = useTranslation(language);
  const modalScrollPadding = useModalScrollPadding();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [theme, setTheme] = useState<CelebrationThemeId>('wedding');
  const [guestCategories, setGuestCategories] = useState<string[]>([...DEFAULT_GUEST_CATEGORIES]);
  const [guestSides, setGuestSides] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');

  const previewTheme = getCelebrationTheme(theme);

  useEffect(() => {
    if (existingEvent) {
      setName(existingEvent.name);
      setDate(existingEvent.date ?? '');
      setLocation(existingEvent.location ?? '');
      setTheme(existingEvent.theme);
      setGuestCategories(existingEvent.guestCategories ?? [...DEFAULT_GUEST_CATEGORIES]);
      setGuestSides(existingEvent.guestSides ?? []);
    }
  }, [existingEvent]);

  const handleSave = () => {
    if (name.trim().length < 2) {
      setNameError(t('events.nameRequired'));
      return;
    }

    const payload = {
      name: name.trim(),
      date: date.trim() || undefined,
      location: location.trim() || undefined,
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
    <EventThemeProvider themeId={theme}>
      <ThemedScreenContainer padded={false} style={styles.screen}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: modalScrollPadding }]}
          keyboardShouldPersistTaps="handled"
        >
          <Stack.Screen
            options={{
              title: existingEvent ? t('events.edit') : t('events.add'),
              headerStyle: { backgroundColor: previewTheme.colors.background },
              headerTintColor: previewTheme.colors.primary,
              headerTitleStyle: { color: previewTheme.colors.text },
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />

          <TextInputField
            label={t('events.name')}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError('');
            }}
            placeholder={t('events.namePlaceholder')}
            error={nameError}
          />
          <ThemePicker
            label={t('events.theme')}
            selected={theme}
            onSelect={setTheme}
            getLabel={(themeId) => t(`events.themes.${themeId}`)}
          />
          <StringListEditor
            label={t('events.guestCategories')}
            items={guestCategories}
            onChange={setGuestCategories}
            addLabel={t('events.addGuestCategory')}
            placeholder={t('events.guestCategoryPlaceholder')}
          />
          <StringListEditor
            label={t('events.guestSides')}
            items={guestSides}
            onChange={setGuestSides}
            addLabel={t('events.addGuestSide')}
            placeholder={t('events.guestSidePlaceholder')}
          />
          <DatePickerField
            label={`${t('events.date')} (${t('common.optional')})`}
            value={date || undefined}
            onChange={(iso) => setDate(iso ?? '')}
            placeholder={t('events.selectDate')}
            clearLabel={t('events.clearDate')}
            locale={language}
          />
          <TextInputField
            label={`${t('events.location')} (${t('common.optional')})`}
            value={location}
            onChangeText={setLocation}
            placeholder={t('events.locationPlaceholder')}
          />

          <View style={styles.actions}>
            <Button label={t('common.save')} onPress={handleSave} />
            <Button label={t('common.cancel')} variant="ghost" onPress={() => router.back()} />
          </View>
        </ScrollView>
      </ThemedScreenContainer>
    </EventThemeProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
