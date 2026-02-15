import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HyperbaricOxygenTherapyScreen} from '../screens/HyperbaricOxygenTherapyScreen';
import {ServiceDetailScreen} from '../screens/ServiceDetailScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';
import type {ServiceDetailParam} from '../types/serviceDetail';

export type HyperbaricOxygenStackParamList = {
  HyperbaricMain: undefined;
  ServiceDetail: {detail: ServiceDetailParam};
  BookAppointment: {serviceId: string; serviceTitle: string};
  AddAddress: undefined;
  Profile: undefined;
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
      <Stack.Screen
        name="BookAppointment"
        getComponent={() => require('../screens/BookAppointmentScreen').BookAppointmentScreen}
        options={{title: 'Book Appointment'}}
      />
      <Stack.Screen
        name="AddAddress"
        getComponent={() => require('../screens/AddAddressScreen').AddAddressScreen}
        options={{title: 'Add New Address'}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Stack.Navigator>
  );
};
