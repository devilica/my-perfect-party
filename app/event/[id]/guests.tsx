import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, View } from 'react-native';

import { GuestFilterBar } from '@/components/GuestFilterBar';
import { GuestCard } from '@/components/GuestCard';
import { ThemedScreenContainer } from '@/components/ThemedScreenContainer';
import { EmptyState, Fab } from '@/components/ui';
import { useFabScrollPadding } from '@/hooks/useFabBottomOffset';
import { filterGuests } from '@/lib/guestStats';
import { getTablesForEvent } from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import { useEventId } from '@/lib/useEventId';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { GuestFilter } from '@/types/models';
import { radius, spacing, typography } from '@/theme/colors';

export default function GuestsScreen() {
  const eventId = useEventId();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<GuestFilter>('all');
  const language = useWeddingStore((s) => s.language);
  const allGuests = useWeddingStore((s) => s.guests);
  const allTables = useWeddingStore((s) => s.tables);
  const deleteGuest = useWeddingStore((s) => s.deleteGuest);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const fabScrollPadding = useFabScrollPadding();

  const tables = useMemo(
    () => getTablesForEvent(allTables, eventId),
    [allTables, eventId]
  );

  const filteredGuests = useMemo(
    () => filterGuests(allGuests, eventId, filter, search),
    [allGuests, eventId, filter, search]
  );

  const handleDelete = (guestId: string) => {
    Alert.alert(t('guests.delete'), t('guests.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => deleteGuest(guestId),
      },
    ]);
  };

  const listHeader = (
    <View>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={t('guests.searchPlaceholder')}
        placeholderTextColor={theme.textMuted}
        style={[
          styles.search,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      />
      <GuestFilterBar selected={filter} onSelect={setFilter} />
    </View>
  );

  return (
    <ThemedScreenContainer padded={false}>
      <View style={styles.screen}>
        <FlatList
          data={filteredGuests}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title={t('guests.emptyTitle')}
              subtitle={t('guests.emptySubtitle')}
            />
          }
          renderItem={({ item }) => (
            <GuestCard
              guest={item}
              table={tables.find((table) => table.id === item.tableId)}
              onPress={() =>
                router.push(`/modals/guest-form?eventId=${eventId}&guestId=${item.id}`)
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
        <Fab onPress={() => router.push(`/modals/guest-form?eventId=${eventId}`)} />
      </View>
    </ThemedScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  search: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  list: {
    flex: 1,
  },
});
