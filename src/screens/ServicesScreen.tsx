import React, {useMemo} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: any;
};

export const ServicesScreen: React.FC = () => {
  const services: Service[] = useMemo(
    () => [
      // Source: `vytalyou_website/index.php` Our Medical Services cards (L239-L316)
      {id: 'radiology', title: 'Radiology', description: 'AI-assisted ultrasound, Colour Doppler, Elastography, X-ray.', icon: require('../assets/icons/endocrine.png')},
      {id: 'pathology', title: 'Pathology', description: 'Comprehensive laboratory testing for all vital organs.', icon: require('../assets/icons/pathology.png')},
      {id: 'bca', title: 'Body Composition Analysis', description: 'Advanced technology measuring obesity, muscle mass, inflammation, and cellular age.', icon: require('../assets/icons/bio.png')},
      {id: 'genomics', title: 'Wellness Genomic Testing', description: 'DNA-based insights into health risks and longevity potential.', icon: require('../assets/icons/dna.png')},
      {id: 'cardiac', title: 'Cardiac Evaluation', description: 'ECG and 2D/3D ECHO for heart performance assessment.', icon: require('../assets/icons/ecg-machine.png')},
      {id: 'iv', title: 'Personalized IV Therapy', description: 'NAD+ and VytalYou IV drips customized based on your diagnostic data.', icon: require('../assets/icons/saline-drip.png')},
    ],
    [],
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/logo-03.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>OUR MEDICAL SERVICES</Text>
      <Text style={styles.subtitle}>
        A complete diagnostic ecosystem designed to prevent disease and optimise longevity.
      </Text>

      <FlatList
        data={services}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <Image source={item.icon} style={styles.icon} resizeMode="contain" />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundNavy,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {width: 140, height: 40},
  title: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.85,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 18,
  },
  listContent: {
    paddingBottom: spacing.xxl + 90,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  card: {
    width: '48%',
    backgroundColor: colors.backgroundWhite,
    borderRadius: 16,
    padding: spacing.lg,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(14, 37, 61, 0.10)', // derived from brand navy
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  icon: {width: 36, height: 36},
  cardTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold as any,
    color: colors.backgroundNavy,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  cardDesc: {
    fontFamily: fonts.primary,
    fontSize: 12,
    fontWeight: fontWeights.regular as any,
    color: colors.textDark,
    opacity: 0.75,
    textAlign: 'center',
    lineHeight: 16,
  },
});

