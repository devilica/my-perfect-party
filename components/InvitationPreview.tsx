import { Ionicons } from '@expo/vector-icons';
import { forwardRef, ReactNode, useRef } from 'react';
import {
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { InvitationFrame } from '@/components/InvitationFrame';
import { getInvitationTemplate } from '@/constants/invitationTemplates';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import {
  EventInvitation,
  InvitationFontFamily,
  InvitationTextBox,
} from '@/types/models';

export type InvitationSelection =
  | { type: 'headerIcon' }
  | { type: 'headerTitle' }
  | { type: 'hostNames' }
  | { type: 'eventDate' }
  | { type: 'rsvp' }
  | { type: 'subEvent'; id: string }
  | { type: 'customText'; id: string };

type InvitationPreviewProps = {
  invitation: EventInvitation;
  width?: number;
  height?: number;
  editable?: boolean;
  showGuides?: boolean;
  selected?: InvitationSelection | null;
  onSelect?: (selection: InvitationSelection | null) => void;
  onEdit?: (selection: InvitationSelection) => void;
  onDelete?: (selection: InvitationSelection) => void;
  onMoveText?: (id: string, x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

const BASE_SPACING = {
  afterIcon: 8,
  afterHeader: 12,
  afterNames: 14,
  afterDate: 16,
  subEventGap: 10,
  beforeRsvp: 16,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function isSameSelection(
  a: InvitationSelection | null | undefined,
  b: InvitationSelection | null | undefined
) {
  if (a === b) return true;
  if (!a || !b || a.type !== b.type) return false;
  if ('id' in a && 'id' in b) return a.id === b.id;
  return true;
}

function getNamesFontFamily(family: InvitationFontFamily): string | undefined {
  switch (family) {
    case 'script':
      return 'GreatVibes-Regular';
    case 'serif':
      return Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });
    case 'sans':
      return Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });
  }
}

function ElementToolbar({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);

  return (
    <View style={styles.toolbar}>
      <Pressable
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel={t('common.delete')}
        style={[styles.toolbarBtn, styles.toolbarDanger]}
      >
        <Ionicons name="trash-outline" size={18} color="#FFFCFA" />
      </Pressable>
      <Pressable
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel={t('common.edit')}
        style={styles.toolbarBtn}
      >
        <Ionicons name="pencil" size={18} color="#FFFCFA" />
      </Pressable>
    </View>
  );
}

function SelectableBlock({
  selected,
  showChrome,
  onSelect,
  onEdit,
  onDelete,
  children,
  style,
}: {
  selected: boolean;
  showChrome: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  children: ReactNode;
  style?: object;
}) {
  if (!showChrome) {
    return <View style={style}>{children}</View>;
  }

  return (
    <View style={[style, styles.selectable, selected ? styles.selectableOn : null]}>
      <Pressable onPress={onSelect}>{children}</Pressable>
      {selected ? <ElementToolbar onEdit={onEdit} onDelete={onDelete} /> : null}
    </View>
  );
}

function SubEventRow({
  icon,
  time,
  title,
  location,
  textColor,
  accentColor,
  spacing,
  selected,
  showChrome,
  onSelect,
  onEdit,
  onDelete,
}: {
  icon: string;
  time?: string;
  title: string;
  location?: string;
  textColor: string;
  accentColor: string;
  spacing: number;
  selected: boolean;
  showChrome: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const iconName = icon as keyof typeof Ionicons.glyphMap;
  const detail = [time, title, location].filter(Boolean).join(' ');
  if (!detail) return null;

  return (
    <SelectableBlock
      selected={selected}
      showChrome={showChrome}
      onSelect={onSelect}
      onEdit={onEdit}
      onDelete={onDelete}
      style={{ marginBottom: spacing, width: '100%', alignItems: 'center' }}
    >
      <View style={styles.subEventContent}>
        {icon ? (
          <Ionicons
            name={iconName}
            size={16}
            color={accentColor}
            style={styles.subEventIcon}
          />
        ) : null}
        <Text style={[styles.subEventText, { color: textColor }]} numberOfLines={2}>
          {detail.toUpperCase()}
        </Text>
      </View>
    </SelectableBlock>
  );
}

function DraggableTextBox({
  box,
  width,
  height,
  selected,
  showChrome,
  onSelect,
  onEdit,
  onDelete,
  onMove,
  onDragStart,
  onDragEnd,
}: {
  box: InvitationTextBox;
  width: number;
  height: number;
  selected: boolean;
  showChrome: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove?: (id: string, x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const boxRef = useRef(box);
  boxRef.current = box;
  const sizeRef = useRef({ width, height, editable: showChrome });
  sizeRef.current = { width, height, editable: showChrome };
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onDragStartRef = useRef(onDragStart);
  onDragStartRef.current = onDragStart;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;
  const startRef = useRef({ x: box.x, y: box.y });

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => sizeRef.current.editable,
      onMoveShouldSetPanResponder: () => sizeRef.current.editable,
      onPanResponderGrant: () => {
        startRef.current = { x: boxRef.current.x, y: boxRef.current.y };
        onSelectRef.current();
        onDragStartRef.current?.();
      },
      onPanResponderMove: (_, gesture) => {
        const { width: frameW, height: frameH } = sizeRef.current;
        const nextX = clamp(startRef.current.x + gesture.dx / frameW, 0.02, 0.9);
        const nextY = clamp(startRef.current.y + gesture.dy / frameH, 0.02, 0.9);
        onMoveRef.current?.(boxRef.current.id, nextX, nextY);
      },
      onPanResponderRelease: () => {
        onDragEndRef.current?.();
      },
      onPanResponderTerminate: () => {
        onDragEndRef.current?.();
      },
    })
  ).current;

  if (!box.text && !showChrome) return null;

  return (
    <View
      style={[
        styles.textBox,
        {
          left: box.x * width,
          top: box.y * height,
          maxWidth: width * 0.82,
        },
        showChrome && selected ? styles.selectableOn : null,
      ]}
    >
      <View {...(showChrome ? pan.panHandlers : undefined)}>
        <Text
          style={{
            color: box.text ? box.color : 'rgba(101, 93, 89, 0.45)',
            fontSize: box.fontSize,
            lineHeight: Math.round(box.fontSize * 1.25),
            fontFamily: getNamesFontFamily(box.fontFamily),
            textAlign: box.align ?? 'center',
          }}
        >
          {box.text || (showChrome ? ' ' : '')}
        </Text>
      </View>
      {showChrome && selected ? (
        <ElementToolbar onEdit={onEdit} onDelete={onDelete} />
      ) : null}
    </View>
  );
}

