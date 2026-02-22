import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Image, Text, Animated, Dimensions} from 'react-native';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';

const {width} = Dimensions.get('window');

interface Props {
  isAppReady: boolean;
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({isAppReady, onFinish}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; 
    const translateAnim = useRef(new Animated.Value(20)).current;
    const [animFinished, setAnimFinished] = React.useState(false);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.timing(translateAnim, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]).start(() => setAnimFinished(true));
    }, []);

    useEffect(() => {
        if (animFinished && isAppReady) {
            // Optional delay if app loads too fast, to let the user see the logo
            const timeout = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }).start(onFinish);
            }, 500); 
            return () => clearTimeout(timeout);
        }
    }, [animFinished, isAppReady]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/logo-03.png')}
        style={[styles.logo, {opacity: fadeAnim, transform: [{translateY: translateAnim}]}]}
        resizeMode="contain"
      />
      <Animated.View style={[styles.taglineContainer, {opacity: fadeAnim, transform: [{translateY: translateAnim}]}]}>
        <Text style={styles.tagline}>Decode Health. Measure Wellness.</Text>
        <Text style={styles.tagline}>Redesign Your Biology.</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundNavy,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logo: {
    width: width * 0.6,
    height: 100,
    marginBottom: spacing.xxl,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.accentAqua,
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
});
