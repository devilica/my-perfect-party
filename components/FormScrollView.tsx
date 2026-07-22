import { ComponentProps } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { flexFill } from '@/lib/webLayout';

type FormScrollViewProps = ComponentProps<typeof ScrollView>;

const BOTTOM_OFFSET = 120;

export function FormScrollView({ style, ...props }: FormScrollViewProps) {
  if (Platform.OS === 'web') {
    return (
      <ScrollView
        {...props}
        style={[styles.scroll, style]}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <KeyboardAwareScrollView
      {...props}
      style={[styles.scroll, style]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={BOTTOM_OFFSET}
    />
  );
}

const styles = StyleSheet.create({
  scroll: {
    ...flexFill,
  },
});
