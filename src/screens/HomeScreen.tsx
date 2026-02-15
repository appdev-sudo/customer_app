import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getServices} from '../api/client';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import type {HomeStackParamList} from '../navigation/HomeStack';
import type {LongevityPackage} from '../types/longevity';
import type {MedicalServiceItem} from '../types/serviceDetail';
import {MedicalServiceCard} from '../components/MedicalServiceCard';
import {ProfileIcon} from '../components/ProfileIcon';

const {width} = Dimensions.get('window');

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

/** Longevity packages from Image 2 (Longevity Subscriptions section) */
const LONGEVITY_PACKAGES: LongevityPackage[] = [
  {
    id: 'longevity-protocol',
    title: 'Longevity Protocol',
    duration: '6-month total transformation',
    idealFor:
      'Ideal For: For those who want to operate at their highest physical and mental potential, while proactively protecting their health for the decades ahead.',
    bullets: [
      'Comprehensive Pre-therapy diagnostics',
      '20 customised IV drip sessions',
      'Post-therapy evaluation',
    ],
    hasFounding100: true,
  },
  {
    id: 'rejuvenation-protocol',
    title: 'Rejuvenation Protocol',
    duration: '2-month Rejuvenation',
    idealFor:
      'Ideal for: Fatigue, metabolic reset, energy and recovery optimisation.',
    bullets: [
      'Comprehensive Pre-therapy diagnostics',
      '12 customised IV drip sessions',
      'Post-therapy evaluation',
    ],
  },
  {
    id: 'foundation-programme',
    title: 'Foundation Programme',
    duration: '35-day introduction to longevity medicine',
    idealFor: 'Ideal for: First-time preventive health seekers.',
    bullets: [
      'Pre-therapy diagnostics (excluding Genomics)',
      '4 customised IV drip sessions',
      '1 VytalYou IV drip',
    ],
  },
  {
    id: 'anti-hangover-drip',
    title: 'Anti-Hangover Drip',
    duration: 'Hangover & Recovery Drips - For before or after social events',
    bullets: ['1 VytalYou PowerHouse IV drip'],
  },
];

/** Healthcare services for home carousel (Image 1 – "Healthcare Services at your Doorstep") */
type HomeService = {id: string; title: string; icon: any};
const HOME_SERVICES: HomeService[] = [
  {id: 'lab-tests', title: 'Lab Tests', icon: require('../assets/icons/pathology.png')},
  {id: 'weight-loss', title: 'Weight Loss Program', icon: require('../assets/icons/bio.png')},
  {id: 'iv-therapy', title: 'IV Therapy', icon: require('../assets/icons/saline-drip.png')},
  {id: 'newborn-care', title: 'Newborn Care & Babysitting', icon: require('../assets/icons/endocrine.png')},
  {id: 'food-intolerance', title: 'Food Intolerance Test', icon: require('../assets/icons/dna.png')},
  {id: 'doctor-on-call', title: 'Doctor on Call', icon: require('../assets/icons/ecg-machine.png')},
  {id: 'sexual-health', title: 'Sexual Health', icon: require('../assets/icons/dna.png')},
  {id: 'create-test', title: 'Create your own test', icon: require('../assets/icons/pathology.png')},
  {id: 'doctor-guided', title: 'Doctor-guided', icon: require('../assets/icons/ecg-machine.png')},
];

const CONSULTATION_WHATSAPP = 'https://wa.me/919967526793';
const AUTO_SLIDE_INTERVAL = 2000;
const SERVICE_CARD_MARGIN = spacing.md;
const SERVICE_ITEM_WIDTH = 120 + SERVICE_CARD_MARGIN;