export const InvitationPreview = forwardRef<View, InvitationPreviewProps>(
  function InvitationPreview(
    {
      invitation,
      width = 320,
      height = 480,
      editable = false,
      showGuides = true,
      selected,
      onSelect,
      onEdit,
      onDelete,
      onMoveText,
      onDragStart,
      onDragEnd,
    },
    ref
  ) {
    const language = useWeddingStore((s) => s.language);
    const { t } = useTranslation(language);
    const template = getInvitationTemplate(invitation.templateId);
    const textColor = invitation.fontColor;
    const spacingMul = invitation.lineSpacing;
    const customTexts = invitation.customTexts ?? [];
    const iconName = invitation.headerIcon as keyof typeof Ionicons.glyphMap;
    const showChrome = editable && showGuides;
    const suppressDeselectRef = useRef(false);

    const markInteract = () => {
      suppressDeselectRef.current = true;
    };

    const select = (selection: InvitationSelection) => {
      markInteract();
      onSelect?.(selection);
    };

    const edit = (selection: InvitationSelection) => {
      markInteract();
      onSelect?.(selection);
      onEdit?.(selection);
    };

    const remove = (selection: InvitationSelection) => {
      markInteract();
      onDelete?.(selection);
    };

    const deselect = () => {
      if (suppressDeselectRef.current) {
        suppressDeselectRef.current = false;
        return;
      }
      if (showChrome) onSelect?.(null);
    };

    return (
      <View ref={ref} collapsable={false} style={{ width, height }}>
        <Pressable
          onPress={deselect}
          style={{ width, height }}
          android_ripple={{ color: 'transparent' }}
        >
          <InvitationFrame
            templateId={invitation.templateId}
            backgroundOpacity={invitation.backgroundOpacity}
            width={width}
            height={height}
          >
            <View style={styles.inner} pointerEvents="box-none">
              {invitation.headerIcon ? (
                <SelectableBlock
                  selected={selected?.type === 'headerIcon'}
                  showChrome={showChrome}
                  onSelect={() => select({ type: 'headerIcon' })}
                  onEdit={() => edit({ type: 'headerIcon' })}
                  onDelete={() => remove({ type: 'headerIcon' })}
                  style={{ marginBottom: BASE_SPACING.afterIcon * spacingMul }}
                >
                  <Ionicons name={iconName} size={28} color={template.accentColor} />
                </SelectableBlock>
              ) : null}

              {invitation.headerTitle ? (
                <SelectableBlock
                  selected={selected?.type === 'headerTitle'}
                  showChrome={showChrome}
                  onSelect={() => select({ type: 'headerTitle' })}
                  onEdit={() => edit({ type: 'headerTitle' })}
                  onDelete={() => remove({ type: 'headerTitle' })}
                  style={{ marginBottom: BASE_SPACING.afterHeader * spacingMul }}
                >
                  <Text style={[styles.headerTitle, { color: textColor }]}>
                    {invitation.headerTitle.toUpperCase()}
                  </Text>
                </SelectableBlock>
              ) : null}

              {invitation.hostNames ? (
                <SelectableBlock
                  selected={selected?.type === 'hostNames'}
                  showChrome={showChrome}
                  onSelect={() => select({ type: 'hostNames' })}
                  onEdit={() => edit({ type: 'hostNames' })}
                  onDelete={() => remove({ type: 'hostNames' })}
                  style={{ width: '100%', marginBottom: BASE_SPACING.afterNames * spacingMul }}
                >
                  <Text
                    style={[
                      styles.hostNames,
                      {
                        color: textColor,
                        fontSize: invitation.fontSize,
                        lineHeight: Math.round(invitation.fontSize * 1.25),
                        fontFamily: getNamesFontFamily(invitation.namesFontFamily),
                      },
                    ]}
                  >
                    {invitation.hostNames}
                  </Text>
                </SelectableBlock>
              ) : null}

              {invitation.eventDateText ? (
                <SelectableBlock
                  selected={selected?.type === 'eventDate'}
                  showChrome={showChrome}
                  onSelect={() => select({ type: 'eventDate' })}
                  onEdit={() => edit({ type: 'eventDate' })}
                  onDelete={() => remove({ type: 'eventDate' })}
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    marginBottom: BASE_SPACING.afterDate * spacingMul * 0.5,
                  }}
                >
                  <View
                    style={[
                      styles.dateDivider,
                      { borderColor: template.accentColor, opacity: 0.5 },
                    ]}
                  />
                  <Text
                    style={[
                      styles.eventDate,
                      {
                        color: textColor,
                        marginVertical: BASE_SPACING.afterDate * spacingMul * 0.5,
                      },
                    ]}
                  >
                    {invitation.eventDateText.toUpperCase()}
                  </Text>
                  <View
                    style={[
                      styles.dateDivider,
                      { borderColor: template.accentColor, opacity: 0.5 },
                    ]}
                  />
                </SelectableBlock>
              ) : null}

              {invitation.subEvents.map((subEvent) => (
                <SubEventRow
                  key={subEvent.id}
                  icon={subEvent.icon}
                  time={subEvent.time}
                  title={subEvent.title}
                  location={subEvent.location}
                  textColor={textColor}
                  accentColor={template.accentColor}
                  spacing={BASE_SPACING.subEventGap * spacingMul}
                  selected={selected?.type === 'subEvent' && selected.id === subEvent.id}
                  showChrome={showChrome}
                  onSelect={() => select({ type: 'subEvent', id: subEvent.id })}
                  onEdit={() => edit({ type: 'subEvent', id: subEvent.id })}
                  onDelete={() => remove({ type: 'subEvent', id: subEvent.id })}
                />
              ))}

              {invitation.rsvpMessage ? (
                <SelectableBlock
                  selected={selected?.type === 'rsvp'}
                  showChrome={showChrome}
                  onSelect={() => select({ type: 'rsvp' })}
                  onEdit={() => edit({ type: 'rsvp' })}
                  onDelete={() => remove({ type: 'rsvp' })}
                  style={{
                    width: '100%',
                    marginTop: BASE_SPACING.beforeRsvp * spacingMul,
                  }}
                >
                  <Text style={[styles.rsvp, { color: textColor }]}>
                    {invitation.rsvpMessage.toUpperCase()}
                  </Text>
                </SelectableBlock>
              ) : null}
            </View>
          </InvitationFrame>
        </Pressable>

        <View
          style={[styles.overlay, { elevation: 6 }]}
          pointerEvents={showChrome ? 'box-none' : 'none'}
        >
          {!invitation.watermarkRemoved ? (
            <View style={styles.watermark} pointerEvents="none">
              <Text
                style={[
                  styles.watermarkText,
                  { color: textColor },
                ]}
              >
                {t('invitation.watermark', { app: t('app.name') })}
              </Text>
            </View>
          ) : null}
          {customTexts.map((box) => (
            <DraggableTextBox
              key={box.id}
              box={box}
              width={width}
              height={height}
              selected={selected?.type === 'customText' && selected.id === box.id}
              showChrome={showChrome}
              onSelect={() => select({ type: 'customText', id: box.id })}
              onEdit={() => edit({ type: 'customText', id: box.id })}
              onDelete={() => remove({ type: 'customText', id: box.id })}
              onMove={onMoveText}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  inner: {
    width: '100%',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 6,
  },
  watermark: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    alignItems: 'center',
    zIndex: 5,
  },
  watermarkText: {
    fontSize: 8,
    letterSpacing: 0.6,
    textAlign: 'center',
    opacity: 0.55,
    fontWeight: '500',
  },
  selectable: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'relative',
  },
  selectableOn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(185, 47, 67, 0.7)',
    borderRadius: 4,
    backgroundColor: 'rgba(255, 252, 250, 0.12)',
  },
  toolbar: {
    position: 'absolute',
    top: -46,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    zIndex: 20,
    elevation: 8,
  },
  toolbarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B92F43',
    shadowColor: '#251B19',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  toolbarDanger: {
    backgroundColor: '#861E2B',
  },
  textBox: {
    position: 'absolute',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  headerTitle: {
    fontSize: 10,
    letterSpacing: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  hostNames: {
    width: '100%',
    textAlign: 'center',
  },
  eventDate: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  dateDivider: {
    width: '60%',
    borderBottomWidth: 1,
  },
  subEventContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
    paddingHorizontal: 4,
  },
  subEventIcon: {
    marginRight: 8,
  },
  subEventText: {
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 1,
  },
  rsvp: {
    fontSize: 8,
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 8,
  },
});
