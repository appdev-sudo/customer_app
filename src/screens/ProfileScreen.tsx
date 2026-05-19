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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../utils/authContext';
import {colors} from '../theme/colors';
import {fonts, fontSizes, fontWeights} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {getMyBookings} from '../api/bookingApi';

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
const BookingCard: React.FC<{booking: any}> = ({booking}) => {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[booking.status] ?? {label: booking.status, color: colors.textSecondary, icon: 'information-outline'};
  const nurse = booking.nurse && typeof booking.nurse === 'object' ? booking.nurse : null;
  const showStartOtp = ['assigned', 'accepted', 'in_progress'].includes(booking.status) && booking.startOtp;
  const showEndOtp = booking.status === 'in_progress' && booking.endOtp;

  return (
    <Pressable onPress={() => setExpanded(e => !e)} style={styles.bookingCard}>
      {/* Header row */}
      <View style={styles.bookingCardHeader}>
        <View style={styles.bookingCardLeft}>
          <View style={[styles.statusBadge, {backgroundColor: status.color + '20'}]}>
            <MaterialCommunityIcons name={status.icon} size={13} color={status.color} />
            <Text style={[styles.statusText, {color: status.color}]}>{status.label}</Text>
          </View>
          <Text style={styles.bookingService} numberOfLines={1}>{booking.serviceTitle}</Text>
          <Text style={styles.bookingDate}>
            {formatDate(booking.preferredDate)}
            {booking.preferredTimeSlot ? `  ·  ${booking.preferredTimeSlot}` : ''}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
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
            booking.status === 'pending' || booking.status === 'confirmed' ? (
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

// ── Main ProfileScreen ────────────────────────────────────────────────────────
export const ProfileScreen: React.FC = () => {
  const {user, token, isAuthenticated, logout} = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!token) {return;}
    setBookingsLoading(true);
    try {
      const data = await getMyBookings(token);
      setBookings(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error('Failed to fetch bookings:', e.message);
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

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.root}>
        <Image
          source={{uri: 'https://vytalyou-public-assets.s3.eu-north-1.amazonaws.com/logo-03.png'}}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Please login to view your profile</Text>
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

        {bookings.length === 0 && !bookingsLoading ? (
          <View style={styles.emptyBookings}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No bookings yet</Text>
          </View>
        ) : (
          <>
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

      {/* Logout */}
      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <MaterialCommunityIcons name="logout" size={18} color="#FF3B30" style={{marginRight: 6}} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
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
  logo: {width: 160, height: 48, marginBottom: spacing.lg},
  title: {fontFamily: fonts.primary, fontSize: fontSizes.h2, fontWeight: fontWeights.semibold as any, color: colors.textPrimary, marginBottom: spacing.sm},
  subtitle: {fontFamily: fonts.primary, fontSize: fontSizes.body, color: colors.textPrimary, opacity: 0.8},
});
