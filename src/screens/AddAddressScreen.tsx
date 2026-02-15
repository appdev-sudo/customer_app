import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {updateProfile} from '../api/profileApi';
import {useAuth} from '../utils/authContext';
import {HomeStackParamList} from '../navigation/HomeStack';

type Props = NativeStackScreenProps<HomeStackParamList, 'AddAddress'>;

export const AddAddressScreen: React.FC<Props> = ({navigation}) => {
  const {token, user, updateUser} = useAuth();
  
  const [address, setAddress] = useState({
    street: user?.location?.address?.street || '',
    landmark: user?.location?.address?.landmark || '',
    city: user?.location?.address?.city || '',
    state: user?.location?.address?.state || '',
    pincode: user?.location?.address?.pincode || '',
    country: user?.location?.address?.country || '',
    formattedAddress: user?.location?.address?.formattedAddress || '',
  });

  const [coords, setCoords] = useState({
    latitude: user?.location?.latitude || 0,
    longitude: user?.location?.longitude || 0,
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof typeof address, value: string) => {
    setAddress(prev => ({...prev, [field]: value}));
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      return true;
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need access to your location for accurate delivery.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    setLoading(true);
    
    const handleSuccess = async (position: any) => {
      const {latitude, longitude} = position.coords;
      setCoords({latitude, longitude});
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'VytalYouApp/1.0',
            },
          }
        );
        const data = await response.json();
        
        if (data && data.address) {
           setAddress({
              street: data.address.road || data.address.suburb || '',
              landmark: data.address.neighbourhood || '',
              city: data.address.city || data.address.town || data.address.village || '',
              state: data.address.state || '',
              pincode: data.address.postcode || '',
              country: data.address.country || '',
              formattedAddress: data.display_name || '',
           });
           Alert.alert('Success', 'Address fetched successfully!');
        } else {
           Alert.alert('Success', 'Location fetched, but address not found.');
        }

      } catch (err) {
        Alert.alert('Error', 'Address lookup failed.');
      }
      setLoading(false);
    };

    Geolocation.getCurrentPosition(
      handleSuccess,
      (error) => {
        if (error.code === 3 || error.code === 2) {
          Geolocation.getCurrentPosition(
            handleSuccess,
            () => {
              Alert.alert('Error', 'Could not fetch location.');
              setLoading(false);
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
          );
        } else {
          Alert.alert('Error', error.message);
          setLoading(false);
        }
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000},
    );
  };

  const handleSave = async () => {
    if (!address.street && !address.formattedAddress) {
      Alert.alert('Error', 'Please enter valid address details');
      return;
    }

    setLoading(true);
    try {
      // In a real app with multiple addresses, we'd add to array.
      // Here we update the single profile location.
      const updatedProfile = {
        name: user?.name || '',
        age: user?.age || 0,
        sex: user?.sex || 'Male',
        location: {
          ...address,
          latitude: coords.latitude,
          longitude: coords.longitude,
          address: address // Nested structure matches backend expected? 
                           // wait, backend expects location: { latitude, longitude, address: {...} }
                           // my local state `address` IS the inner address object.
                           // so I should encompass it.
        }
      };
      
      // Fix structure to match API expectation
      // API expects: { name, age, sex, location: { latitude, longitude, address: { street... } } }
      const payload = {
        name: user?.name,
        age: user?.age,
        sex: user?.sex,
        location: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            address: address
        }
      };

      if (!token) throw new Error('Not authenticated');

      const response = await updateProfile(token, payload as any);
      updateUser(response.user);
      Alert.alert('Success', 'Address saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add New Address</Text>
      
      <Pressable
        onPress={getCurrentLocation}
        style={[styles.button, { backgroundColor: colors.accentAqua, marginBottom: spacing.lg }]}>
        {loading ? <ActivityIndicator color={colors.backgroundNavy} /> : <Text style={styles.buttonText}>Auto-Detect Location</Text>}
      </Pressable>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Full Address / Building Name"
          placeholderTextColor={colors.textSecondary}
          value={address.formattedAddress}
          onChangeText={v => updateField('formattedAddress', v)}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Street / Area"
          placeholderTextColor={colors.textSecondary}
          value={address.street}
          onChangeText={v => updateField('street', v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Landmark"
          placeholderTextColor={colors.textSecondary}
          value={address.landmark}
          onChangeText={v => updateField('landmark', v)}
        />
        <View style={styles.row}>
            <TextInput
            style={[styles.input, {flex: 1}]}
            placeholder="City"
            placeholderTextColor={colors.textSecondary}
            value={address.city}
            onChangeText={v => updateField('city', v)}
            />
            <TextInput
            style={[styles.input, {flex: 1, marginLeft: 10}]}
            placeholder="Pincode"
            placeholderTextColor={colors.textSecondary}
            value={address.pincode}
            onChangeText={v => updateField('pincode', v)}
            keyboardType="number-pad"
            />
        </View>
        <TextInput
          style={styles.input}
          placeholder="State"
          placeholderTextColor={colors.textSecondary}
          value={address.state}
          onChangeText={v => updateField('state', v)}
        />
      </View>

      <Pressable onPress={handleSave} style={styles.saveButton} disabled={loading}>
        <Text style={styles.saveButtonText}>Save Address</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundNavy },
  content: { padding: spacing.xl },
  title: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  form: { gap: spacing.md },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(77, 214, 255, 0.3)',
    padding: spacing.md,
    color: colors.textPrimary,
    fontFamily: fonts.primary,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  button: {
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.backgroundNavy,
    fontWeight: 'bold',
    fontFamily: fonts.primary,
  },
  saveButton: {
    backgroundColor: colors.accentAqua,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.accentAqua,
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: fontSizes.body,
  },
});
