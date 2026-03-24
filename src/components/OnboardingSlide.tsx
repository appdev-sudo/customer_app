import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';

type Props = {
  title: string;
  description: string;
};

export const OnboardingSlide: React.FC<Props> = ({
  title,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.semibold as any,
    color: colors.accentAqua,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