/** FAQ items from index.php (SECTION 9) */
const FAQ_ITEMS: {q: string; a: string}[] = [
  {
    q: 'Is VytalYou like a regular IV clinic?',
    a: 'No. VytalYou is a medically supervised longevity clinic that combines diagnostics, clinical consultations, and personalised IV therapy under one roof.',
  },
  {
    q: 'Are VytalYou IV drips safe for me?',
    a: 'Yes. All clients undergo detailed medical assessments and consultations to ensure safety before starting therapy.',
  },
  {
    q: 'Are there any side effects of VytalYou IV drips?',
    a: 'When administered under medical supervision using certified products, IV drips are generally well tolerated. Continuous monitoring is maintained during and after sessions.',
  },
  {
    q: 'How soon can I see results?',
    a: 'Many clients experience improved energy and mental clarity within 6–12 hours. Deeper benefits such as metabolic improvement and rejuvenation occur gradually and are long-lasting.',
  },
  {
    q: 'Do VytalYou drips help with de-addiction or hangovers?',
    a: 'Yes. Certain formulations support liver recovery, hydration, and nutrient replenishment, and are commonly used for hangover recovery and detox support.',
  },
  {
    q: 'How long does a session take?',
    a: 'NAD+ infusions may take up to 3 hours. Other personalised drips typically take 15–30 minutes.',
  },
];

/** IV Drips: loaded from API; static list kept as fallback only (unused when API succeeds) */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IV_DRIP_SERVICES_FALLBACK: MedicalServiceItem[] = [
  {
    id: 'complete-recode',
    title: 'The Complete Recode',
    subtitle: 'Comprehensive Cellular Rejuvenation',
    shortDescription: '20 IV Sessions · 6 Months',
    price: '₹2,49,000',
    sessionInfo: '20 IV Sessions • 6 Months',
    tagline: 'The Definitive Longevity & Cellular Reset',
    image: require('../assets/images/Website_banner_2.jpg'),
    sections: [
      {
        title: 'A. Pre-Therapy Routine Health Check',
        items: [
          'Ultrasound Abdomen',
          'Chest X-Ray',
          '2D Echocardiogram',
          'ECG',
          'Genetic Test',
          'Complete Blood Profile',
          'Body Composition Evaluation',
        ],
      },
      {
        title: 'B. 20 Precision IV Therapy Sessions',
        items: [
          'Phase I (First 2 Months)',
          '6 NAD+ sessions',
          '6 Vytalyou Cocktail',
        ],
      },
      {
        title: 'C. Post-Therapy Routine Health Check',
        items: [
          'Ultrasound Abdomen',
          'Complete Blood Profile',
          'Body Composition Evaluation',
        ],
      },
    ],
  },
  {
    id: 'renewal-series',
    title: 'The Renewal Series',
    subtitle: 'Focused Rejuvenation & Renewal',
    shortDescription: '12 IV Sessions · 2 Months',
    price: '₹1,49,000',
    sessionInfo: '12 IV Sessions • 2 Months',
    tagline: 'Targeted Longevity Rejuvenation',
    image: require('../assets/images/Website_banner_2.jpg'),
    sections: [
      {
        title: 'A. Pre-Therapy Routine Health Check',
        items: [
          'Ultrasound Abdomen',
          'Chest X-Ray',
          '2D Echocardiogram',
          'ECG',
          'Genetic Test',
          'Complete Blood Profile',
          'Body Composition Evaluation',
        ],
      },
      {
        title: 'B. 12 Precision IV Therapy Sessions',
        items: [
          'Phase I (First 2 Months)',
          '6 NAD+ sessions',
          '6 Vytalyou Cocktail',
        ],
      },
      {
        title: 'C. Post-Therapy Routine Health Check',
        items: [
          'Ultrasound Abdomen',
          'Complete Blood Profile',
          'Body Composition Evaluation',
        ],
      },
    ],
  },
  {
    id: 'starter-evolution',
    title: 'The Starter Evolution',
    subtitle: 'Introductory Longevity Boost',
    shortDescription: '4 IV Sessions · 35 Days',
    price: '₹75,000',
    sessionInfo: '4 IV Sessions • 35 Days',
    tagline: 'A Taste of Cellular Revitalization',
    image: require('../assets/images/Website_banner_2.jpg'),
    sections: [
      {
        title: 'A. Pre-Therapy Routine Health Check',
        items: [
          'Ultrasound Abdomen',
          'Chest X-Ray',
          '2D Echocardiogram',
          'ECG',
          'Genetic Test',
          'Complete Blood Profile',
          'Body Composition Evaluation',
        ],
      },
      {
        title: 'B. 4 Precision IV Therapy Sessions',
        items: [
          'Phase I 10 – 35 Days',
          '3 NAD+ sessions',
          '1 Vytalyou Cocktail',
        ],
      },
      {
        title: 'C. Post-Therapy Routine Health Check',
        items: [
          'Ultrasound Abdomen',
          'Complete Blood Profile',
          'Body Composition Evaluation',
        ],
      },
    ],
  },
  {
    id: 'femme-strong',
    title: 'Femme Strong',
    shortDescription: 'IV therapy tailored for women’s wellness and strength.',
    fullDescription:
      'Femme Strong is an IV therapy formulation tailored for women’s wellness, energy, and strength. It supports hormonal balance, recovery, and overall vitality. Sessions are personalised based on your diagnostics and goals.',
    image: require('../assets/icons/saline-drip.png'),
    bullets: [
      'Tailored for women’s wellness',
      'Supports energy and recovery',
      'Personalised based on your profile',
    ],
  },
  {
    id: 'endurance',
    title: 'Endurance',
    shortDescription: 'IV support for stamina, recovery and sustained performance.',
    fullDescription:
      'Endurance is an IV formulation designed to support stamina, recovery, and sustained physical and mental performance. Ideal for athletes and anyone seeking better endurance and faster recovery.',
    image: require('../assets/icons/saline-drip.png'),
    bullets: [
      'Stamina and sustained performance',
      'Faster recovery',
      'Athlete-friendly formulation',
    ],
  },
  {
    id: 'alpha-athlete',
    title: 'Alpha Athlete',
    shortDescription: 'Peak performance IV support for athletes.',
    fullDescription:
      'Alpha Athlete is our peak-performance IV support for athletes. It combines targeted micronutrients and NAD+ support to optimise performance, recovery, and cellular repair — all under medical supervision.',
    image: require('../assets/icons/saline-drip.png'),
    bullets: [
      'Peak performance support',
      'Recovery and cellular repair',
      'Medical supervision',
    ],
  },
];

