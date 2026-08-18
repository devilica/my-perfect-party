import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomSystemBarFill } from '@/components/BottomSystemBarFill';
import { INVITATION_ICONS } from '@/constants/invitationIcons';
import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

type InvitationIconPickerProps = {
  selectedIcon: string;
  onSelect: (icon: string) => void;
  title?: string;
  allowNone?: boolean;
  embedded?: boolean;
};

export function InvitationIconPicker({
  selectedIcon,
  onSelect,
  title,
  allowNone = false,
  embedded = false,
}: InvitationIconPickerProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const bottomSheetPadding = useBottomSheetPadding();
  const [open, setOpen] = useState(false);
  const label = title ?? t('invitation.selectHeaderIcon');
  const hasIcon = Boolean(selectedIcon);
  const triggerName = (hasIcon ? selectedIcon : 'add-outline') as keyof typeof Ionicons.glyphMap;

  const handleSelect = (icon: string) => {
    onSelect(icon);
    setOpen(false);
  };

  const iconGrid = (
    <>
      {allowNone ? (
        <Pressable
          onPress={() => (embedded ? onSelect('') : handleSelect(''))}
          accessibilityLabel={t('invitation.noIcon')}
          style={[
            styles.cell,
            {
              backgroundColor: !hasIcon ? theme.primaryLight : theme.surface,
              borderColor: !hasIcon ? theme.primary : theme.border,
            },
          ]}
        >
          <Ionicons
            name="ban-outline"
            size={24}
            color={!hasIcon ? theme.primaryDark : theme.text}
          />
        </Pressable>
      ) : null}
      {INVITATION_ICONS.map((option) => {
        const selected = option.name === selectedIcon;
        const iconName = option.name as keyof typeof Ionicons.glyphMap;
        return (
          <Pressable
            key={option.name}
            onPress={() => (embedded ? onSelect(option.name) : handleSelect(option.name))}
            style={[
              styles.cell,
              {
                backgroundColor: selected ? theme.primaryLight : theme.surface,
                borderColor: selected ? theme.primary : theme.border,
              },
            ]}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={selected ? theme.primaryDark : theme.text}
            />
          </Pressable>
        );
      })}
    </>
  );

  if (embedded) {
    return <View style={styles.grid}>{iconGrid}</View>;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.triggerRow}>
        <Text style={[styles.title, { color: theme.textSecondary }]}>{label}</Text>
        <Pressable
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={[
            styles.trigger,
            {
              backgroundColor: hasIcon ? theme.primaryLight : theme.surface,
              borderColor: hasIcon ? theme.primary : theme.border,
            },
          ]}
        >
          <Ionicons
            name={triggerName}
            size={22}
            color={hasIcon ? theme.primaryDark : theme.textSecondary}
          />
        </Pressable>
        {allowNone && hasIcon ? (
          <Pressable
            onPress={() => onSelect('')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t('invitation.noIcon')}
          >
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
          <Pressable style={styles.overlayDismiss} onPress={() => setOpen(false)} />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.background,
                paddingBottom: bottomSheetPadding,
              },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>{label}</Text>
              <Pressable
                onPress={() => setOpen(false)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t('common.close')}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView
              style={styles.gridScroll}
              contentContainerStyle={styles.grid}
              showsVerticalScrollIndicator={false}
            >
              {iconGrid}
            </ScrollView>
          </View>
          <BottomSystemBarFill color={theme.background} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.caption,
    fontWeight: '600',
  },
  trigger: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayDismiss: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    maxHeight: '70%',
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
  gridScroll: {
    flexGrow: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: spacing.sm,
  },
  cell: {
    width: '23%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
