import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';

import { getRouteParam } from '@/lib/routeParams';

export function useEventId(): string {
  const local = useLocalSearchParams<{ id?: string }>();
  const global = useGlobalSearchParams<{ id?: string }>();
  return getRouteParam(local.id ?? global.id);
}
