import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MedicalServiceCard} from '../components/MedicalServiceCard';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import type {HyperbaricOxygenStackParamList} from '../navigation/HyperbaricOxygenStack';
import type {MedicalServiceItem} from '../types/serviceDetail';

type Props = NativeStackScreenProps<HyperbaricOxygenStackParamList, 'HyperbaricMain'>;

const HYPERBARIC_SERVICES: MedicalServiceItem[] = [
  {
    id: 'hyperbaric-oxygen',
    title: 'Hyperbaric Oxygen Therapy',
    shortDescription: 'Pressurised oxygen therapy to support recovery and cellular function.',
    fullDescription:
      'Hyperbaric Oxygen Therapy (HBOT) delivers 100% oxygen at increased pressure in a controlled chamber. This can support wound healing, recovery, and cellular function. Sessions are supervised and tailored to your goals. Enquire for availability and packages.',
    image: require('../assets/images/Website_banner_2.jpg'),
    bullets: [
      '100% oxygen at increased pressure',
      'Supports recovery and healing',
      'Supervised, controlled sessions',
      'Tailored to your protocol',
    ],
  },
];

export const HyperbaricOxygenTherapyScreen: React.FC<Props> = ({navigation}) => {
  const toDetail = (item: MedicalServiceItem) => ({
    title: item.title,
    subtitle: item.subtitle,
    fullDescription: item.fullDescription,
    bullets: item.bullets,
    image: item.image,
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
      <Text style={styles.title}>Hyperbaric Oxygen Therapy</Text>
      <Text style={styles.subtitle}>
        Pressurised oxygen in a controlled environment to support recovery and cellular health.
      </Text>
      {HYPERBARIC_SERVICES.map(item => (
        <MedicalServiceCard
          key={item.id}
          item={item}
          onKnowMore={() =>
            navigation.navigate('ServiceDetail', {detail: toDetail(item)})
          }
        />
      ))}
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
});
