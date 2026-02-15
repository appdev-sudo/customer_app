import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PhoneAuthScreen} from '../screens/PhoneAuthScreen';
import {OTPVerificationScreen} from '../screens/OTPVerificationScreen';
import {UserProfileScreen} from '../screens/UserProfileScreen';
import {colors} from '../theme/colors';

const Stack = createNativeStackNavigator();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundNavy,
        },
        headerTintColor: colors.accentAqua,
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="PhoneAuth"
        component={PhoneAuthScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: 'Profile',
          headerLeft: () => null, // Prevent going back
        }}
      />
    </Stack.Navigator>
  );
};
