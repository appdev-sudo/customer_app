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
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {sendOTP} from '../api/authApi';

type Props = NativeStackScreenProps<any, 'PhoneAuth'>;

export const PhoneAuthScreen: React.FC<Props> = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    // Validate phone number
    const cleanPhone = phoneNumber.trim();
    
    if (!cleanPhone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    // Add +91 if not present
    let formattedPhone = cleanPhone;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone;
    }

    // Basic validation
    if (formattedPhone.length < 12) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(formattedPhone);
      navigation.navigate('OTPVerification', {phoneNumber: formattedPhone});
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to VytalYou</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to get started
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="9876543210"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
            editable={!loading}
          />
        </View>
        <Text style={styles.hint}>
          We'll send you a verification code via SMS
        </Text>
      </View>

      <Pressable
        onPress={handleSendOTP}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.backgroundNavy} />
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
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
    paddingTop: spacing.xxl * 2,
  },
  header: {
    marginBottom: spacing.xxl,
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
    marginBottom: spacing.xxl,
  },
  label: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(77, 214, 255, 0.3)',
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(77, 214, 255, 0.1)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(77, 214, 255, 0.3)',
  },
  countryCodeText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold as any,
    color: colors.accentAqua,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textPrimary,
  },
  hint: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular as any,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.accentAqua,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular as any,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
