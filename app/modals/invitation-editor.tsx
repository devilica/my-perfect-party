import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';
import { InvitationIconPicker } from '@/components/InvitationIconPicker';
import { InvitationPreview } from '@/components/InvitationPreview';
import { InvitationTemplatePicker } from '@/components/InvitationTemplatePicker';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { Button, TextInputField } from '@/components/ui';
import {
  INVITATION_FONT_COLORS,
} from '@/constants/invitationIcons';
import {
  getSuggestedFontColor,
  getTemplateIndex,
  INVITATION_TEMPLATES,
} from '@/constants/invitationTemplates';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { useIsOnline } from '@/hooks/useIsOnline';
import { areAdsEnabled } from '@/lib/adsEnvironment';
import { createDefaultInvitation } from '@/lib/invitationDefaults';
import { generateId } from '@/lib/generateId';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import { downloadInvitationImage } from '@/lib/downloadInvitationImage';
import {
  preloadRewardedInvitationAd,
  showRewardedInvitationAd,
} from '@/lib/rewardedInvitationAd';
import { shareInvitationImage } from '@/lib/shareInvitationImage';
import { useWeddingStore } from '@/store/weddingStore';
import {
  EventInvitation,
  InvitationFontFamily,
  InvitationSubEvent,
} from '@/types/models';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

const MAX_SUB_EVENTS = 4;

