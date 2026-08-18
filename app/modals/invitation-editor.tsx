import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BottomSystemBarFill } from '@/components/BottomSystemBarFill';
import { FormScrollView } from '@/components/FormScrollView';
import { InvitationIconPicker } from '@/components/InvitationIconPicker';
import {
  InvitationPreview,
  InvitationSelection,
} from '@/components/InvitationPreview';
import { InvitationTemplatePicker } from '@/components/InvitationTemplatePicker';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { HexColorPicker } from '@/components/HexColorPicker';
import { Button, TextInputField } from '@/components/ui';
import {
  getTemplateIndex,
  INVITATION_TEMPLATES,
} from '@/constants/invitationTemplates';
import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { useIsOnline } from '@/hooks/useIsOnline';
import { areAdsEnabled } from '@/lib/adsEnvironment';
import {
  createDefaultInvitation,
  createInvitationTextBox,
  normalizeInvitation,
} from '@/lib/invitationDefaults';
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
  InvitationTextAlign,
  InvitationTextBox,
} from '@/types/models';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

const MAX_SUB_EVENTS = 4;
const MAX_CUSTOM_TEXTS = 8;

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
        allowNone
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

function CustomTextEditor({
  box,
  index,
  selected,
  onChange,
  onRemove,
  onFocus,
  showRemove = true,
}: {
  box: InvitationTextBox;
  index: number;
  selected: boolean;
  onChange: (updated: InvitationTextBox) => void;
  onRemove: () => void;
  onFocus: () => void;
  showRemove?: boolean;
}) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const fontFamilyOptions: { value: InvitationFontFamily; label: string }[] = [
    { value: 'script', label: t('invitation.fontScript') },
    { value: 'serif', label: t('invitation.fontSerif') },
    { value: 'sans', label: t('invitation.fontSans') },
  ];

  const alignOptions: {
    value: InvitationTextAlign;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
  }[] = [
    { value: 'left', icon: 'format-align-left' },
    { value: 'center', icon: 'format-align-center' },
    { value: 'right', icon: 'format-align-right' },
  ];

  return (
    <View
      style={[
        styles.subEventCard,
        {
          borderColor: selected ? theme.primary : theme.border,
          backgroundColor: theme.surface,
        },
      ]}
    >
      <View style={styles.subEventHeader}>
        <Text style={[styles.subEventLabel, { color: theme.textSecondary }]}>
          {t('invitation.customTexts')} {index + 1}
        </Text>
        {showRemove ? (
          <Pressable onPress={onRemove} hitSlop={8}>
            <Text style={[styles.removeLink, { color: theme.danger }]}>
              {t('invitation.removeText')}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <TextInputField
        label={t('invitation.customTextLabel')}
        value={box.text}
        onChangeText={(text) => {
          onFocus();
          onChange({ ...box, text });
        }}
        placeholder={t('invitation.customTextPlaceholder')}
        multiline
      />
      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
        {t('invitation.textSize')}: {Math.round(box.fontSize)}
      </Text>
      <Slider
        minimumValue={10}
        maximumValue={42}
        step={1}
        value={box.fontSize}
        onValueChange={(fontSize) => {
          onFocus();
          onChange({ ...box, fontSize });
        }}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={theme.border}
        thumbTintColor={theme.primary}
        style={styles.slider}
      />
      <View style={styles.chipRow}>
        {fontFamilyOptions.map((option) => {
          const active = box.fontFamily === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange({ ...box, fontFamily: option.value })}
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
      <View style={styles.chipRow}>
        {alignOptions.map((option) => {
          const active = (box.align ?? 'center') === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange({ ...box, align: option.value })}
              style={[
                styles.alignChip,
                {
                  backgroundColor: active ? theme.primaryLight : theme.surface,
                  borderColor: active ? theme.primary : theme.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={option.icon}
                size={20}
                color={active ? theme.primaryDark : theme.textSecondary}
              />
            </Pressable>
          );
        })}
      </View>
      <HexColorPicker
        label={t('invitation.fontColor')}
        actionLabel={t('invitation.changeColor')}
        hexLabel={t('invitation.colorHex')}
        value={box.color}
        onChange={(color) => onChange({ ...box, color })}
      />
    </View>
  );
}

function selectionTitle(selection: InvitationSelection, t: (key: string) => string) {
  switch (selection.type) {
    case 'headerIcon':
      return t('invitation.selectHeaderIcon');
    case 'headerTitle':
      return t('invitation.headerTitle');
    case 'hostNames':
      return t('invitation.hostNames');
    case 'eventDate':
      return t('invitation.eventDate');
    case 'rsvp':
      return t('invitation.rsvpMessage');
    case 'subEvent':
      return t('invitation.subEvents');
    case 'customText':
      return t('invitation.customTexts');
  }
}

function InvitationElementEditSheet({
  visible,
  selection,
  invitation,
  onClose,
  onUpdateField,
  onUpdateSubEvent,
  onUpdateCustomText,
}: {
  visible: boolean;
  selection: InvitationSelection | null;
  invitation: EventInvitation;
  onClose: () => void;
  onUpdateField: <K extends keyof EventInvitation>(key: K, value: EventInvitation[K]) => void;
  onUpdateSubEvent: (id: string, updated: InvitationSubEvent) => void;
  onUpdateCustomText: (id: string, updated: InvitationTextBox) => void;
}) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const bottomSheetPadding = useBottomSheetPadding();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [visible]);

  if (!visible || !selection) return null;

  const windowHeight = Dimensions.get('window').height;
  const sheetLift = keyboardHeight;
  const sheetMaxHeight =
    sheetLift > 0
      ? Math.max(240, windowHeight - sheetLift - spacing.md)
      : windowHeight * 0.75;

  const subEvent =
    selection.type === 'subEvent'
      ? invitation.subEvents.find((item) => item.id === selection.id)
      : undefined;
  const customText =
    selection.type === 'customText'
      ? invitation.customTexts.find((item) => item.id === selection.id)
      : undefined;
  const subEventIndex =
    selection.type === 'subEvent'
      ? invitation.subEvents.findIndex((item) => item.id === selection.id)
      : -1;
  const customTextIndex =
    selection.type === 'customText'
      ? invitation.customTexts.findIndex((item) => item.id === selection.id)
      : -1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.sheetOverlay, { backgroundColor: theme.overlay }]}>
        <Pressable style={styles.sheetDismiss} onPress={onClose} />
        <View
          style={[
            styles.editSheet,
            {
              backgroundColor: theme.background,
              paddingBottom: sheetLift > 0 ? spacing.md : bottomSheetPadding,
              marginBottom: sheetLift,
              maxHeight: sheetMaxHeight,
            },
          ]}
        >
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>
              {selectionTitle(selection, t)}
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.editSheetScroll}
            contentContainerStyle={styles.editSheetBody}
            keyboardDismissMode="interactive"
          >
            {selection.type === 'headerIcon' ? (
              <InvitationIconPicker
                selectedIcon={invitation.headerIcon}
                onSelect={(icon) => onUpdateField('headerIcon', icon)}
                allowNone
                embedded
              />
            ) : null}
            {selection.type === 'headerTitle' ? (
              <TextInputField
                label={t('invitation.headerTitle')}
                value={invitation.headerTitle}
                onChangeText={(value) => onUpdateField('headerTitle', value)}
                placeholder={t('invitation.headerTitlePlaceholder')}
                multiline
              />
            ) : null}
            {selection.type === 'hostNames' ? (
              <TextInputField
                label={t('invitation.hostNames')}
                value={invitation.hostNames}
                onChangeText={(value) => onUpdateField('hostNames', value)}
                placeholder={t('invitation.hostNamesPlaceholder')}
                multiline
              />
            ) : null}
            {selection.type === 'eventDate' ? (
              <TextInputField
                label={t('invitation.eventDate')}
                value={invitation.eventDateText}
                onChangeText={(value) => onUpdateField('eventDateText', value)}
                placeholder={t('invitation.eventDatePlaceholder')}
              />
            ) : null}
            {selection.type === 'rsvp' ? (
              <TextInputField
                label={t('invitation.rsvpMessage')}
                value={invitation.rsvpMessage}
                onChangeText={(value) => onUpdateField('rsvpMessage', value)}
                placeholder={t('invitation.rsvpPlaceholder')}
                multiline
              />
            ) : null}
            {selection.type === 'subEvent' && subEvent ? (
              <SubEventEditor
                subEvent={subEvent}
                index={Math.max(subEventIndex, 0)}
                onChange={(updated) => onUpdateSubEvent(subEvent.id, updated)}
                onRemove={onClose}
                canRemove={false}
              />
            ) : null}
            {selection.type === 'customText' && customText ? (
              <CustomTextEditor
                box={customText}
                index={Math.max(customTextIndex, 0)}
                selected
                onChange={(updated) => onUpdateCustomText(customText.id, updated)}
                onRemove={onClose}
                onFocus={() => undefined}
                showRemove={false}
              />
            ) : null}
          </ScrollView>
          <Button
            label={t('invitation.save')}
            icon="checkmark-outline"
            onPress={onClose}
            style={styles.sheetSaveBtn}
          />
        </View>
        {sheetLift > 0 ? null : <BottomSystemBarFill color={theme.background} />}
      </View>
    </Modal>
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
  const [removingWatermark, setRemovingWatermark] = useState(false);
  const [selected, setSelected] = useState<InvitationSelection | null>(null);
  const [editTarget, setEditTarget] = useState<InvitationSelection | null>(null);
  const [draggingText, setDraggingText] = useState(false);

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
    setInvitation(
      normalizeInvitation(event.invitation ?? createDefaultInvitation(event, t))
    );
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

  const handleRemoveWatermark = async () => {
    if (!invitation || invitation.watermarkRemoved) return;
    setRemovingWatermark(true);
    try {
      if (!areAdsEnabled()) {
        updateField('watermarkRemoved', true);
        return;
      }
      if (!isOnline) {
        Alert.alert(t('invitation.adUnavailable'));
        return;
      }

      const result = await showRewardedInvitationAd();
      if (result === 'rewarded') {
        preloadRewardedInvitationAd();
        updateField('watermarkRemoved', true);
        return;
      }
      if (result === 'unavailable' || result === 'failed') {
        Alert.alert(t('invitation.adUnavailable'));
      }
    } finally {
      setRemovingWatermark(false);
    }
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
    setSelected(null);
    setEditTarget(null);
    setSharing(true);
    await new Promise((resolve) => setTimeout(resolve, 32));
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
    setSelected(null);
    setEditTarget(null);
    setDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 32));
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

  const customTexts = invitation?.customTexts ?? [];

  const addCustomText = () => {
    if (!invitation || customTexts.length >= MAX_CUSTOM_TEXTS) return;
    const next = createInvitationTextBox(
      invitation.fontColor,
      invitation.namesFontFamily,
      customTexts.length,
      t('invitation.customTextPlaceholder')
    );
    updateField('customTexts', [...customTexts, next]);
    setSelected({ type: 'customText', id: next.id });
    setEditTarget({ type: 'customText', id: next.id });
  };

  const updateCustomText = (id: string, updated: InvitationTextBox) => {
    updateField(
      'customTexts',
      customTexts.map((item) => (item.id === id ? updated : item))
    );
  };

  const moveCustomText = (id: string, x: number, y: number) => {
    updateField(
      'customTexts',
      customTexts.map((item) => (item.id === id ? { ...item, x, y } : item))
    );
  };

  const removeCustomText = (id: string) => {
    updateField(
      'customTexts',
      customTexts.filter((item) => item.id !== id)
    );
    setSelected((current) =>
      current?.type === 'customText' && current.id === id ? null : current
    );
    setEditTarget((current) =>
      current?.type === 'customText' && current.id === id ? null : current
    );
  };

  const updateSubEventById = (id: string, updated: InvitationSubEvent) => {
    if (!invitation) return;
    updateField(
      'subEvents',
      invitation.subEvents.map((item) => (item.id === id ? updated : item))
    );
  };

  const handleDeleteSelection = (target: InvitationSelection) => {
    if (!invitation) return;
    switch (target.type) {
      case 'headerIcon':
        updateField('headerIcon', '');
        break;
      case 'headerTitle':
        updateField('headerTitle', '');
        break;
      case 'hostNames':
        updateField('hostNames', '');
        break;
      case 'eventDate':
        updateField('eventDateText', '');
        break;
      case 'rsvp':
        updateField('rsvpMessage', '');
        break;
      case 'subEvent':
        updateField(
          'subEvents',
          invitation.subEvents.filter((item) => item.id !== target.id)
        );
        break;
      case 'customText':
        updateField(
          'customTexts',
          customTexts.filter((item) => item.id !== target.id)
        );
        break;
    }
    setSelected(null);
    setEditTarget(null);
  };

  if (!event || !invitation) return null;

  const fontFamilyOptions: { value: InvitationFontFamily; label: string }[] = [
    { value: 'script', label: t('invitation.fontScript') },
    { value: 'serif', label: t('invitation.fontSerif') },
    { value: 'sans', label: t('invitation.fontSans') },
  ];

  return (
    <ThemedEventModal eventId={eventId ?? ''}>
      <View style={styles.editorRoot}>
      <Stack.Screen options={screenOptions} />
      <FormScrollView
        scrollEnabled={!draggingText}
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

          <InvitationPreview
            ref={previewRef}
            invitation={invitation}
            editable
            showGuides={!sharing && !downloading}
            selected={selected}
            onSelect={setSelected}
            onEdit={setEditTarget}
            onDelete={handleDeleteSelection}
            onMoveText={moveCustomText}
            onDragStart={() => setDraggingText(true)}
            onDragEnd={() => setDraggingText(false)}
          />

          <Pressable
            onPress={() => cycleTemplate(1)}
            style={[styles.navBtn, { backgroundColor: theme.surface }]}
            accessibilityLabel={t('invitation.nextTemplate')}
          >
            <Ionicons name="chevron-forward" size={22} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.customTextHeader}>
          <View style={styles.customTextIntro}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('invitation.customTexts')}
            </Text>
            <Text style={[styles.hint, { color: theme.textSecondary }]}>
              {t('invitation.dragHint')}
            </Text>
          </View>
          {customTexts.length < MAX_CUSTOM_TEXTS ? (
            <Pressable onPress={addCustomText}>
              <Text style={[styles.addLink, { color: theme.primary }]}>
                + {t('invitation.addText')}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {customTexts.map((box, index) => (
          <CustomTextEditor
            key={box.id}
            box={box}
            index={index}
            selected={selected?.type === 'customText' && selected.id === box.id}
            onChange={(updated) => updateCustomText(box.id, updated)}
            onRemove={() => removeCustomText(box.id)}
            onFocus={() => setSelected({ type: 'customText', id: box.id })}
          />
        ))}

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

        <HexColorPicker
          label={t('invitation.fontColor')}
          actionLabel={t('invitation.changeColor')}
          hexLabel={t('invitation.colorHex')}
          value={invitation.fontColor}
          onChange={(color) => updateField('fontColor', color)}
        />

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
          allowNone
        />


        <TextInputField
          label={t('invitation.headerTitle')}
          value={invitation.headerTitle}
          onChangeText={(value) => updateField('headerTitle', value)}
          placeholder={t('invitation.headerTitlePlaceholder')}
          multiline
        />

        <TextInputField
          label={t('invitation.hostNames')}
          value={invitation.hostNames}
          onChangeText={(value) => updateField('hostNames', value)}
          placeholder={t('invitation.hostNamesPlaceholder')}
          multiline
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
            canRemove
          />
        ))}

        <TextInputField
          label={t('invitation.rsvpMessage')}
          value={invitation.rsvpMessage}
          onChangeText={(value) => updateField('rsvpMessage', value)}
          placeholder={t('invitation.rsvpPlaceholder')}
          multiline
        />

        {!invitation.watermarkRemoved ? (
          <View style={styles.watermarkActions}>
            <Text style={[styles.hint, { color: theme.textSecondary }]}>
              {t('invitation.removeWatermarkHint')}
            </Text>
            <Button
              label={t('invitation.removeWatermark')}
              icon="eye-off-outline"
              variant="secondary"
              onPress={handleRemoveWatermark}
              loading={removingWatermark}
              style={styles.actionBtn}
            />
          </View>
        ) : null}

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
      <BottomSystemBarFill color={theme.background} />
      <InvitationElementEditSheet
        visible={editTarget != null}
        selection={editTarget}
        invitation={invitation}
        onClose={() => setEditTarget(null)}
        onUpdateField={updateField}
        onUpdateSubEvent={updateSubEventById}
        onUpdateCustomText={updateCustomText}
      />
      </View>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  editorRoot: {
    flex: 1,
  },
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
  customTextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  customTextIntro: {
    flex: 1,
    gap: 4,
  },
  hint: {
    ...typography.caption,
  },
  alignChip: {
    width: 40,
    height: 36,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  watermarkActions: {
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetDismiss: {
    flex: 1,
  },
  editSheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  editSheetScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    ...typography.subheading,
  },
  editSheetBody: {
    paddingBottom: spacing.sm,
  },
  sheetSaveBtn: {
    width: '100%',
    marginTop: spacing.sm,
  },
});
