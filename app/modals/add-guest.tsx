import { Redirect, useLocalSearchParams } from 'expo-router';

import { getRouteParam } from '@/lib/routeParams';

export default function LegacyAddGuestRedirect() {
  const params = useLocalSearchParams<{ eventId: string }>();
  const eventId = getRouteParam(params.eventId);
  return <Redirect href={`/modals/guest-form?eventId=${eventId}`} />;
}
