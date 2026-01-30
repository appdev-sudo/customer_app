import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeStack} from './HomeStack';
import {DiagnosticStack} from './DiagnosticStack';
import {RedLightTherapyStack} from './RedLightTherapyStack';
import {HyperbaricOxygenStack} from './HyperbaricOxygenStack';
import {colors} from '../theme/colors';
import {fonts, fontWeights} from '../theme/typography';

export type AppTabParamList = {
  IVDrips: undefined;
  Diagnostic: undefined;
  RedLightTherapy: undefined;
  HyperbaricOxygen: undefined;
  // Profile: undefined; // commented for now
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundNavy,
          borderTopColor: 'rgba(255,255,255,0.08)',
        },
        tabBarActiveTintColor: colors.accentAqua,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: fonts.primary,
          fontSize: 11,
          fontWeight: fontWeights.medium as any,
        },
      }}>
      <Tab.Screen
        name="IVDrips"
        component={HomeStack}
        options={{tabBarLabel: 'IV Drips'}}
      />
      <Tab.Screen
        name="Diagnostic"
        component={DiagnosticStack}
        options={{tabBarLabel: 'Diagnostic'}}
      />
      <Tab.Screen
        name="RedLightTherapy"
        component={RedLightTherapyStack}
        options={{tabBarLabel: 'Red Light'}}
      />
      <Tab.Screen
        name="HyperbaricOxygen"
        component={HyperbaricOxygenStack}
        options={{tabBarLabel: 'Hyperbaric O₂'}}
      />
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
};