function SubEventEditor({
  subEvent,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  subEvent: InvitationSubEvent;
  index: number;
  onChange: (updated: InvitationSubEvent) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  return (
    <View style={[styles.subEventCard, { borderColor: theme.border, backgroundColor: theme.surface }]}>
      <View style={styles.subEventHeader}>
        <Text style={[styles.subEventLabel, { color: theme.textSecondary }]}>
          {t('invitation.subEvents')} {index + 1}
        </Text>
        {canRemove ? (
          <Pressable onPress={onRemove} hitSlop={8}>
            <Text style={[styles.removeLink, { color: theme.danger }]}>
              {t('invitation.removeSubEvent')}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <InvitationIconPicker
        title={t('invitation.subEventIcon')}
        selectedIcon={subEvent.icon}
        onSelect={(icon) => onChange({ ...subEvent, icon })}
      />
      <TextInputField
        label={t('invitation.subEventTime')}
        value={subEvent.time ?? ''}
        onChangeText={(time) => onChange({ ...subEvent, time })}
        placeholder="12:00"
      />
      <TextInputField
        label={t('invitation.subEventTitle')}
        value={subEvent.title}
        onChangeText={(title) => onChange({ ...subEvent, title })}
        placeholder={t('invitation.defaults.ceremony')}
      />
      <TextInputField
        label={t('invitation.subEventLocation')}
        value={subEvent.location ?? ''}
        onChangeText={(location) => onChange({ ...subEvent, location })}
        placeholder={t('invitation.defaults.venue')}
      />
    </View>
  );
}

export default function InvitationEditorModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId: string }>();
  const eventId = getRouteParam(params.eventId);
  const language = useWeddingStore((s) => s.language);
  const events = useWeddingStore((s) => s.events);
  const updateEventInvitation = useWeddingStore((s) => s.updateEventInvitation);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');
  const modalScrollPadding = useModalScrollPadding();
  const isOnline = useIsOnline();
  const previewRef = useRef<View>(null);
  const initializedRef = useRef<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const event = useMemo(
    () => (eventId ? events.find((item) => item.id === eventId) : undefined),
    [events, eventId]
  );

  const [invitation, setInvitation] = useState<EventInvitation | null>(null);

  useEffect(() => {
    if (!event) return;
    const key = `${event.id}:${event.invitation?.updatedAt ?? 'new'}`;
    if (initializedRef.current === key) return;
    initializedRef.current = key;
    setInvitation(event.invitation ?? createDefaultInvitation(event, t));
  }, [event?.id, event?.invitation?.updatedAt, language]);

  useEffect(() => {
    if (areAdsEnabled() && isOnline) {
      preloadRewardedInvitationAd();
    }
  }, [isOnline]);

  const screenOptions = useMemo(
    () => getThemedModalScreenOptions(celebrationTheme, t('invitation.editorTitle')),
    [celebrationTheme, language]
  );

  const updateField = <K extends keyof EventInvitation>(
    key: K,
    value: EventInvitation[K]
  ) => {
    setInvitation((current) => (current ? { ...current, [key]: value } : current));
  };

  const selectTemplate = (templateId: string) => {
    if (!invitation) return;
    setInvitation({
      ...invitation,
      templateId,
      fontColor: getSuggestedFontColor(templateId),
    });
  };

  const cycleTemplate = (direction: -1 | 1) => {
    if (!invitation) return;
    const currentIndex = getTemplateIndex(invitation.templateId);
    const nextIndex =
      (currentIndex + direction + INVITATION_TEMPLATES.length) %
      INVITATION_TEMPLATES.length;
    selectTemplate(INVITATION_TEMPLATES[nextIndex].id);
  };

  const handleSave = () => {
    if (!eventId || !invitation) return;
    updateEventInvitation(eventId, invitation);
    router.back();
  };

  const ensureInvitationReward = async (): Promise<boolean> => {
    if (!areAdsEnabled() || !isOnline) return true;

    const result = await showRewardedInvitationAd();
    if (result === 'rewarded') {
      preloadRewardedInvitationAd();
      return true;
    }
    if (result === 'unavailable' || result === 'failed') {
      return true;
    }
    return false;
  };

  const handleShare = async () => {
    if (!invitation) return;
    setSharing(true);
    try {
      if (!(await ensureInvitationReward())) return;

      const result = await shareInvitationImage(
        previewRef,
        t('invitation.shareUnavailableWeb')
      );
      if (result === 'unavailable') {
        Alert.alert(t('invitation.shareUnavailableWeb'));
      }
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!invitation) return;
    setDownloading(true);
    try {
      if (!(await ensureInvitationReward())) return;

      const result = await downloadInvitationImage(previewRef);
      if (result === 'saved') {
        Alert.alert(t('invitation.downloadSuccess'));
      } else if (result === 'denied') {
        Alert.alert(t('invitation.downloadDenied'));
      } else {
        Alert.alert(t('invitation.downloadUnavailableWeb'));
      }
    } finally {
      setDownloading(false);
    }
  };

  const addSubEvent = () => {
    if (!invitation || invitation.subEvents.length >= MAX_SUB_EVENTS) return;
    const newSubEvent: InvitationSubEvent = {
      id: generateId(),
      icon: 'time-outline',
      time: '12:00',
      title: '',
      location: '',
    };
    updateField('subEvents', [...invitation.subEvents, newSubEvent]);
  };

  const updateSubEvent = (index: number, updated: InvitationSubEvent) => {
    if (!invitation) return;
    const subEvents = invitation.subEvents.map((item, i) =>
      i === index ? updated : item
    );
    updateField('subEvents', subEvents);
  };

  const removeSubEvent = (index: number) => {
    if (!invitation) return;
    updateField(
      'subEvents',
      invitation.subEvents.filter((_, i) => i !== index)
    );
  };

  if (!event || !invitation) return null;

  const fontFamilyOptions: { value: InvitationFontFamily; label: string }[] = [
    { value: 'script', label: t('invitation.fontScript') },
    { value: 'serif', label: t('invitation.fontSerif') },
    { value: 'sans', label: t('invitation.fontSans') },
  ];

  return (
    <ThemedEventModal eventId={eventId ?? ''}>
      <Stack.Screen options={screenOptions} />
      <FormScrollView
        contentContainerStyle={[styles.container, { paddingBottom: modalScrollPadding }]}
      >
        <View style={styles.previewSection}>
          <Pressable
            onPress={() => cycleTemplate(-1)}
            style={[styles.navBtn, { backgroundColor: theme.surface }]}
            accessibilityLabel={t('invitation.prevTemplate')}
          >
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </Pressable>

          <InvitationPreview ref={previewRef} invitation={invitation} />

          <Pressable
            onPress={() => cycleTemplate(1)}
            style={[styles.navBtn, { backgroundColor: theme.surface }]}
            accessibilityLabel={t('invitation.nextTemplate')}
          >
            <Ionicons name="chevron-forward" size={22} color={theme.text} />
          </Pressable>
        </View>

        <InvitationTemplatePicker
          selectedId={invitation.templateId}
          onSelect={selectTemplate}
        />

        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          {t('invitation.opacity')}
        </Text>
        <Slider
          minimumValue={0.2}
          maximumValue={1}
          step={0.05}
          value={invitation.backgroundOpacity}
          onValueChange={(value) => updateField('backgroundOpacity', value)}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
          style={styles.slider}
        />

        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          {t('invitation.fontSize')}: {Math.round(invitation.fontSize)}
        </Text>
        <Slider
          minimumValue={24}
          maximumValue={48}
          step={1}
          value={invitation.fontSize}
          onValueChange={(value) => updateField('fontSize', value)}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
          style={styles.slider}
        />

        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          {t('invitation.fontColor')}
        </Text>
        <View style={styles.colorRow}>
          {INVITATION_FONT_COLORS.map((color) => {
            const selected = invitation.fontColor === color;
            return (
              <Pressable
                key={color}
                onPress={() => updateField('fontColor', color)}
                style={[
                  styles.colorSwatch,
                  {
                    backgroundColor: color,
                    borderColor: selected ? theme.primary : theme.border,
                    borderWidth: selected ? 3 : 1,
                  },
                ]}
              />
            );
          })}
        </View>

        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          {t('invitation.lineSpacing')}
        </Text>
        <Slider
          minimumValue={0.8}
          maximumValue={1.4}
          step={0.05}
          value={invitation.lineSpacing}
          onValueChange={(value) => updateField('lineSpacing', value)}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
          style={styles.slider}
        />

        <InvitationIconPicker
          selectedIcon={invitation.headerIcon}
          onSelect={(icon) => updateField('headerIcon', icon)}
        />

        <TextInputField
          label={t('invitation.headerTitle')}
          value={invitation.headerTitle}
          onChangeText={(value) => updateField('headerTitle', value)}
          placeholder={t('invitation.headerTitlePlaceholder')}
        />

        <TextInputField
          label={t('invitation.hostNames')}
          value={invitation.hostNames}
          onChangeText={(value) => updateField('hostNames', value)}
          placeholder={t('invitation.hostNamesPlaceholder')}
        />

        <TextInputField
          label={t('invitation.eventDate')}
          value={invitation.eventDateText}
          onChangeText={(value) => updateField('eventDateText', value)}
          placeholder={t('invitation.eventDatePlaceholder')}
        />

        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          {t('invitation.namesFont')}
        </Text>
        <View style={styles.chipRow}>
          {fontFamilyOptions.map((option) => {
            const active = invitation.namesFontFamily === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => updateField('namesFontFamily', option.value)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? theme.primaryLight : theme.surface,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? theme.primaryDark : theme.textSecondary,
                    fontWeight: active ? '600' : '400',
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.subEventsHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t('invitation.subEvents')}
          </Text>
          {invitation.subEvents.length < MAX_SUB_EVENTS ? (
            <Pressable onPress={addSubEvent}>
              <Text style={[styles.addLink, { color: theme.primary }]}>
                + {t('invitation.addSubEvent')}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {invitation.subEvents.map((subEvent, index) => (
          <SubEventEditor
            key={subEvent.id}
            subEvent={subEvent}
            index={index}
            onChange={(updated) => updateSubEvent(index, updated)}
            onRemove={() => removeSubEvent(index)}
            canRemove={invitation.subEvents.length > 1}
          />
        ))}

        <TextInputField
          label={t('invitation.rsvpMessage')}
          value={invitation.rsvpMessage}
          onChangeText={(value) => updateField('rsvpMessage', value)}
          placeholder={t('invitation.rsvpPlaceholder')}
          multiline
        />

        <View style={styles.actions}>
          <Button
            label={t('invitation.save')}
            icon="save-outline"
            onPress={handleSave}
            style={styles.actionBtn}
          />
          <Button
            label={t('invitation.share')}
            icon="share-outline"
            variant="secondary"
            onPress={handleShare}
            loading={sharing}
            style={styles.actionBtn}
          />
          <Button
            label={t('invitation.download')}
            icon="download-outline"
            variant="secondary"
            onPress={handleDownload}
            loading={downloading}
            style={styles.actionBtn}
          />
        </View>
      </FormScrollView>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  previewSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  fieldLabel: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  slider: {
    width: '100%',
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  subEventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  addLink: {
    ...typography.caption,
    fontWeight: '600',
  },
  subEventCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  subEventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subEventLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  removeLink: {
    ...typography.caption,
    fontWeight: '600',
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
});
