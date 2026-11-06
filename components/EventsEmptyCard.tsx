import { StyleSheet, Text, View } from 'react-native';

import { resolveAssetDimensions } from '@/components/AppImage';
import { AppImageBackground } from '@/components/AppImageBackground';
import { Card } from '@/components/ui';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

const EMPTY_EVENTS_FLORAL_CARD = require('@/assets/images/empty-events-floral-card.jpg');
const FLORAL_ASPECT = (() => {
  const { width, height } = resolveAssetDimensions(EMPTY_EVENTS_FLORAL_CARD);
  return width > 0 && height > 0 ? width / height : 16 / 9;
})();

type EventsEmptyCardProps = {
  title: string;
  subtitle: string;
  onPress: () => void;
};

export function EventsEmptyCard({ title, subtitle, onPress }: EventsEmptyCardProps) {
  const theme = useThemeColors();

  return (
    <Card onPress={onPress} style={styles.card}>
      <AppImageBackground
        source={EMPTY_EVENTS_FLORAL_CARD}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content} pointerEvents="box-none">
          <View style={styles.textBlock}>
            <Text
              style={[styles.title, { color: theme.primaryDark }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {title}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
          </View>
        </View>
      </AppImageBackground>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignSelf: 'stretch',
    padding: 0,
    overflow: 'hidden',
    borderRadius: radius.lg,
  },
  background: {
    width: '100%',
    aspectRatio: FLORAL_ASPECT,
    overflow: 'hidden',
    backgroundColor: '#FFF8F4',
  },
  backgroundImage: {
    borderRadius: radius.lg,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.lg,
    // RN: vertical % padding is relative to width; ~36% ≈ below card midline at 16:9
    paddingTop: '23%',
  },
  textBlock: {
    width: '80%',
    maxWidth: 340,
    alignItems: 'center',
  },
  title: {
    ...typography.subheading,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '700',
    width: '100%',
  },
  subtitle: {
    ...typography.caption,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
});
