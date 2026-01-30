import React, {useCallback, useRef, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import {OnboardingSlide} from '../components/OnboardingSlide';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {setOnboardingCompleted} from '../utils/onboardingStorage';

const {width} = Dimensions.get('window');

type Slide = {
  key: string;
  title: string;
  description: string;
};

// Slide content taken directly from website copy.
// Source: hero section headline & subtext (index.php L61-L63, L79-L83).
const SLIDES: Slide[] = [
  {
    key: 'hero',
    title: 'Decode Health. Measure Wellness.',
    description:
      'Redesign Your Biology. We add years to your life through preventive science and personalized IV therapy. India’s first preventive longevity centre. Doctor-supervised | Medical-grade diagnostics.',
  },
  // Source: About section heading & paragraph (index.php L98-L113).
  {
    key: 'about',
    title: 'Prevent illness Before Symptoms Appear',
    description:
      'VytalYou is India’s first measurable longevity clinic, focused on enhancing long-term health and vitality. We collect 2,400+ clinically relevant data points from your body to create a complete internal map of your health.',
  },
  // Source: Precision section title & list (index.php L134-L153, L167-L169).
  {
    key: 'plan',
    title: 'Your Personalised Wellness Plan',
    description:
      'Personalized VytalYou IV drip, NAD+ therapy for cellular repair, targeted IV micronutrients, and diagnostic-based guidance. This is how we add years to your life.',
  },
  // Source: CTA section headline & subheading / button (index.php L1165-L1168, L1173-L1175).
  {
    key: 'cta',
    title: 'Take control before symptoms appear.',
    description:
      'We add years to your life. Book Consultation to begin your journey with VytalYou.',
  },
];

type Props = {
  onFinished: () => void;
};

export const OnboardingScreen: React.FC<Props> = ({onFinished}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      setCurrentIndex(index);
    },
    [],
  );

  const handleNext = useCallback(async () => {
    const isLast = currentIndex === SLIDES.length - 1;
    if (isLast) {
      await setOnboardingCompleted(true);
      onFinished();
      return;
    }
    const nextIndex = currentIndex + 1;
    listRef.current?.scrollToIndex({index: nextIndex, animated: true});
    setCurrentIndex(nextIndex);
  }, [currentIndex, onFinished]);

  const renderItem = ({item}: ListRenderItemInfo<Slide>) => (
    <View style={{width}}>
      <OnboardingSlide
        title={item.title}
        description={item.description}
        image={
          item.key === 'hero'
            ? require('../assets/images/logo-03.png')
            : require('../assets/images/Website_banner_2.jpg')
        }
      />
    </View>
  );

  return (
    <View style={styles.root}>
      <Image
        source={require('../assets/images/Website_banner_2.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={6}
      />
      <View style={styles.overlay} />
      <View style={styles.header}>
        <Image
          source={require('../assets/images/logo-03.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={SLIDES}
        keyExtractor={item => item.key}
        renderItem={renderItem}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={slide.key}
                style={[
                  styles.dot,
                  isActive && styles.dotActive,
                ]}
              />
            );
          })}
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonLabel}>
            {currentIndex === SLIDES.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundBlack,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 48, 75, 0.7)',
  },
  header: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'flex-start',
    zIndex: 2,
  },
  logo: {
    width: 140,
    height: 40,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 16,
    backgroundColor: colors.accentOrange,
  },
  button: {
    backgroundColor: colors.accentOrange,
    borderRadius: 999,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonLabel: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.backgroundBlack,
  },
});

