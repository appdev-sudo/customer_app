import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../utils/authContext';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {getMyBookings, getMySubscriptions, scheduleSession} from '../api/bookingApi';

// ── Time & Date Helpers ────────────────────────────────────────────────────────
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

const formatDayDateMonth = (date: Date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
  };
};

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, {label: string; color: string; icon: string}> = {
  pending:     {label: 'Pending',     color: '#F59E0B', icon: 'clock-outline'},
  confirmed:   {label: 'Confirmed',   color: '#3B82F6', icon: 'check-circle-outline'},
  assigned:    {label: 'Nurse Assigned', color: colors.accentAqua, icon: 'account-check-outline'},
  accepted:    {label: 'Accepted',    color: '#10B981', icon: 'thumb-up-outline'},
  in_progress: {label: 'In Progress', color: '#8B5CF6', icon: 'play-circle-outline'},
  completed:   {label: 'Completed',   color: '#059669', icon: 'check-decagram'},
  cancelled:   {label: 'Cancelled',   color: '#EF4444', icon: 'close-circle-outline'},
  rejected:    {label: 'Rejected',    color: '#EF4444', icon: 'close-circle-outline'},
};

const formatDate = (iso: string) => {
  if (!iso) {return '';}
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'});
};

// ── Booking Card ──────────────────────────────────────────────────────────────
const BookingCard: React.FC<{booking: any, onScheduleClick?: (session: any) => void, isSubSession?: boolean}> = ({booking, onScheduleClick, isSubSession}) => {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[booking.status] ?? {label: booking.status, color: colors.textSecondary, icon: 'information-outline'};
  const nurse = booking.nurse && typeof booking.nurse === 'object' ? booking.nurse : null;
  const showStartOtp = ['assigned', 'accepted', 'in_progress'].includes(booking.status) && booking.startOtp && booking.locationType !== 'clinic';
  const showEndOtp = booking.status === 'in_progress' && booking.endOtp && booking.locationType !== 'clinic';

  return (
    <Pressable onPress={() => setExpanded(e => !e)} style={[styles.bookingCard, isSubSession && { backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0, paddingVertical: 4, marginBottom: 0 }]}>
      {/* Header row */}
      <View style={styles.bookingCardHeader}>
        <View style={styles.bookingCardLeft}>
          <View style={[styles.statusBadge, {backgroundColor: status.color + '20'}]}>
            <MaterialCommunityIcons name={status.icon} size={13} color={status.color} />
            <Text style={[styles.statusText, {color: status.color}]}>{status.label}</Text>
          </View>
          <Text style={styles.bookingService} numberOfLines={1}>{booking.serviceTitle}</Text>
          <Text style={styles.bookingDate}>
            {booking.preferredDate ? formatDate(booking.preferredDate) : 'Unscheduled'}
            {booking.preferredTimeSlot ? `  ·  ${booking.preferredTimeSlot}` : ''}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
          {!booking.preferredDate && booking.status === 'pending' && onScheduleClick && (
            <Pressable onPress={() => onScheduleClick(booking)} style={{backgroundColor: colors.accentAqua, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6}}>
              <Text style={{color: colors.backgroundNavy, fontSize: 12, fontWeight: 'bold'}}>Schedule</Text>
            </Pressable>
          )}
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textSecondary}
          />
        </View>
      </View>

      {/* Expanded details */}
      {expanded && (
        <View style={styles.bookingDetails}>
          <View style={styles.divider} />

          {/* Nurse info */}
          {nurse ? (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                <MaterialCommunityIcons name="account-nurse-outline" size={14} color={colors.accentAqua} />
                {'  '}Assigned Nurse
              </Text>
              <View style={styles.nurseCard}>
                <View style={styles.nurseAvatar}>
                  <MaterialCommunityIcons name="account-circle" size={36} color={colors.accentAqua} />
                </View>
                <View style={styles.nurseInfo}>
                  <Text style={styles.nurseName}>{nurse.name || 'VytalYou Nurse'}</Text>
                  <Text style={styles.nurseId}>{nurse.nurseId || ''}</Text>
                  {nurse.phone && (
                    <Text style={styles.nursePhone}>{nurse.phone}</Text>
                  )}
                </View>
              </View>
            </View>
          ) : (
            (booking.status === 'pending' || booking.status === 'confirmed') && booking.locationType !== 'clinic' ? (
              <View style={styles.pendingNurse}>
                <MaterialCommunityIcons name="account-search-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.pendingNurseText}>Nurse will be assigned shortly</Text>
              </View>
            ) : null
          )}

          {/* Start OTP */}
          {showStartOtp && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                <MaterialCommunityIcons name="shield-key-outline" size={14} color="#F59E0B" />
                {'  '}Start OTP
              </Text>
              <View style={styles.otpContainer}>
                {booking.startOtp.split('').map((digit: string, i: number) => (
                  <View key={i} style={styles.otpBox}>
                    <Text style={styles.otpDigit}>{digit}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.otpHint}>Share this OTP with your nurse to begin the service</Text>
            </View>
          )}

          {/* End OTP — shown during in_progress so customer can give it to nurse to complete */}
          {showEndOtp && (
            <View style={styles.detailSection}>
              <Text style={[styles.detailSectionTitle, {color: '#60A5FA'}]}>
                <MaterialCommunityIcons name="shield-check-outline" size={14} color="#60A5FA" />
                {'  '}End OTP
              </Text>
              <View style={styles.otpContainer}>
                {booking.endOtp.split('').map((digit: string, i: number) => (
                  <View key={i} style={[styles.otpBox, styles.otpBoxEnd]}>
                    <Text style={[styles.otpDigit, {color: '#60A5FA'}]}>{digit}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.otpHint}>Share this OTP with your nurse when the service is complete</Text>
            </View>
          )}

          {/* Address */}
          {booking.address?.formattedAddress && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.accentAqua} />
                {'  '}Service Address
              </Text>
              <Text style={styles.addressText}>{booking.address.formattedAddress}</Text>
            </View>
          )}

          {/* Payment Details */}
          {!isSubSession && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                <MaterialCommunityIcons name="credit-card-outline" size={14} color={colors.accentAqua} />
                {'  '}Payment Information
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Total Amount:</Text>
                <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 'bold' }}>Rs. {booking.totalAmount || 0}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Amount Paid:</Text>
                <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 'bold' }}>Rs. {booking.amountPaid || 0}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Status:</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: booking.paymentStatus === 'paid' ? '#10B981' : '#F59E0B' }}>
                  {(booking.paymentStatus || 'pending').toUpperCase()}
                </Text>
              </View>
            </View>
          )}

          {/* Notes */}
          {booking.notes && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                <MaterialCommunityIcons name="note-text-outline" size={14} color={colors.accentAqua} />
                {'  '}Notes
              </Text>
              <Text style={styles.addressText}>{booking.notes}</Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

// ── Subscription Card ─────────────────────────────────────────────────────────
const SubscriptionCard: React.FC<{subscription: any; onScheduleClick: (session: any) => void}> = ({subscription, onScheduleClick}) => {
  const [expanded, setExpanded] = useState(false);
  const statusColor = subscription.status === 'active' ? '#3B82F6' : '#10B981';
  
  return (
    <View style={styles.bookingCard}>
      <Pressable onPress={() => setExpanded(e => !e)} style={styles.bookingCardHeader}>
        <View style={styles.bookingCardLeft}>
          <View style={[styles.statusBadge, {backgroundColor: statusColor + '20'}]}>
            <MaterialCommunityIcons name={subscription.status === 'active' ? 'play-circle-outline' : 'check-decagram'} size={13} color={statusColor} />
            <Text style={[styles.statusText, {color: statusColor}]}>{subscription.status}</Text>
          </View>
          <Text style={styles.bookingService} numberOfLines={1}>{subscription.serviceTitle}</Text>
          <Text style={styles.bookingDate}>
            Sessions: {subscription.completedSessions} / {subscription.totalSessions}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>
      
      {expanded && (
        <View style={styles.bookingDetails}>
          <View style={styles.divider} />
          
          {/* Payment Details */}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>
              <MaterialCommunityIcons name="credit-card-outline" size={14} color={colors.accentAqua} />
              {'  '}Payment Information
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Total Amount:</Text>
              <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 'bold' }}>Rs. {subscription.totalAmount || 0}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Amount Paid:</Text>
              <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 'bold' }}>Rs. {subscription.amountPaid || 0}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Status:</Text>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: subscription.paymentStatus === 'paid' ? '#10B981' : '#F59E0B' }}>
                {(subscription.paymentStatus || 'pending').toUpperCase()}
              </Text>
            </View>
          </View>

          {subscription.sessions && subscription.sessions.map((session: any) => (
            <View key={session._id} style={{marginBottom: 12, padding: 8, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'}}>
              <BookingCard 
                booking={{...session, serviceTitle: session.sessionName}} 
                onScheduleClick={onScheduleClick} 
                isSubSession={true} 
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// ── Main ProfileScreen ────────────────────────────────────────────────────────
export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const {user, token, isAuthenticated, logout} = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Scheduling State
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [sessionToSchedule, setSessionToSchedule] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<'home'|'clinic'>('home');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<string>('Vytalyou Powai');
  const CLINICS = ['Vytalyou Powai', 'Vytalyou Juhu', 'Vytalyou Worli'];

  const fetchBookings = useCallback(async () => {
    if (!token) {return;}
    setBookingsLoading(true);
    try {
      const [data, subsData] = await Promise.all([
        getMyBookings(token),
        getMySubscriptions(token)
      ]);
      setBookings(Array.isArray(data) ? data : []);
      setSubscriptions(Array.isArray(subsData) ? subsData : []);
    } catch (e: any) {
      console.error('Failed to fetch data:', e.message);
    } finally {
      setBookingsLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {fetchBookings();}
  }, [isAuthenticated, fetchBookings]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: async () => { await logout(); }},
    ]);
  };

  const openScheduleModal = (session: any) => {
    setSessionToSchedule(session);
    setSelectedLocation('home');
    setSelectedDate(null);
    setSelectedTime(null);
    setScheduleModalVisible(true);
  };

  const handleScheduleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Incomplete', 'Please select a date and time slot.');
      return;
    }
    if (selectedLocation === 'home' && (!user?.location?.address?.formattedAddress && !user?.location?.address?.street)) {
      Alert.alert('Address Missing', 'Please add an address first.');
      return;
    }
    
    setScheduleLoading(true);
    try {
      if (!token) throw new Error('Not authenticated');
      await scheduleSession(token, sessionToSchedule._id, {
        locationType: selectedLocation,
        clinicLocation: selectedLocation === 'clinic' ? selectedClinic : undefined,
        preferredDate: selectedDate.toISOString(),
        preferredTimeSlot: selectedTime,
        address: selectedLocation === 'home' ? user?.location?.address : undefined,
      });
      setScheduleModalVisible(false);
      Alert.alert('Success', 'Session scheduled successfully!');
      fetchBookings();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to schedule session.');
    } finally {
      setScheduleLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={[styles.root, styles.unauthRoot]}>
        <Image
          source={{uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/logo-03.png'}}
          style={styles.unauthLogo}
          resizeMode="contain"
        />
        <View style={styles.unauthTextContainer}>
          <Text style={styles.unauthTitle}>Welcome to VytalYou</Text>
          <Text style={styles.unauthSubtitle}>Login or Sign Up to manage your bookings and view your profile</Text>
        </View>
        <Pressable 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('AuthStack' as never)}
        >
          <Text style={styles.loginButtonText}>Login / Sign Up</Text>
        </Pressable>
      </View>
    );
  }

  const activeBookings = bookings.filter(b => ['assigned', 'accepted', 'in_progress'].includes(b.status));
  const pastBookings   = bookings.filter(b => ['completed', 'cancelled', 'rejected'].includes(b.status));
  const pendingBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status));

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBookings(); }} tintColor={colors.accentAqua} />}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name ? user.name.charAt(0).toUpperCase() : '?'}</Text>
        </View>
        <Text style={styles.name}>{user.name || 'User'}</Text>
        <Text style={styles.phone}>{user.phone}</Text>
      </View>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {user.age && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{user.age} years</Text>
          </View>
        )}
        {user.sex && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sex</Text>
            <Text style={styles.infoValue}>{user.sex}</Text>
          </View>
        )}
        {user.location?.address?.formattedAddress && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text numberOfLines={2} style={[styles.infoValue, {flex: 1, textAlign: 'right', marginLeft: 10}]}>
              {user.location.address.city}, {user.location.address.pincode}
            </Text>
          </View>
        )}
      </View>

      {/* My Bookings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Bookings</Text>
          {bookingsLoading && <ActivityIndicator size="small" color={colors.accentAqua} />}
        </View>

        {bookings.length === 0 && subscriptions.length === 0 && !bookingsLoading ? (
          <View style={styles.emptyBookings}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No bookings yet</Text>
          </View>
        ) : (
          <>
            {/* Subscriptions */}
            {subscriptions.length > 0 && (
              <>
                <Text style={styles.bookingGroupLabel}>⭐ Subscriptions</Text>
                {subscriptions.map(s => <SubscriptionCard key={s._id} subscription={s} onScheduleClick={openScheduleModal} />)}
              </>
            )}
            {/* Active bookings first */}
            {activeBookings.length > 0 && (
              <>
                <Text style={styles.bookingGroupLabel}>🟢 Active</Text>
                {activeBookings.map(b => <BookingCard key={b._id} booking={b} />)}
              </>
            )}
            {/* Pending */}
            {pendingBookings.length > 0 && (
              <>
                <Text style={styles.bookingGroupLabel}>🕐 Pending</Text>
                {pendingBookings.map(b => <BookingCard key={b._id} booking={b} />)}
              </>
            )}
            {/* Past */}
            {pastBookings.length > 0 && (
              <>
                <Text style={styles.bookingGroupLabel}>📋 Past</Text>
                {pastBookings.map(b => <BookingCard key={b._id} booking={b} />)}
              </>
            )}
          </>
        )}
      </View>

      {/* App Info / Policies */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>

        <Pressable style={styles.policyRow} onPress={() => navigation.navigate('ContactUs' as never)}>
          <View style={styles.policyRowLeft}>
            <MaterialCommunityIcons name="headphones" size={20} color={colors.textSecondary} />
            <Text style={styles.policyText}>Contact Us</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </Pressable>

        <Pressable style={styles.policyRow} onPress={() => navigation.navigate('TermsAndConditions' as never)}>
          <View style={styles.policyRowLeft}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.policyText}>Terms & Conditions</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </Pressable>

        <Pressable style={[styles.policyRow, { borderBottomWidth: 0 }]} onPress={() => navigation.navigate('RefundsAndCancellations' as never)}>
          <View style={styles.policyRowLeft}>
            <MaterialCommunityIcons name="cash-refund" size={20} color={colors.textSecondary} />
            <Text style={styles.policyText}>Refunds & Cancellations</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <MaterialCommunityIcons name="logout" size={18} color="#FF3B30" style={{marginRight: 6}} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      {/* Schedule Modal */}
      <Modal visible={scheduleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md}}>
              <Text style={styles.modalTitle}>Schedule Session</Text>
              <Pressable onPress={() => setScheduleModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
              <Text style={{color: colors.textSecondary, marginBottom: spacing.lg}}>
                {sessionToSchedule?.sessionName}
              </Text>

              <Text style={styles.sectionTitleModal}>Location</Text>
              <View style={{flexDirection: 'row', gap: 12, marginBottom: spacing.lg}}>
                <Pressable 
                  style={[styles.locationBtn, selectedLocation === 'home' && styles.locationBtnActive]} 
                  onPress={() => setSelectedLocation('home')}
                >
                  <Text style={[styles.locationBtnText, selectedLocation === 'home' && styles.locationBtnTextActive]}>Home Service</Text>
                </Pressable>
                <Pressable 
                  style={[styles.locationBtn, selectedLocation === 'clinic' && styles.locationBtnActive]} 
                  onPress={() => setSelectedLocation('clinic')}
                >
                  <Text style={[styles.locationBtnText, selectedLocation === 'clinic' && styles.locationBtnTextActive]}>Clinic Visit</Text>
                </Pressable>
              </View>

              {selectedLocation === 'clinic' && (
                <View style={{ marginBottom: spacing.lg }}>
                  <Text style={{color: colors.textSecondary, fontSize: 13, marginBottom: spacing.sm}}>Select Clinic:</Text>
                  <View style={{ gap: spacing.sm }}>
                    {CLINICS.map(clinic => (
                      <Pressable
                        key={clinic}
                        onPress={() => setSelectedClinic(clinic)}
                        style={[
                          styles.locationBtn,
                          { justifyContent: 'flex-start', flexDirection: 'row' },
                          selectedClinic === clinic && styles.locationBtnActive
                        ]}
                      >
                        <MaterialCommunityIcons 
                          name={selectedClinic === clinic ? "check-circle" : "circle-outline"} 
                          size={20} 
                          color={selectedClinic === clinic ? colors.backgroundNavy : colors.textPrimary} 
                          style={{ marginRight: spacing.sm }}
                        />
                        <Text style={[styles.locationBtnText, selectedClinic === clinic && styles.locationBtnTextActive]}>
                          {clinic}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              <Text style={styles.sectionTitleModal}>Select Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: spacing.lg}}>
                {generateDates().map((date, index) => {
                    const f = formatDayDateMonth(date);
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

              <Text style={styles.sectionTitleModal}>Select Time</Text>
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

              {selectedLocation === 'home' && (
                <View style={{marginTop: spacing.lg, padding: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
                    <Text style={{color: colors.textSecondary, fontSize: 12}}>Saved Address:</Text>
                    <Pressable onPress={() => {
                      setScheduleModalVisible(false);
                      (navigation as any).navigate('AddAddress');
                    }}>
                      <Text style={{color: colors.accentAqua, fontSize: 12, fontWeight: 'bold'}}>+ Add New</Text>
                    </Pressable>
                  </View>
                  <Text style={{color: colors.textPrimary, fontSize: 13}}>
                    {user?.location?.address?.formattedAddress || user?.location?.address?.street || "No address found. Please add one in settings."}
                  </Text>
                </View>
              )}

              <Pressable onPress={handleScheduleSubmit} disabled={scheduleLoading} style={[styles.loginButton, {marginTop: spacing.xl}]}>
                {scheduleLoading ? <ActivityIndicator color={colors.backgroundNavy} /> : <Text style={styles.loginButtonText}>Confirm Schedule</Text>}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.backgroundNavy},
  content: {paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xxl * 2 + 90},
  header: {alignItems: 'center', marginBottom: spacing.xxl},
  avatar: {width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accentAqua, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(77,214,255,0.3)', marginBottom: spacing.md},
  avatarText: {fontFamily: fonts.primary, fontSize: 32, fontWeight: fontWeights.bold as any, color: colors.backgroundNavy},
  name: {fontFamily: fonts.primary, fontSize: fontSizes.h2, fontWeight: fontWeights.bold as any, color: colors.textPrimary, marginBottom: spacing.xs},
  phone: {fontFamily: fonts.primary, fontSize: fontSizes.body, color: colors.textSecondary},
  section: {marginBottom: spacing.xl, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)'},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md},
  sectionTitle: {fontFamily: fonts.primary, fontSize: fontSizes.body, fontWeight: fontWeights.semibold as any, color: colors.accentAqua},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'},
  infoLabel: {fontFamily: fonts.primary, fontSize: fontSizes.body, fontWeight: fontWeights.medium as any, color: colors.textPrimary, opacity: 0.7},
  infoValue: {fontFamily: fonts.primary, fontSize: fontSizes.body, fontWeight: fontWeights.medium as any, color: colors.textPrimary},
  // Bookings
  bookingGroupLabel: {fontFamily: fonts.primary, fontSize: fontSizes.small, fontWeight: fontWeights.semibold as any, color: colors.textSecondary, marginTop: spacing.md, marginBottom: spacing.sm},
  bookingCard: {backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: spacing.sm, padding: spacing.md},
  bookingCardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  bookingCardLeft: {flex: 1, marginRight: spacing.sm},
  statusBadge: {flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, gap: 4, marginBottom: 6},
  statusText: {fontFamily: fonts.primary, fontSize: 11, fontWeight: fontWeights.semibold as any, textTransform: 'uppercase', letterSpacing: 0.3},
  bookingService: {fontFamily: fonts.primary, fontSize: fontSizes.body, fontWeight: fontWeights.semibold as any, color: colors.textPrimary, marginBottom: 2},
  bookingDate: {fontFamily: fonts.primary, fontSize: fontSizes.small, color: colors.textSecondary},
  // Booking details (expanded)
  bookingDetails: {marginTop: spacing.md},
  divider: {height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: spacing.md},
  detailSection: {marginBottom: spacing.md},
  detailSectionTitle: {fontFamily: fonts.primary, fontSize: fontSizes.small, fontWeight: fontWeights.semibold as any, color: colors.accentAqua, marginBottom: spacing.sm},
  // Nurse card
  nurseCard: {flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(77,214,255,0.06)', borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(77,214,255,0.15)'},
  nurseAvatar: {marginRight: spacing.md},
  nurseInfo: {flex: 1},
  nurseName: {fontFamily: fonts.primary, fontSize: fontSizes.body, fontWeight: fontWeights.semibold as any, color: colors.textPrimary},
  nurseId: {fontFamily: fonts.primary, fontSize: fontSizes.small, color: colors.accentAqua, marginTop: 2},
  nursePhone: {fontFamily: fonts.primary, fontSize: fontSizes.small, color: colors.textSecondary, marginTop: 2},
  pendingNurse: {flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: spacing.sm},
  pendingNurseText: {fontFamily: fonts.primary, fontSize: fontSizes.small, color: colors.textSecondary},
  // OTP
  otpContainer: {flexDirection: 'row', gap: 8, marginBottom: spacing.sm},
  otpBox: {width: 42, height: 50, borderRadius: 10, backgroundColor: 'rgba(245,158,11,0.12)', borderWidth: 2, borderColor: 'rgba(245,158,11,0.4)', alignItems: 'center', justifyContent: 'center'},
  otpBoxEnd: {backgroundColor: 'rgba(96,165,250,0.12)', borderColor: 'rgba(96,165,250,0.4)'},
  otpDigit: {fontFamily: fonts.display, fontSize: fontSizes.h2, fontWeight: fontWeights.bold as any, color: '#F59E0B'},
  otpHint: {fontFamily: fonts.primary, fontSize: fontSizes.small, color: colors.textSecondary},
  // Address/notes
  addressText: {fontFamily: fonts.primary, fontSize: fontSizes.small, color: colors.textSecondary, lineHeight: 18},
  // Empty state
  emptyBookings: {alignItems: 'center', paddingVertical: spacing.xl},
  emptyText: {fontFamily: fonts.primary, fontSize: fontSizes.body, color: colors.textSecondary, marginTop: spacing.sm},
  // Logout
  logoutButton: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,59,48,0.12)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,59,48,0.3)', paddingVertical: spacing.md, marginTop: spacing.sm},
  logoutText: {fontFamily: fonts.primary, fontSize: fontSizes.body, fontWeight: fontWeights.semibold as any, color: '#FF3B30'},
  // Unauthenticated
  unauthRoot: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 80,
  },
  unauthLogo: {
    width: 200,
    height: 60,
    marginBottom: spacing.xl,
  },
  unauthTextContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  unauthTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  unauthSubtitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: colors.accentAqua,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.accentAqua,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold as any,
    color: colors.backgroundNavy,
  },
  // Policies
  policyRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'},
  policyRowLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  policyText: {fontFamily: fonts.primary, fontSize: fontSizes.body, color: colors.textPrimary},
  
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.backgroundNavy, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl, maxHeight: '90%' },
  modalTitle: { fontFamily: fonts.primary, fontSize: fontSizes.h3, fontWeight: 'bold', color: colors.textPrimary },
  sectionTitleModal: { fontFamily: fonts.primary, fontSize: fontSizes.body, fontWeight: 'bold', color: colors.textPrimary, marginBottom: spacing.md },
  locationBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  locationBtnActive: { backgroundColor: colors.accentAqua, borderColor: colors.accentAqua },
  locationBtnText: { color: colors.textPrimary, fontWeight: 'bold' },
  locationBtnTextActive: { color: colors.backgroundNavy },
  dateCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: spacing.md, marginRight: spacing.md, alignItems: 'center', width: 70, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  dateCardActive: { backgroundColor: colors.accentAqua, borderColor: colors.accentAqua },
  dateDay: { fontSize: 12, color: colors.textPrimary, marginBottom: 4, opacity: 0.8 },
  dateNum: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
  dateMonth: { fontSize: 12, color: colors.textPrimary, opacity: 0.8 },
  textActive: { color: colors.backgroundNavy, fontWeight: 'bold', opacity: 1 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timeCard: { width: '31%', backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: spacing.xs, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  timeCardActive: { backgroundColor: colors.accentAqua, borderColor: colors.accentAqua },
  timeText: { color: colors.textPrimary, fontSize: 12 },
});
