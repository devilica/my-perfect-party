import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { ObligationCard } from '@/components/ObligationCard';
import { ThemedScreenContainer } from '@/components/ThemedScreenContainer';
import { Button, EmptyState, Fab, StatCard } from '@/components/ui';
import { OBLIGATION_TEMPLATE_KEYS } from '@/constants/obligationTemplates';
import { useFabScrollPadding } from '@/hooks/useFabBottomOffset';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { getObligationStats, getObligationsForEvent } from '@/lib/obligationStats';
import { makeScrollKey } from '@/lib/scrollRestoration';
import { flexFill } from '@/lib/webLayout';
import { useTranslation } from '@/lib/i18n';
import { useEventId } from '@/lib/useEventId';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

export default function ObligationsScreen() {
  const eventId = useEventId();
  const router = useRouter();
  const language = useWeddingStore((s) => s.language);
  const event = useWeddingStore((s) => s.events.find((e) => e.id === eventId));
  const allObligations = useWeddingStore((s) => s.obligations);
  const deleteObligation = useWeddingStore((s) => s.deleteObligation);
  const addObligationTemplates = useWeddingStore((s) => s.addObligationTemplates);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const fabScrollPadding = useFabScrollPadding();
  const { scrollRef, onScroll, scrollEventThrottle } = useScrollRestoration(
    makeScrollKey('obligations', eventId)
  );
  const [showTemplates, setShowTemplates] = useState(false);

  const obligations = useMemo(
    () => getObligationsForEvent(allObligations, eventId),
    [allObligations, eventId]
  );

  const stats = useMemo(
    () => getObligationStats(allObligations, eventId),
    [allObligations, eventId]
  );

  const templateTitles = useMemo(() => {
    const keys = OBLIGATION_TEMPLATE_KEYS[event?.theme ?? 'wedding'] ?? [];
    return keys.map((key) => t(key));
  }, [event?.theme, t]);

  const hasAvailableTemplates = useMemo(() => {
    const existingTitles = new Set(
      obligations.map((o) => o.title.trim().toLowerCase())
    );
    return templateTitles.some((title) => !existingTitles.has(title.toLowerCase()));
  }, [obligations, templateTitles]);

  const showTemplatesButton = hasAvailableTemplates || showTemplates;

  const handleDelete = (obligationId: string) => {
    Alert.alert(t('obligations.delete'), t('obligations.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => deleteObligation(obligationId),
      },
    ]);
  };

  const handleAddTemplates = () => {
    if (!eventId || !event) return;

    if (showTemplates) {
      setShowTemplates(false);
      return;
    }

    setShowTemplates(true);
    const added = addObligationTemplates(eventId, templateTitles);
    if (added === 0) {
      Alert.alert(t('obligations.templates'), t('obligations.templatesAlreadyAdded'));
    }
  };

  const templatesPanel = showTemplates ? (
    <View style={[styles.templatesPanel, { backgroundColor: theme.primaryLight, borderColor: theme.border }]}>
      <Text style={[styles.templatesTitle, { color: theme.primaryDark }]}>
        {t('obligations.templates')}
      </Text>
      {templateTitles.map((title) => (
        <Text key={title} style={[styles.templateItem, { color: theme.textSecondary }]}>
          {title}
        </Text>
      ))}
    </View>
  ) : null;

  const templatesButton = showTemplatesButton ? (
    <Button
      label={t('obligations.addTemplates')}
      variant="secondary"
      icon="list-outline"
      onPress={handleAddTemplates}
      style={styles.templateBtn}
    />
  ) : null;

  const listHeader = (
    <View style={styles.header}>
      <View style={styles.summaryRow}>
        <StatCard label={t('obligations.total')} value={String(stats.total)} />
        <StatCard
          label={t('obligations.confirmedCount')}
          value={String(stats.confirmed)}
          accent={theme.success}
        />
      </View>
      {templatesButton}
      {templatesPanel}
    </View>
  );

  const emptyComponent = (
    <View style={styles.emptyWrap}>
      <EmptyState
        icon="clipboard-outline"
        title={t('obligations.emptyTitle')}
        subtitle={t('obligations.emptySubtitle')}
      />
      {templatesButton}
      {templatesPanel}
    </View>
  );

  return (
    <ThemedScreenContainer padded={false}>
      <View style={styles.screen}>
        <FlatList
          ref={scrollRef}
          data={obligations}
          keyExtractor={(item) => item.id}
          style={styles.list}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          ListHeaderComponent={obligations.length > 0 ? listHeader : null}
          ListEmptyComponent={emptyComponent}
          renderItem={({ item }) => (
            <ObligationCard
              obligation={item}
              onPress={() =>
                router.push(`/modals/obligation-form?eventId=${eventId}&obligationId=${item.id}`)
              }
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: spacing.md,
            paddingBottom: fabScrollPadding,
            paddingTop: spacing.sm,
          }}
          showsVerticalScrollIndicator={false}
        />
        <Fab onPress={() => router.push(`/modals/obligation-form?eventId=${eventId}`)} />
      </View>
    </ThemedScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...flexFill,
  },
  list: {
    ...flexFill,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  emptyWrap: {
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  templateBtn: {
    alignSelf: 'stretch',
  },
  templatesPanel: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  templatesTitle: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  templateItem: {
    ...typography.body,
  },
});
