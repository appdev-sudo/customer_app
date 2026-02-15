import React from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import type {ServiceDetailParam} from '../types/serviceDetail';
import {useAuth} from '../utils/authContext';

type Props = NativeStackScreenProps<any, 'ServiceDetail'>;

const CONSULTATION_WHATSAPP = 'https://wa.me/919967526793';

export const ServiceDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const params = route.params as { detail: ServiceDetailParam };
  const detail = params?.detail ?? {
    title: 'Service',
    fullDescription: 'Details not available.',
  };
  const {isAuthenticated, user} = useAuth();

  const hasStructuredContent = detail.sections && detail.sections.length > 0;

  const handleEnquire = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Navigate to auth flow
      navigation.navigate('AuthStack', {screen: 'PhoneAuth'});
      return;
    }

    if (!user?.profileCompleted) {
       navigation.navigate('HomeStack', {screen: 'Profile'}); // Should go to UserProfile but handled by stack usually? Or just alert.
       // Actually ProfileScreen handles redirect if not logged in, but here user is logged in.
       // If profile not complete, maybe redirect to UserProfileScreen (edit mode)?
       // But let's assume BookAppointment handles missing details (it checks address).
    }

    // Navigate to BookAppointment
    navigation.navigate('BookAppointment', {
        serviceId: detail.id || 'unknown',
        serviceTitle: detail.title,
    });
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Hero */}
      {detail.image ? (
        <View style={styles.hero}>
          <Image
            source={detail.image}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroText}>
            <Text style={styles.title}>{detail.title}</Text>
            {detail.subtitle ? (
              <Text style={styles.heroSubtitle}>{detail.subtitle}</Text>
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.heroPlaceholder}>
          <Text style={styles.title}>{detail.title}</Text>
          {detail.subtitle ? (
            <Text style={styles.heroSubtitle}>{detail.subtitle}</Text>
          ) : null}
        </View>
      )}

      {/* Price block — prominent when present */}
      {detail.price ? (
        <View style={styles.priceBlock}>
          <Text style={styles.price}>{detail.price}</Text>
          {detail.sessionInfo ? (
            <Text style={styles.sessionInfo}>{detail.sessionInfo}</Text>
          ) : null}
          {detail.tagline ? (
            <Text style={styles.tagline}>{detail.tagline}</Text>
          ) : null}
        </View>
      ) : (
        <>
          {detail.sessionInfo ? (
            <Text style={styles.sessionInfoStandalone}>{detail.sessionInfo}</Text>
          ) : null}
          {detail.tagline ? (
            <Text style={styles.taglineStandalone}>{detail.tagline}</Text>
          ) : null}
        </>
      )}

      {/* Structured sections (A, B, C) */}
      {hasStructuredContent ? (
        <View style={styles.sectionsWrap}>
          {detail.sections!.map((sec, idx) => (
            <View key={idx} style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.items.map((item, i) => (
                <View key={i} style={styles.sectionItemRow}>
                  <View style={styles.sectionBullet} />
                  <Text style={styles.sectionItemText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : (
        <>
          {detail.fullDescription ? (
            <Text style={styles.description}>{detail.fullDescription}</Text>
          ) : null}
          {detail.bullets && detail.bullets.length > 0 ? (
            <View style={styles.legacySection}>
              {detail.bullets.map((b: string) => (
                <View key={b} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </>
      )}

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
    marginBottom: spacing.md,
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
  heroPlaceholder: {
    margin: spacing.xl,
    padding: spacing.lg,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.semibold as any,
    color: colors.accentAqua,
  },
  heroSubtitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  priceBlock: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    backgroundColor: 'rgba(77, 214, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(77, 214, 255, 0.2)',
    alignItems: 'center',
  },
  price: {
    fontFamily: fonts.primary,
    fontSize: 28,
    fontWeight: fontWeights.bold as any,
    color: colors.accentAqua,
    letterSpacing: 0.5,
  },
  sessionInfo: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    opacity: 0.9,
    marginTop: spacing.sm,
  },
  tagline: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.75,
    marginTop: spacing.xs,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sessionInfoStandalone: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    opacity: 0.9,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xs,
  },
  taglineStandalone: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    color: colors.textPrimary,
    opacity: 0.75,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  sectionsWrap: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sectionTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold as any,
    color: colors.accentAqua,
    marginBottom: spacing.md,
    letterSpacing: 0.3,
  },
  sectionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentAqua,
    opacity: 0.9,
    marginRight: spacing.md,
  },
  sectionItemText: {
    flex: 1,
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.95,
    lineHeight: 20,
  },
  description: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.95,
    lineHeight: 22,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  legacySection: {
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: spacing.lg,
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
    marginTop: spacing.md,
    marginHorizontal: spacing.xl,
    backgroundColor: colors.accentAqua,
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
