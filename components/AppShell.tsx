import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { RewardedAdPreviewHost } from '@/components/RewardedAdPreviewHost';
import { flexFill, webViewportHeight } from '@/lib/webLayout';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <View style={styles.root}>
      {children}
      <RewardedAdPreviewHost />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...flexFill,
    ...webViewportHeight,
  },
});
