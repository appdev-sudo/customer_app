import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HyperbaricOxygenTherapyScreen} from '../screens/HyperbaricOxygenTherapyScreen';
import {ServiceDetailScreen} from '../screens/ServiceDetailScreen';
import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';
import type {ServiceDetailParam} from '../types/serviceDetail';

export type HyperbaricOxygenStackParamList = {
  HyperbaricMain: undefined;
  ServiceDetail: {detail: ServiceDetailParam};
};

const Stack = createNativeStackNavigator<HyperbaricOxygenStackParamList>();

export const HyperbaricOxygenStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.backgroundNavy},
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {fontFamily: fonts.primary},
      }}>
      <Stack.Screen
        name="HyperbaricMain"
        component={HyperbaricOxygenTherapyScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={({route}) => ({title: (route.params as {detail: ServiceDetailParam}).detail?.title ?? 'Details'})}
      />
    </Stack.Navigator>
  );
};
