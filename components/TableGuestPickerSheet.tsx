import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { sortGuests } from '@/lib/guestStats';
import { getAssignableGuestsForTable } from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { getGuestFullName, SeatingTable } from '@/types/models';
import { colors, radius, spacing, typography } from '@/theme/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_EXPANDED = SCREEN_HEIGHT * 0.75;
const DISMISS_OFFSET = SHEET_EXPANDED + spacing.lg;
const DISMISS_DRAG_THRESHOLD = SHEET_EXPANDED * 0.28;

const SPRING = { damping: 22, stiffness: 280, mass: 0.85 };

type TableGuestPickerSheetProps = {
  visible: boolean;
  table: SeatingTable | null;
  eventId: string;
  onClose: () => void;
};

function matchesSearch(guest: { firstName: string; lastName: string; phone?: string }, query: string) {
  const haystack = `${guest.firstName} ${guest.lastName} ${guest.phone ?? ''}`.toLowerCase();
  return haystack.includes(query);
}

export function TableGuestPickerSheet({
  visible,
  table,
  eventId,
  onClose,
}: TableGuestPickerSheetProps) {
  const language = useWeddingStore((s) => s.language);
  const guests = useWeddingStore((s) => s.guests);
  const assignGuestToTable = useWeddingStore((s) => s.assignGuestToTable);
  const { t } = useTranslation(language);
  const bottomSheetPadding = useBottomSheetPadding();
  const [search, setSearch] = useState('');

  const translateY = useSharedValue(0);
  const dragStartOffset = useSharedValue(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const notifyClosed = useCallback(() => {
    onCloseRef.current();
  }, []);

  const dismissSheet = () => {
    translateY.value = withTiming(DISMISS_OFFSET, { duration: 240 }, (finished) => {
      if (finished) {
        runOnJS(notifyClosed)();
      }
    });
  };

  const finishDrag = (y: number, velocityY: number) => {
    const fastDismiss = velocityY > 1200;
    const dismissByPosition = y > DISMISS_DRAG_THRESHOLD;

    if (fastDismiss || dismissByPosition) {
      translateY.value = withTiming(DISMISS_OFFSET, { duration: 220 }, (finished) => {
        if (finished) {
          runOnJS(notifyClosed)();
        }
      });
      return;
    }

    translateY.value = withSpring(0, SPRING);
  };

  useEffect(() => {
    if (!visible) {
      setSearch('');
      return;
    }
    translateY.value = 0;
  }, [visible, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
      onPanResponderGrant: () => {
        dragStartOffset.value = translateY.value;
      },
      onPanResponderMove: (_, gesture) => {
        const next = dragStartOffset.value + gesture.dy;
        translateY.value = Math.min(DISMISS_OFFSET, Math.max(0, next));
      },
      onPanResponderRelease: (_, gesture) => {
        finishDrag(translateY.value, gesture.vy);
      },
      onPanResponderTerminate: () => {
        finishDrag(translateY.value, 0);
      },
    })
  ).current;

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const assignableGuests = useMemo(() => {
    if (!table) return [];
    return sortGuests(getAssignableGuestsForTable(guests, table, eventId));
  }, [guests, table, eventId]);

  const filteredGuests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return assignableGuests;
    return assignableGuests.filter((guest) => matchesSearch(guest, query));
  }, [assignableGuests, search]);

  if (!table) return null;

  const handleAssign = (guestId: string) => {
    const success = assignGuestToTable(guestId, table.id);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => dismissSheet()}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={() => dismissSheet()} accessibilityRole="button" />

        <Animated.View
          style={[
            styles.sheet,
            { height: SHEET_EXPANDED, paddingBottom: bottomSheetPadding },
            sheetAnimatedStyle,
          ]}
        >
          <View style={styles.sheetHeader} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} accessibilityRole="adjustable" />
            <Pressable
              onPress={() => dismissSheet()}
              hitSlop={12}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.sheetContent}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('guests.searchPlaceholder')}
              placeholderTextColor={colors.textMuted}
              style={styles.search}
              autoCorrect={false}
              autoCapitalize="none"
            />

            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {filteredGuests.map((guest) => (
                <Pressable key={guest.id} style={styles.option} onPress={() => handleAssign(guest.id)}>
                  <Text style={styles.optionText}>{getGuestFullName(guest)}</Text>
                  <Text style={styles.optionMeta}>
                    {t('guests.guestsCount', { count: guest.partySize })}
                  </Text>
                </Pressable>
              ))}
              {assignableGuests.length === 0 ? (
                <Text style={styles.empty}>{t('seating.noUnassignedGuests')}</Text>
              ) : null}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
  },
  sheetHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    minHeight: 36,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: spacing.xs,
    padding: spacing.xs,
  },
  sheetContent: {
    flex: 1,
  },
  search: {
    ...typography.body,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    marginBottom: spacing.md,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.sm,
  },
  option: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  optionMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  empty: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});
