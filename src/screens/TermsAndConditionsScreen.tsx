import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';

export const TermsAndConditionsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>1. Acceptance of Terms</Text>{'\n'}
          By accessing or using the website of Vytalyou - a brand by CBPB DIAGNOSTIC SERVICES PRIVATE LIMITED - including any services, content, reports, diagnostic testing, wellness therapies, or longevity programs offered through the platform, the user agrees to comply with and be bound by these Terms and Conditions.{'\n\n'}
          If you do not agree with these terms, you are advised not to use this website or its services.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>2. Informational and Educational Purpose</Text>{'\n'}
          The information provided on the Vytalyou website is intended for educational and informational purposes only and should not be considered a substitute for professional medical advice, diagnosis, or treatment.{'\n\n'}
          Users are encouraged to consult qualified healthcare professionals before making health-related decisions.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>3. Diagnostic and Wellness Services</Text>{'\n'}
          Vytalyou may provide services including but not limited to:{'\n'}
          • Diagnostic testing{'\n'}
          • Longevity assessments{'\n'}
          • Biological age analysis{'\n'}
          • Genomic and biomarker-based evaluations{'\n'}
          • IV nutrient therapies{'\n'}
          • Preventive health consultations{'\n'}
          • Wellness and lifestyle programs{'\n\n'}
          These services are intended to support preventive health and wellness and are not a substitute for medical treatment or emergency care.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>4. IV Nutrient Therapy</Text>{'\n'}
          The IV therapies offered by Vytalyou contain vitamins, minerals, amino acids, antioxidants, and other nutraceutical compounds intended to support general wellness.{'\n\n'}
          These components are nutraceuticals and nutritional supplements and are not classified as prescription drugs under Schedule H or Schedule X of the Drugs and Cosmetics Act, 1940 (India).{'\n\n'}
          IV therapies are provided for wellness support and are not intended to diagnose, treat, cure, or prevent specific diseases.{'\n\n'}
          Individual responses to therapies may vary.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>5. Biological Age and Longevity Assessments</Text>{'\n'}
          Biological age assessments provided by Vytalyou are derived from biomarkers, health indicators, and analytical models used in longevity research.{'\n\n'}
          These assessments represent estimated physiological aging trends and should not be interpreted as definitive medical diagnoses.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>6. User Responsibility</Text>{'\n'}
          Users of the website acknowledge that any reliance on the information provided by Vytalyou is solely at their own risk.{'\n\n'}
          Users are responsible for ensuring that any health-related decisions are made in consultation with appropriate healthcare professionals.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>7. Refunds and Cancellations</Text>{'\n'}
          Payments made for services such as diagnostic tests, consultations, IV therapies, or wellness programs may be subject to refund and cancellation policies published on the website.{'\n\n'}
          Once diagnostic testing has been performed, samples processed, reports generated, or therapies administered, refunds may not be applicable.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>8. Limitation of Liability</Text>{'\n'}
          Vytalyou shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of the website, services, diagnostic testing, wellness therapies, or any information provided.{'\n\n'}
          The content, services, and information provided on this website are offered at the sole discretion of Vytalyou and may be modified, updated, or withdrawn without prior notice.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>9. Indemnification</Text>{'\n'}
          By using this website, the user agrees to indemnify and hold harmless Vytalyou, its founders, employees, partners, and affiliates from any claims, liabilities, damages, or legal actions arising in connection with the use of diagnostic testing, wellness therapies, longevity services, or any information provided thereof.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>10. Intellectual Property</Text>{'\n'}
          All content on the Vytalyou website, including text, branding, reports, graphics, images, and materials, is the intellectual property of Vytalyou and may not be copied, reproduced, or distributed without prior written permission.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>11. Privacy</Text>{'\n'}
          User data collected through the website will be handled in accordance with the Vytalyou Privacy Policy and applicable data protection regulations.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>12. Jurisdiction</Text>{'\n'}
          These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India.{'\n\n'}
          Any disputes arising from the use of the website or services provided by Vytalyou shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundNavy,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 2,
  },
  paragraph: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  bold: {
    fontWeight: fontWeights.bold as any,
    color: colors.accentAqua,
    fontSize: fontSizes.body + 2,
  },
});
