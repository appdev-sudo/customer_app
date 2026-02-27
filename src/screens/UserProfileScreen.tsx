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
import type {ProfileData} from '../types/auth';

type Props = NativeStackScreenProps<any, 'UserProfile'>;

export const UserProfileScreen: React.FC<Props> = ({navigation}) => {
  const {token, updateUser} = useAuth();
  
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    age: 0,
    sex: 'Male',
    // weight: 0,
    // height: 0,
    // comorbidities: [],
    // medications: [],
    location: {
      latitude: 0,
      longitude: 0,
      address: {
        street: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        formattedAddress: '',
      },
    },
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const updateAddress = (field: keyof NonNullable<ProfileData['location']>['address'], value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location!,
        address: {
          ...(prev.location?.address || {
            street: '',
            landmark: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
            formattedAddress: '',
          }),
          [field]: value,
        },
      },
    }));
  };

  const updateLocationCoords = (latitude: number, longitude: number) => {
     setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location!,
        latitude,
        longitude
      },
    }));
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
      updateLocationCoords(latitude, longitude);
      
      try {
        // Reverse geocoding using OpenStreetMap (Nominatim)
        // Note: In production, consider using a paid service or caching to respect usage limits
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'VytalYouApp/1.0', // Required by Nominatim policy
            },
          }
        );
        const data = await response.json();
        
        if (data && data.address) {
           setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location!,
                latitude,
                longitude,
                address: {
                  street: data.address.road || data.address.suburb || '',
                  landmark: data.address.neighbourhood || '',
                  city: data.address.city || data.address.town || data.address.village || '',
                  state: data.address.state || '',
                  pincode: data.address.postcode || '',
                  country: data.address.country || '',
                  formattedAddress: data.display_name || '',
                }
              }
           }));
           Alert.alert('Success', 'Location and address fetched successfully!');
        } else {
           Alert.alert('Success', 'Location fetched, but could not determine address automatically.');
        }

      } catch (err) {
        console.log("Geocoding error", err);
        Alert.alert('Success', 'Location fetched, but address lookup failed.');
      }
      setLoading(false);
    };

    Geolocation.getCurrentPosition(
      handleSuccess,
      (error) => {
        console.log('High accuracy location error:', error);
        // If timeout (code 3) or position unavailable (code 2), try low accuracy
        if (error.code === 3 || error.code === 2) {
          Geolocation.getCurrentPosition(
            handleSuccess,
            (finalError) => {
              Alert.alert(
                'Error',
                'Could not fetch location. Please ensure location services are enabled.',
              );
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

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!formData.age || formData.age < 1 || formData.age > 150) {
      Alert.alert('Error', 'Please enter a valid age');
      return;
    }

    if (!formData.location?.address?.street && !formData.location?.address?.formattedAddress) {
      Alert.alert('Error', 'Please provide your address');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    setLoading(true);
    try {
      const response = await updateProfile(token, formData);
      updateUser(response.user);
      
      Alert.alert('Success', 'Profile completed successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to main app
            navigation.getParent()?.goBack();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Help us personalize your experience
        </Text>
      </View>

      <View style={styles.form}>
        {/* Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary}
            value={formData.name}
            onChangeText={value => updateField('name', value)}
            editable={!loading}
          />
        </View>

        {/* Age */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
            value={formData.age ? formData.age.toString() : ''}
            onChangeText={value => updateField('age', parseInt(value) || 0)}
            editable={!loading}
          />
        </View>

        {/* Sex */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Sex *</Text>
          <View style={styles.sexContainer}>
            {(['Male', 'Female', 'Other'] as const).map(sex => (
              <Pressable
                key={sex}
                onPress={() => updateField('sex', sex)}
                style={[
                  styles.sexButton,
                  formData.sex === sex && styles.sexButtonActive,
                ]}
                disabled={loading}>
                <Text
                  style={[
                    styles.sexButtonText,
                    formData.sex === sex && styles.sexButtonTextActive,
                  ]}>
                  {sex}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Location *</Text>
          <Text style={styles.subtitle}>
            Use high precision location for accurate navigation
          </Text>
          
          <View style={{ gap: 10, marginTop: 10 }}>
            
            <Pressable
              onPress={getCurrentLocation}
              style={[styles.button, { backgroundColor: colors.accentAqua, marginBottom: 10 }]}>
              <Text style={styles.buttonText}>Auto-Detect Location & Address</Text>
            </Pressable>

             <TextInput
              style={styles.input}
              placeholder="Flat / House No / Building"
              placeholderTextColor={colors.textSecondary}
              value={formData.location?.address.formattedAddress || ''}
              onChangeText={value => updateAddress('formattedAddress', value)}
              editable={!loading}
              multiline
            />

             <TextInput
              style={styles.input}
              placeholder="Street / Area"
              placeholderTextColor={colors.textSecondary}
              value={formData.location?.address.street || ''}
              onChangeText={value => updateAddress('street', value)}
              editable={!loading}
            />

             <TextInput
              style={styles.input}
              placeholder="Landmark"
              placeholderTextColor={colors.textSecondary}
              value={formData.location?.address.landmark || ''}
              onChangeText={value => updateAddress('landmark', value)}
              editable={!loading}
            />

            <View style={{flexDirection: 'row', gap: 10}}>
               <TextInput
                style={[styles.input, {flex: 1}]}
                placeholder="City"
                placeholderTextColor={colors.textSecondary}
                value={formData.location?.address.city || ''}
                onChangeText={value => updateAddress('city', value)}
                editable={!loading}
              />
               <TextInput
                style={[styles.input, {flex: 1}]}
                placeholder="Pincode"
                placeholderTextColor={colors.textSecondary}
                value={formData.location?.address.pincode || ''}
                onChangeText={value => updateAddress('pincode', value)}
                editable={!loading}
              />
            </View>

             <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor={colors.textSecondary}
              value={formData.location?.address.state || ''}
              onChangeText={value => updateAddress('state', value)}
              editable={!loading}
            />

            {/* Hidden Lat/Lng for verification if needed during dev */}
            {/* <View style={{ flexDirection: 'row', gap: 10 }}>
                 <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Lat"
                  value={formData.location?.latitude?.toString()}
                  editable={false}
                />
                 <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Lng"
                  value={formData.location?.longitude?.toString()}
                  editable={false}
                />
            </View> */}
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleSubmit}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.backgroundNavy} />
        ) : (
          <Text style={styles.buttonText}>Complete Profile</Text>
        )}
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundNavy,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl * 2 + 90,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold as any,
    color: colors.accentAqua,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular as any,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  form: {
    marginBottom: spacing.xl,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(77, 214, 255, 0.3)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sexContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sexButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(77, 214, 255, 0.3)',
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  sexButtonActive: {
    backgroundColor: 'rgba(77, 214, 255, 0.2)',
    borderColor: colors.accentAqua,
  },
  sexButtonText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textSecondary,
  },
  sexButtonTextActive: {
    color: colors.accentAqua,
    fontWeight: fontWeights.semibold as any,
  },
  button: {
    backgroundColor: colors.accentAqua,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold as any,
    color: colors.backgroundNavy,
  },
});
