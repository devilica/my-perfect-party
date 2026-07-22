import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { InvitationFrame } from '@/components/InvitationFrame';
import { getInvitationTemplate } from '@/constants/invitationTemplates';
import { EventInvitation, InvitationFontFamily } from '@/types/models';

type InvitationPreviewProps = {
  invitation: EventInvitation;
  width?: number;
  height?: number;
};

const BASE_SPACING = {
  afterIcon: 8,
  afterHeader: 12,
  afterNames: 14,
  afterDate: 16,
  subEventGap: 10,
  beforeRsvp: 16,
};

function getNamesFontFamily(family: InvitationFontFamily): string | undefined {
  switch (family) {
    case 'script':
      return 'GreatVibes-Regular';
    case 'serif':
      return Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });
    case 'sans':
      return Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });
  }
}

function SubEventRow({
  icon,
  time,
  title,
  location,
  textColor,
  accentColor,
  spacing,
}: {
  icon: string;
  time?: string;
  title: string;
  location?: string;
  textColor: string;
  accentColor: string;
  spacing: number;
}) {
  const iconName = icon as keyof typeof Ionicons.glyphMap;
  const detail = [time, title, location].filter(Boolean).join(' ');

  return (
    <View style={[styles.subEventRow, { marginBottom: spacing }]}>
      <Ionicons
        name={iconName}
        size={16}
        color={accentColor}
        style={styles.subEventIcon}
      />
      <Text style={[styles.subEventText, { color: textColor }]} numberOfLines={2}>
        {detail.toUpperCase()}
      </Text>
    </View>
  );
}

export const InvitationPreview = forwardRef<View, InvitationPreviewProps>(
  function InvitationPreview({ invitation, width = 320, height = 480 }, ref) {
    const template = getInvitationTemplate(invitation.templateId);
    const isLightText = template.textTone === 'light';
    const headerColor = isLightText ? '#F5F5F5' : '#5C5C5C';
    const dateColor = isLightText ? '#FFFFFF' : invitation.fontColor;
    const spacingMul = invitation.lineSpacing;
    const iconName = invitation.headerIcon as keyof typeof Ionicons.glyphMap;

    return (
      <View ref={ref} collapsable={false}>
        <InvitationFrame
          templateId={invitation.templateId}
          backgroundOpacity={invitation.backgroundOpacity}
          width={width}
          height={height}
        >
          <View style={styles.inner}>
            <Ionicons
              name={iconName}
              size={28}
              color={template.accentColor}
              style={{ marginBottom: BASE_SPACING.afterIcon * spacingMul }}
            />

            {invitation.headerTitle ? (
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: headerColor,
                    marginBottom: BASE_SPACING.afterHeader * spacingMul,
                  },
                ]}
              >
                {invitation.headerTitle.toUpperCase()}
              </Text>
            ) : null}

            {invitation.hostNames ? (
              <Text
                style={[
                  styles.hostNames,
                  {
                    color: invitation.fontColor,
                    fontSize: invitation.fontSize,
                    fontFamily: getNamesFontFamily(invitation.namesFontFamily),
                    marginBottom: BASE_SPACING.afterNames * spacingMul,
                  },
                ]}
              >
                {invitation.hostNames}
              </Text>
            ) : null}

            {invitation.eventDateText ? (
              <>
                <View
                  style={[
                    styles.dateDivider,
                    { borderColor: template.accentColor, opacity: 0.5 },
                  ]}
                />
                <Text
                  style={[
                    styles.eventDate,
                    {
                      color: dateColor,
                      marginVertical: BASE_SPACING.afterDate * spacingMul * 0.5,
                    },
                  ]}
                >
                  {invitation.eventDateText.toUpperCase()}
                </Text>
                <View
                  style={[
                    styles.dateDivider,
                    {
                      borderColor: template.accentColor,
                      opacity: 0.5,
                      marginBottom: BASE_SPACING.afterDate * spacingMul * 0.5,
                    },
                  ]}
                />
              </>
            ) : null}

            {invitation.subEvents.map((subEvent) => (
              <SubEventRow
                key={subEvent.id}
                icon={subEvent.icon}
                time={subEvent.time}
                title={subEvent.title}
                location={subEvent.location}
                textColor={headerColor}
                accentColor={template.accentColor}
                spacing={BASE_SPACING.subEventGap * spacingMul}
              />
            ))}

            {invitation.rsvpMessage ? (
              <Text
                style={[
                  styles.rsvp,
                  {
                    color: headerColor,
                    marginTop: BASE_SPACING.beforeRsvp * spacingMul,
                  },
                ]}
              >
                {invitation.rsvpMessage.toUpperCase()}
              </Text>
            ) : null}
          </View>
        </InvitationFrame>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  inner: {
    width: '100%',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 10,
    letterSpacing: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  hostNames: {
    textAlign: 'center',
    lineHeight: 44,
  },
  eventDate: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  dateDivider: {
    width: '60%',
    borderBottomWidth: 1,
  },
  subEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  subEventIcon: {
    marginRight: 8,
  },
  subEventText: {
    flex: 1,
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '500',
  },
  rsvp: {
    fontSize: 8,
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 8,
  },
});
