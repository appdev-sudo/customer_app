import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RedLightTherapyScreen} from '../screens/RedLightTherapyScreen';
import {ServiceDetailScreen} from '../screens/ServiceDetailScreen';
import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';
import type {ServiceDetailParam} from '../types/serviceDetail';

export type RedLightTherapyStackParamList = {
  RedLightMain: undefined;
  ServiceDetail: {detail: ServiceDetailParam};
};

const Stack = createNativeStackNavigator<RedLightTherapyStackParamList>();

export const RedLightTherapyStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.backgroundNavy},
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {fontFamily: fonts.primary},
      }}>
      <Stack.Screen
        name="RedLightMain"
        component={RedLightTherapyScreen}
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
