import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { InvitationFrameThumbnail } from '@/components/InvitationFrame';
import { INVITATION_TEMPLATES, InvitationTemplate } from '@/constants/invitationTemplates';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { spacing, typography } from '@/theme/colors';

type InvitationTemplatePickerProps = {
  selectedId: string;
  onSelect: (templateId: string) => void;
};

function TemplateRow({
  title,
  templates,
  selectedId,
  onSelect,
  labelFor,
}: {
  title: string;
  templates: InvitationTemplate[];
  selectedId: string;
  onSelect: (templateId: string) => void;
  labelFor: (template: InvitationTemplate) => string;
}) {
  const theme = useThemeColors();

  if (templates.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {templates.map((template) => (
          <View key={template.id} style={styles.item}>
            <InvitationFrameThumbnail
              template={template}
              selected={template.id === selectedId}
              onPress={() => onSelect(template.id)}
            />
            <Text
              style={[styles.label, { color: theme.textMuted }]}
              numberOfLines={2}
            >
              {labelFor(template)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function InvitationTemplatePicker({
  selectedId,
  onSelect,
}: InvitationTemplatePickerProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const programmaticTemplates = INVITATION_TEMPLATES.filter(
    (template) => template.category !== 'celebration'
  );
  const celebrationTemplates = INVITATION_TEMPLATES.filter(
    (template) => template.category === 'celebration'
  );

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>
        {t('invitation.background')}
      </Text>
      <TemplateRow
        title={t('invitation.programmaticBackgrounds')}
        templates={programmaticTemplates}
        selectedId={selectedId}
        onSelect={onSelect}
        labelFor={(template) => t(template.labelKey)}
      />
      <TemplateRow
        title={t('invitation.celebrationThemes')}
        templates={celebrationTemplates}
        selectedId={selectedId}
        onSelect={onSelect}
        labelFor={(template) => t(template.labelKey)}
      />
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
  section: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.small,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  row: {
    paddingVertical: spacing.xs,
  },
  item: {
    alignItems: 'center',
    width: 80,
  },
  label: {
    ...typography.small,
    textAlign: 'center',
    marginTop: 2,
  },
});
