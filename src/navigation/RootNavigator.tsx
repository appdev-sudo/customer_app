import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {AppTabs} from './AppTabs';
import {getOnboardingCompleted} from '../utils/onboardingStorage';
import {colors} from '../theme/colors';

export const RootNavigator: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompletedState] = useState(false);

  useEffect(() => {
    (async () => {
      const completed = await getOnboardingCompleted();
      setOnboardingCompletedState(completed);
      setLoading(false);
    })();
  }, []);

  const handleFinished = () => {
    setOnboardingCompletedState(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentAqua} />
      </View>
    );
  }

  if (!onboardingCompleted) {
    return <OnboardingScreen onFinished={handleFinished} />;
  }

  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.backgroundNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

