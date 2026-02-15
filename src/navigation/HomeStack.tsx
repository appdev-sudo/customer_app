import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/HomeScreen';
import {
  LongevityPackageDetailsScreen,
} from '../screens/LongevityPackageDetailsScreen';
import {ServiceDetailScreen} from '../screens/ServiceDetailScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {ProfileIcon} from '../components/ProfileIcon';
import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';
import type {LongevityPackage} from '../types/longevity';
import type {ServiceDetailParam} from '../types/serviceDetail';

export type HomeStackParamList = {
  HomeMain: undefined;
  LongevityPackageDetails: {pkg: LongevityPackage};
  ServiceDetail: {detail: ServiceDetailParam};
  BookAppointment: {serviceId: string; serviceTitle: string};
  AddAddress: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.backgroundNavy},
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {fontFamily: fonts.primary},
      }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={({navigation}) => ({
          headerShown: false,
          headerRight: () => (
            <ProfileIcon onPress={() => navigation.navigate('Profile')} />
          ),
        })}
      />
      <Stack.Screen
        name="LongevityPackageDetails"
        component={LongevityPackageDetailsScreen}
        options={{title: 'Longevity Subscriptions'}}
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
