import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';

import {
  getInvitationTemplate,
  InvitationCornerStyle,
  InvitationTemplate,
} from '@/constants/invitationTemplates';

type InvitationFrameProps = {
  templateId: string;
  backgroundOpacity: number;
  children: ReactNode;
  width?: number;
  height?: number;
};

function TeddyBear({ color, accent }: { color: string; accent: string }) {
  return (
    <>
      <Circle cx="20" cy="12" r="5" fill={color} opacity={0.9} />
      <Circle cx="10" cy="8" r="3.5" fill={color} />
      <Circle cx="30" cy="8" r="3.5" fill={color} />
      <Ellipse cx="20" cy="24" rx="10" ry="9" fill={color} opacity={0.95} />
      <Circle cx="16" cy="22" r="1.2" fill={accent} />
      <Circle cx="24" cy="22" r="1.2" fill={accent} />
      <Ellipse cx="20" cy="26" rx="2" ry="1.2" fill={accent} opacity={0.6} />
      <Ellipse cx="32" cy="26" rx="4" ry="3" fill={color} opacity={0.7} transform="rotate(15 32 26)" />
    </>
  );
}

function RoseCluster({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <>
      <Circle cx="14" cy="14" r="5" fill={primary} opacity={0.55} />
      <Circle cx="20" cy="10" r="4" fill={secondary} opacity={0.5} />
      <Circle cx="10" cy="10" r="3.5" fill={primary} opacity={0.4} />
      <Path
        d="M8 18 Q12 14 16 18 Q20 22 24 16"
        stroke={secondary}
        strokeWidth="1.2"
        fill="none"
        opacity={0.6}
      />
      <Ellipse cx="26" cy="20" rx="4" ry="2.5" fill={secondary} opacity={0.35} />
    </>
  );
}

function GarlandArc({ color }: { color: string }) {
  return (
    <>
      <Path
        d="M4 28 Q20 8 36 28"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity={0.65}
      />
      <Circle cx="10" cy="20" r="3" fill={color} opacity={0.4} />
      <Circle cx="20" cy="12" r="3.5" fill={color} opacity={0.45} />
      <Circle cx="30" cy="20" r="3" fill={color} opacity={0.4} />
      <Ellipse cx="16" cy="24" rx="2" ry="3" fill={color} opacity={0.35} />
      <Ellipse cx="24" cy="24" rx="2" ry="3" fill={color} opacity={0.35} />
    </>
  );
}

function ConfettiCluster({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <>
      <Rect x="6" y="8" width="3" height="3" fill={primary} opacity={0.6} transform="rotate(20 7.5 9.5)" />
      <Circle cx="18" cy="10" r="2" fill={secondary} opacity={0.55} />
      <Rect x="26" y="14" width="2.5" height="2.5" fill={primary} opacity={0.5} transform="rotate(-15 27 15)" />
      <Circle cx="12" cy="22" r="1.8" fill={secondary} opacity={0.5} />
      <Circle cx="28" cy="8" r="1.5" fill={primary} opacity={0.45} />
    </>
  );
}

