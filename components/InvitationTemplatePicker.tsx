import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomSystemBarFill } from '@/components/BottomSystemBarFill';
import { InvitationFrameThumbnail } from '@/components/InvitationFrame';
import { Button } from '@/components/ui';
import { INVITATION_TEMPLATES, PREVIEW_INVITATION_TEMPLATE_COUNT, InvitationTemplate } from '@/constants/invitationTemplates';
import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

type InvitationTemplatePickerProps = {
  selectedId: string;
  onSelect: (templateId: string) => void;
};

const PREVIEW_COUNT = PREVIEW_INVITATION_TEMPLATE_COUNT;
const GRID_COLUMNS = 3;
const GRID_GAP = spacing.sm;
const SHEET_PAD = spacing.md;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GRID_THUMB_WIDTH =
  (SCREEN_WIDTH - SHEET_PAD * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
const GRID_THUMB_HEIGHT = GRID_THUMB_WIDTH * (4 / 3);

function TemplateThumb({
  template,
  selectedId,
  onSelect,
  width,
  height,
}: {
  template: InvitationTemplate;
  selectedId: string;
  onSelect: (templateId: string) => void;
  width?: number;
  height?: number;
}) {
  return (
    <InvitationFrameThumbnail
      template={template}
      selected={template.id === selectedId}
      onPress={() => onSelect(template.id)}
      width={width}
      height={height}
    />
  );
}

export function InvitationTemplatePicker({
  selectedId,
  onSelect,
}: InvitationTemplatePickerProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const bottomSheetPadding = useBottomSheetPadding();
  const [modalVisible, setModalVisible] = useState(false);

  const previewTemplates = INVITATION_TEMPLATES.slice(0, PREVIEW_COUNT);

  const handleSelect = (templateId: string) => {
    onSelect(templateId);
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>
        {t('invitation.background')}
      </Text>
      <View style={styles.previewRow}>
        {previewTemplates.map((template) => (
          <View key={template.id} style={styles.previewItem}>
            <TemplateThumb
              template={template}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </View>
        ))}
      </View>
      <View style={styles.seeMoreWrap}>
        <Button
          label={t('invitation.seeMore')}
          onPress={() => setModalVisible(true)}
          style={styles.seeMoreButton}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
          <Pressable style={styles.overlayDismiss} onPress={() => setModalVisible(false)} />
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
              <Text style={[styles.sheetTitle, { color: theme.text }]}>
                {t('invitation.background')}
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
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
              {INVITATION_TEMPLATES.map((template) => (
                <TemplateThumb
                  key={template.id}
                  template={template}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  width={GRID_THUMB_WIDTH}
                  height={GRID_THUMB_HEIGHT}
                />
              ))}
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
  title: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  previewItem: {
    flex: 1,
    alignItems: 'center',
  },
  seeMoreWrap: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  seeMoreButton: {
    alignSelf: 'center',
    minWidth: 220,
    paddingHorizontal: spacing.xl,
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
    paddingHorizontal: SHEET_PAD,
    paddingTop: spacing.sm,
    maxHeight: SCREEN_HEIGHT * 0.88,
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
    gap: GRID_GAP,
  },
});
