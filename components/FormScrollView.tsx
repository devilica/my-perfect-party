import { ComponentProps, forwardRef } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { flexFill } from '@/lib/webLayout';

type FormScrollViewProps = ComponentProps<typeof ScrollView>;

const BOTTOM_OFFSET = 120;

export const FormScrollView = forwardRef<ScrollView, FormScrollViewProps>(
  function FormScrollView({ style, ...props }, ref) {
    if (Platform.OS === 'web') {
      return (
        <ScrollView
          ref={ref}
          {...props}
          style={[styles.scroll, style]}
          keyboardShouldPersistTaps="handled"
        />
      );
    }

    return (
      <KeyboardAwareScrollView
        ref={ref}
        {...props}
        style={[styles.scroll, style]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={BOTTOM_OFFSET}
      />
    );
  }
);

const styles = StyleSheet.create({
  scroll: {
    ...flexFill,
  },
});
