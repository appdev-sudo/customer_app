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
import type {DiagnosticStackParamList} from '../navigation/DiagnosticStack';
import type {MedicalServiceItem} from '../types/serviceDetail';

type Props = NativeStackScreenProps<DiagnosticStackParamList, 'DiagnosticMain'>;

const DIAGNOSTIC_SERVICES: MedicalServiceItem[] = [
  {
    id: 'pathology',
    title: 'Pathology / Blood tests',
    shortDescription: 'Comprehensive laboratory testing for all vital organs.',
    fullDescription:
      'Our pathology and blood testing services provide a complete picture of your health. We offer comprehensive laboratory testing covering metabolic panels, organ function, hormones, vitamins, and inflammatory markers — all interpreted in the context of longevity and preventive health.',
    image: require('../assets/icons/pathology.png'),
    bullets: [
      'Complete blood count and metabolic panel',
      'Organ function (liver, kidney, thyroid)',
      'Vitamins and minerals',
      'Inflammatory and cardiac markers',
    ],
  },
  {
    id: 'radiology',
    title: 'Radiology - USG & X-ray',
    shortDescription: 'AI-assisted ultrasound, Colour Doppler, Elastography, X-ray.',
    fullDescription:
      'Radiology at VytalYou includes ultrasound (USG), X-ray, and advanced imaging. We use AI-assisted ultrasound, Colour Doppler, and Elastography where indicated to assess organs and structures — supporting early detection and baseline health mapping.',
    image: require('../assets/icons/endocrine.png'),
    bullets: [
      'Ultrasound (Abdomen, etc.)',
      'X-Ray (Chest and others)',
      'Colour Doppler and Elastography where indicated',
    ],
  },
  {
    id: 'cardiac',
    title: 'Cardiac Evaluation',
    subtitle: '2D/3D Echocardiogram, ECG',
    shortDescription: 'ECG and 2D/3D ECHO for heart performance assessment.',
    fullDescription:
      'Cardiac evaluation includes ECG and 2D/3D Echocardiogram to assess heart structure and function. This forms a key part of our preventive longevity assessment, ensuring your cardiovascular system is optimised and any early concerns are identified.',
    image: require('../assets/icons/ecg-machine.png'),
    bullets: [
      'ECG (Electrocardiogram)',
      '2D Echocardiogram',
      '3D Echocardiogram where indicated',
    ],
  },
  {
    id: 'body-composition',
    title: 'Body Composition Analysis',
    shortDescription: 'Advanced technology measuring obesity, muscle mass, inflammation, cellular age.',
    fullDescription:
      'Body composition analysis goes beyond weight. We use advanced technology to measure fat mass, muscle mass, visceral fat, inflammation markers, and cellular age — giving you a clear view of your metabolic and structural health for targeted interventions.',
    image: require('../assets/icons/bio.png'),
    bullets: [
      'Fat and muscle distribution',
      'Visceral fat and metabolic risk',
      'Cellular and metabolic age indicators',
    ],
  },
  {
    id: 'genetics',
    title: 'Genetics',
    shortDescription: 'DNA-based insights into health risks and longevity potential.',
    fullDescription:
      'Our genetic testing provides DNA-based insights into your health risks, nutrient metabolism, and longevity potential. Results are interpreted by our doctors to personalise your IV therapy, supplements, and lifestyle recommendations.',
    image: require('../assets/icons/dna.png'),
    bullets: [
      'Wellness and longevity-related genes',
      'Nutrient and drug metabolism',
      'Personalised interpretation by doctors',
    ],
  },
  {
    id: 'cancer-screening',
    title: 'Cancer Screening',
    shortDescription: 'Early cancer risk screening and preventive markers.',
    fullDescription:
      'Cancer screening at VytalYou is part of our preventive longevity approach. We use evidence-based markers and, where appropriate, imaging and tests to support early detection and risk stratification — always in consultation with your care plan.',
    image: require('../assets/icons/pathology.png'),
    bullets: [
      'Evidence-based tumour markers where indicated',
      'Integrated with full diagnostic picture',
      'Doctor-supervised interpretation',
    ],
  },
];

export const DiagnosticScreen: React.FC<Props> = ({navigation}) => {
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
      <Text style={styles.sectionLabel}>Diagnostics</Text>
      <Text style={styles.title}>Our Diagnostic Services</Text>
      <Text style={styles.subtitle}>
        A complete diagnostic ecosystem to prevent disease and optimise longevity.
      </Text>
      {DIAGNOSTIC_SERVICES.map(item => (
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