function CornerDecor({
  style,
  primary,
  secondary,
  size,
  position,
  subtle,
}: {
  style: InvitationCornerStyle;
  primary: string;
  secondary: string;
  size: number;
  position: 'tl' | 'tr' | 'bl' | 'br';
  subtle?: boolean;
}) {
  if (style === 'none') return null;

  const flipX = position.includes('r') ? -1 : 1;
  const flipY = position.includes('b') ? -1 : 1;

  return (
    <View
      style={[
        decorStyles.corner,
        position === 'tl' && decorStyles.tl,
        position === 'tr' && decorStyles.tr,
        position === 'bl' && decorStyles.bl,
        position === 'br' && decorStyles.br,
        { transform: [{ scaleX: flipX }, { scaleY: flipY }] },
        subtle && decorStyles.cornerSubtle,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 40 40">
        {style === 'roses' ? <RoseCluster primary={primary} secondary={secondary} /> : null}
        {style === 'garland' ? <GarlandArc color={primary} /> : null}
        {style === 'confetti' ? (
          <ConfettiCluster primary={primary} secondary={secondary} />
        ) : null}
        {style === 'teddyPink' ? (
          <>
            <TeddyBear color={primary} accent={secondary} />
            <Ellipse cx="34" cy="10" rx="3" ry="4" fill={secondary} opacity={0.5} />
            <Line x1="34" y1="14" x2="34" y2="18" stroke={secondary} strokeWidth="0.8" />
          </>
        ) : null}
        {style === 'teddyBlue' ? (
          <>
            <TeddyBear color={primary} accent={secondary} />
            <Ellipse cx="34" cy="10" rx="3" ry="4" fill={secondary} opacity={0.5} />
            <Line x1="34" y1="14" x2="34" y2="18" stroke={secondary} strokeWidth="0.8" />
          </>
        ) : null}
        {style === 'stars' ? (
          <>
            <Path
              d="M10 8 L11.5 12 L16 12 L12.5 14.5 L14 19 L10 16.5 L6 19 L7.5 14.5 L4 12 L8.5 12 Z"
              fill={primary}
              opacity={0.55}
            />
            <Circle cx="26" cy="8" r="2.5" fill={secondary} opacity={0.45} />
            <Path
              d="M28 18 L29 20 L31 20 L29.5 21.5 L30 24 L28 22.5 L26 24 L26.5 21.5 L25 20 L27 20 Z"
              fill={secondary}
              opacity={0.4}
            />
          </>
        ) : null}
        {style === 'balloons' ? (
          <>
            <Ellipse cx="12" cy="12" rx="5" ry="7" fill={primary} opacity={0.5} />
            <Line x1="12" y1="19" x2="12" y2="28" stroke={primary} strokeWidth="1" />
            <Ellipse cx="24" cy="14" rx="4" ry="6" fill={secondary} opacity={0.45} />
            <Line x1="24" y1="20" x2="24" y2="28" stroke={secondary} strokeWidth="1" />
          </>
        ) : null}
      </Svg>
    </View>
  );
}

function FloralScatter({ primary, secondary }: { primary: string; secondary: string }) {
  const spots = [
    { cx: 40, cy: 80, r: 4 },
    { cx: 280, cy: 60, r: 3.5 },
    { cx: 50, cy: 400, r: 3 },
    { cx: 270, cy: 420, r: 4 },
    { cx: 160, cy: 30, r: 2.5 },
  ];

  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 320 480" pointerEvents="none">
      {spots.map((spot, index) => (
        <Circle
          key={index}
          cx={spot.cx}
          cy={spot.cy}
          r={spot.r}
          fill={index % 2 === 0 ? primary : secondary}
          opacity={0.12}
        />
      ))}
    </Svg>
  );
}

function FrameBorders({ template }: { template: InvitationTemplate }) {
  return (
    <>
      <View
        style={[
          frameStyles.outerBorder,
          {
            borderColor: template.borderColor,
            borderWidth: template.borderWidth,
          },
        ]}
      />
      {template.doubleBorder ? (
        <View
          style={[
            frameStyles.innerBorder,
            {
              borderColor: template.innerBorderColor ?? template.borderColor,
            },
          ]}
        />
      ) : null}
    </>
  );
}

function FrameContent({
  template,
  backgroundOpacity,
  children,
  cornerSize,
}: {
  template: InvitationTemplate;
  backgroundOpacity: number;
  children: ReactNode;
  cornerSize: number;
}) {
  const secondary = template.secondaryAccent ?? template.accentColor;
  const gradient = template.gradientColors ?? [template.backgroundColor, template.overlayColor];
  const useImage = template.useImageBackground && template.backgroundImage;
  const readOverlayOpacity = useImage
    ? 0.15 + (1 - backgroundOpacity) * 0.35
    : backgroundOpacity * 0.35;

  const decorLayer = (
    <>
      <View
        style={[
          frameStyles.overlay,
          {
            backgroundColor: useImage ? 'rgba(255,255,255,0.92)' : template.overlayColor,
            opacity: readOverlayOpacity,
          },
        ]}
      />
      {template.scatterFloral && !useImage ? (
        <FloralScatter primary={template.accentColor} secondary={secondary} />
      ) : null}
      <FrameBorders template={template} />
      {(['tl', 'tr', 'bl', 'br'] as const).map((position) => (
        <CornerDecor
          key={position}
          style={template.cornerStyle}
          primary={template.accentColor}
          secondary={secondary}
          size={cornerSize}
          position={position}
          subtle={template.subtleCorners}
        />
      ))}
      <View style={frameStyles.content}>{children}</View>
    </>
  );

  if (useImage && template.backgroundImage) {
    return (
      <ImageBackground
        source={template.backgroundImage}
        resizeMode="cover"
        style={[frameStyles.background, { backgroundColor: template.backgroundColor }]}
        imageStyle={{ opacity: backgroundOpacity }}
      >
        {decorLayer}
      </ImageBackground>
    );
  }

  return (
    <View style={[frameStyles.background, { backgroundColor: template.backgroundColor }]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {decorLayer}
    </View>
  );
}

export function InvitationFrame({
  templateId,
  backgroundOpacity,
  children,
  width = 320,
  height = 480,
}: InvitationFrameProps) {
  const template = getInvitationTemplate(templateId);
  const cornerSize = 56;

  return (
    <View style={[frameStyles.container, { width, height }]}>
      <FrameContent
        template={template}
        backgroundOpacity={backgroundOpacity}
        cornerSize={cornerSize}
      >
        {children}
      </FrameContent>
    </View>
  );
}

function InvitationFrameThumbnailInner({
  template,
}: {
  template: InvitationTemplate;
}) {
  if (template.useImageBackground && template.backgroundImage) {
    return (
      <View style={thumbStyles.gradient}>
        <Image
          source={template.backgroundImage}
          style={thumbStyles.imageFill}
          resizeMode="cover"
        />
        <View style={thumbStyles.imageOverlay} />
        <View
          style={[
            thumbStyles.inner,
            { borderColor: template.borderColor },
          ]}
        />
      </View>
    );
  }

  const gradient = template.gradientColors ?? [template.backgroundColor, template.overlayColor];

  return (
    <>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={thumbStyles.gradient}
      >
        <View
          style={[
            thumbStyles.inner,
            { borderColor: template.borderColor },
          ]}
        />
        <View
          style={[
            thumbStyles.accentDot,
            { backgroundColor: template.accentColor },
          ]}
        />
      </LinearGradient>
    </>
  );
}

export function InvitationFrameThumbnail({
  template,
  selected,
  onPress,
}: {
  template: InvitationTemplate;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        thumbStyles.thumb,
        {
          borderColor: selected ? template.accentColor : template.borderColor,
          borderWidth: selected ? 3 : 2,
        },
      ]}
    >
      <InvitationFrameThumbnailInner template={template} />
    </Pressable>
  );
}

const frameStyles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  background: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  outerBorder: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    bottom: 14,
    borderRadius: 4,
  },
  innerBorder: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 1,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 36,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const decorStyles = StyleSheet.create({
  corner: {
    position: 'absolute',
    zIndex: 2,
  },
  tl: { top: 4, left: 4 },
  tr: { top: 4, right: 4 },
  bl: { bottom: 4, left: 4 },
  br: { bottom: 4, right: 4 },
  cornerSubtle: {
    opacity: 0.55,
  },
});

const thumbStyles = StyleSheet.create({
  thumb: {
    width: 72,
    height: 96,
    borderRadius: 6,
    overflow: 'hidden',
    margin: 4,
  },
  gradient: {
    flex: 1,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderRadius: 3,
  },
  accentDot: {
    position: 'absolute',
    bottom: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  imageFill: {
    ...StyleSheet.absoluteFillObject,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
