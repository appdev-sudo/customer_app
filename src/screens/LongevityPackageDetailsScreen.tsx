import React from 'react';
import {Image, Linking, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../navigation/HomeStack';
import type {LongevityPackage} from '../types/longevity';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';

type Props = NativeStackScreenProps<HomeStackParamList, 'LongevityPackageDetails'>;

export const LongevityPackageDetailsScreen: React.FC<Props> = ({route, navigation}) => {
  const {pkg} = route.params as {pkg: LongevityPackage};

  const handleEnquire = async () => {
    // Navigate to BookAppointment
    navigation.navigate('BookAppointment', {
      serviceId: pkg.id,
      serviceTitle: pkg.title,
    });
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Image
          source={require('../assets/images/Website_banner_2.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroText}>
          <Text style={styles.title}>{pkg.title}</Text>
          <Text style={styles.duration}>{pkg.duration}</Text>
        </View>
      </View>

      {pkg.idealFor ? <Text style={styles.idealFor}>{pkg.idealFor}</Text> : null}

      <View style={styles.section}>
        {pkg.bullets.map((b: string) => (
          <View key={b} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{b}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={handleEnquire} style={styles.enquireButton}>
        <Text style={styles.enquireText}>Book Appointment</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundNavy,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    height: 180,
    margin: spacing.xl,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(77, 214, 255, 0.25)',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 48, 75, 0.65)',
  },
  heroText: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  title: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.semibold as any,
    color: colors.accentAqua,
  },
  duration: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  idealFor: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.9,
    lineHeight: 22,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  section: {
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    color: colors.accentAqua,
    marginRight: 10,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.95,
    lineHeight: 20,
  },
  enquireButton: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    backgroundColor: colors.accentAqua, // site uses cyan buttons in packages
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  enquireText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold as any,
    color: colors.backgroundNavy,
  },
});