/** How It Works steps from index.php (SECTION 7) */
const HOW_IT_WORKS = [
  { step: 1, title: 'Consultation', desc: 'We understand your goals, concerns, lifestyle, and symptoms.' },
  { step: 2, title: 'Full Body Checks', desc: '2,400+ data points through Radiology, Pathology, Genomics, Cardiac and Body Composition assessments.' },
  { step: 3, title: 'Medical Interpretation', desc: 'Expert doctors analyse your complete biological profile.' },
  { step: 4, title: 'Personalized IV Drip Protocol', desc: 'Targeted micronutrient and NAD+ infusions.' },
  { step: 5, title: 'Optimization & Review', desc: 'We monitor your body and continuously optimise your infusions.' },
];

export const HomeScreen: React.FC<Props> = ({navigation}) => {
  const longevityRef = useRef<FlatList<LongevityPackage>>(null);
  const servicesRef = useRef<FlatList<HomeService>>(null);
  const [longevityIndex, setLongevityIndex] = useState(0);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const servicesOffsetRef = useRef(0);
  const [ivDripServices, setIvDripServices] = useState<MedicalServiceItem[]>([]);
  const [ivDripsLoading, setIvDripsLoading] = useState(true);
  const [ivDripsError, setIvDripsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getServices('iv_drips')
      .then(data => { if (!cancelled) setIvDripServices(data); })
      .catch(err => { if (!cancelled) setIvDripsError(err?.message ?? 'Failed to load IV drips'); })
      .finally(() => { if (!cancelled) setIvDripsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const next = (longevityIndex + 1) % LONGEVITY_PACKAGES.length;
      setLongevityIndex(next);
      longevityRef.current?.scrollToOffset({
        offset: next * width,
        animated: true,
      });
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, [longevityIndex]);

  useEffect(() => {
    const maxOffset = Math.max(
      0,
      HOME_SERVICES.length * SERVICE_ITEM_WIDTH - (width - spacing.xl * 2)
    );
    const t = setInterval(() => {
      const next = servicesOffsetRef.current + SERVICE_ITEM_WIDTH;
      if (next >= maxOffset) {
        servicesOffsetRef.current = 0;
        servicesRef.current?.scrollToOffset({ offset: 0, animated: true });
      } else {
        servicesOffsetRef.current = next;
        servicesRef.current?.scrollToOffset({ offset: next, animated: true });
      }
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, []);

  const handleBookConsultation = async () => {
    const canOpen = await Linking.canOpenURL(CONSULTATION_WHATSAPP);
    if (canOpen) Linking.openURL(CONSULTATION_WHATSAPP);
  };

  const renderLongevityCard = ({item}: {item: LongevityPackage}) => (
    <View style={styles.longevitySlide}>
      <View style={styles.longevityCard}>
        <View style={styles.longevityLeft}>
          <Text style={styles.longevityTitle}>{item.title}</Text>
          <Text style={styles.longevityDuration}>{item.duration}</Text>
          <View style={styles.cardButtons}>
            <Pressable
              onPress={() => navigation.navigate('LongevityPackageDetails', {pkg: item})}
              style={styles.enquireButton}>
              <Text style={styles.enquireButtonText}>Enquire Now</Text>
            </Pressable>
            
          </View>
        </View>
        <View style={styles.longevityRight}>
          <Image
            source={require('../assets/images/Website_banner_2.jpg')}
            style={styles.longevityImage as ImageStyle}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Top bar – search left, logo right */}
      <View style={styles.topBar}>
        <View style={styles.searchBarWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search services..."
            placeholderTextColor="rgba(255,255,255,0.45)"
          />
        </View>
        <View style={styles.topBarRight}>
          <Image
            source={require('../assets/images/logo-03.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ProfileIcon onPress={() => navigation.navigate('Profile')} />
        </View>
      </View>

      {/* Hero – bordered box, text left, image right (like carousel) */}
      {/* <View style={styles.heroBox}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>Decode Health.{'\n'}Measure Wellness.{'\n'}Redesign Your Biology.</Text>
          <Text style={styles.heroSub}>India's first preventive longevity centre · Doctor-supervised</Text>
          <Pressable onPress={handleBookConsultation} style={styles.heroCta}>
            <Text style={styles.heroCtaText}>Book free consultation</Text>
          </Pressable>
        </View>
        <View style={styles.heroRight}>
          <Image
            source={require('../assets/images/Website_banner_2.jpg')}
            style={styles.heroImage as ImageStyle}
            resizeMode="cover"
          />
        </View>
      </View> */}

      {/* <View style={styles.sectionDividerLine} /> */}

      {/* Longevity */}
      {/* <Text style={styles.whySub}>Because longevity starts with understanding you</Text>
      <Text style={styles.sectionTitle}>Longevity Subscriptions</Text>
      <View style={styles.carouselWrap}>
        <FlatList
          ref={longevityRef}
          data={LONGEVITY_PACKAGES}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderLongevityCard}
          onMomentumScrollEnd={e => {
            const i = Math.round(e.nativeEvent.contentOffset.x / width);
            setLongevityIndex(i);
          }}
        />
      </View> */}

      {/* <View style={styles.dots}>
        {LONGEVITY_PACKAGES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === longevityIndex && styles.dotActive]}
          />
        ))}
      </View> */}

      {/* IV Drips — from API */}
      <Text style={styles.sectionTitle}>IV Drips</Text>
      {ivDripsLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.accentAqua} />
          <Text style={styles.loadingText}>Loading IV drips...</Text>
        </View>
      ) : ivDripsError ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{ivDripsError}</Text>
          <Pressable
            onPress={() => {
              setIvDripsError(null);
              setIvDripsLoading(true);
              getServices('iv_drips')
                .then(setIvDripServices)
                .catch(e => setIvDripsError(e?.message ?? 'Failed to load'))
                .finally(() => setIvDripsLoading(false));
            }}
            style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        ivDripServices.map(item => (
          <MedicalServiceCard
            key={item.id}
            item={item}
            onKnowMore={() =>
              navigation.navigate('ServiceDetail', {
                detail: {
                  id: item.id,
                  title: item.title,
                  subtitle: item.subtitle,
                  fullDescription: item.fullDescription,
                  bullets: item.bullets,
                  image: item.image,
                  price: item.price,
                  sessionInfo: item.sessionInfo,
                  tagline: item.tagline,
                  sections: item.sections,
                },
              })
            }
          />
        ))
      )}

      <View style={styles.sectionDividerLine} />

      {/* Services */}
      <Text style={styles.sectionLabel}>Services</Text>
      <Text style={styles.servicesSectionTitle}>Our Medical Services</Text>
      <Text style={styles.servicesIntro}>A complete diagnostic ecosystem to prevent disease and optimise longevity.</Text>
      <View style={styles.servicesCarouselWrap}>
        <FlatList
          ref={servicesRef}
          data={HOME_SERVICES}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesCarouselContent}
          onMomentumScrollEnd={e => {
            servicesOffsetRef.current = e.nativeEvent.contentOffset.x;
          }}
          renderItem={({item}) => (
            <View style={styles.serviceCard}>
              <View style={styles.serviceIconWrap}>
                <Image source={item.icon} style={styles.serviceIcon as ImageStyle} resizeMode="contain" />
              </View>
              <Text style={styles.serviceCardTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          )}
        />
      </View>
      <Text style={styles.servicesOutro}>We turn complex data into a clear direction and infuse longevity.</Text>

      <View style={styles.sectionDividerLine} />

      {/* About */}
      <Text style={styles.sectionLabel}>About</Text>
      <Text style={styles.aboutTitle}>Prevent illness before symptoms appear</Text>
      <Text style={styles.aboutPara}>
        VytalYou is India's first measurable longevity clinic. We collect 2,400+ clinically relevant data points through Radiology, Pathology, Genomics, Cardiac Evaluation, Body Composition Analysis, and early cancer risk screening — a complete internal map of your health.
      </Text>

      {/* Wellness + Promise — minimal stacked */}
      <Text style={styles.sectionLabel}>Wellness</Text>
      <Text style={styles.wellnessTitle}>Your Personalised Plan</Text>
      <Text style={styles.wellnessBullet}>Personalized VytalYou IV drip</Text>
      <Text style={styles.wellnessBullet}>NAD+ therapy for cellular repair</Text>
      <Text style={styles.wellnessBullet}>Targeted IV micronutrients</Text>
      <Text style={styles.wellnessBullet}>Diagnostic-based guidance</Text>
      <View style={styles.promiseBlock}>
        <Text style={styles.promiseTitle}>We transform you into your most optimized, high-performing, long-living self.</Text>
        <Text style={styles.promiseText}>This is how we add years to your life.</Text>
      </View>

      <View style={styles.sectionDividerLine} />

      {/* Centre */}
      <Text style={styles.sectionLabel}>Centre</Text>
      <Text style={styles.centreTitle}>Inside the VytalYou Centre</Text>
      <Text style={styles.centreDesc}>A premium, medically supervised environment for safety, precision and comfort.</Text>

      {/* How It Works */}
      <Text style={styles.sectionLabel}>Process</Text>
      <Text style={styles.processTitle}>How it works</Text>
      {HOW_IT_WORKS.map(({ step, title, desc }) => (
        <View key={step} style={styles.processRow}>
          <Text style={styles.processNum}>{step}</Text>
          <View style={styles.processContent}>
            <Text style={styles.processCardTitle}>{title}</Text>
            <Text style={styles.processCardDesc}>{desc}</Text>
          </View>
        </View>
      ))}
      {/* Doctors — minimal */}
      {/* <Text style={styles.sectionLabel}>Team</Text>
      <Text style={styles.doctorsTitle}>Meet the doctors</Text>
      <View style={styles.doctorRow}>
        <Text style={styles.doctorName}>Dr. Chirantan Bose MD</Text>
        <Text style={styles.doctorRole}>Molecular Oncologist · Preventive Health Specialist</Text>
      </View>
      <View style={styles.doctorDivider} />
      <View style={styles.doctorRow}>
        <Text style={styles.doctorName}>Dr. Preetesh Bhandari MD</Text>
        <Text style={styles.doctorRole}>Radiologist · Preventive Health Specialist</Text>
      </View>
      <Text style={styles.doctorsTagline}>Your longevity supervised end-to-end by expert doctors.</Text> */}

      {/* FAQ — minimal */}
      <Text style={styles.sectionLabel}>FAQ</Text>
      {/* <Text style={styles.faqTitle}>Frequently asked questions</Text> */}
      {FAQ_ITEMS.map((item, i) => (
        <Pressable
          key={i}
          onPress={() => setExpandedFaqIndex(expandedFaqIndex === i ? null : i)}
          style={[styles.faqItem, expandedFaqIndex === i && styles.faqItemOpen]}>
          <Text style={styles.faqQuestion}>{item.q}</Text>
          {expandedFaqIndex === i && <Text style={styles.faqAnswer}>{item.a}</Text>}
        </Pressable>
      ))}

      <View style={styles.sectionDividerLine} />
      <Pressable onPress={handleBookConsultation} style={styles.bookConsultButton}>
        <Text style={styles.bookConsultText}>Book free consultation</Text>
      </Pressable>
    </ScrollView>
  );
};

const CARD_WIDTH = width - spacing.xl * 3;
const SERVICE_CARD_WIDTH = 120;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundNavy,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl + spacing.sm,
    paddingTop: spacing.xl,
    paddingBottom: spacing.section + spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    paddingHorizontal: spacing.md,
    marginRight: spacing.md,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
    opacity: 0.7,
  },
  searchBarInput: {
    flex: 1,
    fontFamily: fonts.primary,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  logo: {
    width: 120,
    height: 38,
    opacity: 0.95,
  },
  heroBox: {
    flexDirection: 'row',
    height: 170,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  heroLeft: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  heroRight: {
    width: 100,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  heroTitle: {
    fontFamily: fonts.primary,
    fontSize: 15,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  heroPara: {
    fontFamily: fonts.primary,
    fontSize: 11,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.85,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  heroSub: {
    fontFamily: fonts.primary,
    fontSize: 10,
    color: colors.textPrimary,
    opacity: 0.6,
    marginBottom: spacing.sm,
  },
  heroCta: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.backgroundWhite,
  },
  heroCtaText: {
    fontFamily: fonts.primary,
    fontSize: 11,
    fontWeight: fontWeights.medium as any,
    color: colors.backgroundNavy,
  },
  sectionDividerLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: spacing.sm,
  },
  sectionLabel: {
    fontFamily: fonts.primary,
    fontSize: 11,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    opacity: 0.5,
    letterSpacing: 2,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  aboutTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  aboutPara: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.75,
    lineHeight: 22,
    marginBottom: spacing.section,
  },
  wellnessTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  wellnessBullet: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    color: colors.textPrimary,
    opacity: 0.8,
    marginBottom: spacing.sm,
    paddingLeft: spacing.lg,
  },
  promiseBlock: {
    marginTop: spacing.lg,
    paddingLeft: spacing.lg,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(77, 214, 255, 0.35)',
    paddingVertical: spacing.sm,
  },
  promiseTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.accentAqua,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  promiseText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    color: colors.textPrimary,
    opacity: 0.7,
  },
  whySub: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    color: colors.textPrimary,
    textAlign: 'center',
    opacity: 0.65,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  carouselWrap: {
    height: 200,
  },
  longevitySlide: {
    width,
    paddingHorizontal: spacing.xs,
    alignItems: 'flex-start',
  },
  longevityCard: {
    flexDirection: 'row',
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  longevityLeft: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  longevityRight: {
    width: 100,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  longevityImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  longevityTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.accentAqua,
    marginBottom: spacing.xs,
  },
  longevityDuration: {
    fontFamily: fonts.primary,
    fontSize: 12,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.7,
    marginBottom: spacing.sm,
  },
  cardButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  enquireButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(77, 214, 255, 0.4)',
  },
  enquireButtonText: {
    fontFamily: fonts.primary,
    fontSize: 12,
    fontWeight: fontWeights.medium as any,
    color: colors.accentCyan,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 14,
    backgroundColor: 'rgba(77, 214, 255, 0.8)',
  },
  giftTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.lg,
    opacity: 0.85,
  },
  bookConsultButton: {
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  bookConsultText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
  },
  servicesSectionTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  servicesIntro: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    color: colors.textPrimary,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  servicesOutro: {
    fontFamily: fonts.primary,
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
    opacity: 0.6,
    marginTop: spacing.lg,
    marginBottom: spacing.section,
  },
  centreTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  centreDesc: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    color: colors.textPrimary,
    opacity: 0.65,
    lineHeight: 20,
    marginBottom: spacing.section,
  },
  processTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  processRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  processNum: {
    fontFamily: fonts.primary,
    fontSize: 14,
    fontWeight: fontWeights.semibold as any,
    color: colors.accentCyan,
    width: 24,
    marginRight: spacing.md,
  },
  processContent: {
    flex: 1,
  },
  processCardTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  processCardDesc: {
    fontFamily: fonts.primary,
    fontSize: 12,
    color: colors.textPrimary,
    opacity: 0.7,
    lineHeight: 18,
  },
  doctorsTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  doctorRow: {
    paddingVertical: spacing.sm,
  },
  doctorDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: spacing.sm,
  },
  doctorName: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
  },
  doctorRole: {
    fontFamily: fonts.primary,
    fontSize: 12,
    color: colors.textPrimary,
    opacity: 0.6,
    marginTop: 2,
  },
  doctorsTagline: {
    fontFamily: fonts.primary,
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.section,
    opacity: 0.65,
    lineHeight: 20,
  },
  faqTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  faqItem: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  faqItemOpen: {
    paddingBottom: spacing.md,
  },
  faqQuestion: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    opacity: 0.9,
  },
  faqAnswer: {
    fontFamily: fonts.primary,
    fontSize: 12,
    color: colors.textPrimary,
    opacity: 0.7,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  servicesCarouselWrap: {
    height: 160,
  },
  servicesCarouselContent: {
    paddingRight: spacing.xl,
  },
  serviceCard: {
    width: SERVICE_CARD_WIDTH,
    marginRight: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  serviceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(14, 37, 61, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  serviceIcon: {
    width: 28,
    height: 28,
  },
  serviceCardTitle: {
    fontFamily: fonts.primary,
    fontSize: 11,
    fontWeight: fontWeights.medium as any,
    color: colors.backgroundNavy,
    textAlign: 'center',
    opacity: 0.9,
  },
  ivDripsStrikethrough: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular as any,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    opacity: 0.7,
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
  retryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accentAqua,
  },
  retryButtonText: {
    fontFamily: fonts.primary,
    fontSize: 12,
    fontWeight: fontWeights.medium as any,
    color: colors.accentAqua,
  },
});
