import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {AppTabs} from './AppTabs';
import {AuthStack} from './AuthStack';
import {getOnboardingCompleted} from '../utils/onboardingStorage';
import {AuthProvider, useAuth} from '../utils/authContext';
import {colors} from '../theme/colors';
import {SplashScreen} from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

const RootNavigatorContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompletedState] = useState(false);
  const {loading: authLoading} = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Run onboarding check
      const completed = await getOnboardingCompleted();
      setOnboardingCompletedState(completed);
      setLoading(false);
    };
    init();
  }, []);

  const handleFinished = () => {
    setOnboardingCompletedState(true);
  };

  const appReady = !loading && !authLoading;

  if (!splashDone) {
    return <SplashScreen isAppReady={appReady} onFinish={() => setSplashDone(true)} />;
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


