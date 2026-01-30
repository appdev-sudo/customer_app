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
import type {RedLightTherapyStackParamList} from '../navigation/RedLightTherapyStack';
import type {MedicalServiceItem} from '../types/serviceDetail';

type Props = NativeStackScreenProps<RedLightTherapyStackParamList, 'RedLightMain'>;

const RED_LIGHT_SERVICES: MedicalServiceItem[] = [
  {
    id: 'red-light-therapy',
    title: 'Red Light Therapy',
    shortDescription: 'Non-invasive photobiomodulation for recovery, skin and cellular health.',
    fullDescription:
      'Red light therapy uses specific wavelengths of light to support cellular energy production, recovery, and skin health. Sessions are brief and non-invasive, and can complement your IV and longevity protocol. Ask our team for session options and packages.',
    image: require('../assets/images/Website_banner_2.jpg'),
    bullets: [
      'Photobiomodulation for cells',
      'Recovery and muscle support',
      'Skin and wellness benefits',
      'Short, non-invasive sessions',
    ],
  },
];

export const RedLightTherapyScreen: React.FC<Props> = ({navigation}) => {
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
      <Text style={styles.title}>Red Light Therapy</Text>
      <Text style={styles.subtitle}>
        Non-invasive light therapy to support recovery, skin and cellular health.
      </Text>
      {RED_LIGHT_SERVICES.map(item => (
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
