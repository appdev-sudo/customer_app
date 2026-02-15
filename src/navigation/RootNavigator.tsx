import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {AppTabs} from './AppTabs';
import {AuthStack} from './AuthStack';
import {getOnboardingCompleted} from '../utils/onboardingStorage';
import {AuthProvider, useAuth} from '../utils/authContext';
import {colors} from '../theme/colors';

const Stack = createNativeStackNavigator();

const RootNavigatorContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompletedState] = useState(false);
  const {loading: authLoading} = useAuth();

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

  if (loading || authLoading) {
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
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="AppTabs" component={AppTabs} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <AuthProvider>
      <RootNavigatorContent />
    </AuthProvider>
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
