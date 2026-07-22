import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { INVITATION_ICONS } from '@/constants/invitationIcons';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

type InvitationIconPickerProps = {
  selectedIcon: string;
  onSelect: (icon: string) => void;
  title?: string;
};

export function InvitationIconPicker({
  selectedIcon,
  onSelect,
  title,
}: InvitationIconPickerProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>
        {title ?? t('invitation.selectHeaderIcon')}
      </Text>
      <ScrollView
        style={[styles.gridScroll, { borderColor: theme.border, backgroundColor: theme.surface }]}
        contentContainerStyle={styles.grid}
        nestedScrollEnabled
        showsVerticalScrollIndicator
      >
        {INVITATION_ICONS.map((option) => {
          const selected = option.name === selectedIcon;
          const iconName = option.name as keyof typeof Ionicons.glyphMap;
          return (
            <Pressable
              key={option.name}
              onPress={() => onSelect(option.name)}
              style={[
                styles.cell,
                {
                  backgroundColor: selected ? theme.primaryLight : 'transparent',
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  gridScroll: {
    maxHeight: 200,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.xs,
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
