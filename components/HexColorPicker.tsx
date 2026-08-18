import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  LayoutChangeEvent,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/ui';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

type Hsv = { h: number; s: number; v: number };

type HexColorPickerProps = {
  label: string;
  actionLabel: string;
  hexLabel: string;
  value: string;
  onChange: (hex: string) => void;
};

const SV_SIZE = 220;
const HANDLE = 18;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(input: string): string | null {
  const trimmed = input.trim().replace(/^#/, '');
  if (!/^[0-9A-Fa-f]{6}$/.test(trimmed)) return null;
  return `#${trimmed.toUpperCase()}`;
}

function hexToHsv(hex: string): Hsv {
  const normalized = normalizeHex(hex) ?? '#3D3D3D';
  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h,
    s: max === 0 ? 0 : delta / max,
    v: max,
  };
}

function hsvToHex({ h, s, v }: Hsv): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (channel: number) =>
    Math.round((channel + m) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hueColor(h: number) {
  return hsvToHex({ h, s: 1, v: 1 });
}

export function HexColorPicker({
  label,
  actionLabel,
  hexLabel,
  value,
  onChange,
}: HexColorPickerProps) {
  const theme = useThemeColors();
  const [open, setOpen] = useState(false);
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const [hexDraft, setHexDraft] = useState(() => normalizeHex(value) ?? '#3D3D3D');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const hsvRef = useRef(hsv);
  const squareSize = useRef(SV_SIZE);

  useEffect(() => {
    hsvRef.current = hsv;
  }, [hsv]);

  useEffect(() => {
    if (!open) {
      setKeyboardHeight(0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [open]);

  useEffect(() => {
    const next = normalizeHex(value);
    if (!next || next === hsvToHex(hsvRef.current)) return;
    const parsed = hexToHsv(next);
    hsvRef.current = parsed;
    setHsv(parsed);
    setHexDraft(next);
  }, [value]);

  const currentHex = useMemo(() => hsvToHex(hsv), [hsv]);
  const fullHue = hueColor(hsv.h);

  const commit = (next: Hsv) => {
    const clamped = {
      h: clamp(next.h, 0, 359.99),
      s: clamp(next.s, 0, 1),
      v: clamp(next.v, 0, 1),
    };
    hsvRef.current = clamped;
    setHsv(clamped);
    const hex = hsvToHex(clamped);
    setHexDraft(hex);
    onChange(hex);
  };

  const commitHex = (text: string) => {
    const next = text.startsWith('#') ? text : `#${text}`;
    setHexDraft(next);
    const parsed = normalizeHex(next);
    if (!parsed) return;
    const parsedHsv = hexToHsv(parsed);
    hsvRef.current = parsedHsv;
    setHsv(parsedHsv);
    onChange(parsed);
  };

  const updateSvFromTouch = (locationX: number, locationY: number) => {
    const size = squareSize.current || SV_SIZE;
    commit({
      ...hsvRef.current,
      s: clamp(locationX / size, 0, 1),
      v: clamp(1 - locationY / size, 0, 1),
    });
  };

  const svPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        updateSvFromTouch(event.nativeEvent.locationX, event.nativeEvent.locationY);
      },
      onPanResponderMove: (event) => {
        updateSvFromTouch(event.nativeEvent.locationX, event.nativeEvent.locationY);
      },
    })
  ).current;

  const onSquareLayout = (event: LayoutChangeEvent) => {
    squareSize.current = event.nativeEvent.layout.width;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.triggerRow}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
        <View
          style={[
            styles.swatch,
            { backgroundColor: currentHex, borderColor: theme.border },
          ]}
        />
        <Button
          label={actionLabel}
          variant="secondary"
          onPress={() => setOpen(true)}
          style={styles.changeButton}
        />
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={[
            styles.overlay,
            {
              backgroundColor: theme.overlay,
              justifyContent: keyboardHeight > 0 ? 'flex-end' : 'center',
              paddingBottom: keyboardHeight > 0 ? keyboardHeight + spacing.sm : spacing.xl,
            },
          ]}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={[styles.popup, { backgroundColor: theme.surface }]}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.hexRow}>
              <Text style={[styles.hexLabel, { color: theme.textSecondary }]}>{hexLabel}</Text>
              <TextInput
                value={hexDraft}
                onChangeText={commitHex}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={7}
                placeholder="#3D3D3D"
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.hexInput,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
              />
            </View>

            <View
              style={[
                styles.svSquare,
                keyboardHeight > 0 ? styles.svSquareCompact : null,
              ]}
              onLayout={onSquareLayout}
              {...svPan.panHandlers}
            >
              <LinearGradient
                colors={['#FFFFFF', fullHue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={['transparent', '#000000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View
                pointerEvents="none"
                style={[
                  styles.svHandle,
                  {
                    left: hsv.s * (keyboardHeight > 0 ? 160 : SV_SIZE) - HANDLE / 2,
                    top: (1 - hsv.v) * (keyboardHeight > 0 ? 160 : SV_SIZE) - HANDLE / 2,
                    backgroundColor: currentHex,
                    borderColor: '#FFFFFF',
                  },
                ]}
              />
            </View>

            <View style={styles.hueRow}>
              <View style={[styles.previewCircle, { backgroundColor: currentHex, borderColor: theme.border }]} />
              <View style={styles.hueTrack}>
                <LinearGradient
                  colors={['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.hueGradient}
                />
                <Slider
                  minimumValue={0}
                  maximumValue={359.99}
                  step={1}
                  value={hsv.h}
                  onValueChange={(h) => commit({ ...hsvRef.current, h })}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="#FFFFFF"
                  style={styles.hueSlider}
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  changeButton: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  hexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  hexLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  hexInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  popup: {
    borderRadius: radius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  svSquare: {
    width: SV_SIZE,
    height: SV_SIZE,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  svSquareCompact: {
    width: 160,
    height: 160,
  },
  svHandle: {
    position: 'absolute',
    width: HANDLE,
    height: HANDLE,
    borderRadius: HANDLE / 2,
    borderWidth: 2,
  },
  hueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  previewCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },
  hueTrack: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
  },
  hueGradient: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 12,
    borderRadius: radius.full,
  },
  hueSlider: {
    width: '100%',
    height: 36,
  },
});
