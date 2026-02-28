import React, {useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {useAuth} from '../utils/authContext';
import {createBooking} from '../api/bookingApi';
import {createRazorpayOrder, verifyRazorpayPayment} from '../api/paymentApi';
import RazorpayCheckout from 'react-native-razorpay';
import {HomeStackParamList} from '../navigation/HomeStack';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookAppointment'>;

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

export const BookAppointmentScreen: React.FC<Props> = ({route, navigation}) => {
  const {serviceId, serviceTitle} = route.params;
  const {user, token} = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Dates
  const dates = generateDates();

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Incomplete', 'Please select a date and time slot.');
      return;
    }

    if (!user?.location?.address?.formattedAddress && !user?.location?.address?.street) {
        Alert.alert(
            'Address Missing', 
            'Please add an address for the appointment.',
            [
                { text: 'Add Address', onPress: () => navigation.navigate('AddAddress') },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
        return;
    }

    setLoading(true);
    try {
        if (!token) throw new Error('Not authenticated');

        // 1. Create Razorpay order (Assumed ₹1000 for standard session for now to test)
        const orderRes = await createRazorpayOrder(token, 1000); 

        // 2. Setup options
        const options = {
          description: serviceTitle,
          currency: orderRes.order.currency,
          key: orderRes.keyId,
          amount: orderRes.order.amount,
          name: 'VytalYou',
          order_id: orderRes.order.id,
          prefill: {
            contact: user?.phone || '',
            name: user?.name || 'User',
          },
          theme: {color: colors.accentAqua}
        };

        // 3. Open Razorpay Checkout
        RazorpayCheckout.open(options).then(async (data: any) => {
           try {
              // 4. Verify Payment
              await verifyRazorpayPayment(token, {
                razorpay_order_id: data.razorpay_order_id,
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_signature: data.razorpay_signature,
              });

              // 5. Create booking after successful payment
              await createBooking(token, {
                  serviceId,
                  preferredDate: selectedDate.toISOString(),
                  preferredTimeSlot: selectedTime,
                  address: user!.location!.address,
                  paymentId: data.razorpay_payment_id,
              });
              
              Alert.alert('Booking Confirmed', 'Payment Successful & Appointment Request Sent!', [
                  { text: 'OK', onPress: () => navigation.navigate('HomeMain') }
              ]);
           } catch(err: any) {
              Alert.alert('Booking Finalization Failed', err.message || 'Payment verification failed.');
           } finally {
              setLoading(false);
           }
        }).catch((error: any) => {
           // User cancelled or payment failed
           Alert.alert('Payment Cancelled/Failed', error?.description || 'Payment did not go through.');
           setLoading(false);
        });

    } catch (error: any) {
        Alert.alert('Error', error.message || 'Something went wrong.');
        setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
        day: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()]
    };
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Book Appointment</Text>
      <Text style={styles.subHeader}>Service: {serviceTitle}</Text>

      {/* Date Selection */}
      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {dates.map((date, index) => {
            const f = formatDate(date);
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            return (
                <Pressable
                    key={index}
                    onPress={() => setSelectedDate(date)}
                    style={[styles.dateCard, isSelected && styles.dateCardActive]}>
                    <Text style={[styles.dateDay, isSelected && styles.textActive]}>{f.day}</Text>
                    <Text style={[styles.dateNum, isSelected && styles.textActive]}>{f.date}</Text>
                    <Text style={[styles.dateMonth, isSelected && styles.textActive]}>{f.month}</Text>
                </Pressable>
            );
        })}
      </ScrollView>

      {/* Time Selection */}
      <Text style={styles.sectionTitle}>Select Time</Text>
      <View style={styles.timeGrid}>
        {TIME_SLOTS.map((slot, index) => {
            const isSelected = selectedTime === slot;
            return (
                <Pressable
                    key={index}
                    onPress={() => setSelectedTime(slot)}
                    style={[styles.timeCard, isSelected && styles.timeCardActive]}>
                    <Text style={[styles.timeText, isSelected && styles.textActive]}>{slot}</Text>
                </Pressable>
            );
        })}
      </View>

      {/* Address Selection */}
      <Text style={styles.sectionTitle}>Location</Text>
      <View style={styles.addressCard}>
        {user?.location?.address?.formattedAddress || user?.location?.address?.street ? (
            <View>
                <View style={styles.addressHeader}>
                    <View style={styles.radioOuter}>
                        <View style={styles.radioInner} />
                    </View>
                    <Text style={styles.addressLabel}>Home / Saved Address</Text>
                </View>
                <Text style={styles.addressText}>
                    {user.location.address.formattedAddress || `${user.location.address.street}, ${user.location.address.city}`}
                </Text>
                <Pressable onPress={() => navigation.navigate('AddAddress')} style={styles.changeAddressBtn}>
                    <Text style={styles.changeAddressText}>Change Address</Text>
                </Pressable>
            </View>
        ) : (
            <Pressable onPress={() => navigation.navigate('AddAddress')} style={styles.addAddressBtn}>
                <Text style={styles.addAddressText}>+ Add New Address</Text>
            </Pressable>
        )}
      </View>

      {/* Pay Now Button */}
      <Pressable onPress={handleBook} style={styles.payButton} disabled={loading}>
        {loading ? (
            <ActivityIndicator color={colors.backgroundNavy} />
        ) : (
            <Text style={styles.payButtonText}>Pay Now & Confirm</Text>
        )}
      </Pressable>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundNavy },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl * 2 + 90 },
  headerTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subHeader: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    color: colors.accentAqua,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  dateScroll: {
    marginBottom: spacing.md,
  },
  dateCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: spacing.md,
    marginRight: spacing.md,
    alignItems: 'center',
    width: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dateCardActive: {
    backgroundColor: colors.accentAqua,
    borderColor: colors.accentAqua,
  },
  dateDay: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  dateNum: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
  dateMonth: { fontSize: 12, color: colors.textSecondary },
  textActive: { color: colors.backgroundNavy, fontWeight: 'bold' },
  
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeCard: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  timeCardActive: {
    backgroundColor: colors.accentAqua,
    borderColor: colors.accentAqua,
  },
  timeText: {
    color: colors.textPrimary,
    fontSize: 12,
  },

  addressCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  addressHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.accentAqua,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm,
  },
  radioInner: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accentAqua,
  },
  addressLabel: { color: colors.textPrimary, fontWeight: 'bold', fontSize: 14 },
  addressText: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: spacing.md },
  changeAddressBtn: { alignSelf: 'flex-start' },
  changeAddressText: { color: colors.accentAqua, textDecorationLine: 'underline', fontSize: 12 },
  addAddressBtn: { padding: spacing.md, alignItems: 'center' },
  addAddressText: { color: colors.accentAqua, fontWeight: 'bold' },

  payButton: {
    backgroundColor: colors.accentAqua,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  payButtonText: {
    color: colors.backgroundNavy,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
