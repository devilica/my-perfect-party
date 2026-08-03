import { ReactNode, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useFabBottomOffset } from '@/hooks/useFabBottomOffset';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

import { FieldLabel } from '@/components/FieldLabel';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  style,
}: ButtonProps) {
  const theme = useThemeColors();
  const variantStyles = useMemo(
    () => ({
      primary: {
        container: { backgroundColor: theme.primary },
        text: { color: theme.surface },
      },
      secondary: {
        container: {
          backgroundColor: theme.primaryLight,
          borderWidth: 1,
          borderColor: theme.border,
        },
        text: { color: theme.primaryDark },
      },
      danger: {
        container: {
          backgroundColor: theme.dangerLight,
          borderWidth: 1,
          borderColor: theme.danger,
        },
        text: { color: theme.danger },
      },
      ghost: {
        container: { backgroundColor: 'transparent' },
        text: { color: theme.primary },
      },
    }),
    [theme]
  );
  const current = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        current.container,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={current.text.color as string} />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={current.text.color as string}
              style={styles.icon}
            />
          ) : null}
          <Text style={[styles.label, current.text]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 42,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  icon: {
    marginRight: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});

export function Fab({
  onPress,
  icon = 'add',
}: {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const theme = useThemeColors();
  const fabBottom = useFabBottomOffset();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        fabStyles.fab,
        {
          backgroundColor: theme.primary,
          shadowColor: theme.text,
          bottom: fabBottom,
        },
        pressed && { opacity: 0.9 },
      ]}
    >
      <Ionicons name={icon} size={26} color={theme.surface} />
    </Pressable>
  );
}

const fabStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 50,
    height: 50,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});

export function TextInputField({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  error,
  multiline,
  keyboardType = 'default',
  autoCapitalize,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  const theme = useThemeColors();

  return (
    <>
      <FieldLabel label={label} required={required} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          inputStyles.input,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.danger : theme.border,
            color: theme.text,
          },
          multiline && inputStyles.multiline,
        ]}
      />
      {error ? (
        <Text style={[inputStyles.error, { color: theme.danger }]}>{error}</Text>
      ) : null}
    </>
  );
}

const inputStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    marginBottom: spacing.md,
    minHeight: 42,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  error: {
    ...typography.small,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
});

export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}) {
  const theme = useThemeColors();
  const cardStyle = useMemo(
    () => ({
      backgroundColor: theme.surface,
      borderColor: theme.border,
      shadowColor: theme.text,
    }),
    [theme]
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyles.card,
          cardStyle,
          pressed && { opacity: 0.95 },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyles.card, cardStyle, style]}>{children}</View>;
}

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
});

export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  const theme = useThemeColors();

  return (
    <Card style={emptyStyles.container}>
      <Ionicons name={icon} size={48} color={theme.primary} />
      <Text style={[emptyStyles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[emptyStyles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
    </Card>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.subheading,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  const theme = useThemeColors();

  return (
    <Card style={statStyles.card}>
      <View style={statStyles.labelWrap}>
        <Text
          style={[statStyles.label, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {label}
        </Text>
      </View>
      <Text style={[statStyles.value, { color: accent ?? theme.text }]}>{value}</Text>
    </Card>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    minHeight: 72,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  labelWrap: {
    height: 28,
    justifyContent: 'flex-start',
  },
  label: {
    ...typography.small,
    lineHeight: 16,
  },
  value: {
    ...typography.subheading,
  },
});

export function ProgressBar({ progress }: { progress: number }) {
  const theme = useThemeColors();
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <View style={[progressStyles.track, { backgroundColor: theme.pendingLight }]}>
      <View
        style={[
          progressStyles.fill,
          { width: `${clamped}%`, backgroundColor: theme.success },
        ]}
      />
    </View>
  );
}

const progressStyles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});

export function headerTitleStyle(): TextStyle {
  return {
    ...typography.subheading,
  };
}
