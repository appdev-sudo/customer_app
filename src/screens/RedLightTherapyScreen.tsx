import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getServices} from '../api/client';
import {MedicalServiceCard} from '../components/MedicalServiceCard';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import type {RedLightTherapyStackParamList} from '../navigation/RedLightTherapyStack';
import type {MedicalServiceItem} from '../types/serviceDetail';

type Props = NativeStackScreenProps<RedLightTherapyStackParamList, 'RedLightMain'>;

export const RedLightTherapyScreen: React.FC<Props> = ({navigation}) => {
  const [services, setServices] = useState<MedicalServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getServices('red_light')
      .then(data => { if (!cancelled) setServices(data); })
      .catch(err => { if (!cancelled) setError(err?.message ?? 'Failed to load'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const toDetail = (item: MedicalServiceItem) => ({
    title: item.title,
    subtitle: item.subtitle,
    fullDescription: item.fullDescription,
    bullets: item.bullets,
    image: item.image,
    price: item.price,
    sessionInfo: item.sessionInfo,
    tagline: item.tagline,
    sections: item.sections,
  });

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/logo-03.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.sectionLabel}>Therapy</Text>
      <Text style={styles.title}>Red Light Therapy</Text>
      <Text style={styles.subtitle}>
        Non-invasive light therapy to support recovery, skin and cellular health.
      </Text>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.accentAqua} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            onPress={() => {
              setError(null);
              setLoading(true);
              getServices('red_light')
                .then(setServices)
                .catch(e => setError(e?.message ?? 'Failed to load'))
                .finally(() => setLoading(false));
            }}
            style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        services.map(item => (
          <MedicalServiceCard
            key={item.id}
            item={item}
            onKnowMore={() =>
              navigation.navigate('ServiceDetail', {detail: toDetail(item)})
            }
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundNavy,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  logo: {width: 120, height: 38},
  sectionLabel: {
    fontFamily: fonts.primary,
    fontSize: 11,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    opacity: 0.5,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    color: colors.textPrimary,
    opacity: 0.75,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  loadingText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  errorWrap: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    color: colors.accentRed,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accentAqua,
  },
  retryBtnText: {
    fontFamily: fonts.primary,
    fontSize: 12,
    fontWeight: fontWeights.medium as any,
    color: colors.accentAqua,
  },
});
