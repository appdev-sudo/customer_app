import React, {useEffect, useRef, useState} from 'react';
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
import {verifyOTP, resendOTP} from '../api/authApi';
import {useAuth} from '../utils/authContext';

type Props = NativeStackScreenProps<any, 'OTPVerification'>;

export const OTPVerificationScreen: React.FC<Props> = ({route, navigation}) => {
  const {phoneNumber} = route.params as {phoneNumber: string};
  const {login} = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (newOtp.every(digit => digit !== '') && value) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP(phoneNumber, code);
      
      // Save auth data
      await login(response.token, response.user as any);

      // Navigate to profile if not completed, otherwise go back to app
      if (!response.user.profileCompleted) {
        navigation.replace('UserProfile');
      } else {
        // Profile already complete, go back to main app
        navigation.getParent()?.goBack();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      await resendOTP(phoneNumber);
      Alert.alert('Success', 'OTP sent successfully');
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Phone Number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputRefs.current[index] = ref;
            }}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            value={digit}
            onChangeText={value => handleOtpChange(value, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            editable={!loading}
          />
        ))}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accentAqua} />
          <Text style={styles.loadingText}>Verifying...</Text>
        </View>
      )}

      <View style={styles.resendContainer}>
        {canResend ? (
          <Pressable onPress={handleResendOTP} disabled={resendLoading}>
            <Text style={styles.resendText}>
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </Text>
          </Pressable>
        ) : (
          <Text style={styles.countdownText}>
            Resend OTP in {countdown}s
          </Text>
        )}
      </View>

      <Pressable
        onPress={() => handleVerifyOTP()}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Change Phone Number</Text>
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
    lineHeight: 24,
  },
  phoneNumber: {
    fontWeight: fontWeights.semibold as any,
    color: colors.accentAqua,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(77, 214, 255, 0.3)',
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold as any,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: colors.accentAqua,
    backgroundColor: 'rgba(77, 214, 255, 0.1)',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  loadingText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.accentAqua,
    marginLeft: spacing.sm,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  resendText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold as any,
    color: colors.accentAqua,
  },
  countdownText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular as any,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.accentAqua,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
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
  backButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium as any,
    color: colors.textSecondary,
  },
});
